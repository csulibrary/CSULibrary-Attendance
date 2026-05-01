/**
 * PDF/Pages/pdfByCollege.ts
 *
 * Generates the PDF for the BY COLLEGE report type.
 *
 * Whole college (no program selected) → 6 pages:
 *   1. Attendance Per Program          [Bar Chart]
 *   2. Attendance Per Year Level       [Bar Chart]
 *   3. Programs Per Hour               [Line Chart]
 *   4. Year Levels Per Hour            [Line Chart]
 *   5. Programs – Female vs Male       [Pie Chart]
 *   6. Year Levels – Female vs Male    [Pie Chart]
 *
 * Specific program selected → same 6 pages but scoped to that program.
 *
 * Called from: Composables/useReportData.ts → generateCollegePdf()
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { PdfSession } from '../pdfGenerator'
import { renderBarChart } from '../Charts/renderBarChart'
import { renderLineChart } from '../Charts/renderLineChart'
import { renderPieChart } from '../Charts/renderPieChart'
import type { DateFilter } from './pdfAll'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CollegeScope {
  college?: string
  program?: string
}

// Row shape after Supabase join
interface AttendanceRow {
  time_in: string
  students: {
    program: string | null
    college: string | null
    year_level: number | null
    gender: string | null
  } | null
}

interface AttendanceRowRaw {
  time_in: string
  students:
    | {
        program: string | null
        college: string | null
        year_level: number | null
        gender: string | null
      }[]
    | null
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Converts a filter to a { gte, lte } object for Supabase queries. */
function toTimeRange(filter: DateFilter): { gte: string; lte: string } | null {
  if (filter.type === 'day' && filter.day) {
    return { gte: filter.day + 'T00:00:00', lte: filter.day + 'T23:59:59' }
  }
  if (filter.type === 'period' && filter.from && filter.to) {
    return { gte: filter.from + 'T00:00:00', lte: filter.to + 'T23:59:59' }
  }
  if (filter.type === 'month' && filter.months?.length) {
    const y = filter.year ?? new Date().getFullYear()
    const sorted = [...filter.months].sort((a, b) => a - b)
    const firstMonth = sorted[0]
    const lastMonth = sorted[sorted.length - 1]
    if (firstMonth == null || lastMonth == null) return null
    return {
      gte: new Date(y, firstMonth - 1, 1).toISOString(),
      lte: new Date(y, lastMonth, 0, 23, 59, 59).toISOString(),
    }
  }
  return null
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item)
      ;(acc[k] = acc[k] ?? []).push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

/** Hour display label e.g. "8AM", "1PM" */
function hourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}${suffix}`
}

/** Counts rows per hour bucket (6–21). */
function countByHour(rows: AttendanceRow[]): number[] {
  const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6..21
  return hours.map((h) => rows.filter((r) => new Date(r.time_in).getHours() === h).length)
}

const HOURS_6_TO_21 = Array.from({ length: 16 }, (_, i) => hourLabel(i + 6))

// ── Pagination helper for fetching all records ────────────────────────────────
async function fetchAllWithPagination<T>(
  query: any,
  pageSize: number = 1000,
): Promise<T[]> {
  let allData: T[] = []
  let offset = 0

  while (true) {
    const { data, error } = await query.range(offset, offset + pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    allData.push(...(data as T[]))
    if (data.length < pageSize) break
    offset += pageSize
  }

  return allData
}

// ── Supabase fetch ─────────────────────────────────────────────────────────────

async function fetchRows(
  supabase: SupabaseClient,
  filter: DateFilter,
  scope: CollegeScope,
): Promise<AttendanceRow[]> {
  const tf = toTimeRange(filter)

  let q = supabase
    .from('attendance_logs')
    .select('time_in, students!inner(program, college, year_level, gender)')
    .order('time_in', { ascending: true })

  if (tf) q = q.gte('time_in', tf.gte).lte('time_in', tf.lte)
  if (scope.college) q = (q as any).eq('students.college', scope.college)
  if (scope.program) q = (q as any).eq('students.program', scope.program)

  try {
    const rows = (await fetchAllWithPagination(q)) as AttendanceRowRaw[]
    return rows.map((row) => ({
      time_in: row.time_in,
      students: Array.isArray(row.students) ? (row.students[0] ?? null) : null,
    }))
  } catch (error: any) {
    throw new Error(`Supabase error (college fetch): ${error.message}`)
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function generateCollegePdf(
  supabase: SupabaseClient,
  filter: DateFilter,
  scope: CollegeScope,
): Promise<Blob> {
  const isSpecificProgram = !!scope.program
  const scopeLabel = scope.program ?? scope.college ?? 'All Colleges'
  const TOTAL_PAGES = 6

  // Build subtitle
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
  const datePart =
    filter.type === 'month'
      ? (filter.months ?? []).map((m) => MONTH_NAMES[m - 1]).join(', ') + ' ' + (filter.year ?? '')
      : filter.type === 'day'
        ? filter.day
        : `${filter.from} – ${filter.to}`

  const subtitle = `${scopeLabel}   ·   ${datePart}`

  const session = new PdfSession(
    {
      title: isSpecificProgram ? 'PROGRAM ATTENDANCE REPORT' : 'COLLEGE ATTENDANCE REPORT',
      subtitle,
      college: scope.college,
      program: scope.program,
    },
    TOTAL_PAGES,
  )

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const rows = await fetchRows(supabase, filter, scope)

  // Groupings used across multiple pages
  const byProgram = groupBy(rows, (r) => r.students?.program ?? 'Unknown')
  const byYearLevel = groupBy(rows, (r) => `Year ${r.students?.year_level ?? '?'}`)

  const programLabels = Object.keys(byProgram)
  const yearLevelLabels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'].filter(
    (l) => byYearLevel[l],
  )

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 1 — Attendance Per Program (or Program Overview)
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Attendance Overview` : 'Attendance Per Program',
      `Total visits: ${rows.length.toLocaleString()}   ·   Programs recorded: ${programLabels.length}`,
    )
    const chart = await renderBarChart({
      labels: programLabels,
      datasets: [{ label: 'Visits', data: programLabels.map((p) => byProgram[p]?.length ?? 0) }],
      yLabel: 'Number of Visits',
    })
    session.embedChart(chart, startY)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 2 — Attendance Per Year Level
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Year Level Breakdown` : 'Attendance Per Year Level',
      `Across ${yearLevelLabels.length} year level(s)`,
    )
    const chart = await renderBarChart({
      labels: yearLevelLabels,
      datasets: [
        {
          label: 'Visits',
          data: yearLevelLabels.map((l) => byYearLevel[l]?.length ?? 0),
          color: '#2e7d32',
        },
      ],
      yLabel: 'Number of Visits',
    })
    session.embedChart(chart, startY)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 3 — Programs Per Hour (Line Chart)
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Hourly Attendance` : 'Programs — Hourly Attendance',
      'Number of visits per hour of day (6AM – 9PM)',
    )

    const datasets = isSpecificProgram
      ? [{ label: scope.program!, data: countByHour(rows) }]
      : programLabels.slice(0, 6).map((p) => ({
          label: p,
          data: countByHour(byProgram[p] ?? []),
        }))

    const chart = await renderLineChart({ labels: HOURS_6_TO_21, datasets, yLabel: 'Visits' })
    session.embedChart(chart, startY)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 4 — Year Levels Per Hour (Line Chart)
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Year Level Hourly`
        : 'Year Levels — Hourly Attendance',
      'Each line represents one year level across the day',
    )

    const datasets = yearLevelLabels.map((yl) => ({
      label: yl,
      data: countByHour(byYearLevel[yl] ?? []),
    }))

    const chart = await renderLineChart({ labels: HOURS_6_TO_21, datasets, yLabel: 'Visits' })
    session.embedChart(chart, startY)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 5 — Programs' Gender Distribution (Pie)
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const female = rows.filter((r) => r.students?.gender?.toLowerCase() === 'female').length
    const male = rows.filter((r) => r.students?.gender?.toLowerCase() === 'male').length
    const other = rows.length - female - male

    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Gender Distribution`
        : 'Programs — Gender Distribution',
      `Female: ${female.toLocaleString()}   ·   Male: ${male.toLocaleString()}${other > 0 ? `   ·   Other/Unknown: ${other}` : ''}`,
    )

    const labels = other > 0 ? ['Female', 'Male', 'Other/Unknown'] : ['Female', 'Male']
    const data = other > 0 ? [female, male, other] : [female, male]
    const colors = ['#e91e63', '#1565c0', '#78909c']

    const chart = await renderPieChart({ labels, data, colors })
    session.embedChart(chart, startY, 110)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PAGE 6 — Year Levels' Gender Distribution (Pie)
  // ────────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const pieLabels: string[] = []
    const pieData: number[] = []
    const pieColors: string[] = []

    for (const yl of yearLevelLabels) {
      const ylRows = byYearLevel[yl] ?? []
      const f = ylRows.filter((r) => r.students?.gender?.toLowerCase() === 'female').length
      const m = ylRows.filter((r) => r.students?.gender?.toLowerCase() === 'male').length
      if (f + m === 0) continue
      pieLabels.push(`${yl} — F`, `${yl} — M`)
      pieData.push(f, m)
      pieColors.push('#e91e63cc', '#1565c0cc')
    }

    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Year Level Gender`
        : 'Year Levels — Gender Distribution',
      'Female vs Male breakdown per year level',
    )

    const chart = await renderPieChart({
      labels: pieLabels,
      data: pieData,
      colors: pieColors,
      variant: 'doughnut',
      legendPos: 'right',
    })
    session.embedChart(chart, startY, 110)
  }

  return session.toBlob()
}
