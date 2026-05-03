/**
 * PDF/Charts/renderLineChart.ts
 *
 * Renders a line chart using Chart.js onto a hidden <canvas>,
 * then returns a base64 PNG string for embedding in jsPDF.
 *
 * Import: import { renderLineChart } from '../Charts/renderLineChart'
 */

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
  Title,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
  Title,
)

// ── Palette ────────────────────────────────────────────────────────────────────

export const LINE_COLORS = [
  '#1b5e20',
  '#f9a825',
  '#1565c0',
  '#c62828',
  '#6a1b9a',
  '#00695c',
  '#e65100',
  '#37474f',
]

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LineDataset {
  label:  string
  data:   number[]
  /** Hex color. Defaults to LINE_COLORS[index]. */
  color?: string
  /** Fill area under line. Default false. */
  fill?:  boolean
}

export interface LineChartInput {
  labels:    string[]
  datasets:  LineDataset[]
  title?:    string
  xLabel?:   string
  yLabel?:   string
  /** Canvas width in px (default 900). */
  width?:    number
  /** Canvas height in px (default 440). */
  height?:   number
}

// ── Renderer ───────────────────────────────────────────────────────────────────

/**
 * @returns base64 PNG data URL
 */
export async function renderLineChart(input: LineChartInput): Promise<string> {
  const w = input.width  ?? 900
  const h = input.height ?? 440

  const canvas         = document.createElement('canvas')
  canvas.width         = w
  canvas.height        = h
  canvas.style.display = 'none'
  document.body.appendChild(canvas)

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels:   input.labels,
      datasets: input.datasets.map((d, i) => {
        const color = d.color ?? (LINE_COLORS[i % LINE_COLORS.length] as string)
        return {
          label:            d.label,
          data:             d.data,
          borderColor:      color,
          backgroundColor:  color + '28',
          fill:             d.fill ?? (input.datasets.length === 1),
          tension:          0.35,
          pointRadius:      4,
          pointHoverRadius: 6,
          borderWidth:      2.5,
        }
      }),
    },
    options: {
      animation:  false,
      responsive: false,
      plugins: {
        legend: {
          // Always show the legend for line charts — the label IS the series
          // identifier (program name, year level, etc.) and must be visible.
          display:  true,
          position: 'top',
          labels: {
            font:     { size: 11 },
            padding:  12,
            boxWidth: 14,
          },
        },
        title: {
          display: !!input.title,
          text:    input.title ?? '',
          font:    { size: 14, weight: 'bold' },
        },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          grid:  { display: false },
          title: { display: !!input.xLabel, text: input.xLabel ?? '' },
          ticks: { maxRotation: 45 },
        },
        y: {
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.06)' },
          title:       { display: !!input.yLabel, text: input.yLabel ?? '' },
          ticks:       { precision: 0 },
        },
      },
      layout: { padding: { top: 10, bottom: 10, left: 8, right: 8 } },
    },
  })

  // Reliable paint cycle — setTimeout(50ms) is more dependable than a single
  // requestAnimationFrame when Chart.js animation is disabled.
  await new Promise<void>((resolve) => setTimeout(resolve, 50))

  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  document.body.removeChild(canvas)

  return base64
}