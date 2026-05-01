<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f0f4f1]">
    <Sidebar />

    <main class="report-root flex-1 overflow-y-auto">

      <!-- HEADER -->
      <header class="attn-header px-3 pt-3 pb-2">
        <div class="header-breadcrumb text-gray-400">
          <button @click="goBack" class="back-btn flex items-center gap-1.5 text-gray-400 hover:text-[#0d2b0f] transition-colors">
            <span class="uppercase tracking-widest">Back</span>
          </button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-400 transition font-bold">Manage Services</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">Library</span>
          <span class="hero-word-gold"> Report</span>
        </h1>
        <p class="hero-subtitle">Generate and review reports by department, course, and duration.</p>
      </header>

      <!-- CONTENT -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          <!-- LEFT PANEL -->
          <div class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden" style="animation-delay: 0.1s">
            <div class="px-6 py-4 border-b border-[#d4e4da]">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Report Filters</p>
            </div>

            <div class="px-6 py-5 space-y-5">

              <!-- ALL vs SPECIFIC Toggle -->
              <div class="field-animate" style="animation-delay: 0.12s">
                <div class="flex p-1 bg-[#f0f4f1] rounded-xl">
                  <button
                    @click="reportScope = 'all'; selectedDept = ''; selectedCourse = ''"
                    :class="reportScope === 'all' ? 'bg-white shadow-sm text-[#0d2b0f]' : 'text-[#4a7060]'"
                    class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all"
                  >ALL</button>
                  <button
                    @click="reportScope = 'specific'"
                    :class="reportScope === 'specific' ? 'bg-white shadow-sm text-[#0d2b0f]' : 'text-[#4a7060]'"
                    class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all"
                  >SPECIFIC</button>
                </div>
                <p class="text-xs text-[#7a9e90] mt-1.5">
                  {{ reportScope === 'all' ? 'Overview across all colleges.' : 'Filter by a specific department and program.' }}
                </p>
              </div>

              <!-- Report Type (always visible) -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.15s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Report Type</label>
                <div class="relative">
                  <select
                    v-model="specificReportType"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors"
                  >
                    <option v-for="opt in reportTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </span>
                </div>
              </div>

              <!-- Department (only for SPECIFIC) -->
              <div v-if="reportScope === 'specific'" class="field-animate space-y-1.5" style="animation-delay: 0.18s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Department</label>
                <div class="relative">
                  <select
                    v-model="selectedDept"
                    @change="onDeptChange"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors"
                  >
                    <option value="">— choose department —</option>
                    <option v-for="(_, dept) in departments" :key="dept" :value="dept">{{ dept }}</option>
                  </select>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </span>
                </div>
              </div>

              <!-- Course (only for SPECIFIC) -->
              <div v-if="reportScope === 'specific'" class="field-animate space-y-1.5" style="animation-delay: 0.24s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Course</label>
                <div class="relative">
                  <select
                    v-model="selectedCourse"
                    :disabled="!selectedDept"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">— choose course —</option>
                    <option v-for="course in availableCourses" :key="course" :value="course">{{ course }}</option>
                  </select>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </span>
                </div>
              </div>

              <div class="h-px bg-[#d4e4da]" />

              <!-- Duration -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.30s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Duration</label>
                <div class="space-y-3">

                  <!-- Specific Day -->
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="durationType" value="day" class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="durationType === 'day' ? 'border-[#0d2b0f] bg-[#0d2b0f]' : 'border-[#c2d4cb] bg-[#f0f4f1]'">
                      <span v-if="durationType === 'day'" class="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span class="text-sm text-[#3d6455]">Specific day</span>
                    <span v-if="durationType === 'day'" class="ml-auto text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1 badge-pop">
                      {{ todayLabel }}
                    </span>
                  </label>

                  <!-- Specific Month -->
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="durationType" value="month" class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="durationType === 'month' ? 'border-[#0d2b0f] bg-[#0d2b0f]' : 'border-[#c2d4cb] bg-[#f0f4f1]'">
                      <span v-if="durationType === 'month'" class="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span class="text-sm text-[#3d6455]">Specific month</span>
                    <div v-if="durationType === 'month'" class="ml-auto flex gap-2 badge-pop">
                      <select v-model="selectedMonth" class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none">
                        <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                      </select>
                      <select v-model="selectedYear" class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none">
                        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                      </select>
                    </div>
                  </label>

                  <!-- Semester -->
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="durationType" value="semester" class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="durationType === 'semester' ? 'border-[#0d2b0f] bg-[#0d2b0f]' : 'border-[#c2d4cb] bg-[#f0f4f1]'">
                      <span v-if="durationType === 'semester'" class="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span class="text-sm text-[#3d6455]">Semester</span>
                    <div v-if="durationType === 'semester'" class="ml-auto badge-pop">
                      <select v-model="selectedSemester" class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none">
                        <option>1st Semester</option>
                        <option>2nd Semester</option>
                        <option>Summer</option>
                      </select>
                    </div>
                  </label>

                </div>
              </div>

              <div class="h-px bg-[#d4e4da]" />

              <!-- Period -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.36s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Period</label>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1.5 flex-1 text-center">{{ periodStart }}</span>
                  <span class="text-xs text-[#4a7060]">to</span>
                  <span class="text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1.5 flex-1 text-center">{{ periodEnd }}</span>
                </div>
              </div>

              <!-- School Year -->
              <div class="field-animate flex items-center gap-3" style="animation-delay: 0.42s">
                <span class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">School year</span>
                <span class="ml-auto text-xs font-semibold text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-4 py-1.5">2025 — 2026</span>
              </div>

            </div>

            <!-- Color Palette -->
            <div class="field-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden" style="animation-delay: 0.48s">
              <div class="px-6 py-4 border-b border-[#d4e4da]">
                <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Color Palette</p>
              </div>
              <div class="px-6 py-5 space-y-4">
                <div class="relative">
                  <select v-model="selectedPalette"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors">
                    <option v-for="(_, name) in palettes" :key="name" :value="name">{{ name }}</option>
                  </select>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </span>
                </div>
                <div class="flex gap-2 p-3 bg-[#f0f4f1] rounded-xl border border-[#d4e4da]">
                  <div v-for="(color, i) in palettes[selectedPalette]" :key="color"
                    class="palette-swatch w-8 h-8 rounded-md border border-white/10 flex-1"
                    :style="{ background: color, animationDelay: `${i * 50}ms` }" />
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL -->
          <div class="space-y-6">

            <!-- Sample Chart Panel -->
            <div class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] p-6" style="animation-delay: 0.3s">
              <div class="flex justify-between mb-3">
                <p class="text-sm font-semibold text-[#0d2b0f]">
                  {{ chartsGenerated ? currentChartTitle : 'Sample Chart' }}
                </p>
                <button @click="generateReport"
                  class="text-xs px-3 py-1 bg-[#0d2b0f] text-white rounded-lg transition-transform active:scale-95 hover:bg-[#183d1b]">
                  Download
                </button>
              </div>

              <!-- Empty state -->
              <div v-if="!chartsGenerated" class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-14 h-14 rounded-2xl bg-[#e6f2ec] border border-[#a8ccb8] flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="1.5">
                    <rect x="3" y="10" width="4" height="11" rx="1"/>
                    <rect x="10" y="6" width="4" height="15" rx="1"/>
                    <rect x="17" y="3" width="4" height="18" rx="1"/>
                  </svg>
                </div>
                <p class="text-xs font-semibold text-[#4a7060] uppercase tracking-widest mb-1">No Charts Yet</p>
                <p class="text-xs text-[#7a9e90]">Click "Generate Chart" to render real data from the database.</p>
              </div>

              <!-- Charts -->
              <div v-show="chartsGenerated" class="space-y-6">
                <div class="chart-block">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Bar Chart</p>
                  <canvas ref="barCanvas"></canvas>
                </div>
                <div class="chart-block" v-if="chartView === 'separate'">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Pie Chart</p>
                  <canvas ref="pieCanvas"></canvas>
                </div>
                <div class="chart-block" v-if="chartView === 'separate'">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Line Chart</p>
                  <canvas ref="lineCanvas"></canvas>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button @click="handleGenerateCharts" :disabled="isGeneratingCharts"
                class="generate-btn w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 border border-[#a8ccb8] disabled:opacity-60 disabled:cursor-not-allowed"
                :class="isGeneratingCharts ? 'bg-[#d0e8d8] text-[#4a7060]' : 'bg-[#e6f2ec] text-[#0d2b0f] hover:bg-[#d0e8d8] active:scale-[0.98]'"
                style="animation-delay: 0.40s">
                <span class="flex items-center justify-center gap-2">
                  <svg v-if="!isGeneratingCharts" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="10" width="4" height="11" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>
                  </svg>
                  <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  {{ isGeneratingCharts ? 'Fetching Data...' : 'Generate Chart' }}
                </span>
              </button>

              <button @click="generateReport" :disabled="isGenerating || !chartsGenerated"
                class="generate-btn w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="isGenerating ? 'bg-[#8ab5a0] text-[#3d6455]' : 'bg-[#0d2b0f] text-white hover:bg-[#183d1b] active:scale-[0.98]'"
                style="animation-delay: 0.45s">
                <span class="flex items-center justify-center gap-2">
                  <svg v-if="!isGenerating" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  {{ isGenerating ? 'Generating...' : 'Generate Report' }}
                </span>
              </button>
            </div>

            <!-- Progress + Status -->
            <div v-if="isGenerating || statusMsg" class="space-y-2 status-animate">
              <div class="h-1 w-full bg-[#d4e4da] rounded-full overflow-hidden">
                <div class="h-full bg-[#0d2b0f] rounded-full transition-all duration-300 ease-out" :style="{ width: progress + '%' }" />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="statusColor === 'green' ? 'bg-[#16a34a]' : statusColor === 'yellow' ? 'bg-[#b45309]' : 'bg-[#0d2b0f]'" />
                <span class="text-xs" :class="statusColor === 'green' ? 'text-[#16a34a]' : statusColor === 'yellow' ? 'text-[#b45309]' : 'text-[#0d2b0f]'">
                  {{ statusMsg }}
                </span>
              </div>
            </div>

            <!-- Chart Status -->
            <div v-if="chartStatusMsg" class="space-y-2 status-animate">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="chartStatusColor === 'green' ? 'bg-[#16a34a]' : 'bg-[#b45309]'" />
                <span class="text-xs" :class="chartStatusColor === 'green' ? 'text-[#16a34a]' : 'text-[#b45309]'">
                  {{ chartStatusMsg }}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { jsPDF } from 'jspdf'
import Sidebar from '@/components/Sidebar.vue'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
interface StudentRow {
  college: string
  program: string
  year_level: number
  gender: string
}

interface AttendanceRow {
  id: string
  time_in: string
  students: StudentRow | StudentRow[] | null
}

// Helper: Supabase sometimes returns joined rows as array, sometimes as object
function getStudent(row: AttendanceRow): StudentRow | null {
  if (!row.students) return null
  return Array.isArray(row.students) ? (row.students[0] ?? null) : row.students
}

// ── Canvas Refs ───────────────────────────────────────────────────────────────
const barCanvas  = ref<HTMLCanvasElement | null>(null)
const pieCanvas  = ref<HTMLCanvasElement | null>(null)
const lineCanvas = ref<HTMLCanvasElement | null>(null)

let barChart:  InstanceType<typeof Chart> | null = null
let pieChart:  InstanceType<typeof Chart> | null = null
let lineChart: InstanceType<typeof Chart> | null = null

// ── Static Data ───────────────────────────────────────────────────────────────
const departments: Record<string, string[]> = {
  'College of Engineering and Geo Science': [
    'BS Agricultural and Biosystem Engineering',
    'BS Civil Engineering',
    'BS Electronics Engineering',
    'BS Geodetic Engineering',
    'BS Geology',
    'BS Mining Engineering'
  ],
  'College of Computing and Information Technology': [
    'BS Information Technology',
    'BS Information System',
    'BS Computer Science'
  ],
  'College of Education': [
    'Bachelor of Secondary Education',
    'Bachelor of Elementary Education'
  ],
  'College of Mathematics and Natural Sciences': [
    'BS Applied Mathematics',
    'BS Biology',
    'BS Chemistry',
    'BS Marine Biology',
    'BS Mathematics',
    'BS Physics'
  ],
  'College of Agriculture and Agri-Industries': ['BS Agriculture'],
  'College of Forestry and Environmental Sciences': [
    'BS Agroforestry',
    'BS Environmental Science',
    'BS Forestry'
  ],
  'College of Humanities and Social Sciences': [
    'AB Sociology',
    'BS Psychology',
    'BS Social Work'
  ],
  'Graduate Studies': [
    'Doctor of Education',
    'Master of Arts in Education',
    'Master of Arts in Public Administration',
    'Master of Science Education',
    'Master of Science in Biology',
    'Master of Science in Mathematics',
    'Master of Science in Mathematics Education',
    'PHD in Mathematics',
    'PHD in Mathematics Education',
    'PHD in Science Education'
  ],
}

const palettes: Record<string, string[]> = {
  Pastel:     ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D7BAFF', '#FFB3E6'],
  Vivid:      ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#FF2D55'],
  Monochrome: ['#F5F5F5', '#DCDCDC', '#C0C0C0', '#A0A0A0', '#787878', '#505050', '#282828'],
  Ocean:      ['#CAF0F8', '#90E0EF', '#48CAE4', '#00B4D8', '#0096C7', '#0077B6', '#023E8A'],
  Sunset:     ['#FFCA3A', '#FF924C', '#FF595E', '#C9184A', '#9D0208', '#6A040F', '#370617'],
}

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const years  = ['2024', '2025', '2026', '2027']

const semesterRanges: Record<string, { start: string; end: string }> = {
  '1st Semester': { start: '08-01', end: '12-31' },
  '2nd Semester': { start: '01-01', end: '05-31' },
  'Summer':       { start: '06-01', end: '07-31' },
}

const allReportTypes      = ['Attendance Per College']
const specificReportTypes = [
  'Attendance Per Program',
  'Attendance Per Year Level',
  'Attendance of Programs Per Hour',
  'Attendance of Year Levels Per Hour',
  "Attendance of Programs' Female and Male",
  "Attendance of Year Levels' Female and Male",
]

// ── State ─────────────────────────────────────────────────────────────────────
const router = useRouter()

const reportScope        = ref<'all' | 'specific'>('specific')
const specificReportType = ref<string>(specificReportTypes[0] ?? '')
const selectedDept       = ref('')
const selectedCourse     = ref('')
const durationType       = ref<'day' | 'month' | 'semester'>('day')
const selectedMonth      = ref('April')
const selectedYear       = ref('2026')
const selectedSemester   = ref('1st Semester')
const chartView          = ref<'separate' | 'single'>('separate')
const selectedPalette    = ref('Pastel')

const isGenerating       = ref(false)
const isGeneratingCharts = ref(false)
const chartsGenerated    = ref(false)
const progress           = ref(0)
const statusMsg          = ref('')
const statusColor        = ref<'blue' | 'yellow' | 'green'>('blue')
const chartStatusMsg     = ref('')
const chartStatusColor   = ref<'green' | 'yellow'>('green')

let lastChartLabels: string[] = []
let lastChartData:   number[] = []
let lastChartData2:  number[] = []
let lastChartData3:  number[] = []
let isGenderChart = false

// ── Computed ──────────────────────────────────────────────────────────────────
const reportTypeOptions = computed(() =>
  reportScope.value === 'all' ? allReportTypes : specificReportTypes
)

const availableCourses = computed(() =>
  selectedDept.value ? departments[selectedDept.value] ?? [] : []
)

const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
)

// Safely parse a "MM-DD" string into [month, day] numbers
function parseMD(mmdd: string): [number, number] {
  const parts = mmdd.split('-')
  return [Number(parts[0] ?? '1'), Number(parts[1] ?? '1')]
}

const periodStart = computed((): string => {
  if (durationType.value === 'day') return todayLabel.value
  if (durationType.value === 'month') {
    const year  = parseInt(selectedYear.value)
    const month = months.indexOf(selectedMonth.value)
    return new Date(year, month, 1).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }
  const sem = semesterRanges[selectedSemester.value] ?? semesterRanges['1st Semester']!
  const [sm, sd] = parseMD(sem.start)
  return new Date(parseInt(selectedYear.value), sm - 1, sd).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
})

const periodEnd = computed((): string => {
  if (durationType.value === 'day') return todayLabel.value
  if (durationType.value === 'month') {
    const year  = parseInt(selectedYear.value)
    const month = months.indexOf(selectedMonth.value)
    const last  = new Date(year, month + 1, 0).getDate()
    return new Date(year, month, last).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }
  const sem = semesterRanges[selectedSemester.value] ?? semesterRanges['1st Semester']!
  const [em, ed] = parseMD(sem.end)
  return new Date(parseInt(selectedYear.value), em - 1, ed).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
})

const currentChartTitle = computed<string>(() =>
  reportScope.value === 'all'
    ? 'Attendance Per College'
    : (specificReportType.value || 'Library Report')
)

// ── Helpers ───────────────────────────────────────────────────────────────────
function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/admin/attendance')
}

function onDeptChange() {
  selectedCourse.value = ''
}

function getDateRange(): { from: string; to: string } {
  const now = new Date()

  if (durationType.value === 'day') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    return { from: start.toISOString(), to: end.toISOString() }
  }

  if (durationType.value === 'month') {
    const year  = parseInt(selectedYear.value)
    const month = months.indexOf(selectedMonth.value)
    const start = new Date(year, month, 1, 0, 0, 0)
    const end   = new Date(year, month + 1, 0, 23, 59, 59)
    return { from: start.toISOString(), to: end.toISOString() }
  }

  // semester — always has a fallback so parts are never undefined
  const sem = semesterRanges[selectedSemester.value] ?? semesterRanges['1st Semester']!
  const [sm, sd] = parseMD(sem.start)
  const [em, ed] = parseMD(sem.end)
  const year = parseInt(selectedYear.value)
  return {
    from: new Date(year, sm - 1, sd, 0, 0, 0).toISOString(),
    to:   new Date(year, em - 1, ed, 23, 59, 59).toISOString(),
  }
}

// ── Supabase Fetch ────────────────────────────────────────────────────────────
async function fetchReportData(): Promise<AttendanceRow[]> {
  const { from, to } = getDateRange()

  const { data, error } = await supabase
    .from('attendance_logs')
    .select(`
      id,
      time_in,
      students (
        college,
        program,
        year_level,
        gender
      )
    `)
    .eq('attendance_type', 'library')
    .gte('time_in', from)
    .lte('time_in', to)

  if (error) throw new Error(error.message)

  // Post-fetch filter for specific college (avoids Supabase join-filter issues)
  let rows = (data ?? []) as unknown as AttendanceRow[]
  if (reportScope.value === 'specific' && selectedDept.value) {
    rows = rows.filter(r => getStudent(r)?.college === selectedDept.value)
  }

  return rows
}

// ── Aggregation ───────────────────────────────────────────────────────────────
function aggregateByCollege(logs: AttendanceRow[]): { labels: string[]; data: number[] } {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    const col = getStudent(log)?.college ?? 'Unknown'
    counts[col] = (counts[col] ?? 0) + 1
  }
  const shortened: Record<string, string> = {
    'College of Engineering and Geo Science': 'CEGS',
    'College of Computing and Information Technology': 'CCIT',
    'College of Education': 'CED',
    'College of Mathematics and Natural Sciences': 'CMNS',
    'College of Agriculture and Agri-Industries': 'CAAI',
    'College of Forestry and Environmental Sciences': 'CFES',
    'College of Humanities and Social Sciences': 'CHSS',
    'Graduate Studies': 'GS',
  }
  const labels = Object.keys(counts).map(k => shortened[k] ?? k)
  return { labels, data: Object.values(counts) }
}

function aggregateByProgram(logs: AttendanceRow[]): { labels: string[]; data: number[] } {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    const prog = getStudent(log)?.program ?? 'Unknown'
    counts[prog] = (counts[prog] ?? 0) + 1
  }
  return { labels: Object.keys(counts), data: Object.values(counts) }
}

function aggregateByYearLevel(logs: AttendanceRow[]): { labels: string[]; data: number[] } {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    const yr    = getStudent(log)?.year_level
    const label = yr != null ? `Year ${yr}` : 'Unknown'
    counts[label] = (counts[label] ?? 0) + 1
  }
  const sorted = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]))
  return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]) }
}

function aggregateByHour(
  logs: AttendanceRow[],
  groupBy: 'program' | 'year_level'
): { labels: string[]; datasets: { label: string; data: number[] }[] } {
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`)
  const groups: Record<string, Record<string, number>> = {}

  for (const log of logs) {
    const s        = getStudent(log)
    const hour     = new Date(log.time_in).getHours()
    const hourLabel = `${hour}:00`
    const groupKey = groupBy === 'program'
      ? (s?.program ?? 'Unknown')
      : `Year ${s?.year_level ?? '?'}`

    if (!groups[groupKey]) groups[groupKey] = {}
    groups[groupKey][hourLabel] = (groups[groupKey][hourLabel] ?? 0) + 1
  }

  const datasets = Object.entries(groups).map(([label, hourCounts]) => ({
    label,
    data: hours.map(h => hourCounts[h] ?? 0),
  }))
  return { labels: hours, datasets }
}

function aggregateByGender(
  logs: AttendanceRow[],
  groupBy: 'program' | 'year_level'
): { labels: string[]; maleData: number[]; femaleData: number[] } {
  const groups: Record<string, { male: number; female: number }> = {}

  for (const log of logs) {
    const s        = getStudent(log)
    const groupKey = groupBy === 'program'
      ? (s?.program ?? 'Unknown')
      : `Year ${s?.year_level ?? '?'}`
    const gender = (s?.gender ?? '').toLowerCase()

    if (!groups[groupKey]) groups[groupKey] = { male: 0, female: 0 }
    if (gender === 'male')   groups[groupKey].male++
    if (gender === 'female') groups[groupKey].female++
  }

  const labels     = Object.keys(groups)
  const maleData   = labels.map(l => groups[l]?.male ?? 0)
  const femaleData = labels.map(l => groups[l]?.female ?? 0)
  return { labels, maleData, femaleData }
}

// ── Chart Rendering ───────────────────────────────────────────────────────────
function destroyCharts() {
  barChart?.destroy();  barChart  = null
  pieChart?.destroy();  pieChart  = null
  lineChart?.destroy(); lineChart = null
}

async function renderSimpleCharts(labels: string[], data: number[], colors: string[]) {
  isGenderChart   = false
  lastChartLabels = labels
  lastChartData   = data
  lastChartData2  = []
  lastChartData3  = []

  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: currentChartTitle.value,
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
        }
      }
    })
  }

  if (chartView.value === 'separate') {
    if (pieCanvas.value) {
      pieChart = new Chart(pieCanvas.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
          }
        }
      })
    }

    if (lineCanvas.value) {
      lineChart = new Chart(lineCanvas.value, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: currentChartTitle.value,
            data,
            borderColor: colors[0] ?? '#000',
            backgroundColor: (colors[0] ?? '#000') + '33',
            pointBackgroundColor: colors.slice(0, labels.length),
            pointRadius: 5,
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
          }
        }
      })
    }
  }
}

async function renderGenderChart(labels: string[], maleData: number[], femaleData: number[], colors: string[]) {
  isGenderChart   = true
  lastChartLabels = labels
  lastChartData2  = maleData
  lastChartData3  = femaleData

  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Male',   data: maleData,   backgroundColor: colors[4] ?? '#007AFF', borderRadius: 4 },
          { label: 'Female', data: femaleData, backgroundColor: colors[5] ?? '#FF2D55', borderRadius: 4 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
        }
      }
    })
  }
}

async function renderHourChart(
  hourLabels: string[],
  datasets: { label: string; data: number[] }[],
  colors: string[]
) {
  isGenderChart   = false
  lastChartLabels = hourLabels
  lastChartData   = datasets[0]?.data ?? []

  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels: hourLabels,
        datasets: datasets.map((ds, i) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: colors[i % colors.length] ?? '#888888',
          borderRadius: 4,
        }))
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 9 } } } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
        }
      }
    })
  }
}

// ── Main Generate Charts Handler ──────────────────────────────────────────────
async function handleGenerateCharts() {
  if (reportScope.value === 'specific' && !selectedDept.value) {
    chartStatusMsg.value   = 'Please select a department first.'
    chartStatusColor.value = 'yellow'
    return
  }

  isGeneratingCharts.value = true
  chartStatusMsg.value     = ''
  chartsGenerated.value    = false

  await nextTick()

  try {
    const logs = await fetchReportData()

    if (logs.length === 0) {
      chartStatusMsg.value     = 'No library attendance records found for the selected filters.'
      chartStatusColor.value   = 'yellow'
      isGeneratingCharts.value = false
      return
    }

    destroyCharts()
    await nextTick()

    const colors = palettes[selectedPalette.value] ?? palettes['Pastel']!
    const type   = reportScope.value === 'all' ? 'Attendance Per College' : specificReportType.value

    if (type === 'Attendance Per College') {
      const { labels, data } = aggregateByCollege(logs)
      await renderSimpleCharts(labels, data, colors)
    } else if (type === 'Attendance Per Program') {
      const { labels, data } = aggregateByProgram(logs)
      await renderSimpleCharts(labels, data, colors)
    } else if (type === 'Attendance Per Year Level') {
      const { labels, data } = aggregateByYearLevel(logs)
      await renderSimpleCharts(labels, data, colors)
    } else if (type === 'Attendance of Programs Per Hour') {
      const { labels, datasets } = aggregateByHour(logs, 'program')
      await renderHourChart(labels, datasets, colors)
    } else if (type === 'Attendance of Year Levels Per Hour') {
      const { labels, datasets } = aggregateByHour(logs, 'year_level')
      await renderHourChart(labels, datasets, colors)
    } else if (type === "Attendance of Programs' Female and Male") {
      const { labels, maleData, femaleData } = aggregateByGender(logs, 'program')
      await renderGenderChart(labels, maleData, femaleData, colors)
    } else if (type === "Attendance of Year Levels' Female and Male") {
      const { labels, maleData, femaleData } = aggregateByGender(logs, 'year_level')
      await renderGenderChart(labels, maleData, femaleData, colors)
    }

    chartsGenerated.value  = true
    chartStatusMsg.value   = `Charts generated — ${logs.length} record(s) found.`
    chartStatusColor.value = 'green'

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch data.'
    chartStatusMsg.value   = `Error: ${msg}`
    chartStatusColor.value = 'yellow'
  } finally {
    isGeneratingCharts.value = false
  }
}

// ── Dynamic Description ───────────────────────────────────────────────────────
function generateDescription(): string {
  const durationStr =
    durationType.value === 'day'      ? `on ${todayLabel.value}` :
    durationType.value === 'month'    ? `for ${selectedMonth.value} ${selectedYear.value}` :
                                        `for the ${selectedSemester.value}`

  if (reportScope.value === 'all') {
    return `This report provides a comprehensive overview of library attendance across all colleges at Caraga State University ${durationStr}. It shows the total number of student visits grouped by college.`
  }

  const type = specificReportType.value
  const dept = selectedDept.value || 'the selected department'

  const descriptions: Record<string, string> = {
    'Attendance Per Program':                       `Library attendance grouped by program under ${dept} ${durationStr}.`,
    'Attendance Per Year Level':                    `Library attendance grouped by year level under ${dept} ${durationStr}.`,
    'Attendance of Programs Per Hour':              `Hourly library attendance broken down by program under ${dept} ${durationStr}.`,
    'Attendance of Year Levels Per Hour':           `Hourly library attendance broken down by year level under ${dept} ${durationStr}.`,
    "Attendance of Programs' Female and Male":      `Female and male library attendance across programs under ${dept} ${durationStr}.`,
    "Attendance of Year Levels' Female and Male":   `Female and male library attendance across year levels under ${dept} ${durationStr}.`,
  }

  return descriptions[type] ?? `Library attendance report for ${dept} ${durationStr}.`
}

// ── PDF Generation ────────────────────────────────────────────────────────────
async function generateReport() {
  if (!chartsGenerated.value) {
    statusMsg.value   = 'Please generate charts first before downloading the report.'
    statusColor.value = 'yellow'
    progress.value    = 0
    return
  }

  isGenerating.value = true
  statusMsg.value    = 'Building PDF...'
  statusColor.value  = 'blue'
  progress.value     = 10

  try {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const doc        = new jsPDF('l', 'mm', 'a4')
    const pageWidth  = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const extractedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const extractedTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', second: '2-digit'
    })

    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    doc.setTextColor(40, 40, 40)
    doc.setDrawColor(120, 120, 120)
    doc.setLineWidth(0.4)

    progress.value = 20

    // Logo
    const logoX = 12, logoY = 10, logoW = 20, logoH = 20
    doc.rect(logoX, logoY, logoW, logoH)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('LOGO', logoX + logoW / 2, logoY + 11, { align: 'center' })

    // Header
    doc.setTextColor(40, 40, 40)
    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    doc.text('Caraga State University', 38, 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text('Ampayon, Butuan City', 38, 27)
    doc.setFont('times', 'bold')
    doc.setFontSize(13)
    doc.text(`Extracted: ${extractedDate}`, 210, 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(extractedTime, 233, 27)
    doc.setFont('times', 'bold')
    doc.setFontSize(11)
    doc.text(currentChartTitle.value, pageWidth / 2, 38, { align: 'center' })
    doc.setFont('times', 'normal')
    doc.setFontSize(9)

    const infoLine = reportScope.value === 'all'
      ? `Scope: All Colleges | Period: ${periodStart.value} to ${periodEnd.value} | School Year: 2025–2026`
      : `College: ${selectedDept.value} | Program: ${selectedCourse.value || 'All'} | Period: ${periodStart.value} to ${periodEnd.value} | School Year: 2025–2026`
    doc.text(infoLine, 38, 35)

    progress.value = 40

    // Embed bar chart
    const chartAreaX = 18, chartAreaY = 42, chartAreaW = 165, chartAreaH = 120
    if (barCanvas.value) {
      const barImg = barCanvas.value.toDataURL('image/png')
      doc.addImage(barImg, 'PNG', chartAreaX, chartAreaY, chartAreaW, chartAreaH)
    }

    progress.value = 60

    // Second page for pie + line if separate mode
    if (chartView.value === 'separate' && !isGenderChart && (pieCanvas.value || lineCanvas.value)) {
      doc.addPage()
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      doc.setFont('times', 'bold')
      doc.setFontSize(13)
      doc.text(`${currentChartTitle.value} — Additional Charts`, pageWidth / 2, 15, { align: 'center' })

      if (pieCanvas.value) {
        doc.addImage(pieCanvas.value.toDataURL('image/png'), 'PNG', 18, 22, 120, 90)
      }
      if (lineCanvas.value) {
        doc.addImage(lineCanvas.value.toDataURL('image/png'), 'PNG', 18, 118, 160, 80)
      }
    }

    doc.setPage(1)
    progress.value = 75

    // Right legend panel
    const sideX = 192, sideY = 42, sideW = 85, sideH = 120
    doc.setDrawColor(120, 120, 120)
    doc.setLineWidth(0.4)
    doc.rect(sideX, sideY, sideW, sideH)
    doc.line(sideX, sideY + 28, sideX + sideW, sideY + 28)
    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    doc.text('Legend', sideX + 2, sideY + 7)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)

    const colors = palettes[selectedPalette.value] ?? palettes['Pastel']!

    if (!isGenderChart) {
      lastChartLabels.slice(0, 10).forEach((lbl, i) => {
        const dotY = sideY + 14 + i * 6.5
        const hex  = colors[i % colors.length] ?? '#888888'
        const r    = parseInt(hex.slice(1, 3), 16)
        const g    = parseInt(hex.slice(3, 5), 16)
        const b    = parseInt(hex.slice(5, 7), 16)
        doc.setFillColor(r, g, b)
        doc.rect(sideX + 2, dotY - 2.5, 3, 3, 'F')
        doc.setTextColor(40, 40, 40)
        const shortLbl = lbl.length > 28 ? lbl.slice(0, 26) + '…' : lbl
        doc.text(`${shortLbl}: ${lastChartData[i] ?? 0}`, sideX + 7, dotY)
      })
    } else {
      const genderEntries: [string, string][] = [
        [colors[4] ?? '#007AFF', 'Male'],
        [colors[5] ?? '#FF2D55', 'Female'],
      ]
      genderEntries.forEach(([hex, label], i) => {
        const dotY = sideY + 14 + i * 7
        const r    = parseInt(hex.slice(1, 3), 16)
        const g    = parseInt(hex.slice(3, 5), 16)
        const b    = parseInt(hex.slice(5, 7), 16)
        doc.setFillColor(r, g, b)
        doc.rect(sideX + 2, dotY - 2.5, 3, 3, 'F')
        doc.setTextColor(40, 40, 40)
        doc.text(label, sideX + 7, dotY)
      })
    }

    doc.line(sideX, sideY + 28, sideX + sideW, sideY + 28)
    doc.setFont('times', 'bold')
    doc.setFontSize(9)
    doc.text('Description:', sideX + 2, sideY + 34)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const wrappedDesc: string[] = doc.splitTextToSize(generateDescription(), sideW - 4) as string[]
    doc.text(wrappedDesc, sideX + 2, sideY + 41)

    progress.value = 90

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(90, 90, 90)
    doc.text('Generated by ACCESS', pageWidth / 2, pageHeight - 4, { align: 'center' })

    const title    = currentChartTitle.value
    const filename = `Library_Report_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(filename)

    progress.value     = 100
    isGenerating.value = false
    statusMsg.value    = 'PDF report downloaded successfully.'
    statusColor.value  = 'green'

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    isGenerating.value = false
    statusMsg.value    = `Failed to generate PDF: ${msg}`
    statusColor.value  = 'yellow'
    progress.value     = 0
  }
}
</script>

<style scoped>
.report-root { font-family: 'Poppins', sans-serif; }

.header-breadcrumb {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  display: inline-block;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}
.hero-word-dark { color: #0d2b0f; }
.hero-word-gold { color: #e6a800; }
.hero-underlined { position: relative; display: inline-block; }
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -8px; left: 0;
  width: 100%; height: 5px;
  background: linear-gradient(to right, #0d2b0f, #e6a800);
  border-radius: 3px;
  transform-origin: left;
  animation: underlineGrow 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.hero-subtitle {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}

.panel-animate {
  opacity: 0;
  animation: panelIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes panelIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.field-animate {
  opacity: 0;
  animation: fieldIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fieldIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}

.palette-swatch { animation: swatchPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes swatchPop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

.badge-pop { animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes badgePop {
  from { opacity: 0; transform: scale(0.8) translateX(6px); }
  to   { opacity: 1; transform: scale(1) translateX(0); }
}

.chart-block {
  opacity: 0;
  animation: chartReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
@keyframes chartReveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.generate-btn {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
}

.status-animate { animation: fadeIn 0.3s ease both; }

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
</style>