<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar />
    <main class="flex-1 p-8 overflow-y-auto">
      <header class="report-header intro-header mb-6">
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
              <span class="heroTitlePrimary">Attendance</span>
              <span class="heroTitleAccent">Logs</span>
            </h1>

            <div class="heroUnderline"></div>
          </div>
          <p class="hero-subtitle">
            View and monitor attendance records by department, course, and time period.
          </p>
        </div>
      </header>

      <div class="kpi-strip mb-8 flex gap-4">
        <div
          v-for="(stat, i) in attendanceStats"
          :key="i"
          class="kpi-card flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 transition-all hover:shadow-md"
          :style="{ animationDelay: i * 0.1 + 's' }"
        >
          <div
            class="kpi-icon w-12 h-12 flex items-center justify-center rounded-lg"
            :style="{ background: stat.color + '18', color: stat.color }"
          >
            <i :class="stat.icon" class="text-xl"></i>
          </div>
          <div class="kpi-body">
            <div class="kpi-value text-2xl font-bold text-gray-800">{{ stat.value }}</div>
            <span class="kpi-label text-xs uppercase tracking-wider font-bold text-gray-500">{{
              stat.label
            }}</span>
          </div>
        </div>
      </div>

      <section
        class="panel mb-8 slide-up bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        style="animation-delay: 0.1s"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div class="filter-group">
            <label class="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest"
              >Select Department</label
            >
            <select
              v-model="filters.department"
              class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-green-700 outline-none transition-all"
            >
              <option value="All">All Colleges</option>
              <option v-for="(courses, dept) in departmentMapping" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest"
              >Select Course</label
            >
            <select
              v-model="filters.course"
              class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-green-700 outline-none transition-all"
            >
              <option value="All">All Programs</option>
              <option v-for="course in availableCourses" :key="course" :value="course">
                {{ course }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest"
              >Select Limit</label
            >
            <input
              type="number"
              v-model="filters.limit"
              class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          <div class="flex gap-4">
            <button
              @click="handleShowRanking"
              class="w-37.5 bg-[#0d2b0f] text-white px-6 py-2.5 rounded-lg text-xs font-black tracking-widest hover:bg-green-900 transition-all shadow-lg shadow-green-900/20 uppercase"
            >
              Display
            </button>
            <button
              class="w-37.5 bg-yellow-500 border border-transparent text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-all uppercase tracking-widest"
            >
              Export
            </button>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section
          class="panel xl:col-span-2 slide-up bg-white rounded-xl shadow-sm border border-gray-100"
          style="animation-delay: 0.3s"
        >
          <div
            class="panel-head border-b border-gray-50 flex justify-between items-center bg-gray-50/50"
          >
            <div>
              <h2 class="panel-title text-lg font-bold text-gray-800">Student Visitor Ranking</h2>
              <p class="panel-sub text-xs text-gray-500">
                Leaderboard based on individual visit frequency
              </p>
            </div>
            <div class="px-6 py-3 text-xs text-gray-500 font-semibold">
              {{ displayCountText }}
            </div>
            <span
              @click="toggleShowAll"
              class="text-xs font-bold text-green-700 underline cursor-pointer"
              style="margin-top: 15px; margin-right: 20px"
            >
              {{ showAll ? 'Show Less' : 'See all Records' }}
            </span>
          </div>
          <div class="overflow-y-auto max-h-105">
            <table class="report-table w-full">
              <thead class="bg-gray-50/50">
                <tr>
                  <th
                    class="py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-left"
                  >
                    Visits
                  </th>
                  <th
                    class="py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-left"
                  >
                    ID Number
                  </th>
                  <th
                    class="py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-left"
                  >
                    Full Name
                  </th>
                  <th
                    class="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center"
                  >
                    Course
                  </th>
                  <th
                    class="py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center"
                  >
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in filteredStudents"
                  :key="student.id_number"
                  class="table-row-animate border-t border-gray-50 hover:bg-green-50/30 transition-colors"
                  :style="{ animationDelay: 0.4 + index * 0.05 + 's' }"
                >
                  <td class="p-4">
                    <span
                      class="font-black text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs"
                      >{{ student.visits }}</span
                    >
                  </td>
                  <td class="p-4 text-sm font-medium text-gray-600">{{ student.id_number }}</td>
                  <td class="p-4 text-sm font-bold text-gray-800 uppercase">{{ student.name }}</td>
                  <td
                    class="p-4 text-sm text-start font-semibold text-gray-500"
                    style="padding-left: 28px"
                  >
                    {{ student.course }}
                  </td>
                  <td class="p-4 text-sm text-center font-bold text-gray-700">
                    {{ student.year_level }}
                  </td>
                </tr>
                <tr v-if="filteredStudents.length === 0">
                  <td colspan="5" class="p-10 text-center text-gray-400 text-sm italic">
                    No records found for the selected filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          class="panel slide-up bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          style="animation-delay: 0.4s"
        >
          <!-- HEADER -->
          <div class="ar-panel-head p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 class="ar-panel-title text-lg font-bold text-gray-800">College Ranking</h2>
            <p class="panel-sub text-xs text-gray-500">Top College Visitor</p>
          </div>

          <!-- SCROLL AREA -->
          <div class="overflow-y-auto max-h-105">
            <table class="ar-table report-table w-full">
              <tbody>
                <tr
                  v-for="(college, index) in collegeData"
                  :key="college.name"
                  class="border-t border-gray-50 hover:bg-green-50/30 transition"
                >
                  <!-- RANK -->
                  <td class="p-4 w-12 text-center">
                    <span
                      :class="['rank-pill', index === 0 ? 'bg-yellow-400' : 'bg-gray-300']"
                      class="text-[10px] font-black px-2 py-0.5 rounded text-white"
                    >
                      {{ index + 1 }}
                    </span>
                  </td>

                  <!-- COLLEGE INFO -->
                  <td class="p-4">
                    <div class="text-xs font-bold text-gray-800">
                      {{ college.name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ college.code }}
                    </div>
                  </td>

                  <!-- COUNT -->
                  <td class="p-4 text-right font-black text-green-800">
                    {{ college.count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

/* =====================================================
  TYPES
===================================================== */
interface Log {
  student_id: string
  attendance_type: string
  college: string
  program: string
  name: string
  year_level: number | string
}

/* =====================================================
  STATE
===================================================== */
const logs = ref<Log[]>([])
const loading = ref(false)

const filters = ref({
  department: 'All',
  course: 'All',
  limit: 10,
})

/* =====================================================
  FETCH DATA
===================================================== */

const showAll = ref(false)

const fetchAttendance = async () => {
  loading.value = true

  const { data, error } = await supabase.from('attendance_logs').select(`
      student_id,
      attendance_type,
      students (
        college,
        program,
        first_name,
        last_name,
        year_level
      )
    `)

  if (error) {
    console.error('Fetch error:', error.message)
    loading.value = false
    return
  }

  logs.value = (data || []).map((item: any) => {
    const s = item.students

    return {
      student_id: item.student_id,
      attendance_type: item.attendance_type || 'unknown',
      college: s?.college || 'Unknown',
      program: s?.program || 'Unknown',
      name: s ? `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() : 'Unknown Student',
      year_level: s?.year_level ?? '-',
    }
  })

  loading.value = false
}

/* =====================================================
  STUDENT RANKING
===================================================== */
const studentRanking = computed(() => {
  const map: Record<string, any> = {}

  logs.value.forEach((log) => {
    if (!map[log.student_id]) {
      map[log.student_id] = {
        id_number: log.student_id,
        name: log.name,
        course: log.program,
        year_level: log.year_level,
        visits: 0,
      }
    }

    map[log.student_id].visits++
  })

  return Object.values(map).sort((a: any, b: any) => b.visits - a.visits)
})

/* =====================================================
  FILTERED STUDENTS
===================================================== */
const filteredStudents = computed(() => {
  let data = studentRanking.value

  if (filters.value.department !== 'All') {
    data = data.filter(
      (s) =>
        logs.value.find((l) => l.student_id === s.id_number)?.college === filters.value.department,
    )
  }

  if (filters.value.course !== 'All') {
    data = data.filter((s) => s.course === filters.value.course)
  }

  return showAll.value ? data : data.slice(0, filters.value.limit)
})

/* =====================================================
  DEPARTMENT + COURSE (DYNAMIC)
===================================================== */
const departmentMapping = computed(() => {
  const map: Record<string, Set<string>> = {}

  logs.value.forEach((log) => {
    const college = log.college

    if (!map[college]) {
      map[college] = new Set<string>()
    }

    map[college].add(log.program)
  })

  return map
})

const availableCourses = computed(() => {
  if (filters.value.department === 'All') {
    return [...new Set(logs.value.map((l) => l.program))]
  }

  return [
    ...new Set(
      logs.value.filter((l) => l.college === filters.value.department).map((l) => l.program),
    ),
  ]
})

/* =====================================================
  COLLEGE RANKING
===================================================== */
const collegeData = computed(() => {
  const counts: Record<string, number> = {}

  logs.value.forEach((log) => {
    counts[log.college] = (counts[log.college] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      code: name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
})

/* =====================================================
  KPI STATS
===================================================== */
const attendanceStats = computed(() => [
  {
    label: 'Total Visits',
    value: logs.value.length,
    icon: 'fas fa-users',
    color: '#166534',
  },
  {
    label: 'Top College',
    value: collegeData.value[0]?.name || 'N/A',
    icon: 'fas fa-trophy',
    color: '#ca8a04',
  },
  {
    label: 'Programs',
    value: new Set(logs.value.map((l) => l.program)).size,
    icon: 'fas fa-book',
    color: '#2563eb',
  },
  {
    label: 'Colleges',
    value: new Set(logs.value.map((l) => l.college)).size,
    icon: 'fas fa-building',
    color: '#7c3aed',
  },
])

// Counttt
const displayCountText = computed(() => {
  const total = studentRanking.value.length
  const shown = filteredStudents.value.length

  return `Showing ${shown} of ${total} records`
})

/* =====================================================
  ACTIONS
===================================================== */
const handleShowRanking = () => {
  showAll.value = false
  console.log('Filters applied:', filters.value)
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

/* =====================================================
  LIFECYCLE
===================================================== */
onMounted(() => {
  fetchAttendance()
})
</script>

<style scoped>
.table-row-animate {
  opacity: 0;
  transform: translateY(10px);
  animation: slideIn 0.4s forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rank-pill {
  display: inline-block;
  min-width: 20px;
}

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
  width: 250px;
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
