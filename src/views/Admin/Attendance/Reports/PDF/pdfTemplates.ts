/**
 * PDF/pdfTemplates.ts
 *
 * Uniform header and footer stamped on every page across ALL three report types.
 * Import addHeader() and addFooter() in pdfAll.ts, pdfByCollege.ts, pdfSpecific.ts.
 *
 * Usage:
 *   import { addHeader, addFooter, CONTENT_TOP, CONTENT_BOTTOM } from '../pdfTemplates'
 *   addHeader(doc, meta, pageNum, totalPages)
 *   addFooter(doc, meta)
 */

import type { jsPDF } from 'jspdf'
import headerImg from '@/assets/images/others/report-header.png'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PdfMeta {
  /** Bold title shown in the green header bar, e.g. "ALL ATTENDANCE REPORT" */
  title: string
  /** Smaller subtitle line, e.g. "February · March 2026" */
  subtitle?: string
  /** Optional – shown centred in footer when set */
  college?: string
  /** Optional – shown centred in footer when set */
  program?: string
  /** Defaults to now() */
  generatedAt?: Date
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DARK_GREEN  = [13,  43,  15]  as const   // #0d2b0f
const GOLD        = [249, 168, 37]  as const   // #f9a825
const PAGE_W      = 210   // A4 portrait width  (mm)
const PAGE_H      = 297   // A4 portrait height (mm)
const HEADER_H    = 30    // height of the green bar
const FOOTER_H    = 16    // height reserved at the bottom
const offsetY = HEADER_H

/** First Y coordinate that is safe to draw content on (below header). */
export const CONTENT_TOP    = HEADER_H * 2 + 8    // 38 mm

/** Last Y coordinate that is safe to draw content on (above footer). */
export const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 4  // 277 mm

// ── Header ─────────────────────────────────────────────────────────────────────

/**
 * Draws the green header bar with institution name, report title, subtitle,
 * page number and a circular CSU logo placeholder.
 *
 * @param doc        jsPDF document instance
 * @param meta       Report metadata
 * @param pageNum    Current page number (1-based)
 * @param totalPages Total pages in this report
 */
export function addHeader(
  doc:        jsPDF,
  meta:       PdfMeta,
  pageNum:    number,
  totalPages: number,
): void {
// ── Header image (top) ─────────────────────────────────────────────────────
doc.addImage(headerImg, 'PNG', 0, 0, PAGE_W, HEADER_H)

// ── Gold accent stripe (keep same position) ────────────────────────────────
doc.setFillColor(...GOLD)
doc.rect(0, HEADER_H - 2, PAGE_W, 2, 'F')

// ── Green bar moved BELOW yellow line ──────────────────────────────────────
doc.setFillColor(...DARK_GREEN)
doc.rect(0, HEADER_H, PAGE_W, HEADER_H, 'F')


  // ── Left side text ──────────────────────────────────────────────────────────
  // Institution / system label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(180, 210, 180)
  doc.text('CARAGA STATE UNIVERSITY — ATTENDANCE AND CAPACITY CSU-LIBRARY ENTRY SYSTEM', 14, 9 + offsetY)

  // Report title
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(meta.title, 14, 18 + offsetY)

  // Subtitle (date range / college label)
  if (meta.subtitle) {
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 220, 180)
    doc.text(meta.subtitle, 14, 24.5 + offsetY)
  }

  // ── Right side: page number + logo ─────────────────────────────────────────
  // Page number
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 220, 180)
  doc.text(`Page ${pageNum} / ${totalPages}`, PAGE_W - 14, 24.5 + offsetY, { align: 'right' })


  // ── Reset for body content ──────────────────────────────────────────────────
  doc.setTextColor(0, 0, 0)
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.2)
}

// ── Footer ─────────────────────────────────────────────────────────────────────

/**
 * Draws the thin footer with system label (left), scope / college·program
 * (centre), and generation timestamp (right).
 *
 * @param doc  jsPDF document instance
 * @param meta Report metadata
 */
export function addFooter(doc: jsPDF, meta: PdfMeta): void {
  const y = PAGE_H - FOOTER_H

  // Separator line
  doc.setDrawColor(...DARK_GREEN)
  doc.setLineWidth(0.3)
  doc.line(14, y, PAGE_W - 14, y)

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(110, 110, 110)

  // Left: system label
  doc.text('Attendance And Capacity CSU-Library Entry System', 14, y + 6)

  // Right: generated timestamp
  const dateStr = (meta.generatedAt ?? new Date()).toLocaleString('en-PH', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
  doc.text(`Generated: ${dateStr}`, PAGE_W - 14, y + 6, { align: 'right' })

  // Centre: college · program scope (only when set)
  const scopeParts = [meta.college, meta.program].filter(Boolean)
  if (scopeParts.length) {
    doc.text(scopeParts.join(' · '), PAGE_W / 2, y + 6, { align: 'center' })
  }

  // Reset
  doc.setTextColor(0, 0, 0)
}