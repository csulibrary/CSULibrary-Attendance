<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <main class="report-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="report-header">
        <div class="header-left">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/analytics')"
              >BACK</span
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Books Analytics</span>
          </div>

          <h1 class="header-title">Library <span style="color: #f9a825">Book Analytics</span></h1>

          <p class="header-sub">
            Import accession records to visualize library acquisitions, withdrawals, and subject
            distribution.
          </p>
        </div>

        <div class="header-right">
          <div class="date-badge">
            <CalendarDays class="w-4 h-4" />
            March 2026
          </div>
        </div>
      </header>

      <!-- IMPORT PANEL -->
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Import Accession File</h2>
            <p class="panel-sub">Upload XLSX, XLS, or CSV to populate analytics</p>
          </div>

          <div v-if="fileName" class="file-pill">
            <FileSpreadsheet class="w-4 h-4" />
            {{ fileName }}
          </div>
        </div>

        <div
          class="drop-zone"
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerUpload"
        >
          <input
            ref="fileInput"
            type="file"
            hidden
            accept=".xlsx,.xls,.csv"
            @change="handleFileSelect"
          />

          <FileSpreadsheet class="upload-icon" />

          <p class="upload-main"><strong>Click to upload</strong> or drag and drop</p>

          <p class="upload-sub">XLSX, XLS, CSV · Max 20MB</p>
        </div>
      </section>

      <!-- KPI STRIP -->
      <div class="kpi-strip">
        <div v-for="stat in kpiStats" :key="stat.label" class="kpi-card">
          <div class="kpi-icon">
            <component :is="stat.icon" />
          </div>

          <div>
            <span class="kpi-value">{{ stat.value }}</span>
            <span class="kpi-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="main-grid">
        <!-- ACQUISITION TIMELINE -->
        <section class="panel col-span-2">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Acquisitions Timeline</h2>
              <p class="panel-sub">Monthly acquisitions</p>
            </div>

            <select v-model="selectedYear" class="year-select">
              <option v-for="y in availableYears" :key="y">
                {{ y }}
              </option>
            </select>
          </div>

          <div class="chart-area">
            <svg viewBox="0 0 560 190" class="w-full">
              <g v-for="bar in chartBars" :key="bar.label">
                <rect
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.w"
                  :height="bar.h"
                  rx="3"
                  :fill="bar.highlight ? '#1b5e20' : '#a5d6a7'"
                />

                <text :x="bar.cx" y="180" font-size="9" text-anchor="middle">
                  {{ bar.label }}
                </text>
              </g>
            </svg>
          </div>
        </section>

        <!-- SUBJECT DISTRIBUTION -->
        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Subject Distribution</h2>
          </div>

          <div class="subject-list">
            <div v-for="s in subjects" :key="s.name" class="subject-row">
              <div class="subject-head">
                <span>{{ s.name }}</span>
                <span>{{ s.count }} ({{ s.pct }}%)</span>
              </div>

              <div class="subject-bar">
                <div class="subject-fill" :style="{ width: s.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- NEW BOOKS -->
        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Newly Acquired Books</h2>

            <span class="pill"> {{ newlyAcquired.length }} books </span>
          </div>

          <div class="list">
            <div v-for="book in newlyAcquired" :key="book.accNo" class="list-row">
              <BookOpen class="row-icon" />

              <div class="row-content">
                <p class="row-title">{{ book.title }}</p>

                <p class="row-sub">{{ book.author }} · {{ book.subject }}</p>
              </div>

              <span class="acc-no"> Acc#{{ book.accNo }} </span>
            </div>
          </div>
        </section>

        <!-- DEACCESSION -->
        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">De-Accessioned Books</h2>

            <span class="pill danger">
              {{ deAccessioned.length }}
            </span>
          </div>

          <div class="list">
            <div v-for="book in deAccessioned" :key="book.accNo" class="list-row">
              <BookX class="row-icon danger" />

              <div class="row-content">
                <p class="row-title">{{ book.title }}</p>

                <p class="row-sub">{{ book.author }} · {{ book.subject }}</p>
              </div>

              <div class="acc-block">
                <span class="acc-no"> Acc#{{ book.accNo }} </span>

                <span class="date">
                  {{ book.dateRemoved }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- FOOTER SUMMARY -->
      <section class="panel highlight-panel">
        <div class="summary">
          <Library class="summary-icon" />

          <div>
            <p class="summary-title">CSU Library Collection Report</p>

            <p class="summary-sub">Generated March 2026</p>
          </div>
        </div>

        <div class="summary-stats">
          <div>
            <p class="stat-value">1248</p>
            <p class="stat-label">Total Books</p>
          </div>

          <div>
            <p class="stat-value">34</p>
            <p class="stat-label">This Month</p>
          </div>

          <div>
            <p class="stat-value highlight">12</p>
            <p class="stat-label">De-Accessioned</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

import { FileSpreadsheet, CalendarDays, BookOpen, BookPlus, BookX, Library } from 'lucide-vue-next'

/* ----------------------------
   Sidebar
---------------------------- */

const activeTab = ref('ANALYTICS')

const handleTabChange = (tab: string) => {
  activeTab.value = tab
}

/* ----------------------------
   Upload
---------------------------- */

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const fileName = ref('')

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    fileName.value = file.name
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false

  const file = e.dataTransfer?.files?.[0]

  if (file) {
    fileName.value = file.name
  }
}

/* ----------------------------
   KPI
---------------------------- */

const kpiStats = [
  { label: 'Total Books', value: '1248', icon: Library },
  { label: 'New Acquisitions', value: '34', icon: BookPlus },
  { label: 'De-Accessioned', value: '12', icon: BookX },
  { label: 'Subjects', value: '18', icon: Library },
]

/* ----------------------------
   Chart
---------------------------- */

const selectedYear = ref(2026)

const availableYears = [2026, 2025, 2024]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RAW_VALS = [18, 22, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0]

const BAR_AREA_W = 516
const BAR_W = BAR_AREA_W / 12 - 4

const chartBars = MONTHS.map((label, i) => {
  const val = RAW_VALS[i] ?? 0
  const maxVal = Math.max(...RAW_VALS, 1)

  const barH = (val / maxVal) * 148

  const x = 32 + (BAR_AREA_W / 12) * i + 2

  return {
    x,
    y: 162 - barH,
    w: BAR_W,
    h: barH,
    cx: x + BAR_W / 2,
    label,
    highlight: i === 2,
  }
})

/* ----------------------------
   Subjects
---------------------------- */

const subjects = [
  { name: 'Computer Science', count: 312, pct: 25 },
  { name: 'Engineering', count: 248, pct: 20 },
  { name: 'Natural Sciences', count: 199, pct: 16 },
  { name: 'Social Sciences', count: 175, pct: 14 },
  { name: 'Literature', count: 150, pct: 12 },
]

/* ----------------------------
   Books
---------------------------- */

const newlyAcquired = [
  {
    accNo: '24-1101',
    title: 'Artificial Intelligence',
    author: 'Russell',
    subject: 'Computer Science',
  },
  { accNo: '24-1102', title: 'Design Patterns', author: 'Gamma', subject: 'Engineering' },
]

const deAccessioned = [
  {
    accNo: '98-0042',
    title: 'BASIC Programming',
    author: 'Norton',
    subject: 'CS',
    dateRemoved: 'Feb 12 2026',
  },
  {
    accNo: '97-0118',
    title: 'Britannica Vol.3',
    author: 'Various',
    subject: 'Reference',
    dateRemoved: 'Feb 20 2026',
  },
]
</script>

<style src="@/assets/styles/report-analytics.css"></style>
