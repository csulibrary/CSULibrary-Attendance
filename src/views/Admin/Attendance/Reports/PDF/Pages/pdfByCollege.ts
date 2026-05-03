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
 *   6. Year Levels – Female vs Male    [Pie Chart / Doughnut]
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

function hourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}${suffix}`
}

/** Counts rows per hour bucket (6–21). */
function countByHour(rows: AttendanceRow[]): number[] {
  return Array.from({ length: 16 }, (_, i) => i + 6).map(
    (h) => rows.filter((r) => new Date(r.time_in).getHours() === h).length,
  )
}

const HOURS_6_TO_21 = Array.from({ length: 16 }, (_, i) => hourLabel(i + 6))

// Fixed year levels — always 5 buckets even if some are empty
const YEAR_LEVELS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']

// Green palette for multi-series charts
const GREEN_PALETTE = [
  '#1b5e20',
  '#388e3c',
  '#66bb6a',
  '#0d2b0f',
  '#43a047',
]

// ── Pagination helper ─────────────────────────────────────────────────────────

async function fetchAllWithPagination<T>(query: any, pageSize = 1000): Promise<T[]> {
  const allData: T[] = []
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
      students: Array.isArray(row.students) ? (row.students[0] ?? null) : row.students ?? null,
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

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
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

  // ── Groupings ──────────────────────────────────────────────────────────────
  //
  // Always normalize program/year_level to a non-null string so groupBy
  // never silently creates an 'Unknown' / 'Year ?' bucket that hides real data.
  //
  const byProgram = groupBy(rows, (r) => r.students?.program ?? 'Unknown')
  const byYearLevel = groupBy(rows, (r) => {
    const yl = r.students?.year_level
    return yl != null ? `Year ${yl}` : 'Unknown'
  })

  // For whole-college view: list every distinct program found in the data.
  // For specific-program view: just that one program.
  const programLabels = isSpecificProgram
    ? [scope.program ?? 'Unknown']
    : Object.keys(byProgram)
        .filter((p) => p !== 'Unknown')
        .sort()

  // ── Page 1 ─────────────────────────────────────────────────────────────────
  // Whole college  → Bar: one bar per program, x-axis = program name
  // Specific prog  → Bar: single bar showing total visits for that program
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    // Build per-program counts
    const labelsPage1 = isSpecificProgram
      ? [scope.program ?? 'Unknown']
      : programLabels                                      // every discovered program

    const dataPage1 = isSpecificProgram
      ? [rows.length]
      : programLabels.map((p) => byProgram[p]?.length ?? 0)

    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Attendance Overview` : 'Attendance Per Program',
      `Total visits: ${rows.length.toLocaleString()}   ·   Programs recorded: ${labelsPage1.length}`,
    )

    // Assign a distinct green shade per bar so every program is visually
    // distinguishable even when there are many programs.
    const barColors = labelsPage1.map((_, i) => GREEN_PALETTE[i % GREEN_PALETTE.length] as string)

    const chart = await renderBarChart({
      labels: labelsPage1,
      datasets: [
        {
          label: 'Visits',
          data: dataPage1,
          // Pass color array via the first dataset; renderBarChart passes it
          // directly to Chart.js backgroundColor which accepts string[].
          color: barColors as unknown as string,
        },
      ],
      yLabel: 'Number of Visits',
      xLabel: 'Program',
    })
    session.embedChart(chart, startY)
  }

  // ── Page 2 ─────────────────────────────────────────────────────────────────
  // Bar chart: attendance count per year level (Year 1 … Year 5)
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    // Count directly from raw rows rather than relying on byYearLevel keys,
    // so every year level slot always has a number (even if 0).
    const dataPage2 = YEAR_LEVELS.map((yl) => {
      const yearNum = Number(yl.split(' ')[1])
      return rows.filter((r) => r.students?.year_level === yearNum).length
    })

    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Year Level Breakdown` : 'Attendance Per Year Level',
      `Year levels 1–5   ·   Total visits: ${rows.length.toLocaleString()}`,
    )

    const chart = await renderBarChart({
      labels: YEAR_LEVELS,
      datasets: [
        {
          label: 'Visits',
          data: dataPage2,
          color: '#2e7d32',
        },
      ],
      yLabel: 'Number of Visits',
      xLabel: 'Year Level',
    })
    session.embedChart(chart, startY)
  }

  // ── Page 3 ─────────────────────────────────────────────────────────────────
  // Line chart: hourly attendance — one line per program (up to 8 programs)
  // Each line is clearly labelled with the program name in the legend.
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram ? `${scope.program} — Hourly Attendance` : 'Programs — Hourly Attendance',
      'Visits per hour of day (6 AM – 9 PM)',
    )

    const lineDatasets = isSpecificProgram
      ? [
          {
            label: scope.program!,
            data: countByHour(rows),
            color: GREEN_PALETTE[0] as string,
          },
        ]
      : programLabels.slice(0, 8).map((p, i) => ({
          label: p,                                        // explicit program name as legend label
          data: countByHour(byProgram[p] ?? []),
          color: GREEN_PALETTE[i % GREEN_PALETTE.length] as string,
        }))

    const chart = await renderLineChart({
      labels: HOURS_6_TO_21,
      datasets: lineDatasets,
      yLabel: 'Visits',
      xLabel: 'Hour of Day',
    })
    session.embedChart(chart, startY)
  }

  // ── Page 4 ─────────────────────────────────────────────────────────────────
  // Line chart: hourly attendance — one line per year level (Year 1 … Year 5)
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Year Level Hourly Attendance`
        : 'Year Levels — Hourly Attendance',
      'Each line represents one year level across the day (6 AM – 9 PM)',
    )

    // Build per-year-level hourly counts directly from raw rows so the data
    // is always correct regardless of how byYearLevel was keyed.
    const yearLevelDatasets = YEAR_LEVELS.map((yl, i) => {
      const yearNum = Number(yl.split(' ')[1])
      const ylRows = rows.filter((r) => r.students?.year_level === yearNum)
      return {
        label: yl,                                         // e.g. "Year 1"
        data: countByHour(ylRows),
        color: GREEN_PALETTE[i % GREEN_PALETTE.length] as string,
      }
    })

    const chart = await renderLineChart({
      labels: HOURS_6_TO_21,
      datasets: yearLevelDatasets,
      yLabel: 'Visits',
      xLabel: 'Hour of Day',
    })
    session.embedChart(chart, startY)
  }

  // ── Page 5 ─────────────────────────────────────────────────────────────────
  // Pie chart: overall gender distribution (Female vs Male)
  // Falls back to a meaningful message if there is genuinely no gender data.
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    const female = rows.filter((r) => r.students?.gender?.toLowerCase() === 'female').length
    const male   = rows.filter((r) => r.students?.gender?.toLowerCase() === 'male').length
    const other  = rows.filter(
      (r) =>
        r.students?.gender != null &&
        r.students.gender.toLowerCase() !== 'female' &&
        r.students.gender.toLowerCase() !== 'male',
    ).length

    // Build label/data arrays; omit slices that are 0 so Chart.js always has
    // at least one non-zero value and renders a visible pie.
    const genderLabels: string[] = []
    const genderData:   number[] = []
    const genderColors: string[] = []

    if (female > 0) { genderLabels.push('Female'); genderData.push(female); genderColors.push('#e91e63') }
    if (male   > 0) { genderLabels.push('Male');   genderData.push(male);   genderColors.push('#1565c0') }
    if (other  > 0) { genderLabels.push('Other');  genderData.push(other);  genderColors.push('#78909c') }

    // If all counts are 0, still render a placeholder so the page isn't blank.
    if (genderData.length === 0) {
      genderLabels.push('No gender data'); genderData.push(1); genderColors.push('#cccccc')
    }

    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Gender Distribution`
        : `${scope.college ?? 'College'} — Gender Distribution`,
      `Female: ${female.toLocaleString()}   ·   Male: ${male.toLocaleString()}${other > 0 ? `   ·   Other: ${other.toLocaleString()}` : ''}`,
    )

    const chart = await renderPieChart({
      labels:    genderLabels,
      data:      genderData,
      colors:    genderColors,
      variant:   'pie',
      legendPos: 'right',
    })
    session.embedChart(chart, startY, 110)
  }

  // ── Page 6 ─────────────────────────────────────────────────────────────────
  // Doughnut chart: gender breakdown per year level
  // Each year level contributes two slices (Female, Male) with distinct colors.
  // ───────────────────────────────────────────────────────────────────────────
  session.newPage()
  {
    // Build slices only for year levels that actually have data so we never
    // push a 0-value slice (which would make Chart.js render a blank segment).
    const doughnutLabels: string[] = []
    const doughnutData:   number[] = []
    const doughnutColors: string[] = []

    // Pairs of Female/Male colors per year level (shaded variants).
    const femaleShades = ['#e91e63', '#f06292', '#f48fb1', '#fce4ec', '#c2185b']
    const maleShades   = ['#1565c0', '#1976d2', '#42a5f5', '#90caf9', '#0d47a1']

    for (let i = 0; i < YEAR_LEVELS.length; i++) {
      const yl      = YEAR_LEVELS[i] as string
      const yearNum = i + 1
      const ylRows  = rows.filter((r) => r.students?.year_level === yearNum)

      const f = ylRows.filter((r) => r.students?.gender?.toLowerCase() === 'female').length
      const m = ylRows.filter((r) => r.students?.gender?.toLowerCase() === 'male').length

      if (f > 0) {
        doughnutLabels.push(`${yl} — Female`)
        doughnutData.push(f)
        doughnutColors.push(femaleShades[i % femaleShades.length] as string)
      }
      if (m > 0) {
        doughnutLabels.push(`${yl} — Male`)
        doughnutData.push(m)
        doughnutColors.push(maleShades[i % maleShades.length] as string)
      }
    }

    // Placeholder when no gender data exists at all.
    if (doughnutData.length === 0) {
      doughnutLabels.push('No gender data'); doughnutData.push(1); doughnutColors.push('#cccccc')
    }

    const startY = session.sectionTitle(
      isSpecificProgram
        ? `${scope.program} — Year Level Gender Distribution`
        : `${scope.college ?? 'College'} — Year Level Gender Distribution`,
      'Female vs Male breakdown per year level',
    )

    const chart = await renderPieChart({
      labels:    doughnutLabels,
      data:      doughnutData,
      colors:    doughnutColors,
      variant:   'doughnut',
      legendPos: 'right',
    })
    session.embedChart(chart, startY, 110)
  }

  return session.toBlob()
}