import { ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { getCurriculumDetailByProgramId, getProgramStudyPlans } from '@/services/curriculumService'
import type { ProgramStudyPlanRow } from '@/types/Curriculum'

export type CurriculumInfoPayload = {
  id: string
  program_id?: string | null
  program_name?: string | null
  program_sp_name?: string | null
  revision_year?: number | null
  revision_no?: string | null
  legal_basis?: string | null
  effectivity_term?: string | null
  description?: string | null
  source: 'program_specializations' | 'programs'
}

type FetchOptions = {
  allowAllStudyPlans?: boolean
}

const normalizeRouteValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]) : ''
  }

  return value ? String(value) : ''
}

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type ProgramLookupRow = {
  id: string
  program_name: string
  program_code?: string | null
}

const findProgramByIdentifier = async (identifier: string): Promise<ProgramLookupRow | null> => {
  const normalizedIdentifier = decodeURIComponent(identifier).trim()

  if (!normalizedIdentifier) {
    return null
  }

  if (isUuid(normalizedIdentifier)) {
    const { data, error } = await supabase
      .from('programs')
      .select('id, program_name, program_code')
      .eq('id', normalizedIdentifier)
      .maybeSingle()

    if (error) {
      throw error
    }

    return (data as ProgramLookupRow | null) ?? null
  }

  const { data: byCode, error: byCodeError } = await supabase
    .from('programs')
    .select('id, program_name, program_code')
    .eq('program_code', normalizedIdentifier)
    .maybeSingle()

  if (byCodeError) {
    throw byCodeError
  }

  if (byCode) {
    return byCode as ProgramLookupRow
  }

  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('id, program_name, program_code')

  if (programsError) {
    throw programsError
  }

  const normalizedSlug = slugify(normalizedIdentifier)
  const matched = ((programs as ProgramLookupRow[] | null) ?? []).find((program) => {
    const slugFromName = slugify(program.program_name || '')
    const slugFromCode = slugify(program.program_code || '')
    return slugFromName === normalizedSlug || slugFromCode === normalizedSlug
  })

  return matched ?? null
}

export const useCurriculumData = () => {
  const activeProgramId = ref('')
  const activeSpecializationId = ref('')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const curriculumInfo = ref<CurriculumInfoPayload | null>(null)
  const curriculumDetail = ref<Awaited<ReturnType<typeof getCurriculumDetailByProgramId>>>(null)
  const studyPlans = ref<ProgramStudyPlanRow[]>([])

  const fetchCurriculumData = async (
    route: RouteLocationNormalizedLoaded,
    options: FetchOptions = {},
  ): Promise<void> => {
    isLoading.value = true
    errorMessage.value = null

    try {
      const programIdFromParams = normalizeRouteValue(route.params.programId)
      const programIdFromQuery = normalizeRouteValue(route.query.programId)
      const specializationIdFromParams = normalizeRouteValue(route.params.specializationId)
      const specializationIdFromQuery = normalizeRouteValue(route.query.specializationId)

      activeProgramId.value = programIdFromParams || programIdFromQuery
      activeSpecializationId.value = specializationIdFromParams || specializationIdFromQuery

      curriculumInfo.value = null
      curriculumDetail.value = null
      studyPlans.value = []

      if (activeProgramId.value) {
        let resolvedProgramId = ''
        let resolvedSpecializationId = ''

        const programData = await findProgramByIdentifier(activeProgramId.value)

        if (!programData) {
          throw new Error(`Program with identifier "${activeProgramId.value}" was not found in the database.`)
        }

        resolvedProgramId = programData.id
        activeProgramId.value = programData.id

        curriculumInfo.value = {
          id: programData.id,
          program_id: programData.id,
          program_name: programData.program_name,
          source: 'programs',
        }

        if (activeSpecializationId.value) {
          if (isUuid(activeSpecializationId.value)) {
            const { data: specializationData, error: specializationError } = await supabase
              .from('program_specializations')
              .select('id, program_id, program_sp_name, program_sp_code')
              .eq('id', activeSpecializationId.value)
              .maybeSingle()

            if (specializationError) {
              throw specializationError
            }

            if (specializationData) {
              resolvedSpecializationId = specializationData.id
              curriculumInfo.value = {
                id: specializationData.id,
                program_id: specializationData.program_id,
                program_sp_name: specializationData.program_sp_name,
                source: 'program_specializations',
              }
            }
          }
        }

        curriculumDetail.value = await getCurriculumDetailByProgramId(
          resolvedProgramId,
          resolvedSpecializationId || null,
        )

        if (curriculumDetail.value) {
          curriculumInfo.value = {
            id: curriculumDetail.value.id,
            program_id: curriculumDetail.value.program_id,
            program_name: curriculumInfo.value?.program_name ?? undefined,
            revision_year: curriculumDetail.value.revision_year,
            revision_no: curriculumDetail.value.revision_no,
            legal_basis: curriculumDetail.value.legal_basis,
            effectivity_term: curriculumDetail.value.effectivity_term,
            description: curriculumDetail.value.description,
            source: curriculumInfo.value?.source ?? 'programs',
          }
        }

        if (!curriculumInfo.value) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('id, program_name')
            .eq('id', resolvedProgramId)
            .maybeSingle()

          if (programError) {
            throw programError
          }

          curriculumInfo.value = programData
            ? {
                id: programData.id,
                program_id: programData.id,
                program_name: programData.program_name,
                source: 'programs',
              }
            : null
        }

        studyPlans.value = await getProgramStudyPlans(
          resolvedProgramId,
          resolvedSpecializationId || null,
        )
        return
      }

      if (!options.allowAllStudyPlans) {
        throw new Error('Missing programId in route parameters.')
      }

      const { data, error } = await supabase
        .from('program_study_plan')
        .select('*')
        .order('year_level', { ascending: true })
        .order('semester', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) {
        throw error
      }

      studyPlans.value = (data as ProgramStudyPlanRow[] | null) ?? []
    } catch (error) {
      console.error('Failed to fetch curriculum data:', error)
      errorMessage.value =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to load curriculum data.'
      curriculumInfo.value = null
      studyPlans.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeProgramId,
    activeSpecializationId,
    isLoading,
    errorMessage,
    curriculumInfo,
    curriculumDetail,
    studyPlans,
    fetchCurriculumData,
  }
}
