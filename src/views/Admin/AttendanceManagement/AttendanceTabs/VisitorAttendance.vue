<template>
  <div class="flex h-screen w-full overflow-hidden bg-slate-50">
    <Sidebar />

    <main class="flex-1 overflow-y-auto px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="headBlock">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/attendance')"
            >
              BACK
            </span>

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>

            <span>Attendance</span>
          </div>

          <div class="titleHero">
            <h1 class="heroTitle">
              <span class="heroTitlePrimary">Visitors</span>
              <span class="heroTitleAccent">Attendance</span>
            </h1>

            <div class="heroUnderline"></div>
          </div>
          <p class="hero-subtitle">
            Review and filter visitor entries from the library attendance section.
          </p>
        </div>

        <!-- Logs take the primary column and render first; filters sit in a narrower side panel -->
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <section class="order-1 rounded-xl bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <h2 class="text-lg font-bold text-slate-900">Visitor Logs</h2>
              </div>
              <span
                v-if="isFiltered"
                class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
              >
                Filtered
              </span>
            </div>

            <div
              v-if="loading"
              class="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500"
            >
              Loading visitor records...
            </div>

            <div
              v-else-if="errorMessage"
              class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
            >
              {{ errorMessage }}
            </div>

            <div v-else class="overflow-hidden rounded-xl border border-slate-200">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead
                    class="bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-600"
                  >
                    <tr>
                      <th class="px-4 py-3">Name</th>
                      <th class="px-4 py-3">Contact</th>
                      <th class="px-4 py-3">Institution</th>
                      <th class="px-4 py-3">Designation</th>
                      <th class="px-4 py-3">Location</th>
                      <th class="px-4 py-3">Gender</th>
                      <th class="px-4 py-3">Date</th>
                      <th class="px-4 py-3">Time In</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white text-slate-700">
                    <tr v-if="visitorLogs.length === 0">
                      <td colspan="8" class="px-4 py-10 text-center text-sm text-slate-500">
                        No visitor records to display.
                      </td>
                    </tr>
                    <tr v-for="log in visitorLogs" :key="log.id">
                      <td class="px-4 py-3 font-medium text-slate-900">
                        {{ getVisitorName(log) }}
                      </td>
                      <td class="px-4 py-3">
                        {{ log.contact || '--' }}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {{ log.institution || '--' }}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {{ log.designation || '--' }}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {{ getLocation(log) }}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {{ log.gender || '--' }}
                      </td>
                      <td class="px-4 py-3">
                        {{ formatDisplayDate(log.time_in) }}
                      </td>
                      <td class="px-4 py-3">
                        {{ formatDisplayTime(log.time_in) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-sm font-medium text-slate-700">
                Total number of library visit:
                <span class="font-bold text-slate-900">{{ visitorLogs.length }}</span>
              </p>

              <button
                type="button"
                @click="exportVisitorLogs"
                class="inline-flex h-10 items-center justify-center rounded-lg bg-[#164d23] px-5 text-sm font-semibold text-white transition hover:bg-[#123d1b] lg:w-auto"
              >
                Export
              </button>
            </div>
          </section>

          <!-- Side filter panel -->
          <aside class="order-2 rounded-xl bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div class="mb-4 flex items-center gap-3">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <h2 class="text-base font-bold text-slate-900">Filters</h2>
            </div>

            <div class="space-y-3">
              <label
                class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'specific-date'
                    ? 'border-[#164d23] bg-white shadow-sm'
                    : ''
                "
              >
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="specific-date"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Specific Date</span>
                </div>

                <input
                  v-model="specificDate"
                  type="date"
                  :disabled="selectedFilterMode !== 'specific-date'"
                  class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
              </label>

              <label
                class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'specific-month'
                    ? 'border-[#164d23] bg-white shadow-sm'
                    : ''
                "
              >
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="specific-month"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Specific Month</span>
                </div>

                <div class="flex flex-col gap-2">
                  <select
                    v-model="specificMonth"
                    :disabled="selectedFilterMode !== 'specific-month'"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option v-for="month in months" :key="month.value" :value="month.value">
                      {{ month.label }}
                    </option>
                  </select>

                  <select
                    v-model="specificYear"
                    :disabled="selectedFilterMode !== 'specific-month'"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </label>

              <label
                class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'period' ? 'border-[#164d23] bg-white shadow-sm' : ''
                "
              >
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="period"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Period</span>
                </div>

                <div class="flex flex-col gap-2">
                  <input
                    v-model="periodStartDate"
                    type="date"
                    :disabled="selectedFilterMode !== 'period'"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span class="text-center text-xs font-medium text-slate-500">to</span>
                  <input
                    v-model="periodEndDate"
                    type="date"
                    :disabled="selectedFilterMode !== 'period'"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </label>

              <label
                class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300"
                :class="selectedFilterMode === 'all' ? 'border-[#164d23] bg-white shadow-sm' : ''"
              >
                <input
                  v-model="selectedFilterMode"
                  type="radio"
                  name="visitor-filter-mode"
                  value="all"
                  class="h-4 w-4 accent-[#164d23]"
                />
                <span class="text-xs font-semibold text-slate-700">Show All Records</span>
              </label>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const selectedFilterMode = ref<'specific-date' | 'specific-month' | 'period' | 'all'>(
  'specific-date',
)
const specificDate = ref(new Date().toISOString().slice(0, 10))
const specificMonth = ref(String(new Date().getMonth() + 1).padStart(2, '0'))
const specificYear = ref(String(new Date().getFullYear()))
const periodStartDate = ref('')
const periodEndDate = ref('')

const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, index) => String(currentYear - index))
})

const isFiltered = computed(() => selectedFilterMode.value !== 'all')

type VisitorLog = {
  id: string
  time_in: string | null
  full_name?: string | null
  institution?: string | null
  contact?: string | null
  gender?: string | null
  honorific?: string | null
  designation?: string | null
  city?: string | null
  province?: string | null
  [key: string]: unknown
}

const visitorLogs = ref<VisitorLog[]>([])
const loading = ref(false)
const errorMessage = ref('')

const formatDisplayDate = (value: string | null) => {
  if (!value) return '--'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '--'

  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDisplayTime = (value: string | null) => {
  if (!value) return '--'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '--'

  return dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getVisitorName = (log: VisitorLog) => {
  const name = log.full_name || '--'
  return log.honorific ? `${log.honorific} ${name}` : name
}

const getLocation = (log: VisitorLog) => {
  const parts = [log.city, log.province].filter(Boolean)
  return parts.length ? parts.join(', ') : '--'
}

const exportVisitorLogs = () => {
  const headers = [
    'Name',
    'Contact',
    'Institution',
    'Designation',
    'City',
    'Province',
    'Gender',
    'Date',
    'Time In',
  ]

  const rows = visitorLogs.value.map((log) => [
    getVisitorName(log),
    log.contact || '--',
    log.institution || '--',
    log.designation || '--',
    log.city || '--',
    log.province || '--',
    log.gender || '--',
    formatDisplayDate(log.time_in),
    formatDisplayTime(log.time_in),
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Attendance')

  const fileName = `visitor-attendance-${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

const buildDateRange = () => {
  if (selectedFilterMode.value === 'all') {
    return null
  }

  if (selectedFilterMode.value === 'specific-date' && specificDate.value) {
    return {
      start: `${specificDate.value}T00:00:00`,
      end: `${specificDate.value}T23:59:59`,
    }
  }

  if (selectedFilterMode.value === 'specific-month') {
    const year = Number(specificYear.value)
    const month = Number(specificMonth.value)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    }
  }

  if (selectedFilterMode.value === 'period' && periodStartDate.value && periodEndDate.value) {
    return {
      start: `${periodStartDate.value}T00:00:00`,
      end: `${periodEndDate.value}T23:59:59`,
    }
  }

  return null
}

const loadVisitorLogs = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    let query = supabase
      .from('attendance_logs_visitors')
      .select('*')
      .order('time_in', { ascending: false })

    const range = buildDateRange()

    if (range) {
      query = query.gte('time_in', range.start).lte('time_in', range.end)
    }

    const { data, error } = await query

    if (error) throw error

    visitorLogs.value = (data || []) as VisitorLog[]
  } catch (error) {
    console.error('Failed to load visitor records:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load visitor records.'
    visitorLogs.value = []
  } finally {
    loading.value = false
  }
}

// Filters auto-apply: any change to mode or the relevant inputs reloads the logs.
watch(
  [selectedFilterMode, specificDate, specificMonth, specificYear, periodStartDate, periodEndDate],
  () => {
    // For "period" mode, wait until both dates are set before querying.
    if (selectedFilterMode.value === 'period' && (!periodStartDate.value || !periodEndDate.value)) {
      return
    }
    loadVisitorLogs()
  },
)

onMounted(() => {
  loadVisitorLogs()
})
</script>

<style scoped>
.heroTitle {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  line-height: 0.95;
  font-size: clamp(3rem, 3vw, 1.7rem);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.heroTitlePrimary {
  color: #0d2b0f;
}

.heroTitleAccent {
  color: #efb72d;
}

.heroUnderline {
  margin-top: 14px;
  width: 160px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #214b1f 0%, #c49317 100%);
}

.hero-subtitle {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 10px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>