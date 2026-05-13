/**
 * PDF/Pages/pdfSpecific.ts
 *
 * Generates the PDF for the SPECIFIC FILTER report type.
 *
 * top_students  → 2 pages: Bar Chart + Student Table
 * peak_hours    → 2 pages: Line Chart + Peak/Low Summary Table
 * duration      → 3 pages: Bar (avg over time) + Bar (distribution) + Stats Table
 * events        → 2 pages: Bar Chart + Event Details Table
 *
 * Called from: Composables/useReportData.ts → generateSpecificPdf()
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { PdfSession } from '../pdfGenerator'
import { renderBarChart } from '../Charts/renderBarChart'
import { renderLineChart } from '../Charts/renderLineChart'
import type { DateFilter } from './pdfAll'

// ── Types ──────────────────────────────────────────────────────────────────────

export type SpecificType = 'top_students' | 'peak_hours' | 'duration' | 'events'

export interface SpecificScope {
  college?: string
  program?: string
}

interface StudentRow {
  first_name: string | null
  last_name: string | null
  program: string | null
  college: string | null
}

interface EventRow {
  title: string | null
  type: string | null
  start_date: string | null
  end_date: string | null
  location: string | null
}

// ── Internal helpers ───────────────────────────────────────────────────────────

function applyTimeFilter(query: any, filter: DateFilter): any {
  if (filter.type === 'day' && filter.day) {
    return query.gte('time_in', filter.day + 'T00:00:00').lte('time_in', filter.day + 'T23:59:59')
  }
  if (filter.type === 'period' && filter.from && filter.to) {
    return query.gte('time_in', filter.from + 'T00:00:00').lte('time_in', filter.to + 'T23:59:59')
  }
  if (filter.type === 'month' && filter.months?.length) {
    const y = filter.year ?? new Date().getFullYear()
    const sorted = [...filter.months].sort((a, b) => a - b)
    const firstMonth = sorted[0]
    const lastMonth = sorted[sorted.length - 1]
    if (firstMonth == null || lastMonth == null) return query
    return query
      .gte('time_in', new Date(y, firstMonth - 1, 1).toISOString())
      .lte('time_in', new Date(y, lastMonth, 0, 23, 59, 59).toISOString())
  }
  return query
}

function hourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}${suffix}`
}

function buildDateLabel(filter: DateFilter): string {
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
  if (filter.type === 'day') return filter.day ?? 'Selected Day'
  if (filter.type === 'period') return `${filter.from} – ${filter.to}`
  return (filter.months ?? []).map((m) => MONTH_NAMES[m - 1]).join(', ') + ' ' + (filter.year ?? '')
}

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

// ── Main export ────────────────────────────────────────────────────────────────

export async function generateSpecificPdf(
  supabase: SupabaseClient,
  filter: DateFilter,
  scope: SpecificScope,
  type: SpecificType,
): Promise<Blob> {
  const TITLES: Record<SpecificType, string> = {
    top_students: 'TOP VISITING STUDENTS',
    peak_hours: 'PEAK & LOW HOURS',
    duration: 'DURATION ANALYSIS',
    events: 'EVENTS ATTENDANCE REPORT',
  }

  const TOTAL_PAGES: Record<SpecificType, number> = {
    top_students: 2,
    peak_hours: 2,
    duration: 3,
    events: 2,
  }

  const dateLabel = buildDateLabel(filter)
  const scopeLabel = scope.program ?? scope.college ?? ''
  const subtitle = [scopeLabel, dateLabel].filter(Boolean).join('   ·   ')

  const session = new PdfSession(
    { title: TITLES[type], subtitle, college: scope.college, program: scope.program },
    TOTAL_PAGES[type],
  )

  // ════════════════════════════════════════════════════════════════════════════
  // TOP VISITING STUDENTS
  // ════════════════════════════════════════════════════════════════════════════
  if (type === 'top_students') {
    let q = supabase
      .from('attendance_logs')
      .select(
        'student_id, duration_minutes, students!inner(first_name, last_name, program, college)',
      )
    q = applyTimeFilter(q, filter)
    if (scope.college) q = (q as any).eq('students.college', scope.college)
    if (scope.program) q = (q as any).eq('students.program', scope.program)

    try {
      const typedData = (await fetchAllWithPagination(q)) as Array<{
        student_id: string
        duration_minutes: number | null
        students: StudentRow[] | null
      }>

      // Aggregate per student
      const map: Record<
        string,
        {
          name: string
          program: string
          visits: number
          totalDuration: number
        }
      > = {}

    for (const row of typedData) {
      const id = row.student_id
      if (!map[id]) {
        const s = Array.isArray(row.students) ? row.students[0] : null
        map[id] = {
          name: `${s?.first_name ?? ''} ${s?.last_name ?? ''}`.trim() || id,
          program: s?.program ?? '',
          visits: 0,
          totalDuration: 0,
        }
      }
      map[id].visits++
      map[id].totalDuration += row.duration_minutes ?? 0
    }

    const sorted = Object.entries(map)
      .sort((a, b) => b[1].visits - a[1].visits)
      .slice(0, 30)

    const top10 = sorted.slice(0, 10)

    // ── Page 1: Bar Chart ─────────────────────────────────────────────────────
    session.newPage()
    const startY1 = session.sectionTitle(
      'Top Visiting Students',
      `Showing top ${top10.length} students by visit count   ·   ${dateLabel}`,
    )
    const chart1 = await renderBarChart({
      labels: top10.map(([, v]) => v.name.split(' ').pop() ?? v.name),
      datasets: [{ label: 'Visits', data: top10.map(([, v]) => v.visits) }],
      yLabel: 'Visit Count',
      width: 600,
      height: 280,
    })
    session.embedChart(chart1, startY1, 95)
    session.addNotesLabel(startY1 + 100)

    // ── Page 2: Table ─────────────────────────────────────────────────────────
    session.newPage()
    const startY2 = session.sectionTitle(
      'Student Visit Details',
      `Top ${sorted.length} students ranked by visit count`,
    )
    session.drawTable({
      startY: startY2,
      head: [['Student ID', 'Name', 'Program', 'Visits', 'Total Duration (min)']],
      body: sorted.map(([id, v]) => [id, v.name, v.program, v.visits, v.totalDuration]),
      foot: [['', '', 'TOTAL STUDENTS', sorted.length.toString(), '']],
      colWidths: { 1: 40, 2: 55 },
    })
    } catch (error: any) {
      throw new Error(`Supabase (top_students): ${error.message}`)
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PEAK & LOW HOURS
  // ════════════════════════════════════════════════════════════════════════════
  else if (type === 'peak_hours') {
    try {
      let q = supabase.from('attendance_logs').select('time_in')
      q = applyTimeFilter(q, filter)
      const typedData = (await fetchAllWithPagination(q)) as Array<{ time_in: string }>

    // Count visits per hour (0–23)
    const hourCounts = Array<number>(24).fill(0)
    for (const row of typedData) {
      const hour = new Date(row.time_in).getHours()
      if (hour >= 0 && hour < 24) hourCounts[hour] = (hourCounts[hour] ?? 0) + 1
    }

    // Use hours 6–21 only
    const activeHours = Array.from({ length: 16 }, (_, i) => i + 6)
    const counts = activeHours.map((h) => hourCounts[h] ?? 0)
    const labels = activeHours.map(hourLabel)

    const maxCount = counts.length ? Math.max(...counts) : 0
    const positiveCounts = counts.filter((c) => c > 0)
    const minCount = positiveCounts.length ? Math.min(...positiveCounts) : 0
    const peakIndex = counts.indexOf(maxCount)
    const lowIndex = counts.indexOf(minCount)
    const peakHour = peakIndex >= 0 ? activeHours[peakIndex] : activeHours[0]
    const lowHour = lowIndex >= 0 ? activeHours[lowIndex] : activeHours[0]
    const peakHourLabel = peakHour != null ? hourLabel(peakHour) : 'N/A'
    const lowHourLabel = minCount > 0 && lowHour != null ? hourLabel(lowHour) : 'N/A'

    // ── Page 1: Line Chart ────────────────────────────────────────────────────
    session.newPage()
    const startY1 = session.sectionTitle(
      'Attendance Per Hour',
      `Peak: ${peakHourLabel} (${maxCount} visits)   ·   Lowest: ${lowHourLabel} (${minCount} visits)`,
    )
    const chart1 = await renderLineChart({
      labels,
      datasets: [{ label: 'Visits', data: counts, color: '#1b5e20', fill: true }],
      yLabel: 'Visit Count',
      width: 600,
      height: 280,
    })
    session.embedChart(chart1, startY1, 95)
    session.addNotesLabel(startY1 + 100)

    // ── Page 2: Summary Table ─────────────────────────────────────────────────
    session.newPage()
    const startY2 = session.sectionTitle(
      'Peak vs Low Hours Summary',
      'All tracked hours ranked from highest to lowest visit count',
    )

    const sortedHours = activeHours
      .map((h, i) => ({ hour: h, count: counts[i] }))
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))

    session.drawTable({
      startY: startY2,
      head: [['Hour', 'Visit Count', 'Share of Day', 'Classification']],
      body: sortedHours.map(({ hour, count }) => {
        const total = counts.reduce((a, b) => a + b, 0)
        const safeCount = count ?? 0
        const share = total > 0 ? ((safeCount / total) * 100).toFixed(1) + '%' : '0%'
        const clsn =
          safeCount >= maxCount * 0.8 ? 'Peak' : safeCount <= minCount * 1.5 ? 'Low' : 'Normal'
        return [hourLabel(hour), safeCount.toString(), share, clsn]
      }),
      colWidths: { 0: 28, 1: 28, 2: 28 },
    })
    } catch (error: any) {
      throw new Error(`Supabase (peak_hours): ${error.message}`)
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DURATION ANALYSIS
  // ════════════════════════════════════════════════════════════════════════════
  else if (type === 'duration') {
    try {
      let q = supabase
        .from('attendance_logs')
        .select('time_in, duration_minutes')
        .not('duration_minutes', 'is', null)
      q = applyTimeFilter(q, filter)

      const rows = (await fetchAllWithPagination(q)) as {
        time_in: string
        duration_minutes: number
      }[]

    // Group by date → average duration
    const byDate: Record<string, number[]> = {}
    for (const row of rows) {
      const d = new Date(row.time_in).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
      })
      ;(byDate[d] = byDate[d] ?? []).push(row.duration_minutes)
    }
    const dateLabels = Object.keys(byDate)
    const avgByDate = dateLabels.map((d) => {
      const vals = byDate[d] ?? []
      if (vals.length === 0) return 0
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    })

    // Duration distribution buckets
    const BUCKETS = ['< 15 min', '15–30 min', '30–60 min', '60–120 min', '> 120 min']
    const bucketCounts: number[] = [0, 0, 0, 0, 0]
    for (const { duration_minutes: d } of rows) {
      if (d < 15) bucketCounts[0] = (bucketCounts[0] ?? 0) + 1
      else if (d < 30) bucketCounts[1] = (bucketCounts[1] ?? 0) + 1
      else if (d < 60) bucketCounts[2] = (bucketCounts[2] ?? 0) + 1
      else if (d < 120) bucketCounts[3] = (bucketCounts[3] ?? 0) + 1
      else bucketCounts[4] = (bucketCounts[4] ?? 0) + 1
    }

    const durations = rows.map((r) => r.duration_minutes)
    const avg = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0
    const min = durations.length ? Math.min(...durations) : 0
    const max = durations.length ? Math.max(...durations) : 0
    const median = (() => {
      if (!durations.length) return 0
      const s = [...durations].sort((a, b) => a - b)
      const m = Math.floor(s.length / 2)
      if (s.length % 2 === 0) {
        const left = s[m - 1] ?? 0
        const right = s[m] ?? 0
        return Math.round((left + right) / 2)
      }
      return s[m] ?? 0
    })()

    // ── Page 1: Average Duration Over Time ────────────────────────────────────
    session.newPage()
    const startY1 = session.sectionTitle(
      'Average Duration Over Time',
      `Overall average: ${avg} min   ·   Records with duration: ${rows.length.toLocaleString()}`,
    )
    const chart1 = await renderBarChart({
      labels: dateLabels,
      datasets: [{ label: 'Avg Duration (min)', data: avgByDate, color: '#388e3c' }],
      yLabel: 'Minutes',
      width: 600,
      height: 280,
    })
    session.embedChart(chart1, startY1, 95)
    session.addNotesLabel(startY1 + 100)

    // ── Page 2: Duration Distribution ────────────────────────────────────────
    session.newPage()
    const startY2 = session.sectionTitle(
      'Duration Distribution',
      'Visit counts grouped by how long students stayed',
    )
    const chart2 = await renderBarChart({
      labels: BUCKETS,
      datasets: [{ label: 'Visit Count', data: bucketCounts, color: '#2e7d32' }],
      yLabel: 'Number of Visits',
      width: 600,
      height: 280,
    })
    session.embedChart(chart2, startY2, 95)
    session.addNotesLabel(startY2 + 100)

    // ── Page 3: Statistics Table ──────────────────────────────────────────────
    session.newPage()
    const startY3 = session.sectionTitle(
      'Duration Statistics',
      `Based on ${rows.length.toLocaleString()} session records`,
    )
    session.drawTable({
      startY: startY3,
      head: [['Statistic', 'Value']],
      body: [
        ['Average Duration', `${avg} minutes`],
        ['Median Duration', `${median} minutes`],
        ['Minimum Duration', `${min} minutes`],
        ['Maximum Duration', `${max} minutes`],
        ['Total Records (with dur)', rows.length.toString()],
        ...BUCKETS.map((b, i) => [b, `${bucketCounts[i]} visits`]),
      ],
      colWidths: { 0: 70, 1: 40 },
    })
    } catch (error: any) {
      throw new Error(`Supabase (duration): ${error.message}`)
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EVENTS REPORT
  // ════════════════════════════════════════════════════════════════════════════
  else if (type === 'events') {
    try {
      let q = supabase
        .from('attendance_logs')
        .select('event_id, events!inner(title, type, start_date, end_date, location), students!inner(college, program)')
        .eq('attendance_type', 'event')
      q = applyTimeFilter(q, filter)
      if (scope.college) q = (q as any).eq('students.college', scope.college)
      if (scope.program) q = (q as any).eq('students.program', scope.program)
      const typedData = (await fetchAllWithPagination(q)) as Array<{
        event_id: string
        events: EventRow[] | null
      }>

    // Aggregate per event
    const map: Record<
      string,
      {
        title: string
        type: string
        date: string
        location: string
        count: number
      }
    > = {}

    for (const row of typedData) {
      const id = row.event_id
      if (!map[id]) {
        const e = Array.isArray(row.events) ? row.events[0] : null
        map[id] = {
          title: e?.title ?? 'Unknown',
          type: e?.type ?? '',
          date: e?.start_date ?? '',
          location: e?.location ?? '',
          count: 0,
        }
      }
      map[id].count++
    }

    const events = Object.values(map).sort((a, b) => b.count - a.count)
    const grandTotal = events.reduce((s, e) => s + e.count, 0)

    // ── Page 1: Bar Chart ─────────────────────────────────────────────────────
    session.newPage()
    const startY1 = session.sectionTitle(
      'Attendance Per Event',
      `${events.length} event(s) in selected period   ·   Total attendee records: ${grandTotal.toLocaleString()}`,
    )
    const top15 = events.slice(0, 15)
    const chart1 = await renderBarChart({
      labels: top15.map((e) => (e.title.length > 22 ? e.title.slice(0, 20) + '…' : e.title)),
      datasets: [{ label: 'Attendees', data: top15.map((e) => e.count) }],
      yLabel: 'Attendee Count',
      width: 600,
      height: 280,
    })
    session.embedChart(chart1, startY1, 95)
    session.addNotesLabel(startY1 + 100)

    // ── Page 2: Event Details Table ───────────────────────────────────────────
    session.newPage()
    const startY2 = session.sectionTitle(
      'Event Details',
      `Complete list of ${events.length} event(s)`,
    )
    session.drawTable({
      startY: startY2,
      head: [['Event Title', 'Type', 'Date', 'Location', 'Attendees']],
      body: events.map((e) => [e.title, e.type, e.date, e.location, e.count]),
      foot: [['', '', '', 'TOTAL ATTENDEES', grandTotal.toLocaleString()]],
      colWidths: { 0: 55, 4: 22 },
    })
    } catch (error: any) {
      throw new Error(`Supabase (events): ${error.message}`)
    }
  }

  return session.toBlob()
}
