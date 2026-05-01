<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <!-- Header and sub-head -->
    <transition name="page-intro">
      <main class="report-root flex-1 overflow-y-auto">
        <header class="report-header intro-header">
          <div class="header-left">
            <div class="header-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>Analytics</span>
            </div>
            <h1 class="header-title intro-title">
              Library <span class="text-yellow-500">Analytics</span>
            </h1>
            <p class="header-sub">
              Comprehensive overview of institutional engagement and borrowing patterns
            </p>
          </div>
          <div class="header-right">
            <button class="export-btn" @click="exportData">Export CSV</button>
          </div>
        </header>

        <!-- Card -->
        <div class="kpi-strip">
          <div
            v-for="(kpi, i) in kpis"
            :key="kpi.label"
            class="kpi-card"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >
            <div class="kpi-icon" :style="{ background: `${kpi.color}18`, color: kpi.color }">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                v-html="kpi.icon"
              ></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">{{ kpi.label }}</span>
              <div class="kpi-value-row">
                <span class="kpi-value">{{ kpi.value }}</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 32" preserveAspectRatio="none">
                <polyline
                  :points="kpi.spark"
                  fill="none"
                  :stroke="kpi.color"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  opacity="0.7"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Borrowing Trend card -->
        <div class="main-grid">
          <div class="col-left">
            <div class="panel panel--chart">
              <div class="panel-head">
                <div>
                  <h2 class="panel-title">Borrowing Trend</h2>
                  <p class="panel-sub">
                    Engagement metrics — {{ activeChartTab.toLowerCase() }} view
                  </p>
                </div>
                <div class="chart-tabs">
                  <button
                    v-for="tab in chartTabs"
                    :key="tab"
                    @click="activeChartTab = tab"
                    :class="['chart-tab', activeChartTab === tab ? 'chart-tab--active' : '']"
                  >
                    {{ tab }}
                  </button>
                </div>
              </div>

              <div class="bar-chart">
                <div class="bar-grid">
                  <span v-for="g in chartYAxis" :key="g" class="bar-grid-label">{{ g }}</span>
                </div>
                <div class="bars-wrap">
                  <div
                    v-for="(bar, i) in barData"
                    :key="bar.label + activeChartTab"
                    class="bar-col"
                    :style="{ animationDelay: `${i * 0.06}s` }"
                  >
                    <div
                      class="bar-tooltip"
                      style="font-size: 0.9rem; font-weight: bold; display: none"
                    >
                      {{ bar.value }}
                    </div>
                    <div
                      class="bar"
                      :class="bar.highlight ? 'bar--highlight' : ''"
                      :style="{ height: `${(bar.value / maxChartValue) * 100}%` }"
                    ></div>
                    <span class="bar-label">{{ bar.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Library Analytics -->
            <div class="panel panel--table">
              <div class="panel-head">
                <div>
                  <h2 class="panel-title">Library Analytics</h2>
                  <p class="panel-sub">
                    Rankings based on {{ activeRankingTab.toLowerCase() }} activity
                  </p>
                </div>
                <div class="chart-tabs">
                  <button
                    v-for="tab in rankingTabs"
                    :key="tab.id"
                    @click="activeRankingTab = tab.id"
                    :class="['chart-tab', activeRankingTab === tab.id ? 'chart-tab--active' : '']"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>

              <div class="table-wrap">
                <table class="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{{ currentRankingData.headerName }}</th>
                      <th>{{ currentRankingData.headerMeta }}</th>
                      <th>Total Loans</th>
                    </tr>
                  </thead>
                  <tbody :key="activeRankingTab" class="fade-in-group">
                    <tr
                      v-for="(row, i) in currentRankingData.data"
                      :key="row.name"
                      class="table-row-animate"
                    >
                      <td class="rank-cell">
                        <span class="rank" :class="i < 3 ? `rank--${i + 1}` : ''">{{ i + 1 }}</span>
                      </td>
                      <td class="name-cell">{{ row.name }}</td>
                      <td class="floor-cell">
                        <span class="floor-tag">{{ row.meta }}</span>
                      </td>
                      <td class="visitors-cell">{{ row.value.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="panel-footer" style="display: flex; gap: 10px">
                <button class="report-add-section-btn">
                  <RouterLink
                    to="/admin/analytics/display"
                    class="w-full h-full block text-inherit no-underline"
                  >
                    View Detailed {{ activeRankingTab }} Analytics
                  </RouterLink>
                </button>
                <button class="report-add-section-btn">
                  <RouterLink
                    to="/admin/analytics/add"
                    class="w-full h-full block text-inherit no-underline"
                  >
                    Add/Edit Ranking Categories
                  </RouterLink>
                </button>
                <button class="report-add-section-btn">
                  <RouterLink
                    to="/admin/analytics/books"
                    class="w-full h-full block text-inherit no-underline"
                  >
                    View Book Analytics
                  </RouterLink>
                </button>
              </div>
            </div>
          </div>

          <!-- Circle Chart -->
          <div class="col-right">
            <div class="panel panel--donut">
              <div class="panel-head panel-head--center">
                <div class="text-center">
                  <h2 class="panel-title">Engagement Spread</h2>
                  <p class="panel-sub">Top {{ activeDonutFilter.toLowerCase() }} ratio</p>
                </div>
                <div class="chart-tabs">
                  <button
                    v-for="f in donutFilters"
                    :key="f"
                    @click="activeDonutFilter = f"
                    :class="['chart-tab', activeDonutFilter === f ? 'chart-tab--active' : '']"
                  >
                    {{ f }}
                  </button>
                </div>
              </div>
              <div class="donut-area">
                <svg class="donut-svg" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#f0ede7" stroke-width="22" />
                  <circle
                    v-for="(seg, i) in filteredDonutSegments"
                    :key="i"
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    :stroke="seg.color"
                    stroke-width="22"
                    :stroke-dasharray="`${seg.dash} ${377 - seg.dash}`"
                    :stroke-dashoffset="seg.offset"
                    stroke-linecap="round"
                    class="donut-segment"
                  />
                  <text
                    x="80"
                    y="76"
                    text-anchor="middle"
                    font-size="20"
                    font-weight="900"
                    fill="#0d2b0f"
                  >
                    {{ currentDonutData.totalLabel }}
                  </text>
                  <text
                    x="80"
                    y="94"
                    text-anchor="middle"
                    font-size="8"
                    font-weight="700"
                    fill="rgba(13,43,15,0.45)"
                    letter-spacing="1"
                  >
                    TOTAL LOANS
                  </text>
                </svg>
                <div class="donut-legend">
                  <div v-for="seg in filteredDonutSegments" :key="seg.label" class="legend-row">
                    <span class="legend-dot" :style="{ background: seg.color }"></span>
                    <span class="legend-label">{{ seg.label }}</span>
                    <span class="legend-pct">{{ seg.pct }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import '@/assets/styles/report-analytics.css'

type RankingTab = 'Borrowers' | 'Colleges' | 'Departments'
type ChartTab = 'Weekly' | 'Monthly' | 'Yearly'
type DonutFilter = 'Students' | 'Colleges' | 'Programs'

// --- Navigation ---
const activeTab = ref('REPORTS')
const activeChartTab = ref<ChartTab>('Monthly')
const chartTabs: ChartTab[] = ['Weekly', 'Monthly', 'Yearly']

const handleTabChange = (tab: string) => {
  activeTab.value = tab
}

// --- KPI Data ---
const kpis = [
  {
    label: 'Active Borrowers',
    value: '284',
    up: true,
    color: '#1b5e20',
    spark: '4,28 16,20 28,24 40,12 52,18 64,8 76,14',
    icon: '<path d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m0 0A4 4 0 1112 8a4 4 0 01-3 3.87z"/>',
  },
  {
    label: 'Total Books',
    value: '3,842',
    up: true,
    color: '#0277bd',
    spark: '4,22 16,18 28,14 40,10 52,8 64,6 76,4',
    icon: '<path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>',
  },
  {
    label: 'Books Loaned',
    value: '392',
    up: true,
    color: '#f9a825',
    spark: '4,26 16,22 28,18 40,14 52,20 64,10 76,16',
    icon: '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-4.5 1.253"/>',
  },
  {
    label: 'Total Visitor',
    value: '2,112',
    up: false,
    color: '#c62828',
    spark: '4,10 16,14 28,12 40,18 52,14 64,20 76,16',
    icon: '<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
  },
]

// --- BORROWING TREND LOGIC ---
interface TrendEntry {
  label: string
  value: number
  highlight?: boolean
}

const trendData: Record<ChartTab, TrendEntry[]> = {
  Weekly: [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 65, highlight: true },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 20 },
    { label: 'Sun', value: 15 },
  ],
  Monthly: [
    { label: 'Aug', value: 280 },
    { label: 'Sep', value: 420 },
    { label: 'Oct', value: 390 },
    { label: 'Nov', value: 465 },
    { label: 'Dec', value: 210 },
    { label: 'Jan', value: 350 },
    { label: 'Feb', value: 480, highlight: true },
    { label: 'Mar', value: 415 },
  ],
  Yearly: [
    { label: '2022', value: 2400 },
    { label: '2023', value: 3100 },
    { label: '2024', value: 4200, highlight: true },
    { label: '2025', value: 3800 },
  ],
}

const barData = computed(() => trendData[activeChartTab.value])

const maxChartValue = computed(() => {
  const values = barData.value.map((d) => d.value)
  return Math.max(...values) * 1.2
})

const chartYAxis = computed(() => {
  const max = Math.ceil(maxChartValue.value / 100) * 100
  return [max, max * 0.75, max * 0.5, max * 0.25, 0].map((v) => Math.floor(v))
})

// --- Consolidated Ranking Logic ---
const activeRankingTab = ref<RankingTab>('Borrowers')

const rankingTabs: { id: RankingTab; label: string }[] = [
  { id: 'Borrowers', label: 'Students' },
  { id: 'Colleges', label: 'Colleges' },
  { id: 'Departments', label: 'Programs' },
]

const rankingsData: Record<
  RankingTab,
  {
    headerName: string
    headerMeta: string
    data: { name: string; meta: string; value: number }[]
  }
> = {
  Borrowers: {
    headerName: 'Student Name',
    headerMeta: 'ID Number',
    data: [
      { name: 'Juan Dela Cruz', meta: '20-1042', value: 42 },
      { name: 'Maria Santos', meta: '21-0854', value: 38 },
      { name: 'Petrus Fontanilla', meta: '19-1231', value: 31 },
      { name: 'Ana Reyes', meta: '22-0045', value: 29 },
    ],
  },
  Colleges: {
    headerName: 'College',
    headerMeta: 'Code',
    data: [
      { name: 'College of Engineering', meta: 'CEGS', value: 1240 },
      { name: 'College of Computing', meta: 'CCIS', value: 980 },
      { name: 'College of Education', meta: 'CED', value: 850 },
      { name: 'College of Agriculture', meta: 'CAA', value: 640 },
    ],
  },
  Departments: {
    headerName: 'Program',
    headerMeta: 'Dept',
    data: [
      { name: 'BS Information Technology', meta: 'BSIT', value: 740 },
      { name: 'BS Civil Engineering', meta: 'BSCE', value: 520 },
      { name: 'BS Psychology', meta: 'BS PSYCH', value: 410 },
      { name: 'BS Computer Science', meta: 'BSCS', value: 390 },
    ],
  },
}

const currentRankingData = computed(() => rankingsData[activeRankingTab.value])

const exportData = () => {
  alert(`Exporting ${activeRankingTab.value} report as CSV...`)
}

// --- Doughnut Filter Logic ---
const activeDonutFilter = ref<DonutFilter>('Students')
const donutFilters: DonutFilter[] = ['Students', 'Colleges', 'Programs']

interface DonutSegment {
  label: string
  pct: number
  color: string
}

interface DonutData {
  totalLabel: string
  segments: DonutSegment[]
}

const donutDataMap: Record<DonutFilter, DonutData> = {
  Students: {
    totalLabel: '392',
    segments: [{ label: 'Total Borrowers', pct: 100, color: '#1b5e20' }],
  },
  Colleges: {
    totalLabel: '392',
    segments: [
      { label: 'CEIT', pct: 40, color: '#1b5e20' },
      { label: 'CAS', pct: 30, color: '#0277bd' },
      { label: 'CED', pct: 20, color: '#f9a825' },
      { label: 'COA', pct: 10, color: '#6a1b9a' },
    ],
  },
  Programs: {
    totalLabel: '392',
    segments: [
      { label: 'BSIT', pct: 50, color: '#1b5e20' },
      { label: 'BSCE', pct: 25, color: '#0277bd' },
      { label: 'BSED', pct: 25, color: '#f9a825' },
    ],
  },
}

const currentDonutData = computed(() => donutDataMap[activeDonutFilter.value])
const circumference = 2 * Math.PI * 60

const filteredDonutSegments = computed(() => {
  const segs = currentDonutData.value.segments
  let cum = 0
  return segs.map((s) => {
    const dash = (s.pct / 100) * circumference
    const offset = -(cum / 100) * circumference + circumference / 4
    cum += s.pct
    return { ...s, dash, offset }
  })
})
</script>
