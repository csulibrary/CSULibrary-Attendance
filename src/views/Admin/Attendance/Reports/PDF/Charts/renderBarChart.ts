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
  '#0d2b0f',
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
  label:  string
  data:   number[]
  /**
   * Hex color string, OR an array of hex strings (one per bar).
   * When an array is passed every bar gets its own colour — useful for
   * charts where each bar represents a different category (e.g. programs).
   * Defaults to BAR_COLORS[index].
   */
  color?: string | string[]
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
 * Renders a bar chart to a base64 PNG data URL.
 *
 * Key fix: backgroundColor now accepts string | string[] so that a single
 * dataset can paint each bar a different colour (e.g. one colour per program).
 */
export async function renderBarChart(input: BarChartInput): Promise<string> {
  const w = input.width  ?? 900
  const h = input.height ?? 440

  const canvas         = document.createElement('canvas')
  canvas.width         = w
  canvas.height        = h
  canvas.style.display = 'none'
  document.body.appendChild(canvas)

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels:   input.labels,
      datasets: input.datasets.map((d, i) => {
        // Resolve backgroundColor:
        //   • string[]  → passed straight through (one color per bar)
        //   • string    → single color for all bars in this dataset
        //   • undefined → fall back to palette entry for this dataset index
        let bg: string | string[]
        if (Array.isArray(d.color)) {
          bg = d.color
        } else {
          bg = d.color ?? (BAR_COLORS[i % BAR_COLORS.length] as string)
        }

        return {
          label:           d.label,
          data:            d.data,
          backgroundColor: bg,
          borderRadius:    4,
          borderSkipped:   false,
        }
      }),
    },
    options: {
      animation:  false,
      responsive: false,
      plugins: {
        legend: {
          // Show legend when there are multiple datasets OR when the caller
          // explicitly wants one. For single-dataset multi-colour charts the
          // legend is hidden because each bar's x-axis label is the identifier.
          display:  input.datasets.length > 1,
          position: 'top',
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
          stacked: input.stacked ?? false,
          grid:    { display: false },
          title:   { display: !!input.xLabel, text: input.xLabel ?? '' },
          ticks:   {
            maxRotation: 45,
            autoSkip:    false,    // always show every label
          },
        },
        y: {
          stacked:     input.stacked ?? false,
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.06)' },
          title:       { display: !!input.yLabel, text: input.yLabel ?? '' },
          ticks: {
            // Ensure count labels are always integers
            precision: 0,
          },
        },
      },
      layout: { padding: { top: 10, bottom: 10, left: 8, right: 8 } },
    },
    plugins: [
      {
        // Draw the numeric value on top of every bar so counts are always
        // visible even if the y-axis scale is hard to read in a PDF.
        id: 'barValueLabels',
        afterDatasetsDraw(chartInstance) {
          const ctx = chartInstance.ctx
          chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chartInstance.getDatasetMeta(datasetIndex)
            if (meta.hidden) return
            meta.data.forEach((bar, index) => {
              const value = dataset.data[index]
              if (value == null || value === 0) return
              ctx.save()
              ctx.fillStyle   = '#333333'
              ctx.font        = 'bold 11px sans-serif'
              ctx.textAlign   = 'center'
              ctx.textBaseline = 'bottom'
              ctx.fillText(String(value), bar.x, bar.y - 2)
              ctx.restore()
            })
          })
        },
      },
    ],
  })

  // Give Chart.js a full paint cycle.  Using a short setTimeout is more
  // reliable than a single requestAnimationFrame when animation is disabled.
  await new Promise<void>((resolve) => setTimeout(resolve, 50))

  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  document.body.removeChild(canvas)

  return base64
}