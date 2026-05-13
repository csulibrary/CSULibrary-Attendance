/**
 * PDF/pdfGenerator.ts
 *
 * Core helpers shared by pdfAll.ts, pdfByCollege.ts, and pdfSpecific.ts.
 *
 * Responsibilities:
 *  - Creates a fresh jsPDF document (A4 portrait)
 *  - Provides newPage() which stamps header+footer automatically
 *  - Provides sectionTitle() for consistent page titling
 *  - Provides drawTable() as a thin wrapper over autoTable
 *  - Provides embedChartOnPage() to place a Chart.js PNG in the safe zone
 *
 * Every page generator MUST use newPage() instead of doc.addPage() so that
 * the header and footer are always applied uniformly.
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { addHeader, addFooter, CONTENT_TOP, CONTENT_BOTTOM } from './pdfTemplates'
import type { PdfMeta } from './pdfTemplates'

// Re-export so callers only need to import from pdfGenerator
export type { PdfMeta }
export { CONTENT_TOP, CONTENT_BOTTOM }

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TableConfig {
  head:    string[][]
  body:    (string | number)[][]
  foot?:   string[][]
  startY?: number
  /** Column widths in mm, keyed by 0-based index */
  colWidths?: Record<number, number>
}

// ── PdfSession class ───────────────────────────────────────────────────────────
// Using a class keeps pageNum / totalPages state tidy without global variables.

export class PdfSession {
  readonly doc:         jsPDF
  readonly meta:        PdfMeta
  readonly totalPages:  number
  private  _pageNum:    number = 0

  constructor(meta: PdfMeta, totalPages: number) {
    this.doc        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    this.meta       = { generatedAt: new Date(), ...meta }
    this.totalPages = totalPages
  }

  get pageNum() { return this._pageNum }

  /**
   * Adds a new page (or sets up page 1) and stamps header + footer.
   * Always call this instead of doc.addPage().
   */
  newPage(): void {
    if (this._pageNum > 0) this.doc.addPage()
    this._pageNum++
    addHeader(this.doc, this.meta, this._pageNum, this.totalPages)
    addFooter(this.doc, this.meta)
  }

  /**
   * Draws a bold section title + smaller description below the header.
   * Returns the Y coordinate where body content should begin.
   */
  sectionTitle(title: string, description?: string): number {
    const doc = this.doc

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(13, 43, 15)
    doc.text(title, 14, CONTENT_TOP + 4)

    if (description) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 100, 100)
      doc.text(description, 14, CONTENT_TOP + 11)
    }

    doc.setTextColor(0, 0, 0)
    return CONTENT_TOP + (description ? 16 : 9)
  }

  /**
   * Places a base64 PNG chart image in the safe content zone.
   *
   * @param base64   PNG data URL from a chart renderer
   * @param startY   Top Y position (use return value of sectionTitle())
   * @param maxH     Maximum height to use (defaults to fill remaining page space)
   * @returns        The Y coordinate directly below the chart
   */
  embedChart(base64: string, startY: number, maxH?: number): number {
    const available = CONTENT_BOTTOM - startY - 4
    const h         = Math.min(maxH ?? available, available)
    const w         = 182   // page width minus 14mm margins on both sides

    this.doc.addImage(base64, 'PNG', 14, startY, w, h)
    return startY + h
  }

  /**
   * Adds a "Notes:" label for user annotation space below a chart.
   * @param y Y coordinate where to place the label
   */
  addNotesLabel(y: number): void {
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('Notes:', 14, y)
  }

  /**
   * Renders a styled autoTable.
   * Uses dark-green header, alternating row fills, gold footer row.
   */
  drawTable(cfg: TableConfig): void {
    const colStyles: Record<number, object> = {}
    if (cfg.colWidths) {
      for (const [idx, w] of Object.entries(cfg.colWidths)) {
        colStyles[Number(idx)] = { cellWidth: w }
      }
    }

    autoTable(this.doc, {
      startY:     cfg.startY ?? CONTENT_TOP + 16,
      head:       cfg.head,
      body:       cfg.body,
      foot:       cfg.foot,
      styles:           { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles:       { fillColor: [13, 43, 15], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      footStyles:       { fillColor: [249, 168, 37], textColor: [13, 43, 15], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 243, 239] },
      margin:           { left: 14, right: 14 },
      columnStyles:     colStyles,
      tableWidth:       'auto',
      // Repeat header on overflow pages
      showHead: 'everyPage',
      // Hook: stamp header/footer on any auto-generated overflow pages
      didDrawPage: (data: { pageNumber: number }) => {
        // pageNumber is table-local: page 1 is the starting page we already stamped.
        if (data.pageNumber > 1) {
          this._pageNum++
          addHeader(this.doc, this.meta, this._pageNum, this.totalPages)
          addFooter(this.doc, this.meta)
        }
      },
    })
  }

  /** Returns the final PDF as a Blob. */
  toBlob(): Blob {
    return this.doc.output('blob')
  }
}