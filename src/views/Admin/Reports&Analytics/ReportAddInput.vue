<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <main class="report-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="report-header intro-header">
        <div>
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/analytics')"
              >BACK</span
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Collection Analytics</span>
          </div>

          <h1 class="header-title intro-title">
            Library <span style="color: #f9a825">Collection Analytics</span>
          </h1>

          <p class="header-sub">
            Import accession files and visualize CSU Library collection trends, acquisitions,
            de-accessions, and subject distributions.
          </p>
        </div>

        <div class="header-right">
          <div class="date-badge">
            <CalendarDays />
            March 2026
          </div>
        </div>
      </header>

      <!-- IMPORT PANEL -->
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Import Accession File</h2>
            <p class="panel-sub">Upload XLSX / XLS / CSV file to generate analytics</p>
          </div>
        </div>

        <div
          class="drop-zone"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="isDragging = false"
        >
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".xlsx,.xls,.csv"
            @change="onFileChange"
          />

          <p v-if="!fileName">Click to upload or drag accession spreadsheet</p>

          <p v-if="fileName">
            Selected file: <strong>{{ fileName }}</strong>
          </p>
        </div>
      </section>

      <!-- KPI CARDS -->
      <section class="kpi-strip">
        <div
          v-for="(stat, i) in kpiStats"
          :key="stat.label"
          class="kpi-card"
          :style="`animation-delay:${i * 0.05}s`"
        >
          <div class="kpi-icon" :style="{ background: '#1b5e2015' }">
            <component :is="stat.icon" />
          </div>

          <div>
            <span class="kpi-label">{{ stat.label }}</span>
            <span class="kpi-value">{{ stat.value }}</span>
          </div>
        </div>
      </section>

      <!-- MAIN GRID -->
      <div class="main-grid">
        <!-- LEFT COLUMN -->
        <div>
          <!-- ACQUISITIONS -->
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title">Acquisitions Timeline</h2>
                <p class="panel-sub">Monthly newly acquired books</p>
              </div>

              <select v-model="selectedYear">
                <option v-for="y in availableYears" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
            </div>

            <div class="bar-chart">
              <div class="bars-wrap">
                <div v-for="bar in chartBars" :key="bar.label" class="bar-col">
                  <div
                    class="bar"
                    :class="{ 'bar--highlight': bar.highlight }"
                    :style="{ height: bar.h + 'px' }"
                  ></div>

                  <span class="bar-label">
                    {{ bar.label }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- SUBJECT DISTRIBUTION -->
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title">Subject Distribution</h2>
                <p class="panel-sub">Top categories by book count</p>
              </div>
            </div>

            <table class="report-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th class="text-right">Books</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(s, i) in subjects"
                  :key="s.name"
                  class="table-row-animate"
                  :style="`animation-delay:${i * 0.05}s`"
                >
                  <td class="name-cell">
                    {{ s.name }}
                  </td>

                  <td class="text-right">
                    {{ s.count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- NEWLY ACQUIRED -->
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title">Newly Acquired Books</h2>
                <p class="panel-sub">Latest additions to the collection</p>
              </div>
            </div>

            <table class="report-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Subject</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(book, i) in newlyAcquired"
                  :key="i"
                  class="table-row-animate"
                  :style="`animation-delay:${i * 0.05}s`"
                >
                  <td class="name-cell">{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>{{ book.subject }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <!-- RIGHT COLUMN -->
        <div>
          <!-- PUBLICATION YEARS -->
          <section class="panel">
            <div class="panel-head panel-head--center">
              <h2 class="panel-title">Publication Year Distribution</h2>

              <p class="panel-sub">Books grouped by decade</p>
            </div>

            <table class="report-table">
              <tbody>
                <tr v-for="br in pubBrackets" :key="br.label">
                  <td>{{ br.label }}</td>

                  <td class="text-right">
                    {{ br.count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- LANGUAGE SPLIT -->
          <section class="panel">
            <div class="panel-head panel-head--center">
              <h2 class="panel-title">Language Distribution</h2>

              <p class="panel-sub">Books by language</p>
            </div>

            <div class="donut-area">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="16" />
              </svg>

              <div class="donut-legend">
                <div v-for="lang in languages" :key="lang.name" class="legend-row">
                  <div class="legend-dot" :style="{ background: lang.color }"></div>

                  <span class="legend-label">
                    {{ lang.name }}
                  </span>

                  <span class="legend-pct"> {{ lang.pct }}% </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

import { CalendarDays, Library, BookPlus, BookX, PieChart } from 'lucide-vue-next'

const activeTab = ref('ANALYTICS')

const handleTabChange = (name: string) => {
  activeTab.value = name
}

/* FILE IMPORT */

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const fileName = ref('')

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) fileName.value = file.name
}

/* KPI DATA */

const kpiStats = [
  { label: 'Total Books', value: '1,248', icon: Library },
  { label: 'Newly Acquired', value: '34', icon: BookPlus },
  { label: 'De-Accessioned', value: '12', icon: BookX },
  { label: 'Subjects', value: '18', icon: PieChart },
]

const selectedYear = ref(2026)

const availableYears = [2026, 2025, 2024, 2023]

/* BAR CHART */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const RAW = [18, 22, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0]

const chartBars = MONTHS.map((label, i) => {
  const val = RAW[i] ?? 0

  return {
    label,
    h: val * 4,
    highlight: i === 2,
  }
})

/* SUBJECTS */

const subjects = [
  { name: 'Computer Science', count: 312 },
  { name: 'Engineering', count: 248 },
  { name: 'Natural Sciences', count: 199 },
  { name: 'Social Sciences', count: 175 },
  { name: 'Literature', count: 150 },
]

/* BOOKS */

const newlyAcquired = [
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Russell',
    subject: 'Computer Science',
  },
  { title: 'Design Patterns', author: 'Gamma', subject: 'Engineering' },
  { title: 'Organic Chemistry', author: 'McMurry', subject: 'Science' },
]

/* PUBLICATION */

const pubBrackets = [
  { label: 'Pre-1970', count: 48 },
  { label: '1970-1989', count: 112 },
  { label: '1990-1999', count: 198 },
  { label: '2000-2009', count: 337 },
  { label: '2010-2019', count: 424 },
]

/* LANGUAGES */

const languages = [
  { name: 'English', pct: 72, color: '#1b5e20' },
  { name: 'Filipino', pct: 15, color: '#66bb6a' },
  { name: 'Spanish', pct: 8, color: '#a5d6a7' },
  { name: 'Others', pct: 5, color: '#f9a825' },
]
</script>

<style src="@/assets/styles/report-analytics.css"></style>
