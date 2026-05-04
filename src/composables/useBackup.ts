import { computed, ref } from 'vue'
import JSZip from 'jszip'
import { supabase } from '@/lib/supabase'

export const BACKUP_TABLES = [
  'users',
  'announcements',
  'events',
  'students',
  'attendance_logs',
  'attendance_logs_visitors',
  'export_batches',
  'attendance_page',
  'public_records',
  'website_services',
  'website_images',
  'about',
  'gallery_sections',
  'gallery_images',
  'rooms',
  'room_reservations',
  'room_reservation_participants',
  'colleges',
  'programs',
  'curricula',
  'courses',
  'program_specializations',
  'program_study_plan',
  'curriculum_requirements',
  'curriculum_courses',
] as const

export const BACKUP_STORAGE_BUCKETS = [
  'attendance_video',
  'announcement_images',
  'gallery_images',
  'website_images',
  'events_images',
  'personnel_images',
] as const

type BackupWarning = {
  source: 'database' | 'storage' | 'manifest'
  name: string
  message: string
}

type DownloadBackupOptions = {
  tables?: string[]
  buckets?: string[]
  fileNamePrefix?: string
}

type BackupManifest = {
  generated_at: string
  project: string
  tables: string[]
  buckets: string[]
  exported_tables: number
  exported_storage_files: number
  warnings: BackupWarning[]
}

type StorageListItem = {
  name: string
  id: string | null
  metadata?: Record<string, unknown> | null
}

const STORAGE_LIST_PAGE_SIZE = 100
const STORAGE_DOWNLOAD_CONCURRENCY = 5

export function useBackup() {
  const isBackingUp = ref(false)
  const stage = ref<'idle' | 'database' | 'storage' | 'zip' | 'done' | 'error'>('idle')
  const statusMessage = ref('Idle')
  const lastError = ref<string | null>(null)

  const totalTables = ref(0)
  const completedTables = ref(0)

  const totalStorageFiles = ref(0)
  const completedStorageFiles = ref(0)

  const zipPercent = ref(0)
  const warnings = ref<BackupWarning[]>([])

  const overallCompleted = computed(
    () => completedTables.value + completedStorageFiles.value,
  )
  const overallTotal = computed(() => totalTables.value + totalStorageFiles.value)

  const storageProgressText = computed(
    () => `${completedStorageFiles.value} of ${totalStorageFiles.value} files downloaded`,
  )

  const overallProgressText = computed(() => `${overallCompleted.value} of ${overallTotal.value}`)

  const resetState = () => {
    stage.value = 'idle'
    statusMessage.value = 'Idle'
    lastError.value = null
    totalTables.value = 0
    completedTables.value = 0
    totalStorageFiles.value = 0
    completedStorageFiles.value = 0
    zipPercent.value = 0
    warnings.value = []
  }

  const listAllFilesInBucket = async (bucket: string, prefix = ''): Promise<string[]> => {
    const results: string[] = []
    let offset = 0

    while (true) {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, {
        limit: STORAGE_LIST_PAGE_SIZE,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      })

      if (error) throw error

      const page = (data ?? []) as StorageListItem[]
      if (page.length === 0) break

      for (const item of page) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name
        const isFolder = item.id === null || item.metadata === null

        if (isFolder) {
          const nestedFiles = await listAllFilesInBucket(bucket, fullPath)
          results.push(...nestedFiles)
        } else {
          results.push(fullPath)
        }
      }

      if (page.length < STORAGE_LIST_PAGE_SIZE) break
      offset += STORAGE_LIST_PAGE_SIZE
    }

    return results
  }

  const runWithConcurrency = async (
    tasks: Array<() => Promise<void>>,
    limit: number,
  ): Promise<void> => {
    if (tasks.length === 0) return

    let nextIndex = 0

    const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (nextIndex < tasks.length) {
        const index = nextIndex
        nextIndex += 1
        await tasks[index]?.()
      }
    })

    await Promise.all(workers)
  }

  const downloadBackup = async (options?: DownloadBackupOptions) => {
    if (isBackingUp.value) return

    resetState()
    isBackingUp.value = true

    const tables = options?.tables?.length ? options.tables : [...BACKUP_TABLES]
    const buckets = options?.buckets?.length ? options.buckets : [...BACKUP_STORAGE_BUCKETS]

    totalTables.value = tables.length
    stage.value = 'database'

    const zip = new JSZip()
    const databaseFolder = zip.folder('database')
    const storageFolder = zip.folder('storage')

    if (!databaseFolder || !storageFolder) {
      isBackingUp.value = false
      stage.value = 'error'
      lastError.value = 'Failed to initialize ZIP folders.'
      return
    }

    try {
      for (const table of tables) {
        statusMessage.value = `Exporting table: ${table}`

        const { data, error } = await supabase.from(table).select('*')
        if (error) {
          warnings.value.push({
            source: 'database',
            name: table,
            message: error.message,
          })
          databaseFolder.file(`${table}.json`, JSON.stringify({ error: error.message }, null, 2))
        } else {
          databaseFolder.file(`${table}.json`, JSON.stringify(data ?? [], null, 2))
        }

        completedTables.value += 1
      }

      stage.value = 'storage'
      statusMessage.value = 'Resolving storage buckets'

      let bucketsToExport = [...buckets]
      const { data: bucketData, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        warnings.value.push({
          source: 'storage',
          name: 'listBuckets',
          message: bucketsError.message,
        })
      } else {
        const available = new Set((bucketData ?? []).map((b) => b.name))
        const missing = buckets.filter((bucket) => !available.has(bucket))

        if (missing.length > 0) {
          for (const bucket of missing) {
            warnings.value.push({
              source: 'storage',
              name: bucket,
              message: 'Bucket is not available in listBuckets() result.',
            })
          }
        }

        bucketsToExport = buckets.filter((bucket) => available.has(bucket))
      }

      const fileMap: Record<string, string[]> = {}

      for (const bucket of bucketsToExport) {
        statusMessage.value = `Listing files in bucket: ${bucket}`

        try {
          fileMap[bucket] = await listAllFilesInBucket(bucket)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          warnings.value.push({
            source: 'storage',
            name: bucket,
            message,
          })
          fileMap[bucket] = []
        }
      }

      totalStorageFiles.value = Object.values(fileMap).reduce((sum, paths) => sum + paths.length, 0)

      const downloadTasks: Array<() => Promise<void>> = []

      for (const [bucket, paths] of Object.entries(fileMap)) {
        if (paths.length === 0) {
          warnings.value.push({
            source: 'storage',
            name: bucket,
            message: 'Bucket is empty or no readable files were found.',
          })
          continue
        }

        for (const path of paths) {
          downloadTasks.push(async () => {
            statusMessage.value = `Downloading ${bucket}/${path}`

            try {
              const { data, error } = await supabase.storage.from(bucket).download(path)
              if (error || !data) {
                warnings.value.push({
                  source: 'storage',
                  name: `${bucket}/${path}`,
                  message: error?.message ?? 'No data returned from download()',
                })
              } else {
                storageFolder.file(`${bucket}/${path.replace(/^\/+/, '')}`, data)
              }
            } catch (error) {
              warnings.value.push({
                source: 'storage',
                name: `${bucket}/${path}`,
                message: error instanceof Error ? error.message : String(error),
              })
            } finally {
              completedStorageFiles.value += 1
            }
          })
        }
      }

      await runWithConcurrency(downloadTasks, STORAGE_DOWNLOAD_CONCURRENCY)

      const generatedAt = new Date().toISOString()

      const manifest: BackupManifest = {
        generated_at: generatedAt,
        project: 'CSULibrary',
        tables,
        buckets,
        exported_tables: completedTables.value,
        exported_storage_files: completedStorageFiles.value,
        warnings: warnings.value,
      }

      zip.file('manifest.json', JSON.stringify(manifest, null, 2))

      stage.value = 'zip'
      statusMessage.value = 'Generating ZIP file'

      const blob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          zipPercent.value = Math.round(metadata.percent)
        },
      )

      const safeIso = generatedAt.replace(/[:.]/g, '-')
      const fileNamePrefix = options?.fileNamePrefix?.trim() || 'csu-library-backup'
      const fileName = `${fileNamePrefix}-${safeIso}.zip`

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)

      stage.value = 'done'
      statusMessage.value = 'Backup ZIP downloaded'
    } catch (error) {
      stage.value = 'error'
      lastError.value = error instanceof Error ? error.message : String(error)
      statusMessage.value = 'Backup failed'
      throw error
    } finally {
      isBackingUp.value = false
    }
  }

  return {
    isBackingUp,
    stage,
    statusMessage,
    lastError,
    totalTables,
    completedTables,
    totalStorageFiles,
    completedStorageFiles,
    storageProgressText,
    overallProgressText,
    zipPercent,
    warnings,
    downloadBackup,
    resetState,
  }
}
