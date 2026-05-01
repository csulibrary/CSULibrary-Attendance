/**
 * Composables/useReportData.ts
 *
 * Central composable for the Reports module.
 * Handles:
 *   1. All Supabase data-fetching (colleges, programs, validation)
 *   2. Delegating PDF generation to the correct PDF/Pages/ generator
 *   3. Exposing reactive state consumed by ReportPage.vue and all child components
 *
 * Usage:
 *   const report = useReportData(supabase)
 *   await report.loadCollegesAndPrograms()
 *   const blob = await report.generate(filters)
 */

import { ref, computed } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import { generateAllPdf } from '../PDF/Pages/pdfAll'
import { generateCollegePdf } from '../PDF/Pages/pdfByCollege'
import { generateSpecificPdf } from '../PDF/Pages/pdfSpecific'
import type { DateFilter } from '../PDF/Pages/pdfAll'
import type { SpecificType } from '../PDF/Pages/pdfSpecific'

// ── Re-export shared types so the rest of the module only imports from here ────

export type { DateFilter, SpecificType }

export type ReportType = 'all' | 'college' | 'specific'
export type DateFilterType = 'day' | 'period' | 'month'

export interface GenerateParams {
  reportType: ReportType
  dateFilterType: DateFilterType
  /** 'YYYY-MM-DD' – used when dateFilterType === 'day' */
  selectedDay: string
  /** 'YYYY-MM-DD' */
  periodFrom: string
  /** 'YYYY-MM-DD' */
  periodTo: string
  /** 1-12 array, used when dateFilterType === 'month' */
  selectedMonths: number[]
  selectedYear: number
  selectedCollege: string
  selectedProgram: string
  selectedSpecific: SpecificType
}

// ── Composable ─────────────────────────────────────────────────────────────────

export function useReportData(supabase: SupabaseClient) {
  // ── Metadata state ───────────────────────────────────────────────────────────
  const colleges = ref<string[]>([])
  const programsByCollege = ref<Record<string, string[]>>({})
  const isLoadingMeta = ref(false)
  const metaError = ref<string | null>(null)

  // ── Generation state ─────────────────────────────────────────────────────────
  const isGenerating = ref(false)
  const generateError = ref<string | null>(null)
  const generatedBlob = ref<Blob | null>(null)
  const reportSummary = ref('')

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filteredPrograms = computed(
    () => (college: string) => programsByCollege.value[college] ?? [],
  )

  // ── Load colleges and programs from DB ───────────────────────────────────────

  /**
   * Fetches distinct college and program values from the students table.
   * Call once on mount in ReportPage.vue.
   */
  async function loadCollegesAndPrograms(): Promise<void> {
    isLoadingMeta.value = true
    metaError.value = null
    try {
      const { data, error } = await supabase
        .from('students')
        .select('college, program')
        .order('college')

      if (error) throw error

      const collegeSet = new Set<string>()
      const programsMap: Record<string, Set<string>> = {}

      for (const row of data ?? []) {
        const c = row.college?.trim()
        const p = row.program?.trim()
        if (!c) continue
        collegeSet.add(c)
        if (!programsMap[c]) programsMap[c] = new Set()
        if (p) programsMap[c].add(p)
      }

      colleges.value = [...collegeSet].sort()
      programsByCollege.value = Object.fromEntries(
        Object.entries(programsMap).map(([c, ps]) => [c, [...ps].sort()]),
      )
    } catch (err: any) {
      metaError.value = err.message ?? 'Failed to load college/program data.'
    } finally {
      isLoadingMeta.value = false
    }
  }

  // ── Build DateFilter object from UI params ────────────────────────────────────

  function buildDateFilter(params: GenerateParams): DateFilter {
    return {
      type: params.dateFilterType,
      day: params.selectedDay || undefined,
      from: params.periodFrom || undefined,
      to: params.periodTo || undefined,
      months: params.selectedMonths.length ? params.selectedMonths : undefined,
      year: params.selectedYear,
    }
  }

  // ── Validate params before generating ────────────────────────────────────────

  function validate(params: GenerateParams): string | null {
    const {
      dateFilterType,
      selectedDay,
      periodFrom,
      periodTo,
      selectedMonths,
      reportType,
      selectedSpecific,
      selectedCollege,
    } = params

    if (dateFilterType === 'day' && !selectedDay) return 'Please select a day.'
    if (dateFilterType === 'period' && (!periodFrom || !periodTo))
      return 'Please select a start and end date.'
    if (dateFilterType === 'period' && periodFrom > periodTo)
      return 'Start date must be before end date.'
    if (dateFilterType === 'month' && selectedMonths.length === 0)
      return 'Please select at least one month.'
    if (reportType === 'specific' && !selectedSpecific) return 'Please select a report focus.'
    if (reportType === 'college' && !selectedCollege) return 'Please select a college.'

    return null
  }

  // ── Main generate function ────────────────────────────────────────────────────

  /**
   * Validates params, calls the appropriate PDF generator, and stores the
   * resulting Blob in generatedBlob.
   *
   * @returns true on success, false on validation or generation failure
   */
  async function generate(params: GenerateParams): Promise<boolean> {
    generateError.value = null
    generatedBlob.value = null
    reportSummary.value = ''

    const validationErr = validate(params)
    if (validationErr) {
      generateError.value = validationErr
      return false
    }

    isGenerating.value = true

    try {
      const dateFilter = buildDateFilter(params)
      const scope = {
        college: params.selectedCollege || undefined,
        program: params.selectedProgram || undefined,
      }

      if (params.reportType === 'all') {
        generatedBlob.value = await generateAllPdf(supabase, dateFilter)
        reportSummary.value = buildAllSummary(params)
      } else if (params.reportType === 'college') {
        generatedBlob.value = await generateCollegePdf(supabase, dateFilter, scope)
        reportSummary.value = buildCollegeSummary(params)
      } else {
        generatedBlob.value = await generateSpecificPdf(
          supabase,
          dateFilter,
          scope,
          params.selectedSpecific,
        )
        reportSummary.value = buildSpecificSummary(params)
      }

      return true
    } catch (err: any) {
      generateError.value = err.message ?? 'An unknown error occurred while generating the report.'
      return false
    } finally {
      isGenerating.value = false
    }
  }

  // ── Download helper ───────────────────────────────────────────────────────────

  /**
   * Triggers a browser download of the generated PDF.
   * Safe to call only after generate() returns true.
   */
  function downloadPdf(filename?: string): void {
    if (!generatedBlob.value) return
    const url = URL.createObjectURL(generatedBlob.value)
    const link = document.createElement('a')
    link.href = url
    link.download = filename ?? buildFilename()
    link.click()
    URL.revokeObjectURL(url)
  }

  /** Reset generation state so the user can start over. */
  function resetGeneration(): void {
    generatedBlob.value = null
    generateError.value = null
    reportSummary.value = ''
  }

  // ── Summary label builders ────────────────────────────────────────────────────

  const MONTH_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  function dateSummary(p: GenerateParams): string {
    if (p.dateFilterType === 'day') return p.selectedDay
    if (p.dateFilterType === 'period') return `${p.periodFrom} – ${p.periodTo}`
    const mLabels = p.selectedMonths.map((m) => MONTH_NAMES[m - 1]).join(', ')
    return `${mLabels} ${p.selectedYear}`
  }

  function buildAllSummary(p: GenerateParams): string {
    return `All Attendance · ${dateSummary(p)}`
  }

  function buildCollegeSummary(p: GenerateParams): string {
    const scope = p.selectedProgram || p.selectedCollege || 'All Colleges'
    return `${scope} · ${dateSummary(p)}`
  }

  const SPECIFIC_LABELS: Record<SpecificType, string> = {
    top_students: 'Top Visiting Students',
    peak_hours: 'Peak & Low Hours',
    duration: 'Duration Analysis',
    events: 'Events Report',
  }

  function buildSpecificSummary(p: GenerateParams): string {
    return `${SPECIFIC_LABELS[p.selectedSpecific]} · ${dateSummary(p)}`
  }

  function buildFilename(): string {
    const now = new Date()
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    return `attendance-report-${ts}.pdf`
  }

  // ── Expose ────────────────────────────────────────────────────────────────────

  return {
    // Metadata
    colleges,
    programsByCollege,
    filteredPrograms,
    isLoadingMeta,
    metaError,

    // Generation
    isGenerating,
    generateError,
    generatedBlob,
    reportSummary,

    // Methods
    loadCollegesAndPrograms,
    generate,
    downloadPdf,
    resetGeneration,
  }
}
