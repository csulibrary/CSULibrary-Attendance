<template>
  <div class="page-shell flex h-screen bg-[#f0f4f1]">
    <Sidebar />

    <!-- MAIN CONTENT -->
    <div class="sr-main flex-1 p-4 lg:p-8 font-sans text-slate-700 overflow-y-auto">

      <header class="sr-header mb-3">
  <div class="sr-header-container mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

    <!-- LEFT SIDE -->
    <div>
      <div class="header-breadcrumb text-gray-400">
        <button
          class="back-btn flex items-center gap-1.5 text-gray-400 hover:text-[#0d2b0f] transition-colors"
          @click="$router.push('/admin/attendance')"
        >
          <span class="uppercase tracking-widest">Back</span>
        </button>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3">
          <path d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-400 font-bold">Attendance</span>
      </div>

      <h1 class="hero-title">
        <span class="hero-word-dark hero-underlined">Student</span>
        <span class="hero-word-gold"> Record</span>
        <p class="hero-subtitle">
          Filter and manage student records by college and academic program.
        </p>
      </h1>
    </div>

    <!-- RIGHT SIDE SEARCH -->
    <div class="w-full lg:w-[32%]" style="padding-top: 50px;">
      <div class="relative group mt-4 lg:mt-0">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i class="fas fa-search text-slate-300 group-focus-within:text-[#0d2b0f] transition-colors"></i>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by ID, Name, or Program..."
          class="w-full bg-white border-2 border-transparent pl-12 pr-4 py-4 rounded-2xl focus:border-[#0d2b0f]/20 focus:ring-4 focus:ring-[#0d2b0f]/5 transition-all outline-none shadow-sm text-sm font-medium"
        />
      </div>
    </div>

  </div>
</header>


      <!-- MAIN GRID -->
      <main class="sr-grid mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- FILTERS -->
        <section class="lg:col-span-4 space-y-6">
          <div class="bg-white p-8 rounded-[1.5rem] border border-[#c2d4cb] shadow-xl shadow-slate-200/40">

            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-widest text-[#4a7060]">Filter</h2>
            </div>

            <!-- FILTER GRID -->
            <div class="sr-filter-grid grid grid-cols-1 md:grid-cols-2 gap-4">

              <div class="relative">
                <label class="text-[10px] font-black uppercase text-[#4a7060] ml-1 mb-2 block">College</label>
                <button @click="isCollegeOpen = !isCollegeOpen; isProgramOpen = false" type="button"
                  class="w-full h-12.5 bg-[#f0f4f1] border border-[#c2d4cb] px-5 rounded-2xl text-sm font-bold text-[#0d2b0f] flex justify-between items-center outline-none focus:border-[#0d2b0f] transition-colors">
                  <span class="truncate pr-2">{{ filters.college === 'All' ? '— College —' : filters.college }}</span>
                  <i class="fas fa-chevron-down transition-transform flex-shrink-0" :class="{ 'rotate-180': isCollegeOpen }"></i>
                </button>
                <div v-if="isCollegeOpen"
                  class="absolute z-30 w-full mt-2 bg-white border border-[#c2d4cb] rounded-2xl shadow-xl max-h-64 overflow-y-auto">
                  <div @click="filters.college = 'All'; isCollegeOpen = false"
                    class="px-5 py-3 hover:bg-[#f0f4f1] cursor-pointer text-sm font-bold text-[#4a7060] border-b border-[#d4e4da]">
                    — All Colleges —
                  </div>
                  <div v-for="c in colleges" :key="c" @click="filters.college = c; isCollegeOpen = false"
                    class="px-5 py-3 hover:bg-[#e6f2ec] hover:text-[#e6a800] cursor-pointer text-sm font-bold text-[#0d2b0f]">
                    {{ c }}
                  </div>
                </div>
              </div>

              <div class="relative">
                <label class="text-[10px] font-black uppercase text-[#4a7060] ml-1 mb-2 block">Program</label>
                <button @click="isProgramOpen = !isProgramOpen; isCollegeOpen = false" type="button"
                  class="w-full h-12.5 bg-[#f0f4f1] border border-[#c2d4cb] px-5 rounded-2xl text-sm font-bold text-[#0d2b0f] flex justify-between items-center outline-none focus:border-[#0d2b0f] transition-colors">
                  <span class="truncate pr-2">{{ filters.program === 'All' ? '— Program —' : filters.program }}</span>
                  <i class="fas fa-chevron-down transition-transform flex-shrink-0" :class="{ 'rotate-180': isProgramOpen }"></i>
                </button>
                <div v-if="isProgramOpen"
                  class="absolute z-30 w-full mt-2 bg-white border border-[#c2d4cb] rounded-2xl shadow-xl max-h-64 overflow-y-auto">
                  <div @click="filters.program = 'All'; isProgramOpen = false"
                    class="px-5 py-3 hover:bg-[#f0f4f1] cursor-pointer text-sm font-bold text-[#4a7060] border-b border-[#d4e4da]">
                    — All Programs —
                  </div>
                  <div v-for="p in programs" :key="p" @click="filters.program = p; isProgramOpen = false"
                    class="px-5 py-3 hover:bg-[#e6f2ec] hover:text-[#e6a800] cursor-pointer text-sm font-bold text-[#0d2b0f]">
                    {{ p }}
                  </div>
                </div>
              </div>

            </div>

            <!-- STATUS -->
            <div>
              <label class="text-[10px] font-black uppercase text-[#4a7060] ml-1 mb-3 mt-5 block">Enrollment Status</label>
              <div class="grid gap-2">
                <button v-for="status in ['All', 'Enrolled', 'Withdrawn', 'Graduated']" :key="status"
                  @click="filters.status = status"
                  :class="filters.status === status ? 'bg-[#0d2b0f] text-white' : 'bg-white text-[#4a7060] border border-[#c2d4cb] hover:bg-[#e6f2ec]'"
                  class="px-5 py-3 rounded-xl text-xs font-bold flex justify-between transition-colors">
                  {{ status }}
                </button>
              </div>
            </div>

            <!-- GENDER BREAKDOWN BUTTON -->
            <div class="mt-6 pt-6 border-t border-[#d4e4da]">
              <button
                @click="openGenderModal"
                class="w-full py-3.5 rounded-2xl bg-[#0d2b0f] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-[#183d1b] active:scale-[0.98] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="9" cy="9" r="4"/>
                  <path d="M9 13v7M6 17h6"/>
                  <path d="M18 4l4 4M22 4h-4v4"/>
                  <circle cx="18" cy="12" r="3"/>
                </svg>
                Total Gender Breakdown
              </button>
            </div>

          </div>
        </section>

        <!-- TABLE -->
        <section class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-3xl border border-[#c2d4cb] shadow-xl overflow-hidden">

            <div class="px-8 py-6 flex justify-between border-b border-[#d4e4da]">
              <div>
                <h3 class="font-black text-sm uppercase text-[#0d2b0f]">Registry Database</h3>
                <p class="text-[10px] text-[#4a7060]">{{ filteredStudents.length }} Records Found</p>
              </div>
            </div>

            <div class="table-scroll overflow-y-auto max-h-[calc(100vh-300px)] overflow-x-auto pr-2">
              <table class="w-full text-left">
                <thead class="text-[10px] uppercase text-[#4a7060] sticky top-0 bg-white">
                  <tr>
                    <th class="px-8 py-4">Identity</th>
                    <th class="px-8 py-4">College</th>
                    <th class="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in filteredStudents" :key="s.studentId"
                    class="cursor-pointer hover:bg-[#f0f4f1] transition-colors border-b border-[#f0f4f1] last:border-0">
                    <td class="px-8 py-5">
                      <div class="font-bold text-[#0d2b0f]">{{ s.name }}</div>
                      <div class="text-xs text-[#4a7060]">{{ s.studentId }} • {{ s.program }}</div>
                    </td>
                    <td class="px-8 py-5">
                      <span class="text-xs bg-[#e6f2ec] border border-[#a8ccb8] text-[#0d2b0f] px-2 py-1 rounded">
                        {{ s.college }}
                      </span>
                    </td>
                    <td class="px-8 py-5 text-right">
                      <span :class="statusStyle(s.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                        {{ s.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>

              </table>

              <div v-if="loadingStudents" class="py-20 flex justify-center">
                <p class="text-[#4a7060] text-xs font-bold">Loading...</p>
              </div>
              <div v-else-if="filteredStudents.length === 0" class="py-20 flex justify-center">
                <p class="text-[#a8ccb8] text-xs font-bold">No Records Matched</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>

    <!-- ══════════════════════════════════════════════
         GENDER BREAKDOWN DRAWER
    ═══════════════════════════════════════════════ -->
    <Teleport to="body">

      <!-- Backdrop -->
      <Transition name="backdrop">
        <div
          v-if="genderModalOpen"
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          @click="genderModalOpen = false"
        />
      </Transition>

      <!-- Drawer panel -->
      <Transition name="drawer">
        <div
          v-if="genderModalOpen"
          class="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white z-50 shadow-2xl flex flex-col"
        >

          <!-- Drawer Header -->
          <div class="px-8 py-6 border-b border-[#d4e4da] flex items-center justify-between flex-shrink-0">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-[#4a7060] mb-1">Student Registry</p>
              <h2 class="text-xl font-black text-[#0d2b0f]">Total Gender Breakdown</h2>
            </div>
            <div class="flex items-center gap-2">
              <!-- Refresh button -->
              <button
                @click="fetchAttendanceLogs(true)"
                :disabled="refreshing"
                class="w-9 h-9 rounded-xl bg-[#f0f4f1] border border-[#c2d4cb] flex items-center justify-center text-[#4a7060] hover:bg-[#e6f2ec] hover:text-[#0d2b0f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  :class="refreshing ? 'spin' : ''"
                >
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </button>
              <!-- Close button -->
              <button
                @click="genderModalOpen = false"
                class="w-9 h-9 rounded-xl bg-[#f0f4f1] border border-[#c2d4cb] flex items-center justify-center text-[#4a7060] hover:bg-[#e6f2ec] hover:text-[#0d2b0f] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Drawer Scrollable Body -->
          <div class="flex-1 overflow-y-auto px-8 py-6 space-y-8 relative">

            <!-- Refreshing overlay -->
            <Transition name="backdrop">
              <div
                v-if="refreshing"
                class="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3"
              >
                <svg class="spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d2b0f" stroke-width="2.5">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <p class="text-xs font-black uppercase tracking-widest text-[#4a7060]">Refreshing data...</p>
              </div>
            </Transition>

            <!-- ── OVERALL TOTAL CARD ── -->
            <div class="rounded-2xl bg-[#0d2b0f] p-6 text-white">
              <p class="text-[10px] font-black uppercase tracking-widest text-[#a8ccb8] mb-4">Overall Total — All Colleges</p>

              <div class="flex items-end gap-3 mb-5">
                <span class="text-5xl font-black leading-none">{{ genderStats.total }}</span>
                <span class="text-sm text-[#a8ccb8] mb-1">students</span>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-4">
                <!-- Female card -->
                <div class="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#4a7060]/30 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8ccb8" stroke-width="2">
                      <circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-black">{{ genderStats.female }}</div>
                    <div class="text-[10px] text-[#a8ccb8] font-bold uppercase tracking-wide">Female</div>
                  </div>
                </div>
                <!-- Male card -->
                <div class="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#e6a800]/20 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e6a800" stroke-width="2">
                      <circle cx="10" cy="14" r="4"/><path d="M19 5l-5 5M19 5h-4M19 5v4"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-black">{{ genderStats.male }}</div>
                    <div class="text-[10px] text-[#fde68a] font-bold uppercase tracking-wide">Male</div>
                  </div>
                </div>
              </div>

              <!-- F/M proportion bar -->
              <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{
                    width: genderStats.total ? (genderStats.female / genderStats.total * 100) + '%' : '0%',
                    background: 'linear-gradient(to right, #4a7060, #e6a800)'
                  }"
                />
              </div>
              <div class="flex justify-between mt-1.5 text-[10px] text-[#a8ccb8]">
                <span>{{ genderStats.total ? Math.round(genderStats.female / genderStats.total * 100) : 0 }}% Female</span>
                <span>{{ genderStats.total ? Math.round(genderStats.male / genderStats.total * 100) : 0 }}% Male</span>
              </div>
            </div>

            <!-- ── BY COLLEGE ── -->
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-[#4a7060] mb-4">By College</p>

              <div class="space-y-3">
                <div
                  v-for="college in genderByCollege"
                  :key="college.name"
                  class="bg-[#f0f4f1] border border-[#d4e4da] rounded-2xl overflow-hidden"
                >

                  <!-- College row (click to expand) -->
                  <button
                    @click="toggleCollege(college.name)"
                    class="w-full px-5 pt-4 pb-2 flex items-start justify-between text-left hover:bg-[#e6f2ec] transition-colors"
                  >
                    <div class="flex-1 min-w-0 pr-3">
                      <p class="text-xs font-black text-[#0d2b0f] leading-snug">{{ college.name }}</p>
                      <p class="text-[10px] text-[#4a7060] mt-0.5">{{ college.total }} students total</p>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0 mt-0.5">
                      <div class="flex items-center gap-1">
                        <div class="w-2 h-2 rounded-full bg-[#4a7060]"></div>
                        <span class="text-xs font-black text-[#0d2b0f]">{{ college.female }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="w-2 h-2 rounded-full bg-[#e6a800]"></div>
                        <span class="text-xs font-black text-[#0d2b0f]">{{ college.male }}</span>
                      </div>
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="2.5"
                        class="transition-transform duration-200"
                        :class="expandedColleges.has(college.name) ? 'rotate-180' : ''"
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </button>

                  <!-- Mini proportion bar -->
                  <div class="px-5 pb-3">
                    <div class="h-1.5 rounded-full bg-[#d4e4da] overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :style="{
                          width: college.total ? (college.female / college.total * 100) + '%' : '0%',
                          background: 'linear-gradient(to right, #4a7060, #e6a800)'
                        }"
                      />
                    </div>
                    <div class="flex justify-between mt-1 text-[9px] text-[#4a7060]">
                      <span>{{ college.total ? Math.round(college.female / college.total * 100) : 0 }}%</span>
                      <span>{{ college.total ? Math.round(college.male / college.total * 100) : 0 }}%</span>
                    </div>
                  </div>

                  <!-- YEAR LEVEL BREAKDOWN (expandable) -->
                  <Transition name="expand">
                    <div v-if="expandedColleges.has(college.name)" class="border-t border-[#d4e4da]">
                      <div class="px-5 py-4 bg-white">

                        <div class="flex items-center gap-4 mb-3">
                          <p class="text-[10px] font-black uppercase tracking-widest text-[#4a7060] flex-1">By Year Level</p>
                          <div class="flex items-center gap-1.5">
                            <div class="w-2 h-2 rounded-full bg-[#4a7060]"></div>
                            <span class="text-[10px] text-[#4a7060] font-bold">F</span>
                          </div>
                          <div class="flex items-center gap-1.5">
                            <div class="w-2 h-2 rounded-full bg-[#e6a800]"></div>
                            <span class="text-[10px] text-[#4a7060] font-bold">M</span>
                          </div>
                          <span class="text-[10px] text-[#4a7060] font-bold w-8 text-right">Total</span>
                        </div>

                        <div class="space-y-3">
                          <div
                            v-for="yl in college.yearLevels"
                            :key="yl.level"
                            class="bg-[#f0f4f1] rounded-xl px-4 py-3"
                          >
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-[10px] font-black text-[#0d2b0f] uppercase tracking-wide">
                                {{ yl.level === 0 ? 'N/A' : `Year ${yl.level}` }}
                              </span>
                              <div class="flex items-center gap-3">
                                <span class="text-xs font-black text-[#4a7060]">{{ yl.female }}</span>
                                <span class="text-xs font-black text-[#e6a800]">{{ yl.male }}</span>
                                <span class="text-xs font-black text-[#0d2b0f] w-8 text-right">{{ yl.total }}</span>
                              </div>
                            </div>
                            <div class="h-1.5 rounded-full bg-[#d4e4da] overflow-hidden flex">
                              <div
                                class="h-full bg-[#4a7060] transition-all duration-500"
                                :style="{ width: yl.total ? (yl.female / yl.total * 100) + '%' : '0%' }"
                              />
                              <div
                                class="h-full bg-[#e6a800] transition-all duration-500"
                                :style="{ width: yl.total ? (yl.male / yl.total * 100) + '%' : '0%' }"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Transition>

                </div>
              </div>
            </div>

          </div>
        </div>
      </Transition>

    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'
import '@/assets/styles/student-record.css'

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Student {
  studentId: string
  name: string
  program: string
  college: string
  status: string
  gender: string
  yearLevel: number
  timeIn: string
}

// ─── STATE ───────────────────────────────────────────────────────────────────

/** Registry table — fetched directly from `students` */
const allStudents = ref<Student[]>([])

/** Attendance logs — fetched from `attendance_logs` (used for gender breakdown) */
const attendanceLogs = ref<Student[]>([])

const loadingStudents = ref(true)
const loadingLogs = ref(true)
const refreshing = ref(false)

const searchQuery = ref('')
const isCollegeOpen = ref(false)
const isProgramOpen = ref(false)

const filters = ref({
  college: 'All',
  program: 'All',
  status: 'All'
})

// GENDER DRAWER
const genderModalOpen = ref(false)
const expandedColleges = ref<Set<string>>(new Set())

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const COLLEGE_ALIASES: Record<string, string> = {
  SS: 'GS'
}

const normalizeCollege = (raw: string | null) => {
  const upper = (raw ?? '').trim().toUpperCase()
  return COLLEGE_ALIASES[upper] ?? upper
}

// ─── FETCH: STUDENTS TABLE (Registry) ────────────────────────────────────────

async function fetchStudents() {
  loadingStudents.value = true

  const pageSize = 1000
  let from = 0
  let all: any[] = []

  while (true) {
    const { data, error } = await supabase
      .from('students')
      .select('id_number, first_name, last_name, middle_name, program, college, year_level, gender, is_active')
      .range(from, from + pageSize - 1)

    if (error) {
      console.error('fetchStudents error:', error)
      break
    }

    if (!data || data.length === 0) break

    all = all.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  allStudents.value = all.map((s: any) => ({
    studentId: s.id_number ?? '',
    name: `${s.last_name ?? ''}, ${s.first_name ?? ''} ${s.middle_name ?? ''}`.trim(),
    program: s.program ?? '',
    college: normalizeCollege(s.college),
    status: s.is_active
      ? (s.year_level === 4 ? 'Graduated' : 'Enrolled')
      : 'Withdrawn',
    gender: (s.gender ?? '').toLowerCase(),
    yearLevel: s.year_level ?? 0,
    timeIn: ''
  }))

  loadingStudents.value = false
}

// ─── FETCH: ATTENDANCE LOGS (Gender Breakdown) ───────────────────────────────

async function fetchAttendanceLogs(isRefresh = false) {
  if (isRefresh) {
    refreshing.value = true
  } else {
    loadingLogs.value = true
  }

  const pageSize = 1000
  let from = 0
  let all: any[] = []

  while (true) {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select(`
        student_id,
        time_in,
        students:student_id (
          id_number,
          first_name,
          last_name,
          middle_name,
          program,
          college,
          year_level,
          gender,
          is_active
        )
      `)
      .not('time_in', 'is', null)
      .range(from, from + pageSize - 1)

    if (error) {
      console.error('fetchAttendanceLogs error:', error)
      break
    }

    if (!data || data.length === 0) break

    all = all.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  attendanceLogs.value = all
    .filter((row: any) => row.students)
    .map((row: any) => {
      const s = row.students
      return {
        studentId: s.id_number ?? '',
        name: `${s.last_name ?? ''}, ${s.first_name ?? ''} ${s.middle_name ?? ''}`.trim(),
        program: s.program ?? '',
        college: normalizeCollege(s.college),
        status: s.is_active
          ? (s.year_level === 4 ? 'Graduated' : 'Enrolled')
          : 'Withdrawn',
        gender: (s.gender ?? '').toLowerCase(),
        yearLevel: s.year_level ?? 0,
        timeIn: row.time_in
      }
    })

  loadingLogs.value = false
  refreshing.value = false
}

// ─── LIFECYCLE ───────────────────────────────────────────────────────────────

onMounted(() => {
  fetchStudents()        // Registry Database table
  fetchAttendanceLogs()  // Gender Breakdown drawer
})

// ─── REGISTRY: FILTERED TABLE ────────────────────────────────────────────────

const filteredStudents = computed(() => {
  const q = searchQuery.value.toLowerCase()

  return allStudents.value.filter(s =>
    (s.name.toLowerCase().includes(q) ||
      s.studentId.includes(q) ||
      s.program.toLowerCase().includes(q)) &&
    (filters.value.college === 'All' || s.college === filters.value.college) &&
    (filters.value.program === 'All' || s.program === filters.value.program) &&
    (filters.value.status === 'All' || s.status === filters.value.status)
  )
})

/** Dropdowns sourced from students table */
const colleges = computed(() => [...new Set(allStudents.value.map(s => s.college))].sort())
const programs = computed(() => [...new Set(allStudents.value.map(s => s.program))].sort())

// ─── GENDER BREAKDOWN (based on attendance_logs) ─────────────────────────────

/** Date filter for gender breakdown — uses attendance log timeIn */
const dateFilter = ref<'today' | 'week' | 'month' | 'all'>('all')

const filteredByDate = computed(() => {
  const now = new Date()

  return attendanceLogs.value.filter(s => {
    const t = new Date(s.timeIn)

    if (dateFilter.value === 'today') {
      return t.toDateString() === now.toDateString()
    }
    if (dateFilter.value === 'week') {
      const start = new Date()
      start.setDate(now.getDate() - 7)
      return t >= start
    }
    if (dateFilter.value === 'month') {
      return (
        t.getMonth() === now.getMonth() &&
        t.getFullYear() === now.getFullYear()
      )
    }
    return true
  })
})

const genderStats = computed(() => ({
  total: filteredByDate.value.length,
  female: filteredByDate.value.filter(s => s.gender === 'female').length,
  male: filteredByDate.value.filter(s => s.gender === 'male').length
}))

const genderByCollege = computed(() => {
  const map = new Map<
    string,
    { f: number; m: number; byYear: Map<number, { f: number; m: number }> }
  >()

  for (const s of filteredByDate.value) {
    if (!map.has(s.college)) {
      map.set(s.college, { f: 0, m: 0, byYear: new Map() })
    }

    const entry = map.get(s.college)!

    if (s.gender === 'female') entry.f++
    else if (s.gender === 'male') entry.m++

    if (!entry.byYear.has(s.yearLevel)) {
      entry.byYear.set(s.yearLevel, { f: 0, m: 0 })
    }

    const yl = entry.byYear.get(s.yearLevel)!

    if (s.gender === 'female') yl.f++
    else if (s.gender === 'male') yl.m++
  }

  return [...map.entries()]
    .map(([name, d]) => ({
      name,
      female: d.f,
      male: d.m,
      total: d.f + d.m,
      yearLevels: [...d.byYear.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([level, c]) => ({
          level,
          female: c.f,
          male: c.m,
          total: c.f + c.m
        }))
    }))
    .sort((a, b) => b.total - a.total)
})

// ─── GENDER DRAWER CONTROLS ──────────────────────────────────────────────────

function openGenderModal() {
  genderModalOpen.value = true
  expandedColleges.value = new Set()
}

function toggleCollege(name: string) {
  const next = new Set(expandedColleges.value)
  next.has(name) ? next.delete(name) : next.add(name)
  expandedColleges.value = next
}

// ─── STATUS STYLE ────────────────────────────────────────────────────────────

const statusStyle = (status: string) => {
  if (status === 'Enrolled') return 'bg-green-100 text-green-700'
  if (status === 'Withdrawn') return 'bg-red-100 text-red-600'
  if (status === 'Graduated') return 'bg-blue-100 text-blue-600'
  return 'bg-gray-100 text-gray-500'
}
</script>

<style scoped>
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
.hero-word-dark  { color: #0d2b0f; }
.hero-word-gold  { color: #e6a800; }
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

/* ─── SCROLLBAR ─── */
.table-scroll { scroll-behavior: smooth; }
.table-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.table-scroll::-webkit-scrollbar-track { background: transparent; margin: 6px 0; }
.table-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1, #94a3b8);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.table-scroll:hover::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #4a7060, #0d2b0f);
}
.table-scroll::-webkit-scrollbar-corner { background: transparent; }
.table-scroll { scrollbar-color: #0d2b0f transparent; }

/* ─── DRAWER ─── */
.drawer-enter-active,
.drawer-leave-active  { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-from,
.drawer-leave-to      { transform: translateX(100%); }

/* ─── BACKDROP ─── */
.backdrop-enter-active,
.backdrop-leave-active { transition: opacity 0.25s ease; }
.backdrop-enter-from,
.backdrop-leave-to     { opacity: 0; }

/* ─── EXPAND (year level accordion) ─── */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.28s ease, opacity 0.22s ease;
  overflow: hidden;
  max-height: 600px;
}
.expand-enter-from,
.expand-leave-to { max-height: 0; opacity: 0; }

/* ─── KEYFRAMES ─── */
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

/* ─── REFRESH SPIN ─── */
.spin {
  animation: spinOnce 0.7s linear infinite;
}
@keyframes spinOnce {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>