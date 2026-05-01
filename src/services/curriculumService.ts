import { supabase } from '@/lib/supabase'
import type {
  CurriculumData,
  CurriculumDetail,
  CollegeCurriculum,
  CurriculumCourse,
  CurriculumRequirement,
  Course,
  ProgramSpecialization,
  ProgramStudyPlanRow,
  ProgramCurriculum,
  StudyPlanItem,
  SemesterCurriculum,
} from '@/types/Curriculum'

const CURRICULA_TABLE = 'curricula'

type CurriculumRow = {
  id: string
  program_id: string
  revision_year: number | null
  revision_no: string | null
  legal_basis: string | null
  effectivity_term: string | null
  description: string | null
  created_at?: string
  program_specialization_id?: string | null
}

type RequirementRow = {
  id: string
  curriculum_id: string | null
  name: string | null
  description: string | null
  display_order: number | null
}

type RequirementCourseRow = {
  id: string
  requirement_id: string | null
  display_order: number | null
  courses:
    | {
        id: string
        course_code: string | null
        course_title: string
      }
    | Array<{
        id: string
        course_code: string | null
        course_title: string
      }>
    | null
}

type StudyPlanRow = {
  id: string
  curriculum_id: string | null
  year_level: number | null
  semester: number | null
  display_order: number | null
  type?: string | null
  courses:
    | {
        id: string
        course_code: string | null
        course_title: string
      }
    | Array<{
        id: string
        course_code: string | null
        course_title: string
      }>
    | null
}

type CollegeLookupRow = {
  code: string
  name: string
}

const firstValue = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

const mapCourse = (courseRow: RequirementCourseRow['courses'] | StudyPlanRow['courses']): Course | null => {
  const course = firstValue(courseRow)

  if (!course) {
    return null
  }

  return {
    id: course.id,
    course_code: course.course_code ?? '',
    course_title: course.course_title,
  }
}

type ProgramWithCurriculaRow = {
  id: string
  program_name: string
  created_at?: string
  college_id: string
  colleges:
    | {
        code: string
        name: string
      }
    | Array<{
        code: string
        name: string
      }>
    | null
  curricula: Array<{
    id: string
    effectivity_term: string | null
    created_at?: string
  }>
  program_specializations?: Array<{
    id: string
    program_id: string
    program_sp_name: string
    program_sp_code?: string | null
  }>
}

const mapProgramsToCurriculumData = (
  programRows: ProgramWithCurriculaRow[],
  collegeRows: CollegeLookupRow[],
): CurriculumData[] => {
  const result: CurriculumData[] = []

  // Preserve colleges with no programs so cards still render.
  for (const college of collegeRows) {
    result.push({
      id: `college-${college.code}`,
      college_code: college.code,
      college_name: college.name,
      program_name: '',
      semester_label: '',
      subjects: [],
    })
  }

  for (const program of programRows) {
    const college = Array.isArray(program.colleges) ? program.colleges[0] : program.colleges

    if (!college) {
      continue
    }

    if (!program.curricula.length) {
      result.push({
        id: `${program.id}-base`,
        program_id: program.id,
        college_code: college.code,
        college_name: college.name,
        program_name: program.program_name,
        semester_label: '',
        subjects: [],
        created_at: program.created_at,
      })
      continue
    }

    for (const curriculum of program.curricula) {
      result.push({
        id: curriculum.id,
        program_id: program.id,
        college_code: college.code,
        college_name: college.name,
        program_name: program.program_name,
        semester_label: curriculum.effectivity_term ?? '',
        subjects: [],
        created_at: curriculum.created_at,
      })
    }
  }

  return result.sort((a, b) => {
    const collegeCompare = a.college_code.localeCompare(b.college_code)
    if (collegeCompare !== 0) return collegeCompare

    const programCompare = (a.program_name || '').localeCompare(b.program_name || '')
    if (programCompare !== 0) return programCompare

    return (a.semester_label || '').localeCompare(b.semester_label || '')
  })
}

/**
 * Fetch all curriculums from database
 */
export const getCurriculums = async (): Promise<CurriculumData[]> => {
  const [{ data: collegesData, error: collegesError }, { data: programsData, error: programsError }] =
    await Promise.all([
      supabase
        .from('colleges')
        .select('code, name')
        .order('code', { ascending: true }),
      supabase
        .from('programs')
        .select('id, program_name, created_at, college_id, colleges(code, name), curricula(id, effectivity_term, created_at), program_specializations(id, program_id, program_sp_name, program_sp_code)')
        .order('program_name', { ascending: true }),
    ])

  if (collegesError) {
    console.error('Error fetching colleges:', collegesError)
    throw collegesError
  }

  if (programsError) {
    console.error('Error fetching program curriculums:', programsError)
    throw programsError
  }

  return mapProgramsToCurriculumData(
    (programsData as ProgramWithCurriculaRow[]) || [],
    (collegesData as CollegeLookupRow[]) || [],
  )
}

/**
 * Fetch curriculums by college code
 */
export const getCurriculumsByCollege = async (collegeCode: string): Promise<CurriculumData[]> => {
  const { data: collegeData, error: collegeError } = await supabase
    .from('colleges')
    .select('id, code, name')
    .eq('code', collegeCode)
    .single()

  if (collegeError) {
    console.error('Error fetching college:', collegeError)
    throw collegeError
  }

  const { data: programsData, error: programsError } = await supabase
    .from('programs')
    .select('id, program_name, created_at, college_id, colleges(code, name), curricula(id, effectivity_term, created_at), program_specializations(id, program_id, program_sp_name, program_sp_code)')
    .eq('college_id', collegeData.id)
    .order('program_name', { ascending: true })

  if (programsError) {
    console.error('Error fetching college curriculums:', programsError)
    throw programsError
  }

  return mapProgramsToCurriculumData((programsData as ProgramWithCurriculaRow[]) || [], [
    { code: collegeData.code, name: collegeData.name },
  ])
}

/**
 * Transform flat curriculum data into grouped structure
 */
export const transformCurriculumsToCollege = (curriculumData: CurriculumData[]): CollegeCurriculum[] => {
  const collegeMap = new Map<string, CollegeCurriculum>()

  for (const item of curriculumData) {
    if (!item.college_code) {
      continue
    }

    // Get or create college
    if (!collegeMap.has(item.college_code)) {
      collegeMap.set(item.college_code, {
        code: item.college_code,
        name: item.college_name,
        programs: [],
      })
    }

    const college = collegeMap.get(item.college_code)!

    // College-level rows are used to keep empty colleges visible.
    if (!item.program_name) {
      continue
    }

    let program = college.programs.find((p) => p.id === (item.program_id || `${item.college_code}-${item.program_name}`))

    // Create program if it doesn't exist
    if (!program) {
      program = {
        id: item.program_id || `${item.college_code}-${item.program_name}`,
        name: item.program_name,
        curriculum: [],
        college_code: item.college_code,
      }
      college.programs.push(program)
    }

    // Add semester if it doesn't exist
    if (!item.semester_label) {
      continue
    }

    let semester = program.curriculum.find((s) => s.label === item.semester_label)
    if (!semester) {
      semester = {
        label: item.semester_label,
        subjects: [],
      }
      program.curriculum.push(semester)
    }

    // Add subjects
    semester.subjects = item.subjects
  }

  return Array.from(collegeMap.values())
}

/**
 * Fetch the latest curriculum detail for a specific program.
 */
export const getCurriculumDetailByProgramId = async (
  programId: string,
  specializationId?: string | null,
): Promise<CurriculumDetail | null> => {
  const curriculumSelect =
    'id, program_id, revision_year, revision_no, legal_basis, effectivity_term, description, created_at, program_specialization_id'

  const curriculumQuery = specializationId
    ? supabase
        .from(CURRICULA_TABLE)
        .select(curriculumSelect)
        .eq('program_specialization_id', specializationId)
    : supabase.from(CURRICULA_TABLE).select(curriculumSelect).eq('program_id', programId)

  const { data: curriculumData, error: curriculumError } = await curriculumQuery
    .order('revision_year', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (curriculumError) {
    console.error('Error fetching curriculum detail:', curriculumError)
    throw curriculumError
  }

  if (!curriculumData) {
    return null
  }

  const curriculum = curriculumData as CurriculumRow

  const [{ data: requirementsData, error: requirementsError }, { data: studyPlanData, error: studyPlanError }] =
    await Promise.all([
      supabase
        .from('curriculum_requirements')
        .select('id, curriculum_id, name, description, display_order, created_at')
        .eq('curriculum_id', curriculum.id)
        .order('display_order', { ascending: true }),
      supabase
        .from('program_study_plan')
        .select('id, curriculum_id, year_level, semester, display_order, type, courses(id, course_code, course_title)')
        .eq('curriculum_id', curriculum.id)
        .order('year_level', { ascending: true })
        .order('semester', { ascending: true })
        .order('display_order', { ascending: true }),
    ])

  if (requirementsError) {
    console.error('Error fetching curriculum requirements:', requirementsError)
    throw requirementsError
  }

  if (studyPlanError) {
    console.error('Error fetching curriculum study plan:', studyPlanError)
    throw studyPlanError
  }

  const requirementRows = (requirementsData as RequirementRow[] | null) ?? []
  const studyPlanRows = (studyPlanData as StudyPlanRow[] | null) ?? []

  const coursesByRequirement = new Map<string, CurriculumCourse[]>()

  if (requirementRows.length) {
    const requirementIds = requirementRows.map((row) => row.id)
    const { data: requirementCoursesData, error: requirementCoursesError } = await supabase
      .from('curriculum_courses')
      .select('id, requirement_id, display_order, courses(id, course_code, course_title)')
      .in('requirement_id', requirementIds)
      .order('display_order', { ascending: true })

    if (requirementCoursesError) {
      console.error('Error fetching curriculum courses:', requirementCoursesError)
      throw requirementCoursesError
    }

    for (const row of (requirementCoursesData as RequirementCourseRow[] | null) ?? []) {
      if (!row.requirement_id) {
        continue
      }

      const course = mapCourse(row.courses)
      if (!course) {
        continue
      }

      const mappedCourse: CurriculumCourse = {
        id: row.id,
        display_order: row.display_order ?? 0,
        course,
      }

      const currentCourses = coursesByRequirement.get(row.requirement_id) ?? []
      currentCourses.push(mappedCourse)
      coursesByRequirement.set(row.requirement_id, currentCourses)
    }
  }

  const requirements: CurriculumRequirement[] = requirementRows.map((row) => ({
    id: row.id,
    name: row.name ?? '',
    description: row.description ?? undefined,
    display_order: row.display_order ?? 0,
    courses: (coursesByRequirement.get(row.id) ?? []).sort(
      (a, b) => a.display_order - b.display_order,
    ),
  }))

  const study_plan: StudyPlanItem[] = studyPlanRows
    .map((row) => {
      const course = mapCourse(row.courses)
      if (!course) {
        return null
      }

      return {
        id: row.id,
        year_level: row.year_level ?? 0,
        semester: row.semester ?? 0,
        display_order: row.display_order ?? 0,
        course,
      }
    })
    .filter((item): item is StudyPlanItem => item !== null)

  return {
    id: curriculum.id,
    program_id: curriculum.program_id,
    revision_year: curriculum.revision_year,
    revision_no: curriculum.revision_no,
    legal_basis: curriculum.legal_basis,
    effectivity_term: curriculum.effectivity_term,
    description: curriculum.description,
    created_at: curriculum.created_at,
    requirements,
    study_plan,
  }
}

/**
 * Fetch all specializations linked to a program.
 */
export const getProgramSpecializationsByProgramId = async (
  programId: string,
  programName?: string,
): Promise<ProgramSpecialization[]> => {
  const extendedSelect =
    'id, program_id, program_sp_name, program_sp_code, description, revision_year, revision_no, legal_basis, effectivity_term'
  const baseSelect = 'id, program_id, program_sp_name, program_sp_code'

  const { data, error } = await supabase
    .from('program_specializations')
    .select(extendedSelect)
    .eq('program_id', programId)
    .order('program_sp_name', { ascending: true })

  if (!error) {
    const rows = (data as ProgramSpecialization[] | null) ?? []
    if (rows.length) {
      return rows
    }
  }

  // Fallback for databases that don't yet have metadata columns on program_specializations.
  const { data: baseData, error: baseError } = await supabase
    .from('program_specializations')
    .select(baseSelect)
    .eq('program_id', programId)
    .order('program_sp_name', { ascending: true })

  if (baseError) {
    // Last fallback: query through programs join for environments with stricter direct-table policies.
    const { data: programRow, error: programRowError } = await supabase
      .from('programs')
      .select('program_specializations(id, program_id, program_sp_name, program_sp_code, description, revision_year, revision_no, legal_basis, effectivity_term)')
      .eq('id', programId)
      .maybeSingle()

    if (programRowError) {
      console.error('Error fetching program specializations:', programRowError)
      throw programRowError
    }

    const joinedSpecializations = (
      programRow as
        | {
            program_specializations?: ProgramSpecialization[]
          }
        | null
    )?.program_specializations

    return joinedSpecializations ?? []
  }

  const baseRows = (baseData as ProgramSpecialization[] | null) ?? []
  if (baseRows.length) {
    return baseRows
  }

  // Fallback by program name context for datasets where program_id linkage is inconsistent.
  if (programName) {
    const { data: joinedRows, error: joinedRowsError } = await supabase
      .from('program_specializations')
      .select('id, program_id, program_sp_name, program_sp_code, description, revision_year, revision_no, legal_basis, effectivity_term, programs(id, program_name)')

    if (!joinedRowsError && joinedRows) {
      const mapped = (joinedRows as Array<{
        id: string
        program_id?: string
        program_sp_name: string
        program_sp_code?: string | null
        description?: string | null
        revision_year?: number | null
        revision_no?: string | null
        legal_basis?: string | null
        effectivity_term?: string | null
        programs?: { id?: string; program_name?: string } | Array<{ id?: string; program_name?: string }> | null
      }>)
        .filter((row) => {
          const rel = Array.isArray(row.programs) ? row.programs[0] : row.programs
          return rel?.id === programId || rel?.program_name === programName || row.program_id === programId
        })
        .map((row) => ({
          id: row.id,
          program_id: row.program_id,
          program_sp_name: row.program_sp_name,
          program_sp_code: row.program_sp_code,
          description: row.description,
          revision_year: row.revision_year,
          revision_no: row.revision_no,
          legal_basis: row.legal_basis,
          effectivity_term: row.effectivity_term,
        }))

      if (mapped.length) {
        return mapped
      }
    }
  }

  return []
}

/**
 * Fetch a single specialization row by id.
 */
export const getProgramSpecializationById = async (
  specializationId: string,
): Promise<ProgramSpecialization | null> => {
  const extendedSelect =
    'id, program_id, program_sp_name, program_sp_code, description, revision_year, revision_no, legal_basis, effectivity_term'
  const baseSelect = 'id, program_id, program_sp_name, program_sp_code'

  const { data, error } = await supabase
    .from('program_specializations')
    .select(extendedSelect)
    .eq('id', specializationId)
    .maybeSingle()

  if (!error) {
    return (data as ProgramSpecialization | null) ?? null
  }

  // Fallback for databases that don't yet have metadata columns on program_specializations.
  const { data: baseData, error: baseError } = await supabase
    .from('program_specializations')
    .select(baseSelect)
    .eq('id', specializationId)
    .maybeSingle()

  if (baseError) {
    console.error('Error fetching specialization metadata:', baseError)
    throw baseError
  }

  return (baseData as ProgramSpecialization | null) ?? null
}

/**
 * Fetch study plans for a program or specialization with course details
 */
export const getProgramStudyPlans = async (
  programId: string,
  programSpecializationId?: string | null,
): Promise<ProgramStudyPlanRow[]> => {
  // First, get the curriculum for this program/specialization
  const curriculumQuery = programSpecializationId
    ? supabase
        .from('curricula')
        .select('id')
        .eq('program_specialization_id', programSpecializationId)
    : supabase.from('curricula').select('id').eq('program_id', programId)

  const { data: curriculumList, error: curriculumError } = await curriculumQuery
    .order('revision_year', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)

  if (curriculumError) {
    console.error('Error fetching curriculum for study plans:', curriculumError)
    return []
  }

  const curriculumData = curriculumList?.[0]

  if (!curriculumData) {
    console.warn(`No curriculum found for programId: ${programId}`)
    return []
  }

  // Now fetch the study plan with course details
  const { data: studyPlanData, error: studyPlanError } = await supabase
    .from('program_study_plan')
    .select(`
      id,
      curriculum_id,
      course_id,
      year_level,
      semester,
      display_order,
      type,
      courses(id, course_code, course_title)
    `)
    .eq('curriculum_id', curriculumData.id)
    .order('year_level', { ascending: true })
    .order('semester', { ascending: true })
    .order('display_order', { ascending: true })

  if (studyPlanError) {
    console.error('Error fetching program study plans:', studyPlanError)
    return []
  }

  const transformedData: ProgramStudyPlanRow[] = ((studyPlanData as Array<Record<string, unknown>> | null) ?? []).map((row) => {
    const relatedCourseValue = (row.courses ?? row.course) as
      | { course_code?: string | null; course_title?: string | null }
      | Array<{ course_code?: string | null; course_title?: string | null }>
      | null
      | undefined
    const relatedCourse = Array.isArray(relatedCourseValue)
      ? (relatedCourseValue[0] ?? null)
      : (relatedCourseValue ?? null)

    return {
      id: String(row.id ?? ''),
      program_id: programId,
      year_level: Number(row.year_level ?? 0),
      semester: Number(row.semester ?? 0),
      display_order: Number(row.display_order ?? 0),
      course_code: relatedCourse?.course_code ?? null,
      course_title: relatedCourse?.course_title ?? null,
    }
  })

  const missingCourseRows = ((studyPlanData as Array<Record<string, unknown>> | null) ?? [])
    .map((row, index) => ({
      index,
      courseId: typeof row.course_id === 'string' ? row.course_id : null,
    }))
    .filter(({ index, courseId }) => {
      if (!courseId) {
        return false
      }

      const transformed = transformedData[index]
      if (!transformed) {
        return false
      }

      return !transformed.course_code || !transformed.course_title
    })

  if (missingCourseRows.length) {
    const uniqueCourseIds = Array.from(new Set(missingCourseRows.map((item) => item.courseId).filter(Boolean))) as string[]
    const { data: fallbackCourses, error: fallbackCoursesError } = await supabase
      .from('courses')
      .select('id, course_code, course_title')
      .in('id', uniqueCourseIds)

    if (!fallbackCoursesError) {
      const courseById = new Map(
        ((fallbackCourses as Array<{ id: string; course_code: string | null; course_title: string | null }> | null) ?? []).map((course) => [
          course.id,
          course,
        ]),
      )

      for (const { index, courseId } of missingCourseRows) {
        if (!courseId) {
          continue
        }

        const existingRow = transformedData[index]
        if (!existingRow) {
          continue
        }

        const fallbackCourse = courseById.get(courseId)
        if (!fallbackCourse) {
          continue
        }

        transformedData[index] = {
          ...existingRow,
          course_code: existingRow.course_code || fallbackCourse.course_code,
          course_title: existingRow.course_title || fallbackCourse.course_title,
        }
      }
    }
  }

  return transformedData
}

/**
 * Create curriculum entry
 */
export const createCurriculum = async (curriculumData: Partial<CurriculumData>) => {
  const { data, error } = await supabase
    .from(CURRICULA_TABLE)
    .insert([curriculumData])
    .select()
    .single()

  if (error) {
    console.error('Error creating curriculum:', error)
    throw error
  }

  return data
}

/**
 * Update curriculum entry
 */
export const updateCurriculum = async (
  id: string,
  updates: Partial<CurriculumData>,
) => {
  const { data, error } = await supabase
    .from(CURRICULA_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating curriculum:', error)
    throw error
  }

  return data
}

/**
 * Delete curriculum entry
 */
export const deleteCurriculum = async (id: string) => {
  const { data, error } = await supabase
    .from(CURRICULA_TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting curriculum:', error)
    throw error
  }

  return data
}
