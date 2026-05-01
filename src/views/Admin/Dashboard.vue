<template>
  <div class="flex h-screen bg-white overflow-hidden font-sans">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <main class="flex-1 relative overflow-hidden flex flex-col min-w-0">
      <header class="relative z-20 h-20 flex items-center justify-between px-12 bg-transparent">
        <div class="flex flex-col">
          <span class="font-bold text-sm uppercase tracking-widest text-[#1b5e20]">
            {{ activeTab }} VIEW
          </span>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right hidden md:block">
            <p class="text-xs font-medium text-[#1b5e20]">{{ currentDate }}</p>
          </div>
        </div>
      </header>

      <div
        class="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 overflow-y-auto"
      >
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="w-full max-w-6xl py-12">
            <div v-if="activeTab === 'DASHBOARD'" class="space-y-12">
              <h2 class="text-[#0d2b0f] text-6xl md:text-7xl font-black">
                Welcome,
                <span class="anim-shimmer"> {{ firstName || 'User' }} </span>.
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <div
                  v-for="(stat, i) in quickStats"
                  :key="stat.label"
                  class="stat-card-wrapper"
                  :style="{ '--i': i }"
                  @mousemove="onMouseMove($event, i)"
                  @mouseleave="onMouseLeave(i)"
                >
                  <div
                    class="stat-card"
                    :ref="
                      (el) => {
                        cardRefs[i] = el
                      }
                    "
                    :style="cardStyles[i]"
                  >
                    <div class="stat-shimmer" :style="shimmerStyles[i]"></div>
                    <div class="stat-accent-bar"></div>
                    <span class="stat-icon" v-html="stat.icon"></span>
                    <h3 class="stat-value">{{ stat.value ?? '—' }}</h3>
                    <p class="stat-label">{{ stat.label }}</p>
                  </div>
                </div>
              </div>

              <div
                class="relative py-4 max-w-2xl mx-auto anim-fade-in"
                style="animation-delay: 0.5s"
              >
                <p
                  class="text-[#1b5e20] text-3xl md:text-xl font-family: 'Cormorant Garamond', serif italic font-bold leading-tight px-6 relative z-10"
                >
                  "{{ currentQuote.text }}"
                </p>
                <p
                  class="mt-3 text-[#1b5e20] font-bold tracking-[0.3em] uppercase text-[11px] opacity-80"
                >
                  — {{ currentQuote.author }}
                </p>
                <div
                  class="mt-2 mx-auto w-30 h-0.5 bg-gradient-to-r from-[#0d2b0f] to-[#f9a825] rounded-full anim-expand"
                ></div>
              </div>
            </div>

            <div v-else class="text-[#1b5e20]">
              <h2 class="text-5xl font-black">{{ activeTab }}</h2>
              <p>Loading...</p>
            </div>
          </div>
        </transition>
      </div>

      <footer class="p-6 text-center">
        <p class="text-[10px] uppercase tracking-[0.5em] font-black text-[#0d2b0f]">
          Caraga State University Library Management
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const currentQuote = ref({
  text: 'A library is not a luxury but one of the necessities of life.',
  author: 'Henry Ward Beecher',
})

const firstName = ref('')
const activeTab = ref('DASHBOARD')

const monthlyAttendance = ref(0)
const activeVisitors = ref(0)
const timedOutVisitors = ref(0)
const topDepartment = ref('Loading...')

const displayMonthly = ref<number | null>(0)
const displayVisitors = ref<number | null>(0)
const displayTimedOut = ref<number | null>(0)

const CARD_COUNT = 4
const cardRefs = reactive<any[]>(new Array(CARD_COUNT).fill(null))

const cardStyles = reactive<string[]>(
  new Array(CARD_COUNT).fill('transform: perspective(800px) rotateX(0deg) rotateY(0deg) scale(1);'),
)

const shimmerStyles = reactive<string[]>(new Array(CARD_COUNT).fill(''))

let liveChannel: ReturnType<typeof supabase.channel> | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let topDepartmentRunId = 0

function onMouseMove(e: MouseEvent, index: number) {
  const card = cardRefs[index]
  if (!card) return

  const rect = (card as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2

  const rotY = ((x - cx) / cx) * 18
  const rotX = -((y - cy) / cy) * 18

  cardStyles[index] = `transform: rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05);`

  const px = (x / rect.width) * 100
  const py = (y / rect.height) * 100

  shimmerStyles[index] =
    `background: radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.22) 0%, transparent 60%);`
}

function onMouseLeave(index: number) {
  cardStyles[index] = 'transform: rotateX(0deg) rotateY(0deg) scale(1);'
  shimmerStyles[index] = ''
}

const handleTabChange = (name: string) => {
  activeTab.value = name
}

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
)

const animateValue = (target: any, final: number, duration = 500) => {
  const current = Number(target.value || 0)

  if (current === final) {
    target.value = final
    return
  }

  let start = current
  const step = (final - start) / (duration / 16)

  const interval = setInterval(() => {
    start += step

    if ((step >= 0 && start >= final) || (step < 0 && start <= final)) {
      target.value = final
      clearInterval(interval)
    } else {
      target.value = Math.floor(start)
    }
  }, 16)
}

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))

function getPHDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

  const [year, month, day] = parts.split('-').map(Number)

  return { year, month, day }
}

function getPHDateRangeForToday() {
  const { year, month, day } = getPHDateParts()

  return {
    start: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00+08:00`,
    end: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T23:59:59+08:00`,
  }
}

function getPHDateRangeForCurrentMonth() {
  const { year, month } = getPHDateParts()
  const lastDay = new Date(year, month, 0).getDate()

  return {
    start: `${year}-${String(month).padStart(2, '0')}-01T00:00:00+08:00`,
    end: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59+08:00`,
  }
}

async function fetchUserName() {
  const { data: auth } = await supabase.auth.getUser()

  if (!auth?.user?.email) return ''

  const { data, error } = await supabase
    .from('users')
    .select('first_name')
    .eq('email', auth.user.email)
    .single()

  if (error) {
    console.error('Failed to fetch user name:', error)
    return ''
  }

  return data?.first_name || ''
}

async function fetchFastDashboardStats() {
  const todayRange = getPHDateRangeForToday()
  const monthRange = getPHDateRangeForCurrentMonth()

  const [fetchedName, monthlyResult, activeResult, timedOutResult] = await Promise.all([
    fetchUserName(),

    supabase
      .from('attendance_logs')
      .select('id', { count: 'exact', head: true })
      .eq('attendance_type', 'library')
      .gte('time_in', monthRange.start)
      .lte('time_in', monthRange.end),

    supabase
      .from('attendance_logs')
      .select('id', { count: 'exact', head: true })
      .eq('attendance_type', 'library')
      .gte('time_in', todayRange.start)
      .lte('time_in', todayRange.end)
      .is('time_out', null),

    supabase
      .from('attendance_logs')
      .select('id', { count: 'exact', head: true })
      .eq('attendance_type', 'library')
      .gte('time_out', todayRange.start)
      .lte('time_out', todayRange.end),
  ])

  if (monthlyResult.error) console.error('Failed to fetch monthly attendance:', monthlyResult.error)
  if (activeResult.error) console.error('Failed to fetch active visitors:', activeResult.error)
  if (timedOutResult.error) console.error('Failed to fetch timed out visitors:', timedOutResult.error)

  firstName.value = fetchedName

  monthlyAttendance.value = monthlyResult.count ?? 0
  activeVisitors.value = activeResult.count ?? 0
  timedOutVisitors.value = timedOutResult.count ?? 0

  animateValue(displayMonthly, monthlyAttendance.value)
  animateValue(displayVisitors, activeVisitors.value)
  animateValue(displayTimedOut, timedOutVisitors.value)
}

async function fetchTopDepartmentInBackground() {
  const runId = ++topDepartmentRunId
  const tally: Record<string, number> = {}
  const batchSize = 300
  let from = 0

  try {
    while (true) {
      if (runId !== topDepartmentRunId) return

      const to = from + batchSize - 1

      const { data, error } = await supabase
        .from('attendance_logs')
        .select(
          `
          id,
          attendance_type,
          students!inner (
            college
          )
        `,
        )
        .eq('attendance_type', 'library')
        .range(from, to)

      if (error) {
        console.error('Failed to fetch top department:', error)
        topDepartment.value = '—'
        return
      }

      const rows = data || []

      for (const row of rows) {
        const student = Array.isArray(row.students) ? row.students[0] : row.students
        const college = student?.college

        if (college) {
          tally[college] = (tally[college] || 0) + 1
        }
      }

      const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]
      topDepartment.value = top ? top[0] : '—'

      if (rows.length < batchSize) break

      from += batchSize
      await sleep(0)
    }
  } catch (error) {
    console.error('Unexpected top department error:', error)
    topDepartment.value = '—'
  }
}

const scheduleRealtimeRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer)

  refreshTimer = setTimeout(async () => {
    await fetchFastDashboardStats()
    fetchTopDepartmentInBackground()
  }, 400)
}

onMounted(async () => {
  localStorage.removeItem('dashboard_stats')

  await fetchFastDashboardStats()

  fetchTopDepartmentInBackground()

  liveChannel = supabase
    .channel('dashboard-live')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance_logs',
      },
      () => {
        scheduleRealtimeRefresh()
      },
    )
    .subscribe()
})

onBeforeUnmount(() => {
  topDepartmentRunId++

  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  if (liveChannel) {
    supabase.removeChannel(liveChannel)
    liveChannel = null
  }
})

const quickStats = computed(() => [
  {
    label: 'Active Visitors',
    value: displayVisitors.value,
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    label: 'Students Timed Out',
    value: displayTimedOut.value,
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  },
  {
    label: 'Top Department',
    value: topDepartment.value,
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    label: 'Monthly Attendance',
    value: displayMonthly.value,
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14l2.5 2.5L16 11"/></svg>`,
  },
])
</script>

<style scoped>
/* ── Wrapper — perspective container ── */
.stat-card-wrapper {
  animation: card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 0.1s);
  perspective: 600px;
  perspective-origin: center center;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card {
  position: relative;
  background: #fff;
  border: 2px solid #1b5e20;
  border-radius: 1rem;
  padding: 1.75rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease,
    background 0.28s ease,
    border-color 0.28s ease;
}

.stat-card-wrapper:hover .stat-card {
  background: #1b5e20;
  border-color: #2e7d32;
  box-shadow:
    0 30px 60px rgba(27, 94, 32, 0.3),
    0 10px 20px rgba(27, 94, 32, 0.18);
}

.stat-shimmer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  transition: background 0.08s linear;
}

.stat-accent-bar {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f9a825, transparent);
  opacity: 0;
  transition: opacity 0.28s ease;
}

.stat-card-wrapper:hover .stat-accent-bar {
  opacity: 1;
}

.stat-icon {
  color: #f9a825;
  display: flex;
  transition:
    color 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.stat-card-wrapper:hover .stat-icon {
  color: #fff;
  transform: scale(1.18);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 900;
  margin-top: 0.5rem;
  color: #1b5e20;
  line-height: 1;
  transition: color 0.28s ease;
}

.stat-card-wrapper:hover .stat-value {
  color: #fff;
}

.stat-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 800;
  margin-top: 0.375rem;
  color: #1b5e20;
  transition: color 0.28s ease;
}

.stat-card-wrapper:hover .stat-label {
  color: rgba(255, 255, 255, 0.85);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.anim-shimmer {
  background: linear-gradient(90deg, #f9a825 25%, #fde68a 50%, #f9a825 75%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>