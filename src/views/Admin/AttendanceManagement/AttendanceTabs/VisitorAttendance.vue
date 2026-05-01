<template>
  <div class="flex h-screen w-full overflow-hidden bg-slate-50">
    <Sidebar />

    <main class="flex-1 overflow-y-auto px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="headBlock">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/attendance')"
            >
              BACK
            </span>

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>

            <span>Attendance</span>
          </div>

          <div class="titleHero">
            <h1 class="heroTitle">
              <span class="heroTitlePrimary">Visitors</span>
              <span class="heroTitleAccent">Attendance</span>
            </h1>

            <div class="heroUnderline"></div>
          </div>
          <p class="hero-subtitle">
            Review and filter visitor entries from the library attendance section.
          </p>
        </div>

        <section class="rounded-xl bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <h1 class="text-lg font-bold text-slate-900">Visitor Filters</h1>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:items-start">
            <div class="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Select Filter:
            </div>

            <div class="space-y-4">
              <label
                class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'specific-date'
                    ? 'border-[#164d23] bg-white shadow-sm'
                    : ''
                "
              >
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="specific-date"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Specific Date</span>
                </div>

                <input
                  v-model="specificDate"
                  type="date"
                  :disabled="selectedFilterMode !== 'specific-date'"
                  class="h-11 max-w-md rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
              </label>

              <label
                class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'specific-month'
                    ? 'border-[#164d23] bg-white shadow-sm'
                    : ''
                "
              >
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="specific-month"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Specific Month</span>
                </div>

                <div class="flex flex-wrap items-end gap-3">
                  <div class="grid gap-1">
                    <select
                      v-model="specificMonth"
                      :disabled="selectedFilterMode !== 'specific-month'"
                      class="h-11 min-w-40 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option v-for="month in months" :key="month.value" :value="month.value">
                        {{ month.label }}
                      </option>
                    </select>
                    <span class="text-xs font-medium uppercase tracking-wide text-slate-500"
                      >month</span
                    >
                  </div>

                  <div class="grid gap-1">
                    <select
                      v-model="specificYear"
                      :disabled="selectedFilterMode !== 'specific-month'"
                      class="h-11 min-w-28 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                    </select>
                    <span class="text-xs font-medium uppercase tracking-wide text-slate-500"
                      >year</span
                    >
                  </div>
                </div>
              </label>

              <label
                class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300"
                :class="
                  selectedFilterMode === 'period' ? 'border-[#164d23] bg-white shadow-sm' : ''
                "
              >
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    v-model="selectedFilterMode"
                    type="radio"
                    name="visitor-filter-mode"
                    value="period"
                    class="h-4 w-4 accent-[#164d23]"
                  />
                  <span>Period</span>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <input
                    v-model="periodStartDate"
                    type="date"
                    :disabled="selectedFilterMode !== 'period'"
                    class="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span class="text-sm font-medium text-slate-500">to</span>
                  <input
                    v-model="periodEndDate"
                    type="date"
                    :disabled="selectedFilterMode !== 'period'"
                    class="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#164d23] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </label>

              <div class="flex justify-end pt-1">
                <button
                  type="button"
                  @click="loadVisitorLogs"
                  class="inline-flex h-10 items-center justify-center rounded-lg bg-[#164d23] px-5 text-sm font-semibold text-white transition hover:bg-[#123d1b] lg:w-auto"
                >
                  Show
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-xl bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center gap-3">
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <h2 class="text-lg font-bold text-slate-900">Visitor Logs</h2>
          </div>

          <div
            v-if="loading"
            class="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500"
          >
            Loading visitor records...
          </div>

          <div
            v-else-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div v-else class="overflow-hidden rounded-xl border border-slate-200">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead
                  class="bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  <tr>
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">Cellphone</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">School/Institution</th>
                    <th class="px-4 py-3">Date</th>
                    <th class="px-4 py-3">Time In</th>
                    <th class="px-4 py-3">Time Out</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white text-slate-700">
                  <tr v-if="visitorLogs.length === 0">
                    <td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">
                      No visitor records to display.
                    </td>
                  </tr>
                  <tr v-for="log in visitorLogs" :key="log.id">
                    <td class="px-4 py-3 font-medium text-slate-900">
                      {{ getVisitorName(log) }}
                    </td>
                    <td class="px-4 py-3">
                      {{ log.contact_details || log.contact || log.cellphone || '--' }}
                    </td>
                    <td class="px-4 py-3 text-xs">
                      {{ log.email || '--' }}
                    </td>
                    <td class="px-4 py-3 text-xs">
                      {{ log.institution || log.company_institution || '--' }}
                    </td>
                    <td class="px-4 py-3">
                      {{ formatDisplayDate(log.time_in) }}
                    </td>
                    <td class="px-4 py-3">
                      {{ formatDisplayTime(log.time_in) }}
                    </td>
                    <td class="px-4 py-3">
                      {{ log.time_out ? formatDisplayTime(log.time_out) : '(Optional)' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            class="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-sm font-medium text-slate-700">
              Total number of library visit:
              <span class="font-bold text-slate-900">{{ visitorLogs.length }}</span>
            </p>

            <button
              type="button"
              @click="exportVisitorLogs"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-[#164d23] px-5 text-sm font-semibold text-white transition hover:bg-[#123d1b] lg:w-auto"
            >
              Export
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const filterModes = [
  { label: 'Specific Date', value: 'specific-date' },
  { label: 'Specific Month', value: 'specific-month' },
  { label: 'Period', value: 'period' },
] as const

const selectedFilterMode = ref<(typeof filterModes)[number]['value']>('specific-date')
const specificDate = ref('2026-04-13')
const specificMonth = ref(String(new Date().getMonth() + 1).padStart(2, '0'))
const specificYear = ref(String(new Date().getFullYear()))
const periodStartDate = ref('')
const periodEndDate = ref('')

const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, index) => String(currentYear - index))
})

type VisitorLog = {
  id: string
  time_in: string | null
  time_out?: string | null
  attendance_type?: string | null
  visitor_name?: string | null
  name?: string | null
  full_name?: string | null
  company?: string | null
  institution?: string | null
  company_institution?: string | null
  contact_details?: string | null
  contact?: string | null
  reason?: string | null
  email?: string | null
  cellphone?: string | null
  [key: string]: unknown
}

const visitorLogs = ref<VisitorLog[]>([])
const loading = ref(false)
const errorMessage = ref('')

const formatDisplayDate = (value: string | null) => {
  if (!value) return '--'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '--'

  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDisplayTime = (value: string | null) => {
  if (!value) return '--'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '--'

  return dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getVisitorName = (log: VisitorLog) => log.visitor_name || log.full_name || log.name || '--'

const exportVisitorLogs = () => {
  const headers = ['Name', 'Cellphone', 'Email', 'School/Institution', 'Date', 'Time In', 'Time Out']

  const rows = visitorLogs.value.map((log) => [
    getVisitorName(log),
    log.contact_details || log.contact || log.cellphone || '--',
    log.email || '--',
    log.institution || log.company_institution || '--',
    formatDisplayDate(log.time_in),
    formatDisplayTime(log.time_in),
    log.time_out ? formatDisplayTime(log.time_out) : '(Optional)',
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Attendance')

  const fileName = `visitor-attendance-${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

const buildDateRange = () => {
  if (selectedFilterMode.value === 'specific-date' && specificDate.value) {
    return {
      start: `${specificDate.value}T00:00:00`,
      end: `${specificDate.value}T23:59:59`,
    }
  }

  if (selectedFilterMode.value === 'specific-month') {
    const year = Number(specificYear.value)
    const month = Number(specificMonth.value)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    }
  }

  if (selectedFilterMode.value === 'period' && periodStartDate.value && periodEndDate.value) {
    return {
      start: `${periodStartDate.value}T00:00:00`,
      end: `${periodEndDate.value}T23:59:59`,
    }
  }

  return null
}

const loadVisitorLogs = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    let query = supabase
      .from('attendance_logs_visitors')
      .select('*')
      .order('time_in', { ascending: false })

    const range = buildDateRange()

    if (range) {
      query = query.gte('time_in', range.start).lte('time_in', range.end)
    }

    const { data, error } = await query

    if (error) throw error

    visitorLogs.value = (data || []) as VisitorLog[]
  } catch (error) {
    console.error('Failed to load visitor records:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load visitor records.'
    visitorLogs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVisitorLogs()
})
</script>

<style scoped>
.heroTitle {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  line-height: 0.95;
  font-size: clamp(3rem, 3vw, 1.7rem);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.heroTitlePrimary {
  color: #0d2b0f;
}

.heroTitleAccent {
  color: #efb72d;
}

.heroUnderline {
  margin-top: 14px;
  width: 160px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #214b1f 0%, #c49317 100%);
}

.hero-subtitle {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 10px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>
