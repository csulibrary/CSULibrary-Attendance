/**
 * PDF/Charts/renderPieChart.ts
 *
 * Renders a pie (or doughnut) chart using Chart.js onto a hidden <canvas>,
 * then returns a base64 PNG string for embedding in jsPDF.
 *
 * Import: import { renderPieChart } from '../Charts/renderPieChart'
 */

import {
  Chart,
  PieController,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  Title,
} from 'chart.js'

Chart.register(PieController, DoughnutController, ArcElement, Legend, Tooltip, Title)

// ── Palette ────────────────────────────────────────────────────────────────────

export const PIE_COLORS = [
  '#0d2b0f',
  '#f9a825',
  '#1565c0',
  '#c62828',
  '#6a1b9a',
  '#00695c',
  '#e65100',
  '#37474f',
  '#2e7d32',
  '#ad1457',
]

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PieChartInput {
  labels:     string[]
  data:       number[]
  title?:     string
  /** Custom hex colors. Falls back to PIE_COLORS. */
  colors?:    string[]
  /** Use 'doughnut' for a doughnut chart. Default 'pie'. */
  variant?:   'pie' | 'doughnut'
  /** Canvas width in px (default 700). */
  width?:     number
  /** Canvas height in px (default 400). */
  height?:    number
  /** Legend position. Default 'right'. */
  legendPos?: 'top' | 'bottom' | 'left' | 'right'
}

// ── Renderer ───────────────────────────────────────────────────────────────────

/**
 * @returns base64 PNG data URL
 *
 * Key fixes:
 *  1. Zero-slice guard — slices with value 0 are filtered out before Chart.js
 *     sees them.  An all-zero dataset would otherwise render a blank canvas.
 *  2. Paint cycle uses setTimeout(50) instead of a single requestAnimationFrame
 *     so the canvas is guaranteed to be fully painted before toDataURL().
 */
export async function renderPieChart(input: PieChartInput): Promise<string> {
  const w    = input.width   ?? 700
  const h    = input.height  ?? 400
  const type = input.variant ?? 'pie'

  // ── Filter out zero-value slices ──────────────────────────────────────────
  // Chart.js renders a completely blank canvas when every data value is 0.
  // Remove zero slices so at least the non-zero ones (or a placeholder) show.
  const filteredIndices = input.data.reduce<number[]>(
    (acc, v, i) => (v > 0 ? [...acc, i] : acc),
    [],
  )

  let labels: string[]
  let data:   number[]
  let colors: string[]

  if (filteredIndices.length === 0) {
    // Entire dataset is zero — render a single grey "No data" placeholder
    // so the page is never blank.
    labels = ['No data available']
    data   = [1]
    colors = ['#cccccc']
  } else {
    const palette = input.colors ?? PIE_COLORS
    labels = filteredIndices.map((i) => input.labels[i] ?? '')
    data   = filteredIndices.map((i) => input.data[i] ?? 0)
    colors = filteredIndices.map((i) => palette[i % palette.length] as string)
  }

  // ── Build canvas & chart ──────────────────────────────────────────────────
  const canvas         = document.createElement('canvas')
  canvas.width         = w
  canvas.height        = h
  canvas.style.display = 'none'
  document.body.appendChild(canvas)

  const chart = new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor:     '#ffffff',
          borderWidth:     2,
        },
      ],
    },
    options: {
      animation:  false,
      responsive: false,
      plugins: {
        legend: {
          display:  true,
          position: input.legendPos ?? 'right',
          labels: {
            font:     { size: 11 },
            padding:  12,
            boxWidth: 14,
            // Show the actual value alongside each label so slices are
            // readable even when they are very thin in the PDF.
            generateLabels(chartInstance) {
              const meta   = chartInstance.getDatasetMeta(0)
              const ds     = chartInstance.data.datasets[0]
              const total  = (ds?.data as number[]).reduce((a, b) => a + b, 0)
              return (chartInstance.data.labels as string[]).map((lbl, i) => {
                const arc   = meta.data[i] as any
                const value = (ds?.data as number[])[i] ?? 0
                const pct   = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                return {
                  text:        `${lbl}: ${value.toLocaleString()} (${pct}%)`,
                  fillStyle:   (ds?.backgroundColor as string[])[i] ?? '#ccc',
                  strokeStyle: '#ffffff',
                  lineWidth:   2,
                  hidden:      arc?.hidden ?? false,
                  index:       i,
                }
              })
            },
          },
        },
        title: {
          display: !!input.title,
          text:    input.title ?? '',
          font:    { size: 14, weight: 'bold' },
          padding: { bottom: 10 },
        },
        tooltip: { enabled: false },
      },
      layout: { padding: 10 },
    },
  })

  // Reliable paint cycle.
  await new Promise<void>((resolve) => setTimeout(resolve, 50))

  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  document.body.removeChild(canvas)

  return base64
}