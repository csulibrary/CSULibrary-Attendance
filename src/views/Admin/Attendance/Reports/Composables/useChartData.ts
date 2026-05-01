/**
 * Composables/useChartData.ts
 *
 * Transforms raw attendance data into Chart.js-ready dataset objects.
 * Used by the Preview components (PreviewAll, PreviewByCollege, PreviewSpecific)
 * to show live mini-charts in the right panel before the user downloads the PDF.
 *
 * This composable does NOT touch Supabase directly — it receives already-fetched
 * rows and shapes them into structures Chart.js understands.
 *
 * Usage:
 *   import { useChartData } from '../Composables/useChartData'
 *   const { buildDailyBar, buildHourlyLine, buildGenderPie } = useChartData()
 */

// ── Palette ────────────────────────────────────────────────────────────────────

export const CHART_COLORS = {
  green:  ['#0d2b0f','#1b5e20','#2e7d32','#388e3c','#43a047','#4caf50','#66bb6a','#81c784'],
  gold:    '#f9a825',
  red:     '#c62828',
  blue:    '#1565c0',
  female:  '#e91e63',
  male:    '#1565c0',
  other:   '#78909c',
} as const

// ── Raw row types (what Supabase returns after joins) ──────────────────────────

export interface RawAttendanceRow {
  time_in:          string
  duration_minutes?: number | null
  student_id?:       string
  event_id?:         string | null
  attendance_type?:  string | null
  students?: {
    program?:    string | null
    college?:    string | null
    year_level?: number | null
    gender?:     string | null
    first_name?: string | null
    last_name?:  string | null
  } | null
  events?: {
    title?:      string | null
    type?:       string | null
    start_date?: string | null
    location?:   string | null
  } | null
}

// ── Chart.js dataset shapes ────────────────────────────────────────────────────

export interface BarChartData {
  labels:   string[]
  datasets: {
    label:           string
    data:            number[]
    backgroundColor: string | string[]
    borderRadius?:   number
  }[]
}

export interface LineChartData {
  labels:   string[]
  datasets: {
    label:           string
    data:            number[]
    borderColor:     string
    backgroundColor: string
    fill:            boolean
    tension:         number
    pointRadius:     number
  }[]
}

export interface PieChartData {
  labels:   string[]
  datasets: {
    data:            number[]
    backgroundColor: string[]
    borderColor:     string
    borderWidth:     number
  }[]
}

// ── Helper utilities ───────────────────────────────────────────────────────────

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    ;(acc[k] = acc[k] ?? []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}

function hourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12    = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}${suffix}`
}

const ACTIVE_HOURS = Array.from({ length: 16 }, (_, i) => i + 6)  // 6..21

// ── Composable ─────────────────────────────────────────────────────────────────

export function useChartData() {

  // ────────────────────────────────────────────────────────────────────────────
  // ALL report charts
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Daily visit count bar chart.
   * Used on: PreviewAll
   */
  function buildDailyBar(rows: RawAttendanceRow[]): BarChartData {
    const byDate = groupBy(rows, r =>
      new Date(r.time_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
    )
    const labels = Object.keys(byDate)
    return {
      labels,
      datasets: [{
        label:           'Visits',
        data:            labels.map(d => byDate[d]?.length ?? 0),
        backgroundColor: CHART_COLORS.green[0],
        borderRadius:    4,
      }],
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // BY COLLEGE report charts
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Visits per program bar chart.
   * Used on: PreviewByCollege (whole college view)
   */
  function buildProgramBar(rows: RawAttendanceRow[]): BarChartData {
    const byProgram = groupBy(rows, r => r.students?.program ?? 'Unknown')
    const labels    = Object.keys(byProgram).sort()
    return {
      labels,
      datasets: [{
        label:           'Visits',
        data:            labels.map(p => byProgram[p]?.length ?? 0),
        backgroundColor: labels.map((_, i) => CHART_COLORS.green[i % CHART_COLORS.green.length] ?? CHART_COLORS.green[0]),
        borderRadius:    4,
      }],
    }
  }

  /**
   * Visits per year level bar chart.
   * Used on: PreviewByCollege
   */
  function buildYearLevelBar(rows: RawAttendanceRow[]): BarChartData {
    const byYL   = groupBy(rows, r => `Year ${r.students?.year_level ?? '?'}`)
    const labels = ['Year 1','Year 2','Year 3','Year 4','Year 5'].filter(l => byYL[l])
    return {
      labels,
      datasets: [{
        label:           'Visits',
        data:            labels.map(l => byYL[l]?.length ?? 0),
        backgroundColor: CHART_COLORS.green[2],
        borderRadius:    4,
      }],
    }
  }

  /**
   * Hourly attendance line chart — one line per program (up to 6 programs).
   * Used on: PreviewByCollege
   */
  function buildProgramHourlyLine(rows: RawAttendanceRow[]): LineChartData {
    const byProgram = groupBy(rows, r => r.students?.program ?? 'Unknown')
    const top6      = Object.keys(byProgram).slice(0, 6)

    return {
      labels: ACTIVE_HOURS.map(hourLabel),
      datasets: top6.map((prog, i) => {
        const color = CHART_COLORS.green[i % CHART_COLORS.green.length] ?? CHART_COLORS.green[0]
        return {
          label:           prog,
          data:            ACTIVE_HOURS.map(h =>
            (byProgram[prog] ?? []).filter(r => new Date(r.time_in).getHours() === h).length
          ),
          borderColor:     color,
          backgroundColor: color + '28',
          fill:            false,
          tension:         0.35,
          pointRadius:     3,
        }
      }),
    }
  }

  /**
   * Hourly attendance line chart — one line per year level.
   * Used on: PreviewByCollege
   */
  function buildYearLevelHourlyLine(rows: RawAttendanceRow[]): LineChartData {
    const byYL   = groupBy(rows, r => `Year ${r.students?.year_level ?? '?'}`)
    const labels = ['Year 1','Year 2','Year 3','Year 4','Year 5'].filter(l => byYL[l])

    return {
      labels: ACTIVE_HOURS.map(hourLabel),
      datasets: labels.map((yl, i) => {
        const color = CHART_COLORS.green[i % CHART_COLORS.green.length] ?? CHART_COLORS.green[0]
        return {
          label:           yl,
          data:            ACTIVE_HOURS.map(h =>
            (byYL[yl] ?? []).filter(r => new Date(r.time_in).getHours() === h).length
          ),
          borderColor:     color,
          backgroundColor: color + '28',
          fill:            false,
          tension:         0.35,
          pointRadius:     3,
        }
      }),
    }
  }

  /**
   * Gender pie chart data (Female / Male / Other).
   * Used on: PreviewByCollege
   */
  function buildGenderPie(rows: RawAttendanceRow[]): PieChartData {
    const female = rows.filter(r => r.students?.gender?.toLowerCase() === 'female').length
    const male   = rows.filter(r => r.students?.gender?.toLowerCase() === 'male').length
    const other  = rows.length - female - male

    const labels = other > 0 ? ['Female', 'Male', 'Other/Unknown'] : ['Female', 'Male']
    const data   = other > 0 ? [female, male, other] : [female, male]
    const colors = [CHART_COLORS.female, CHART_COLORS.male, CHART_COLORS.other]

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor:     '#ffffff',
        borderWidth:     2,
      }],
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SPECIFIC report charts
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Top students bar chart (top 10 by visit count).
   * Used on: PreviewSpecific (top_students)
   */
  function buildTopStudentsBar(rows: RawAttendanceRow[]): BarChartData {
    const map: Record<string, number> = {}
    for (const row of rows) {
      const id   = row.student_id ?? 'unknown'
      map[id] = (map[id] ?? 0) + 1
    }
    const top10 = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return {
      labels: top10.map(([id]) => id),
      datasets: [{
        label:           'Visits',
        data:            top10.map(([, v]) => v),
        backgroundColor: CHART_COLORS.green[0],
        borderRadius:    4,
      }],
    }
  }

  /**
   * Hourly visit count line chart for peak/low hours.
   * Used on: PreviewSpecific (peak_hours)
   */
  function buildPeakHoursLine(rows: RawAttendanceRow[]): LineChartData {
    const counts = ACTIVE_HOURS.map(h =>
      rows.filter(r => new Date(r.time_in).getHours() === h).length
    )
    return {
      labels: ACTIVE_HOURS.map(hourLabel),
      datasets: [{
        label:           'Visits',
        data:            counts,
        borderColor:     CHART_COLORS.green[1],
        backgroundColor: CHART_COLORS.green[1] + '28',
        fill:            true,
        tension:         0.35,
        pointRadius:     4,
      }],
    }
  }

  /**
   * Average duration per date bar chart.
   * Used on: PreviewSpecific (duration)
   */
  function buildAvgDurationBar(rows: RawAttendanceRow[]): BarChartData {
    const byDate: Record<string, number[]> = {}
    for (const row of rows) {
      if (row.duration_minutes == null) continue
      const d = new Date(row.time_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
      ;(byDate[d] = byDate[d] ?? []).push(row.duration_minutes)
    }
    const labels = Object.keys(byDate)
    return {
      labels,
      datasets: [{
        label:           'Avg Duration (min)',
        data:            labels.map(d => {
          const vals = byDate[d] ?? []
          if (vals.length === 0) return 0
          return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
        }),
        backgroundColor: CHART_COLORS.green[3],
        borderRadius:    4,
      }],
    }
  }

  /**
   * Duration distribution bar chart (5 buckets).
   * Used on: PreviewSpecific (duration)
   */
  function buildDurationDistributionBar(rows: RawAttendanceRow[]): BarChartData {
    const BUCKETS  = ['< 15 min','15–30 min','30–60 min','60–120 min','> 120 min']
    const counts: number[] = [0, 0, 0, 0, 0]
    for (const row of rows) {
      const d = row.duration_minutes ?? 0
      if      (d < 15)  counts[0] = (counts[0] ?? 0) + 1
      else if (d < 30)  counts[1] = (counts[1] ?? 0) + 1
      else if (d < 60)  counts[2] = (counts[2] ?? 0) + 1
      else if (d < 120) counts[3] = (counts[3] ?? 0) + 1
      else              counts[4] = (counts[4] ?? 0) + 1
    }
    return {
      labels: BUCKETS,
      datasets: [{
        label:           'Visit Count',
        data:            counts,
        backgroundColor: CHART_COLORS.green.slice(0, 5),
        borderRadius:    4,
      }],
    }
  }

  /**
   * Attendance per event bar chart.
   * Used on: PreviewSpecific (events)
   */
  function buildEventsBar(rows: RawAttendanceRow[]): BarChartData {
    const byEvent: Record<string, number> = {}
    for (const row of rows) {
      const title = row.events?.title ?? row.event_id ?? 'Unknown'
      byEvent[title] = (byEvent[title] ?? 0) + 1
    }
    const sorted = Object.entries(byEvent).sort((a, b) => b[1] - a[1]).slice(0, 10)
    return {
      labels: sorted.map(([t]) => t.length > 20 ? t.slice(0, 18) + '…' : t),
      datasets: [{
        label:           'Attendees',
        data:            sorted.map(([, v]) => v),
        backgroundColor: CHART_COLORS.green[0],
        borderRadius:    4,
      }],
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Summary stats (used in preview panels as KPI numbers)
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Returns quick-summary KPIs for the preview panel.
   */
  function buildSummaryStats(rows: RawAttendanceRow[]) {
    const total    = rows.length
    const durations = rows.map(r => r.duration_minutes).filter((d): d is number => d != null)
    const avgDur   = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null
    const unique   = new Set(rows.map(r => r.student_id)).size
    const hours    = ACTIVE_HOURS.map(h => rows.filter(r => new Date(r.time_in).getHours() === h).length)
    const peakIndex = hours.indexOf(Math.max(...hours))
    const peakHour = peakIndex >= 0 ? ACTIVE_HOURS[peakIndex] : ACTIVE_HOURS[0]

    return {
      totalVisits:    total,
      uniqueStudents: unique,
      avgDuration:    avgDur,
      peakHour:       total > 0 && peakHour != null ? hourLabel(peakHour) : null,
    }
  }

  // ── Expose ────────────────────────────────────────────────────────────────────

  return {
    // ALL
    buildDailyBar,

    // BY COLLEGE
    buildProgramBar,
    buildYearLevelBar,
    buildProgramHourlyLine,
    buildYearLevelHourlyLine,
    buildGenderPie,

    // SPECIFIC
    buildTopStudentsBar,
    buildPeakHoursLine,
    buildAvgDurationBar,
    buildDurationDistributionBar,
    buildEventsBar,

    // Shared
    buildSummaryStats,

    // Constants
    CHART_COLORS,
    ACTIVE_HOURS,
    hourLabel,
  }
}