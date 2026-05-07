<template>
  <div class="page-shell">
    <Sidebar :activeTab="'ATTENDANCE'" @updateActiveTab="handleTabChange" />

    <div class="page-scroll">
      <header class="attn-header">
        <div class="space-y-4">
          <div class="relative group">
            <div class="header-breadcrumb mb-2!">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>ATTENDANCE</span>
            </div>
            <h1 class="hero-title">
              <span class="hero-word-dark hero-underlined">Library</span>
              <span class="hero-word-gold"> Attendance</span>
            </h1>
            <p class="hero-subtitle">
              Comprehensive overview of institutional engagement and borrowing patterns
            </p>
          </div>
        </div>
      </header>

     <div class="stat-strip">
  <div
    v-for="(s, i) in quickStats"
    :key="s.label"
    class="qstat"
    :style="{ animationDelay: 0.25 + i * 0.08 + 's' }"
  >
    <div class="qstat-icon" v-html="s.icon"></div>
    <div>
      <p class="qstat-val">{{ s.val }}</p>
      <p class="qstat-label">{{ s.label }}</p>
      
      <!-- Gender Breakdown  -->
      <div v-if="s.gender" class="qstat-gender-mini">
        <span class="m-text">♂ {{ s.gender.male }}</span>
        <!-- <span class="divider">|</span> -->
        <span class="f-text">♀ {{ s.gender.female }}</span>
      </div>
    </div>

    <span class="qstat-badge" :class="s.up ? 'qstat-badge--up' : 'qstat-badge--dn'">
      {{ s.delta }}
    </span>
  </div>
</div>

      

      <div class="main-grid">
        <div class="dial-card enhanced">
          <div class="dial-card__header">
            <span class="section-eyebrow">Live Attendance</span>
            <span class="live-chip"><span class="live-dot"></span>LIVE</span>
          </div>

          <div class="gauge-wrap">
            <svg viewBox="0 0 320 320" class="gauge-svg">
              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="rgba(13,43,15,0.05)"
                stroke-width="20"
              />

              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="url(#gaugeGrad)"
                stroke-width="20"
                stroke-linecap="round"
                :stroke-dasharray="754"
                :stroke-dashoffset="754 - (754 * gaugeFillPercent) / 100"
                transform="rotate(-90 160 160)"
                class="gauge-arc"
              />

              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="url(#gaugeGlow)"
                stroke-width="28"
                stroke-linecap="round"
                :stroke-dasharray="754"
                :stroke-dashoffset="754 - (754 * gaugeFillPercent) / 100"
                transform="rotate(-90 160 160)"
                class="gauge-glow"
              />

              <defs>
                <linearGradient id="gaugeGrad">
                  <stop offset="0%" stop-color="#f9a825" />
                  <stop offset="100%" stop-color="#0d2b0f" />
                </linearGradient>

                <linearGradient id="gaugeGlow">
                  <stop offset="0%" stop-color="#f9a825" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#0d2b0f" stop-opacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            <div class="gauge-center">
              <div class="gauge-num">
                <span class="gauge-pct">{{ gaugeCount }}</span>
              </div>

              <span class="gauge-sublabel">STUDENTS TODAY</span>

              <span
                class="gauge-status"
                :class="{
                  low: gaugeCount <= 10,
                  mid: gaugeCount > 10 && gaugeCount <= 30,
                  high: gaugeCount > 30,
                }"
              >
                {{ gaugeStatus }}
              </span>
            </div>
          </div>

          <div class="flow-row">
            <div class="flow-col">
              <div class="flow-bar-wrap">
                <div class="flow-bar flow-bar--in" :style="{ width: incomingBarWidth }"></div>
              </div>
              <div class="flow-info">
                <span class="flow-label">Incoming</span>
                <span class="flow-num flow-num--in">{{ visitorsToday }}</span>
              </div>
            </div>

            <div class="flow-divider"></div>

            <div class="flow-col">
              <div class="flow-bar-wrap">
                <div class="flow-bar flow-bar--out" :style="{ width: outgoingBarWidth }"></div>
              </div>
              <div class="flow-info">
                <span class="flow-label">Outgoing</span>
                <span class="flow-num flow-num--out">{{ outgoing }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="controls-col">
          <div class="ctrl-header">
            <div>
              <p class="ctrl-eyebrow">Data Orchestration</p>
              <h3 class="ctrl-title">Attendance <em>Overview</em></h3>
              <p class="ctrl-sub">All export data</p>
            </div>
          </div>

          <div class="export-card">
            <div class="ecard-top">
              <div>
                <p class="ecard-eyebrow">Export History</p>
                <h4 class="ecard-title">Recent Exports</h4>
              </div>
              <span class="ecard-count">{{ exportLogs.length }} records</span>
            </div>

            <div class="etable-wrap">
              <table class="etable">
                <thead>
                  <tr>
                    <th>Date Exported</th>
                    <th>File Type</th>
                    <th>Exported By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="exportLogs.length === 0" class="erow">
                    <td colspan="4" class="empty-state-cell">No export history found.</td>
                  </tr>

                  <tr
                    v-for="(log, i) in exportLogs"
                    :key="log.id"
                    class="erow"
                    :style="{ animationDelay: 0.6 + i * 0.07 + 's' }"
                  >
                    <td class="erow-date">
                      <span class="erow-date__main">{{ log.date }}</span>
                      <span class="erow-date__time">{{ log.time }}</span>
                    </td>
                    <td>
                      <span :class="['etype-badge', 'etype-badge--' + log.typeClass]">
                        {{ log.type }}
                      </span>
                    </td>
                    <td class="erow-user">
                      <div class="erow-avatar">{{ log.user.charAt(0) }}</div>
                      <span>{{ log.user }}</span>
                    </td>
                    <td>
                      <span :class="['estatus', 'estatus--' + log.statusClass]">
                        <span class="estatus-dot"></span>{{ log.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentInfo = {
  id_number: string
  first_name: string
  middle_name?: string | null
  last_name: string
  program: string | null
  college: string | null
  year_level: number | string | null
}

type ExportBatchRow = {
  id: string
  file_name: string | null
  file_type: string | null
  uploaded_at: string | null
  row_count: number | null
  status: string | null
  exported_by_name: string | null
}

type ExportLogView = {
  id: string
  date: string
  time: string
  type: string
  typeClass: string
  user: string
  status: string
  statusClass: string
  rowCount: number
  fileName: string
}

// ─── State ────────────────────────────────────────────────────────────────────

const loading = ref(false)
const exportLogs = ref<ExportLogView[]>([])

// Real-time Counters (Today)
const totalLibraryVisits = ref(0) // Monthly Total
const totalOverallVisits = ref(0) // Monthly total (Library + Event + visitor)
const visitorsTodayCount = ref(0)
const outgoingCount = ref(0)
const currentlyInsideCount = ref(0)
const averageStayDurationText = ref('—')


const totalEventVisits = ref(0)
const totalVisitorVisits = ref(0)


// Analytics (Monthly)
const topPeakHour = ref<{ label: string; visits: number } | null>(null)
const topPeakDay = ref<{ day: string; visits: number } | null>(null)
const topCollege = ref<{ name: string; visits: number } | null>(null)
const topProgram = ref<{ name: string; visits: number } | null>(null)
const topYearLevel = ref<{ name: string; visits: number } | null>(null)


const genderBreakdown = ref({
  library: { male: 0, female: 0 },
  event: { male: 0, female: 0 },
  overall: { male: 0, female: 0 }
})

let analyticsRunId = 0
let liveChannel: ReturnType<typeof supabase.channel> | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

// ─── Date Helpers ─────────────────────────────────────────────────────────────

const getTodayPH = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())

const getPHDateRangeForToday = () => {
  const today = getTodayPH()
  return { start: `${today}T00:00:00+08:00`, end: `${today}T23:59:59+08:00` }
}

const getThisMonthRange = () => {
  const now = new Date()
  // First day of current month 
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  return { firstDay }
}

const getDateObject = (value: string | null) => {
  if (!value) return null
  const dt = new Date(value)
  return Number.isNaN(dt.getTime()) ? null : dt
}

const getHour = (value: string | null) => {
  const dt = getDateObject(value)
  if (!dt) return null
  return Number(new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila', hour: '2-digit', hour12: false,
  }).format(dt))
}

const getDayName = (value: string | null) => {
  const dt = getDateObject(value)
  if (!dt) return 'Unknown'
  return dt.toLocaleDateString('en-US', { timeZone: 'Asia/Manila', weekday: 'long' })
}

const formatHourLabel = (hour: number) => {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:00 ${suffix}`
}

const getDurationMinutes = (log: any) => {
  if (typeof log.duration_minutes === 'number' && log.duration_minutes > 0) return log.duration_minutes
  const timeIn = getDateObject(log.time_in)
  const timeOut = getDateObject(log.time_out)
  if (!timeIn || !timeOut) return 0
  const diff = timeOut.getTime() - timeIn.getTime()
  return diff < 0 ? 0 : Math.round(diff / 60000)
}

const normalizeStudent = (s: any): StudentInfo | null =>
  Array.isArray(s) ? s[0] || null : s || null

// ─── Data Fetching ───────────────────────────────────────────────────────────

const fetchLiveCountsOptimized = async () => {
  const { start, end } = getPHDateRangeForToday()
  const { firstDay } = getThisMonthRange()

  const [libData, evtData, visRes, todayRes] = await Promise.all([
    // Fetch Library with Student Gender
    supabase.from('attendance_logs')
      .select('students(gender)')
      .eq('attendance_type', 'library')
      .gte('time_in', firstDay),
    
    // Fetch Event with Student Gender
    supabase.from('attendance_logs')
      .select('students(gender)')
      .eq('attendance_type', 'event')
      .gte('time_in', firstDay),

    // Visitors (Monthly)
    supabase.from('attendance_logs_visitors').select('id', { count: 'exact', head: true }).gte('time_in', firstDay),

    // Today's Library Activity
    supabase.from('attendance_logs').select('time_in, time_out').eq('attendance_type', 'library').gte('time_in', start)
  ])

  // Helper function 
  const countGender = (data: any[]) => {
    return data.reduce((acc, curr) => {
      const g = curr.students?.gender?.toLowerCase()
      if (g === 'male') acc.male++
      else if (g === 'female') acc.female++
      return acc
    }, { male: 0, female: 0 })
  }

  // Assign Counts
  const libGenders = countGender(libData.data || [])
  const evtGenders = countGender(evtData.data || [])
  
  genderBreakdown.value.library = libGenders
  genderBreakdown.value.event = evtGenders
  genderBreakdown.value.overall = {
    male: libGenders.male + evtGenders.male,
    female: libGenders.female + evtGenders.female
  }

  totalLibraryVisits.value = libData.data?.length || 0
  totalEventVisits.value = evtData.data?.length || 0
  totalVisitorVisits.value = visRes.count || 0
  totalOverallVisits.value = totalLibraryVisits.value + totalEventVisits.value + totalVisitorVisits.value

  // Today's Gauge logic...
  const rows = todayRes.data ?? []
  visitorsTodayCount.value = rows.length
  currentlyInsideCount.value = rows.filter(r => r.time_out === null).length
  outgoingCount.value = rows.filter(r => r.time_out !== null).length
}

const fetchAnalyticsOptimized = async () => {
  const runId = ++analyticsRunId
  const { firstDay } = getThisMonthRange()
  loading.value = true

  try {
    let totalDuration = 0
    let durationCount = 0

    const hourMap: Record<number, number> = {}
    const dayMap: Record<string, number> = {}
    const collegeMap: Record<string, number> = {}
    const programMap: Record<string, number> = {}
    const yearLevelMap: Record<string, number> = {}

    const batchSize = 1000
    let from = 0

    while (true) {
      if (runId !== analyticsRunId) return

      const { data, error } = await supabase
        .from('attendance_logs')
        .select(`
          time_in, time_out, duration_minutes,
          students!attendance_logs_student_id_fkey (college, program, year_level)
        `)
        .eq('attendance_type', 'library')
        .gte('time_in', firstDay) // FILTER: This Month Only
        .order('time_in', { ascending: false })
        .range(from, from + batchSize - 1)

      if (error) break
      const rows = data ?? []

      for (const item of rows as any[]) {
        const student = normalizeStudent(item.students)
        const duration = getDurationMinutes(item)

        if (duration > 0) { totalDuration += duration; durationCount++ }

        const hour = getHour(item.time_in)
        if (hour !== null) hourMap[hour] = (hourMap[hour] || 0) + 1

        const day = getDayName(item.time_in)
        dayMap[day] = (dayMap[day] || 0) + 1

        const college = String(student?.college || 'Unknown')
        const program = String(student?.program || 'Unknown')
        const yearLevel = String(student?.year_level || 'Unknown')

        collegeMap[college] = (collegeMap[college] || 0) + 1
        programMap[program] = (programMap[program] || 0) + 1
        yearLevelMap[yearLevel] = (yearLevelMap[yearLevel] || 0) + 1
      }

      // Update Averages
      if (durationCount > 0) {
        const avg = Math.round(totalDuration / durationCount)
        const hrs = Math.floor(avg / 60)
        const mins = avg % 60
        averageStayDurationText.value = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`
      }

      // Helper to find Top Key
      const topOf = (map: Record<string, number>, keyAs: string) =>
        Object.entries(map)
          .map(([k, v]) => ({ [keyAs]: k, visits: v } as any))
          .sort((a, b) => b.visits - a.visits)[0] ?? null

      topPeakHour.value = Object.entries(hourMap)
        .map(([h, v]) => ({ label: formatHourLabel(Number(h)), visits: v }))
        .sort((a, b) => b.visits - a.visits)[0] ?? null

      topPeakDay.value = topOf(dayMap, 'day')
      topCollege.value = topOf(collegeMap, 'name')
      topProgram.value = topOf(programMap, 'name')
      topYearLevel.value = topOf(yearLevelMap, 'name')

      if (rows.length < batchSize) break
      from += batchSize
      await new Promise(r => setTimeout(r, 0))
    }
  } finally {
    if (runId === analyticsRunId) loading.value = false
  }
}

const fetchExportLogs = async () => {
  const { data } = await supabase
    .from('export_batches')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(5)

  if (data) {
    exportLogs.value = data.map((row: any) => ({
      id: row.id,
      date: new Date(row.uploaded_at).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date(row.uploaded_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      type: (row.file_type || 'XLSX').toUpperCase(),
      typeClass: (row.file_type || 'xlsx').toLowerCase(),
      user: row.exported_by_name || 'System',
      status: row.status === 'failed' ? 'Failed' : 'Success',
      statusClass: row.status || 'success',
      rowCount: row.row_count || 0,
      fileName: row.file_name || '--',
    }))
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([fetchLiveCountsOptimized(), fetchAnalyticsOptimized(), fetchExportLogs()])
  
  liveChannel = supabase.channel('attendance-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_logs' }, () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        fetchLiveCountsOptimized()
        fetchAnalyticsOptimized()
      }, 500)
    })
    .subscribe()
})

onBeforeUnmount(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
  if (liveChannel) supabase.removeChannel(liveChannel)
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const visitorsToday = computed(() => visitorsTodayCount.value)
const outgoing = computed(() => outgoingCount.value)
const currentlyInside = computed(() => currentlyInsideCount.value)
const gaugeCount = computed(() => currentlyInside.value)

const gaugeFillPercent = computed(() => Math.min((gaugeCount.value / 50) * 100, 100)) 
const gaugeStatus = computed(() => {
  if (gaugeCount.value === 0) return 'No Active Visitors'
  if (gaugeCount.value <= 10) return 'Low Traffic'
  if (gaugeCount.value <= 30) return 'Moderate Traffic'
  return 'High Traffic'
})

const flowMax = computed(() => Math.max(visitorsToday.value, outgoing.value, 1))
const incomingBarWidth = computed(() => `${(visitorsToday.value / flowMax.value) * 100}%`)
const outgoingBarWidth = computed(() => `${(outgoing.value / flowMax.value) * 100}%`)

const quickStats = computed(() => [
  { val: totalLibraryVisits.value, label: 'Monthly Visits (Library)', delta: 'This Month', up: true, gender: genderBreakdown.value.library, icon: '👤' },
  { 
    val: totalEventVisits.value, 
    label: 'Event Attendance', 
    delta: 'Students', 
    up: true,
    gender: genderBreakdown.value.event,
    icon: '🎟️' 
  },
    { 
      val: totalVisitorVisits.value, 
      label: 'Visitor Attendance', 
      delta: 'Visitors', 
      up: true, 
      icon: '🧑‍🤝‍🧑' 
    },
  { val: totalOverallVisits.value, label: 'Attendance (all types)', delta: 'This Month', up: true, gender: genderBreakdown.value.overall, icon: '📊' },
  { val: topPeakHour.value?.label || 'N/A', label: 'Peak Hour', delta: topPeakHour.value ? `${topPeakHour.value.visits} vists` : '—', up: true, icon: '⏰' },
  { val: topPeakDay.value?.day || 'N/A', label: 'Peak Day', delta: topPeakDay.value ? `${topPeakDay.value.visits} visits` : '—', up: true, icon: '📅' },
  { val: averageStayDurationText.value, label: 'Avg. Stay', delta: 'Per Session', up: true, icon: '⏳' },
  { val: topCollege.value?.name || 'N/A', label: 'Top College', delta: 'Monthly', up: true, icon: '🎓' },
  { val: topProgram.value?.name || 'N/A', label: 'Top Program', delta: 'Monthly', up: true, icon: '📚' },
  { val: topYearLevel.value ? `Year ${topYearLevel.value.name}` : 'N/A', label: 'Top Year', delta: 'Monthly', up: true, icon: '⭐' },
])

const handleTabChange = (n: string) => console.log(n)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes scaleInBounce {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes arcDraw {
  from {
    stroke-dashoffset: 691.2;
  }
  to {
    stroke-dashoffset: 43.9;
  }
}
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes ping {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.8);
    opacity: 0;
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


.qstat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px; 
}

.qstat-gender-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .85rem; 
  margin-top: 4px;
  font-weight: 500;
  opacity: 0.8;
}

.m-text {
  color: #60a5fa; 
}

.f-text {
  color: #f472b6; 
}

.qstat-gender-mini {
  transition: opacity 0.2s ease;
  opacity: 0.5; 
}

.qstat:hover .qstat-gender-mini {
  opacity: 1; 
}

.page-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #edefed;
  font-family: 'DM Sans', sans-serif;
}

.page-scroll {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 48px 80px 48px;
  box-sizing: border-box;
}
.page-scroll::-webkit-scrollbar {
  width: 5px;
}
.page-scroll::-webkit-scrollbar-thumb {
  background: rgba(13, 43, 15, 0.1);
  border-radius: 5px;
}

.attn-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

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
.header-breadcrumb svg {
  width: 12px;
  height: 12px;
  opacity: 0.4;
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
  height: 3.5px;
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

.attn-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.attn-actions button {
  border: 1.3px solid #0d2b0f;
  background: #ffffff;
  color: #0d2b0f;
  padding: 10px 16px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(13, 43, 15, 0.05);
  transition: all 0.2s ease;
}

.attn-actions button:hover {
  background: #0d2b0f;
  color: #ffffff;
}

.attn-actions button.action-active {
  background: #0d2b0f;
  color: #ffffff;
  border: 1.5px solid #0d2b0f; 
}

.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
.qstat {
  background: white;
  border: 1px solid rgba(13, 43, 15, 0.07);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(13, 43, 15, 0.04);
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.qstat:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(13, 43, 15, 0.09);
}
.qstat-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: rgba(13, 43, 15, 0.05);
  color: #0d2b0f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qstat-val {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0d2b0f;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 2px;
}
.qstat-label {
  font-size: 0.58rem;
  font-weight: 600;
  color: rgba(13, 43, 15, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}
.qstat-badge {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 0.58rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 7px;
}
.qstat-badge--up {
  background: rgba(27, 94, 32, 0.08);
  color: #1b5e20;
}
.qstat-badge--dn {
  background: rgba(198, 40, 40, 0.07);
  color: #c62828;
}

.main-grid {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  width: 100%;
}

.dial-card {
  background: rgb(206, 225, 207);
  border: 1px solid rgba(177, 207, 43, 0.07);
  border-radius: 28px;
  padding: 28px 24px 24px;
  box-shadow: 0 4px 24px rgba(13, 43, 15, 0.06);
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}
.dial-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-eyebrow {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(13, 43, 15, 0.35);
}
.live-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(46, 125, 50, 0.07);
  border: 1px solid rgba(46, 125, 50, 0.18);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.56rem;
  font-weight: 800;
  color: #2e7d32;
  letter-spacing: 0.18em;
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
}
.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4caf50;
  animation: ping 2s infinite;
}

.gauge-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.gauge-arc {
  animation: arcDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
}
.gauge-center {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.gauge-num {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}
.gauge-pct {
  font-family: 'Poppins', sans-serif;
  font-size: 6rem;
  font-weight: 900;
  color: #0d2b0f;
  letter-spacing: -0.06em;
  line-height: 1;
  animation: countUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
}
.gauge-sublabel {
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  color: rgba(13, 43, 15, 0.3);
  text-transform: uppercase;
  animation: fadeIn 0.4s ease 1.4s both;
}
.gauge-status {
  margin-top: 6px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 999px;
}
.gauge-status.low {
  background: rgba(249, 168, 37, 0.14);
  color: #9a6500;
}
.gauge-status.mid {
  background: rgba(13, 43, 15, 0.1);
  color: #0d2b0f;
}
.gauge-status.high {
  background: rgba(46, 125, 50, 0.12);
  color: #2e7d32;
}

.flow-row {
  display: flex;
  align-items: stretch;
  background: #f4f6f4;
  border-radius: 16px;
  padding: 14px 20px;
  margin-top: 12px;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1.4s both;
}
.flow-col {
  flex: 1;
}
.flow-divider {
  width: 1px;
  background: rgba(13, 43, 15, 0.08);
  margin: 0 20px;
  align-self: stretch;
}
.flow-bar-wrap {
  height: 3px;
  background: rgba(13, 43, 15, 0.07);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}
.flow-bar {
  height: 100%;
  border-radius: 2px;
  width: 0;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.flow-bar--in {
  background: #f9a825;
}
.flow-bar--out {
  background: rgba(13, 43, 15, 0.2);
}
.flow-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flow-label {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(13, 43, 15, 0.35);
}
.flow-num {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgba(13, 43, 15, 0.3);
}
.flow-num--in {
  color: #0d2b0f;
}
.flow-num--out {
  color: rgba(13, 43, 15, 0.3);
}

.controls-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ctrl-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}
.ctrl-eyebrow {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c8930a;
  margin: 0 0 4px;
}
.ctrl-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.6rem, 2.2vw, 2rem);
  font-weight: 900;
  color: #0d2b0f;
  letter-spacing: -0.03em;
  line-height: 0.95;
  margin: 0 0 4px;
}
.ctrl-title em {
  font-style: italic;
  color: #f9a825;
}
.ctrl-sub {
  font-size: 0.72rem;
  color: rgba(13, 43, 15, 0.4);
  font-weight: 400;
  margin: 0;
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 24px;
  background: #0d2b0f;
  color: white;
  border: none;
  border-radius: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(13, 43, 15, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}
.sync-btn--1 {
  animation: scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.sync-btn--2 {
  animation: scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.62s both;
}
.sync-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
  transform: translateX(-100%);
  transition: transform 0.7s;
}
.sync-btn:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(13, 43, 15, 0.25);
}
.sync-btn:hover::after {
  transform: translateX(100%);
}

.export-card {
  background: white;
  border: 1px solid rgba(13, 43, 15, 0.07);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(13, 43, 15, 0.04);
  animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.ecard-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid rgba(13, 43, 15, 0.06);
}

.ecard-eyebrow {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #c8930a;
  margin: 0 0 3px;
}

.ecard-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0d2b0f;
  letter-spacing: -0.02em;
  margin: 0;
}

.ecard-count {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(13, 43, 15, 0.35);
  letter-spacing: 0.08em;
  background: rgba(13, 43, 15, 0.05);
  padding: 4px 10px;
  border-radius: 20px;
}

.etable-wrap {
  overflow-x: auto;
}

.etable {
  width: 100%;
  border-collapse: collapse;
}

.etable th {
  text-align: left;
  padding: 14px 18px;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(13, 43, 15, 0.45);
  border-bottom: 1px solid rgba(13, 43, 15, 0.06);
}

.etable td {
  padding: 14px 18px;
  font-size: 0.82rem;
  color: #0d2b0f;
  border-bottom: 1px solid rgba(13, 43, 15, 0.05);
}

.erow {
  animation: fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.erow-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.erow-date__main {
  font-weight: 700;
}
.erow-date__time {
  font-size: 0.72rem;
  color: rgba(13, 43, 15, 0.45);
}

.erow-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.erow-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(13, 43, 15, 0.08);
  color: #0d2b0f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  text-transform: uppercase;
}

.etype-badge,
.estatus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.72rem;
  font-weight: 800;
}

.etype-badge--csv {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}
.etype-badge--xlsx {
  background: rgba(13, 43, 15, 0.1);
  color: #0d2b0f;
}
.etype-badge--pdf {
  background: rgba(198, 40, 40, 0.1);
  color: #c62828;
}
.etype-badge--file {
  background: rgba(13, 43, 15, 0.08);
  color: #0d2b0f;
}

.estatus-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  display: inline-block;
}

.estatus--success {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}
.estatus--success .estatus-dot {
  background: #2e7d32;
}

.estatus--pending {
  background: rgba(249, 168, 37, 0.14);
  color: #9a6500;
}
.estatus--pending .estatus-dot {
  background: #f9a825;
}

.estatus--failed {
  background: rgba(198, 40, 40, 0.1);
  color: #c62828;
}
.estatus--failed .estatus-dot {
  background: #c62828;
}

.empty-state-cell {
  text-align: center;
  padding: 24px;
  color: rgba(13, 43, 15, 0.45);
  font-weight: 700;
}

@media (max-width: 1200px) {
  .stat-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-scroll {
    padding: 24px 18px 60px 18px;
  }

  .stat-strip {
    grid-template-columns: 1fr;
  }

  .ctrl-header {
    flex-direction: column;
  }

  .attn-actions {
    flex-direction: column;
  }
}

.attn-actions button:hover {
  background-color: #2f7e35;
}
</style>
