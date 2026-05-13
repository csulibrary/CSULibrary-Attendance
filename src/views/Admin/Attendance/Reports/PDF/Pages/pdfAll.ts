/**
 * PDF/Pages/pdfAll.ts
 *
 * Generates the PDF for the ALL report type.
 *
 * Single month  → 2 pages:  page 1 bar chart · page 2 table
 * Multi-month   → N+1 pages: one bar chart page per month · one combined table page
 *
 * Called from: Composables/useReportData.ts → generateAllPdf()
 *
 * Dependencies: jspdf · jspdf-autotable · chart.js
 *   npm install jspdf jspdf-autotable chart.js
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { PdfSession } from '../pdfGenerator'
import { renderBarChart } from '../Charts/renderBarChart'

// ── Shared date-filter types (re-used by pdfByCollege and pdfSpecific too) ─────

export interface DateFilter {
  type: 'day' | 'period' | 'month'
  day?: string // 'YYYY-MM-DD'
  from?: string // 'YYYY-MM-DD'
  to?: string // 'YYYY-MM-DD'
  months?: number[] // 1-12
  year?: number
}

// ── Internal helpers ───────────────────────────────────────────────────────────

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

/** Builds Supabase gte/lte strings for a single calendar month. */
function monthRange(month: number, year: number) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59)
  return { gte: start.toISOString(), lte: end.toISOString() }
}

/** Groups attendance rows by college, returns sorted [{date, count}]. */
function groupByCollege(
  rows: { time_in: string; students?: { college: string | null } | null }[],
): { date: string; count: number }[] {
  const map: Record<string, number> = {}
  for (const r of rows) {
    const college = r.students?.college ?? 'Unknown'
    map[college] = (map[college] ?? 0) + 1
  }
  return Object.entries(map)
    .map(([college, count]) => ({ date: college, count }))
    .sort((a, b) => b.count - a.count)
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

/** Fetches raw attendance rows for one calendar month. */
async function fetchMonth(
  supabase: SupabaseClient,
  month:    number,
  year:     number,
): Promise<{ time_in: string; students?: { college: string | null } | null }[]> {
  const { gte, lte } = monthRange(month, year)
  const query = supabase
    .from('attendance_logs')
    .select('time_in, students!inner(college)')
    .gte('time_in', gte)
    .lte('time_in', lte)
    .order('time_in', { ascending: true })

  try {
    return await fetchAllWithPagination(query)
  } catch (error: any) {
    throw new Error(`Supabase error (month ${month}): ${error.message}`)
  }
}

/** Fetches raw attendance rows for a day or period filter. */
async function fetchRange(
  supabase: SupabaseClient,
  filter:   DateFilter,
): Promise<{ time_in: string; students?: { college: string | null } | null }[]> {
  let query = supabase
    .from('attendance_logs')
    .select('time_in, students!inner(college)')
    .order('time_in', { ascending: true })

  if (filter.type === 'day' && filter.day) {
    query = query.gte('time_in', filter.day + 'T00:00:00').lte('time_in', filter.day + 'T23:59:59')
  } else if (filter.type === 'period' && filter.from && filter.to) {
    query = query.gte('time_in', filter.from + 'T00:00:00').lte('time_in', filter.to + 'T23:59:59')
  }

  try {
    return await fetchAllWithPagination(query)
  } catch (error: any) {
    throw new Error(`Supabase error (range): ${error.message}`)
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * Generates and returns a Blob of the ALL attendance PDF.
 *
 * @param supabase  Supabase client instance
 * @param filter    Date filter from the UI
 */
export async function generateAllPdf(supabase: SupabaseClient, filter: DateFilter): Promise<Blob> {
  const year = filter.year ?? new Date().getFullYear()

  // ── 1. Collect data per period ─────────────────────────────────────────────
  interface PeriodData {
    label: string
    rows: { date: string; count: number }[]
  }

  const periods: PeriodData[] = []

  if (filter.type === 'month' && filter.months && filter.months.length > 0) {
    const sorted = [...filter.months].sort((a, b) => a - b)
    for (const m of sorted) {
      const raw = await fetchMonth(supabase, m, year)
      const rows = groupByCollege(raw)
      periods.push({ label: `${MONTH_NAMES[m - 1]} ${year}`, rows })
    }
  } else {
    const raw = await fetchRange(supabase, filter)
    const rows = groupByCollege(raw)
    const label =
      filter.type === 'day'
        ? (filter.day ?? 'Selected Day')
        : filter.type === 'period'
          ? `${filter.from} – ${filter.to}`
          : 'Selected Period'
    periods.push({ label, rows })
  }

  // ── 2. Total counts for the summary table ──────────────────────────────────
  const grandTotal = periods.reduce((sum, p) => sum + p.rows.reduce((s, r) => s + r.count, 0), 0)
  const totalPages = periods.length + 1 // one chart page per period + one table page

  // ── 3. Build subtitle ──────────────────────────────────────────────────────
  const subtitle = periods.map((p) => p.label).join(' · ')

  // ── 4. Init PDF session ────────────────────────────────────────────────────
  const session = new PdfSession({ title: 'ALL ATTENDANCE REPORT', subtitle }, totalPages)

  // ── 5. Chart pages (one per period) ───────────────────────────────────────
  for (const period of periods) {
    session.newPage()

    const total = period.rows.reduce((s, r) => s + r.count, 0)
    const startY = session.sectionTitle(
      `Attendance by College — ${period.label}`,
      `Total visits: ${total.toLocaleString()}   ·   Colleges with records: ${period.rows.length}`,
    )

    const base64 = await renderBarChart({
      labels: period.rows.map((r) => r.date),
      datasets: [{ label: 'Visits', data: period.rows.map((r) => r.count) }],
      yLabel: 'Number of Visits',
      width: 600,
      height: 280,
    })

    const chartBottomY = session.embedChart(base64, startY, 95)

    // Legend note below chart
    session.doc.setFontSize(6.5)
    session.doc.setTextColor(150, 150, 150)
    session.doc.text(
      '■  Each bar represents one college within the selected period.',
      14,
      chartBottomY + 5,
    )
    session.doc.setTextColor(0, 0, 0)

    // Notes space
    session.addNotesLabel(chartBottomY + 13)
  }

  // ── 6. Summary table page ──────────────────────────────────────────────────
  session.newPage()

  const tableStartY = session.sectionTitle(
    'Attendance Log Summary',
    `Grand total: ${grandTotal.toLocaleString()} visits across ${periods.length} period(s)`,
  )

  const tableBody = periods.flatMap((p) => p.rows.map((r) => [p.label, r.date, r.count.toString()]))

  session.drawTable({
    startY: tableStartY,
    head: [['Period', 'College', 'Visit Count']],
    body: tableBody,
    foot: [['', 'GRAND TOTAL', grandTotal.toLocaleString()]],
    colWidths: { 2: 30 },
  })

  return session.toBlob()
}
