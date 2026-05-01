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
 */
export async function renderPieChart(input: PieChartInput): Promise<string> {
  const w    = input.width   ?? 700
  const h    = input.height  ?? 400
  const type = input.variant ?? 'pie'

  const canvas         = document.createElement('canvas')
  canvas.width         = w
  canvas.height        = h
  canvas.style.display = 'none'
  document.body.appendChild(canvas)

  const colors = input.colors ?? PIE_COLORS

  const chart = new Chart(canvas, {
    type,
    data: {
      labels:   input.labels,
      datasets: [{
        data:            input.data,
        backgroundColor: input.labels.map((_, i) => colors[i % colors.length]),
        borderColor:     '#ffffff',
        borderWidth:     2,
      }],
    },
    options: {
      animation:  false,
      responsive: false,
      plugins: {
        legend: {
          display:  true,
          position: input.legendPos ?? 'right',
          labels:   { font: { size: 11 }, padding: 12, boxWidth: 14 },
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

  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  document.body.removeChild(canvas)

  return base64
}