<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f0f4f1]">
    <!-- SIDEBAR (fixed, never scrolls) -->
    <Sidebar />

    <!-- MAIN CONTENT (scrolls independently) -->
    <main class="report-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="attn-header">
        <div>
          <div
            class="flex mb-3 items-center gap-1.5 leading-none text-[0.68rem] font-bold tracking-[0.15em] uppercase text-[rgba(13,43,15,0.4)]"
          >
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/attendance')"
              >BACK</span
            >
            <svg
              class="w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span> Manage Services</span>
          </div>

          <h1 class="hero-title">
            <span class="hero-word-dark hero-underlined">Attendance</span>
            <span class="hero-word-gold"> Report</span>
          </h1>
          <p class="hero-subtitle">
            Generate and review reports by department, course, and duration.
          </p>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- LEFT PANEL: Filters -->
          <div
            class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden"
            style="animation-delay: 0.1s"
          >
            <!-- Card Header -->
            <div class="px-6 py-4 border-b border-[#d4e4da]">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">
                Report Filters
              </p>
            </div>

            <div class="px-6 py-5 space-y-5">
              <!-- Department -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.18s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
                  >Department</label
                >
                <div class="relative">
                  <select
                    v-model="selectedDept"
                    @change="onDeptChange"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors"
                  >
                    <option value="">— choose department —</option>
                    <option v-for="(_, dept) in departments" :key="dept" :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                  <span
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]"
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1l5 5 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Course -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.24s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
                  >Course</label
                >
                <div class="relative">
                  <select
                    v-model="selectedCourse"
                    :disabled="!selectedDept"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">— choose course —</option>
                    <option v-for="course in availableCourses" :key="course" :value="course">
                      {{ course }}
                    </option>
                  </select>
                  <span
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]"
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1l5 5 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div class="h-px bg-[#d4e4da]" />

              <!-- Duration -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.3s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
                  >Duration</label
                >
                <div class="space-y-3">
                  <!-- Specific Day -->
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" v-model="durationType" value="day" class="hidden" />
                    <span
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="
                        durationType === 'day'
                          ? 'border-[#0d2b0f] bg-[#0d2b0f]'
                          : 'border-[#c2d4cb] bg-[#f0f4f1]'
                      "
                    >
                      <span
                        v-if="durationType === 'day'"
                        class="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    </span>
                    <span class="text-sm text-[#3d6455]">Specific day</span>
                    <span
                      v-if="durationType === 'day'"
                      class="ml-auto text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1 badge-pop"
                    >
                      {{ todayLabel }}
                    </span>
                  </label>

                  <!-- Specific Month -->
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="durationType" value="month" class="hidden" />
                    <span
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="
                        durationType === 'month'
                          ? 'border-[#0d2b0f] bg-[#0d2b0f]'
                          : 'border-[#c2d4cb] bg-[#f0f4f1]'
                      "
                    >
                      <span
                        v-if="durationType === 'month'"
                        class="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    </span>
                    <span class="text-sm text-[#3d6455]">Specific month</span>
                    <div v-if="durationType === 'month'" class="ml-auto flex gap-2 badge-pop">
                      <select
                        v-model="selectedMonth"
                        class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
                      >
                        <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                      </select>
                      <select
                        v-model="selectedYear"
                        class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
                      >
                        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                      </select>
                    </div>
                  </label>

                  <!-- Semester -->
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="durationType" value="semester" class="hidden" />
                    <span
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="
                        durationType === 'semester'
                          ? 'border-[#0d2b0f] bg-[#0d2b0f]'
                          : 'border-[#c2d4cb] bg-[#f0f4f1]'
                      "
                    >
                      <span
                        v-if="durationType === 'semester'"
                        class="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    </span>
                    <span class="text-sm text-[#3d6455]">Semester</span>
                    <div v-if="durationType === 'semester'" class="ml-auto badge-pop">
                      <select
                        v-model="selectedSemester"
                        class="bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-2 py-1 text-xs text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
                      >
                        <option>1st Semester</option>
                        <option>2nd Semester</option>
                        <option>Summer</option>
                      </select>
                    </div>
                  </label>
                </div>
              </div>

              <div class="h-px bg-[#d4e4da]" />

              <!-- Period Range -->
              <div class="field-animate space-y-1.5" style="animation-delay: 0.36s">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
                  >Period</label
                >
                <div class="flex items-center gap-3">
                  <span
                    class="text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1.5 flex-1 text-center"
                    >{{ todayLabel }}</span
                  >
                  <span class="text-xs text-[#4a7060]">to</span>
                  <span
                    class="text-xs font-medium text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-3 py-1.5 flex-1 text-center"
                    >{{ todayLabel }}</span
                  >
                </div>
              </div>

              <!-- School Year -->
              <div class="field-animate flex items-center gap-3" style="animation-delay: 0.42s">
                <span class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
                  >School year</span
                >
                <span
                  class="ml-auto text-xs font-semibold text-[#0d2b0f] bg-[#e6f2ec] border border-[#a8ccb8] rounded-lg px-4 py-1.5"
                  >2025 — 2026</span
                >
              </div>
            </div>

            <!-- Color Palette -->
            <div
              class="field-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden"
              style="animation-delay: 0.48s"
            >
              <div class="px-6 py-4 border-b border-[#d4e4da]">
                <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">
                  Color Palette
                </p>
              </div>
              <div class="px-6 py-5 space-y-4">
                <div class="relative">
                  <select
                    v-model="selectedPalette"
                    class="w-full bg-[#f0f4f1] border border-[#c2d4cb] rounded-lg px-3 py-2 text-sm text-[#0d2b0f] appearance-none outline-none focus:border-[#0d2b0f] transition-colors"
                  >
                    <option v-for="(_, name) in palettes" :key="name" :value="name">
                      {{ name }}
                    </option>
                  </select>
                  <span
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7060]"
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1l5 5 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <div class="flex gap-2 p-3 bg-[#f0f4f1] rounded-xl border border-[#d4e4da]">
                  <div
                    v-for="(color, i) in palettes[selectedPalette]"
                    :key="color"
                    class="palette-swatch w-8 h-8 rounded-md border border-white/10 flex-1"
                    :style="{ background: color, animationDelay: `${i * 50}ms` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: Chart Options + Palette -->
          <div class="space-y-6">
            <!-- Chart Display Options -->
            <div
              class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden"
              style="animation-delay: 0.2s"
            >
              <div class="px-6 py-4 border-b border-[#d4e4da]">
                <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">
                  Chart Display
                </p>
              </div>
              <div class="px-6 py-5 space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="radio" v-model="chartView" value="separate" class="hidden" />
                  <span
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="
                      chartView === 'separate'
                        ? 'border-[#0d2b0f] bg-[#0d2b0f]'
                        : 'border-[#c2d4cb] bg-[#f0f4f1]'
                    "
                  >
                    <span
                      v-if="chartView === 'separate'"
                      class="w-1.5 h-1.5 rounded-full bg-white"
                    />
                  </span>
                  <span class="text-sm text-[#3d6455]"
                    >Show separate charts for course and year level</span
                  >
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="radio" v-model="chartView" value="single" class="hidden" />
                  <span
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="
                      chartView === 'single'
                        ? 'border-[#0d2b0f] bg-[#0d2b0f]'
                        : 'border-[#c2d4cb] bg-[#f0f4f1]'
                    "
                  >
                    <span v-if="chartView === 'single'" class="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span class="text-sm text-[#3d6455]"
                    >Show single chart for course and year level</span
                  >
                </label>
              </div>
            </div>

            <!-- Sample Chart Panel -->
            <div
              class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] p-6"
              style="animation-delay: 0.3s"
            >
              <div class="flex justify-between mb-3">
                <p class="text-sm font-semibold text-[#0d2b0f]">Sample Chart</p>
                <button
                  @click="downloadChart"
                  class="text-xs px-3 py-1 bg-[#0d2b0f] text-white rounded-lg transition-transform active:scale-95 hover:bg-[#183d1b]"
                >
                  Download
                </button>
              </div>

              <!-- Empty state when no charts generated yet -->
              <div
                v-if="!chartsGenerated"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="w-14 h-14 rounded-2xl bg-[#e6f2ec] border border-[#a8ccb8] flex items-center justify-center mb-3"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a7060"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="10" width="4" height="11" rx="1" />
                    <rect x="10" y="6" width="4" height="15" rx="1" />
                    <rect x="17" y="3" width="4" height="18" rx="1" />
                  </svg>
                </div>
                <p class="text-xs font-semibold text-[#4a7060] uppercase tracking-widest mb-1">
                  No Charts Yet
                </p>
                <p class="text-xs text-[#7a9e90]">
                  Click "Generate Chart" to render the charts with your selected palette.
                </p>
              </div>

              <!-- Charts (shown after generation) -->
              <div v-show="chartsGenerated" class="space-y-6">
                <!-- BAR -->
                <div class="chart-block">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Bar Chart</p>
                  <canvas ref="barCanvas"></canvas>
                </div>

                <!-- PIE -->
                <div class="chart-block">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Pie Chart</p>
                  <canvas ref="pieCanvas"></canvas>
                </div>

                <!-- LINE -->
                <div class="chart-block">
                  <p class="text-xs mb-2 font-semibold text-[#0d2b0f]">Line Chart</p>
                  <canvas ref="lineCanvas"></canvas>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Generate Chart Button -->
              <button
                @click="generateCharts"
                :disabled="isGeneratingCharts"
                class="generate-btn w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 border border-[#a8ccb8] disabled:opacity-60 disabled:cursor-not-allowed"
                :class="
                  isGeneratingCharts
                    ? 'bg-[#d0e8d8] text-[#4a7060]'
                    : 'bg-[#e6f2ec] text-[#0d2b0f] hover:bg-[#d0e8d8] active:scale-[0.98]'
                "
                style="animation-delay: 0.4s"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg
                    v-if="!isGeneratingCharts"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="10" width="4" height="11" rx="1" />
                    <rect x="10" y="6" width="4" height="15" rx="1" />
                    <rect x="17" y="3" width="4" height="18" rx="1" />
                  </svg>
                  <svg
                    v-else
                    class="spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    />
                  </svg>
                  {{ isGeneratingCharts ? 'Generating Charts...' : 'Generate Chart' }}
                </span>
              </button>

              <!-- Generate Report Button -->
              <button
                @click="generateReport"
                :disabled="isGenerating"
                class="generate-btn w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="
                  isGenerating
                    ? 'bg-[#8ab5a0] text-[#3d6455]'
                    : 'bg-[#0d2b0f] text-white hover:bg-[#183d1b] active:scale-[0.98]'
                "
                style="animation-delay: 0.45s"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg
                    v-if="!isGenerating"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <svg
                    v-else
                    class="spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    />
                  </svg>
                  {{ isGenerating ? 'Generating...' : 'Generate Report' }}
                </span>
              </button>
            </div>

            <!-- Progress + Status -->
            <div v-if="isGenerating || statusMsg" class="space-y-2 status-animate">
              <div class="h-1 w-full bg-[#d4e4da] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#0d2b0f] rounded-full transition-all duration-300 ease-out"
                  :style="{ width: progress + '%' }"
                />
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="
                    statusColor === 'green'
                      ? 'bg-[#16a34a]'
                      : statusColor === 'yellow'
                        ? 'bg-[#b45309]'
                        : 'bg-[#0d2b0f]'
                  "
                />
                <span
                  class="text-xs"
                  :class="
                    statusColor === 'green'
                      ? 'text-[#16a34a]'
                      : statusColor === 'yellow'
                        ? 'text-[#b45309]'
                        : 'text-[#0d2b0f]'
                  "
                >
                  {{ statusMsg }}
                </span>
              </div>
            </div>

            <!-- Chart Status -->
            <div v-if="chartStatusMsg" class="space-y-2 status-animate">
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="chartStatusColor === 'green' ? 'bg-[#16a34a]' : 'bg-[#b45309]'"
                />
                <span
                  class="text-xs"
                  :class="chartStatusColor === 'green' ? 'text-[#16a34a]' : 'text-[#b45309]'"
                >
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

// ── Chart Refs ────────────────────────────────────────────────────────────────
const barCanvas = ref<HTMLCanvasElement | null>(null)
const pieCanvas = ref<HTMLCanvasElement | null>(null)
const lineCanvas = ref<HTMLCanvasElement | null>(null)

let barChart: Chart | null = null
let pieChart: Chart | null = null
let lineChart: Chart | null = null

// ── Data ─────────────────────────────────────────────────────────────────────
const departments: Record<string, string[]> = {
  'College of Engineering and Geo Science': [
    'BS Agricultural and Biosystem Engineering',
    'BS Civil Engineering',
    'BS Electronics Engineering',
    'BS Geodetic Engineering',
    'BS Geology',
    'BS Mining Engineering',
    'All',
  ],
  'College of Computing and Information Technology': [
    'BS Information Technology',
    'BS Information System',
    'BS Computer Science',
    'All',
  ],
  'College of Education': [
    'Bachelor of Secondary Education',
    'Bachelor of Elementary Education',
    'All',
  ],
  'College of Mathematics and Natural Sciences': [
    'BS Applied Mathematics',
    'BS Biology',
    'BS Chemistry',
    'BS Marine Biology',
    'BS Mathematics',
    'BS Physics',
    'All',
  ],
  'College of Agriculture and Agri-Industries': ['BS Agriculture', 'All'],
  'College of Forestry and Environmental Sciences': [
    'BS Agroforestry',
    'BS Environmental Science',
    'BS Forestry',
    'All',
  ],
  'College of Humanities and Social Sciences': [
    'AB Sociology',
    'BS Psychology',
    'BS Social Work',
    'All',
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
    'PHD in Science Education',
    'All',
  ],
}

const palettes: Record<string, string[]> = {
  Pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D7BAFF', '#FFB3E6'],
  Vivid: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#FF2D55'],
  Monochrome: ['#F5F5F5', '#DCDCDC', '#C0C0C0', '#A0A0A0', '#787878', '#505050', '#282828'],
  Ocean: ['#CAF0F8', '#90E0EF', '#48CAE4', '#00B4D8', '#0096C7', '#0077B6', '#023E8A'],
  Sunset: ['#FFCA3A', '#FF924C', '#FF595E', '#C9184A', '#9D0208', '#6A040F', '#370617'],
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const years = ['2024', '2025', '2026', '2027']

// ── State ────────────────────────────────────────────────────────────────────
const router = useRouter()

const selectedDept = ref('')
const selectedCourse = ref('')
const durationType = ref<'day' | 'month' | 'semester'>('day')
const selectedMonth = ref('March')
const selectedYear = ref('2026')
const selectedSemester = ref('1st Semester')
const chartView = ref<'separate' | 'single'>('separate')
const selectedPalette = ref('Pastel')

const isGenerating = ref(false)
const isGeneratingCharts = ref(false)
const chartsGenerated = ref(false)
const progress = ref(0)
const statusMsg = ref('')
const statusColor = ref<'blue' | 'yellow' | 'green'>('blue')
const chartStatusMsg = ref('')
const chartStatusColor = ref<'green' | 'yellow'>('green')

// ── Computed ─────────────────────────────────────────────────────────────────
const availableCourses = computed(() => (selectedDept.value ? departments[selectedDept.value] : []))

const todayLabel = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

// ── Methods ───────────────────────────────────────────────────────────────────

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/admin/attendance')
  }
}

function onDeptChange() {
  selectedCourse.value = ''
}

// Generate Charts
async function generateCharts() {
  isGeneratingCharts.value = true
  chartStatusMsg.value = ''

  // Wait for DOM to be ready (in case charts were hidden)
  await nextTick()

  try {
    const colors = palettes[selectedPalette.value] as string[]

    // Destroy existing chart instances to avoid "canvas already in use" error
    barChart?.destroy()
    pieChart?.destroy()
    lineChart?.destroy()
    barChart = null
    pieChart = null
    lineChart = null

    const labels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
    const data = [42, 67, 55, 80, 38]

    // ── BAR CHART ─────────────────────────────────────────────────────────
    if (barCanvas.value) {
      barChart = new Chart(barCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Library Visits',
              data,
              backgroundColor: colors.slice(0, 5),
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 0 }, // Disable animation so canvas is ready immediately for PDF
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
          },
        },
      })
    }

    // ── PIE CHART ─────────────────────────────────────────────────────────
    if (pieCanvas.value) {
      pieChart = new Chart(pieCanvas.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors.slice(0, 5),
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 0 }, // Disable animation so canvas is ready immediately for PDF
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 10 } },
            },
          },
        },
      })
    }

    // ── LINE CHART ────────────────────────────────────────────────────────
    if (lineCanvas.value) {
      lineChart = new Chart(lineCanvas.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Library Visits',
              data,
              borderColor: colors[0],
              backgroundColor: colors[0] + '33',
              pointBackgroundColor: colors.slice(0, 5),
              pointRadius: 5,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 0 }, // Disable animation so canvas is ready immediately for PDF
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
          },
        },
      })
    }

    chartsGenerated.value = true
    chartStatusMsg.value = 'Charts generated successfully.'
    chartStatusColor.value = 'green'
  } catch (err) {
    console.error(err)
    chartStatusMsg.value = 'Failed to generate charts.'
    chartStatusColor.value = 'yellow'
  } finally {
    isGeneratingCharts.value = false
  }
}

// Download button just triggers full report generation
async function downloadChart() {
  await generateReport()
}

async function generateReport() {
  if (!selectedDept.value) {
    statusMsg.value = 'Please select a department first.'
    statusColor.value = 'yellow'
    progress.value = 0
    return
  }

  if (!selectedCourse.value) {
    statusMsg.value = 'Please select a course first.'
    statusColor.value = 'yellow'
    progress.value = 0
    return
  }

  isGenerating.value = true
  statusMsg.value = 'Preparing charts...'
  statusColor.value = 'blue'
  progress.value = 5

  // ── AUTO-GENERATE CHARTS IF NOT YET DONE ─────────────────────────────────
  // This ensures charts always exist in the PDF even if user skipped the button
  if (!chartsGenerated.value) {
    await generateCharts()
    // Small delay to make sure canvas is fully rendered before toDataURL()
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  statusMsg.value = 'Generating PDF report...'
  progress.value = 15

  try {
    const doc = new jsPDF('l', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth() // 297mm
    const pageHeight = doc.internal.pageSize.getHeight() // 210mm

    const extractedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const extractedTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })

    // ── WHITE BACKGROUND ────────────────────────────────────────────────────
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    doc.setTextColor(40, 40, 40)
    doc.setDrawColor(120, 120, 120)
    doc.setLineWidth(0.4)

    // ── LOGO PLACEHOLDER ────────────────────────────────────────────────────
    const logoX = 12,
      logoY = 8,
      logoW = 20,
      logoH = 20
    doc.rect(logoX, logoY, logoW, logoH)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('LOGO', logoX + logoW / 2, logoY + 11, { align: 'center' })

    // ── HEADER TEXT ─────────────────────────────────────────────────────────
    doc.setTextColor(40, 40, 40)
    doc.setFont('times', 'bold')
    doc.setFontSize(18)
    doc.text('Caraga State University', 38, 16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('Ampayon, Butuan City', 38, 23)

    // Extracted date/time (right side)
    doc.setFont('times', 'bold')
    doc.setFontSize(11)
    doc.text(`Extracted: ${extractedDate}`, pageWidth - 10, 14, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(extractedTime, pageWidth - 10, 21, { align: 'right' })

    // Sub-header info line
    doc.setFont('times', 'normal')
    doc.setFontSize(8.5)
    const headerLine = `College: ${selectedDept.value}  |  Program: ${selectedCourse.value}  |  Month: ${selectedMonth.value}  |  Year: ${selectedYear.value}  |  School Year: 2025–2026`
    doc.text(headerLine, 38, 30)

    // Divider line
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.line(12, 33, pageWidth - 12, 33)

    progress.value = 30

    // ── CHART IMAGES ────────────────────────────────────────────────────────
    // Layout: 3 charts side-by-side in landscape A4
    // Usable width: 297 - 24 margins = 273mm split into 3
    const chartStartY = 37
    const chartH = 90 // height of each chart in mm
    const chartW = 87 // width of each chart in mm
    const chartGap = 4 // gap between charts in mm
    const chartStartX = 12 // left margin

    const chartConfigs = [
      { canvas: barCanvas.value, label: 'Bar Chart' },
      { canvas: pieCanvas.value, label: 'Pie Chart' },
      { canvas: lineCanvas.value, label: 'Line Chart' },
    ]

    chartConfigs.forEach(({ canvas, label }, i) => {
      const x = chartStartX + i * (chartW + chartGap)

      // Chart label above
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(40, 40, 40)
      doc.text(label, x + chartW / 2, chartStartY - 1, { align: 'center' })

      if (canvas) {
        // Export canvas to PNG and embed in PDF
        const imgData = canvas.toDataURL('image/png', 1.0)
        doc.addImage(imgData, 'PNG', x, chartStartY, chartW, chartH)
      } else {
        // Fallback placeholder if canvas not available
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.rect(x, chartStartY, chartW, chartH)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(160, 160, 160)
        doc.text('Chart not available', x + chartW / 2, chartStartY + chartH / 2, {
          align: 'center',
        })
      }

      // Thin border around chart image
      doc.setDrawColor(210, 210, 210)
      doc.setLineWidth(0.2)
      doc.rect(x, chartStartY, chartW, chartH)
    })

    progress.value = 65

    // ── DESCRIPTION / LEGEND PANEL (below charts) ───────────────────────────
    const descY = chartStartY + chartH + 6
    const descH = pageHeight - descY - 10
    const descX = 12
    const descW = pageWidth - 24

    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.rect(descX, descY, descW, descH)

    // Section label
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    doc.text('Report Description', descX + 3, descY + 5)

    // Divider inside description box
    doc.setDrawColor(200, 200, 200)
    doc.line(descX + 1, descY + 7, descX + descW - 1, descY + 7)

    // Description text
    const description =
      `This report presents the library visit data for ${selectedCourse.value} under the ${selectedDept.value}. ` +
      `The data covers ${durationType.value === 'day' ? todayLabel.value : durationType.value === 'month' ? `${selectedMonth.value} ${selectedYear.value}` : selectedSemester.value} ` +
      `for Academic Year 2025–2026. The bar chart shows visits by year level, the pie chart shows proportional distribution, ` +
      `and the line chart illustrates the trend across year levels.`

    doc.setFont('times', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(40, 40, 40)
    const wrappedDesc = doc.splitTextToSize(description, descW - 6)
    doc.text(wrappedDesc, descX + 3, descY + 12)

    // Legend swatches (color palette used)
    const colors = palettes[selectedPalette.value] ?? []
    const swatchY = descY + 11
    const swatchStart = descX + descW - 110
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(80, 80, 80)
    doc.text('Palette:', swatchStart, swatchY)

    colors.slice(0, 5).forEach((hex, ci) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      doc.setFillColor(r, g, b)
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.2)
      doc.roundedRect(swatchStart + 14 + ci * 8, swatchY - 4, 6, 6, 1, 1, 'FD')
    })

    progress.value = 90

    // ── FOOTER ──────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text('Generated by ACCESS — Library Management System', pageWidth / 2, pageHeight - 4, {
      align: 'center',
    })

    progress.value = 100

    doc.save('Library_Report.pdf')

    isGenerating.value = false
    statusMsg.value = 'PDF report generated successfully.'
    statusColor.value = 'green'
  } catch (error) {
    console.error(error)
    isGenerating.value = false
    statusMsg.value = 'Failed to generate PDF report.'
    statusColor.value = 'yellow'
    progress.value = 0
  }
}
</script>

<style scoped>
.report-root {
  font-family: 'Poppins', sans-serif;
}

/* ─── BREADCRUMB ─── */
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

/* ─── HERO TITLE ─── */
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
.hero-word-dark {
  color: #0d2b0f;
}
.hero-word-gold {
  color: #e6a800;
}
.hero-underlined {
  position: relative;
  display: inline-block;
}
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 5px;
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

/* ─── PANEL ENTRANCE ─── */
.panel-animate {
  opacity: 0;
  animation: panelIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── FIELD ENTRANCE ─── */
.field-animate {
  opacity: 0;
  animation: fieldIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fieldIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ─── PALETTE SWATCH POP ─── */
.palette-swatch {
  animation: swatchPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes swatchPop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ─── RADIO BADGE POP ─── */
.badge-pop {
  animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes badgePop {
  from {
    opacity: 0;
    transform: scale(0.8) translateX(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

/* ─── CHART BLOCK REVEAL ─── */
.chart-block {
  opacity: 0;
  animation: chartReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
@keyframes chartReveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── GENERATE BUTTON ─── */
.generate-btn {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
}

/* ─── STATUS ANIMATE ─── */
.status-animate {
  animation: fadeIn 0.3s ease both;
}

/* ─── SPINNER ─── */
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ─── KEYFRAMES ─── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes underlineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
