/**
 * PDF/Charts/renderBarChart.ts
 *
 * Renders a bar chart using Chart.js onto a hidden <canvas>,
 * then returns a base64 PNG string for embedding in jsPDF.
 *
 * Import: import { renderBarChart } from '../Charts/renderBarChart'
 */

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title)

// ── Palette ────────────────────────────────────────────────────────────────────

export const BAR_COLORS = [
  '#0d2b0f',  // darkest green
  '#1b5e20',
  '#2e7d32',
  '#388e3c',
  '#43a047',
  '#4caf50',
  '#66bb6a',
  '#81c784',
]

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BarDataset {
  label:   string
  data:    number[]
  /** Hex color. Defaults to BAR_COLORS[index]. */
  color?:  string
}

export interface BarChartInput {
  labels:    string[]
  datasets:  BarDataset[]
  title?:    string
  xLabel?:   string
  yLabel?:   string
  /** Canvas width in px (default 900). */
  width?:    number
  /** Canvas height in px (default 440). */
  height?:   number
  /** Set true to stack datasets. */
  stacked?:  boolean
}

// ── Renderer ───────────────────────────────────────────────────────────────────

/**
 * @returns base64 PNG data URL
 */
export async function renderBarChart(input: BarChartInput): Promise<string> {
  const w = input.width  ?? 900
  const h = input.height ?? 440

  const canvas        = document.createElement('canvas')
  canvas.width        = w
  canvas.height       = h
  canvas.style.display = 'none'
  document.body.appendChild(canvas)

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels:   input.labels,
      datasets: input.datasets.map((d, i) => ({
        label:           d.label,
        data:            d.data,
        backgroundColor: d.color ?? BAR_COLORS[i % BAR_COLORS.length],
        borderRadius:    4,
        borderSkipped:   false,
      })),
    },
    options: {
      animation:  false,
      responsive: false,
      plugins: {
        legend: { display: input.datasets.length > 1, position: 'top' },
        title:  { display: !!input.title, text: input.title ?? '', font: { size: 14, weight: 'bold' } },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          stacked: input.stacked ?? false,
          grid:    { display: false },
          title:   { display: !!input.xLabel, text: input.xLabel ?? '' },
          ticks:   { maxRotation: 45 },
        },
        y: {
          stacked:     input.stacked ?? false,
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.06)' },
          title:       { display: !!input.yLabel, text: input.yLabel ?? '' },
        },
      },
      layout: { padding: { top: 10, bottom: 10, left: 8, right: 8 } },
    },
  })

  // Wait for the next animation frame so the canvas is fully painted
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

  const base64 = canvas.toDataURL('image/png')

  chart.destroy()
  document.body.removeChild(canvas)

  return base64
}