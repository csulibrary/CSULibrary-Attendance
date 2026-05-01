<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import Sidebar from "@/components/Sidebar.vue"
import { getAttendanceLogs } from "@/services/attendanceService"
import { supabase } from "@/lib/supabase"

type Student = {
  id_number?: string
  first_name?: string
  last_name?: string
  program?: string
  college?: string
  year_level?: string | number
}

type AttendanceLog = {
  id: string
  student_id: string
  time_in: string | null
  time_out: string | null
  attendance_type: string | null
  event_id: string | null
  duration_minutes: number | null
  students?: Student | Student[] | null
}

type StudentFilterRow = {
  program?: string | null
  college?: string | null
  year_level?: string | number | null
}

type ProgramOption = {
  program_code?: string | null
  program_name?: string | null
  is_active?: boolean | null
}

type CollegeOption = {
  code?: string | null
  name?: string | null
  level?: string | null
}

type AttendanceFilters = ReturnType<typeof buildFilters>

const logs = ref<AttendanceLog[]>([])
const studentFilterRows = ref<StudentFilterRow[]>([])
const programsMasterList = ref<ProgramOption[]>([])
const collegesMasterList = ref<CollegeOption[]>([])

const totalRecords = ref(0)
const loading = ref(false)
const filterOptionsLoading = ref(false)
const exporting = ref(false)
const errorMessage = ref("")

const search = ref("")
const selectedProgram = ref("")
const selectedCollege = ref("")
const selectedYearLevel = ref("")
const selectedAttendanceType = ref("")
const selectedStatus = ref("")
const selectedDate = ref("")

const currentPage = ref(1)
const itemsPerPage = 10

const normalizeText = (value: unknown) => {
  return String(value ?? "").trim()
}

const normalizeCode = (value: unknown) => {
  return normalizeText(value).toUpperCase().replace(/\s+/g, "")
}

const isGraduateStudiesValue = (value: unknown) => {
  const text = normalizeCode(value)

  return (
    text === "GS" ||
    text === "SS" ||
    text.includes("GRADUATE") ||
    text.includes("MASTER") ||
    text.includes("DOCTOR") ||
    text.startsWith("MS") ||
    text.startsWith("MA") ||
    text.startsWith("PHD") ||
    text.startsWith("MSC") ||
    text.startsWith("MSCED") ||
    text.startsWith("SPCLSTUD")
  )
}

const isUndergraduateYearLevel = (value: unknown) => {
  const year = normalizeText(value)
  return ["1", "2", "3", "4"].includes(year)
}

const normalizeStudent = (student: Student | Student[] | null | undefined): Student => {
  if (Array.isArray(student)) {
    return student[0] || {}
  }

  return student || {}
}

const buildFilters = () => {
  return {
    search: search.value,
    program: selectedProgram.value,
    college: selectedCollege.value,
    yearLevel: selectedYearLevel.value,
    attendanceType: selectedAttendanceType.value,
    date: selectedDate.value,
    status:
      selectedStatus.value === "Checked In"
        ? "checked_in"
        : selectedStatus.value === "Checked Out"
          ? "checked_out"
          : "",
  } as const
}

const getEmptyFilters = (): AttendanceFilters => {
  return {
    search: "",
    program: "",
    college: "",
    yearLevel: "",
    attendanceType: "",
    date: "",
    status: "",
  } as const
}

const getUniqueSortedValues = (values: unknown[]) => {
  return [...new Set(values.map(normalizeText).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  )
}

const fetchStudentsForFilterOptions = async () => {
  const pageSize = 1000
  let from = 0
  let allRows: StudentFilterRow[] = []

  while (true) {
    const { data, error } = await supabase
      .from("students")
      .select("program, college, year_level")
      .range(from, from + pageSize - 1)

    if (error) {
      throw error
    }

    const rows = data || []
    allRows = [...allRows, ...rows]

    if (rows.length < pageSize) {
      break
    }

    from += pageSize
  }

  studentFilterRows.value = allRows
}

const fetchMasterFilterTables = async () => {
  const [programResult, collegeResult] = await Promise.allSettled([
    supabase
      .from("programs")
      .select("program_code, program_name, is_active")
      .order("program_code", { ascending: true }),

    supabase
      .from("colleges")
      .select("code, name, level")
      .order("code", { ascending: true }),
  ])

  if (programResult.status === "fulfilled") {
    if (programResult.value.error) {
      console.error("Failed to fetch programs:", programResult.value.error)
    } else {
      programsMasterList.value = programResult.value.data || []
    }
  }

  if (collegeResult.status === "fulfilled") {
    if (collegeResult.value.error) {
      console.error("Failed to fetch colleges:", collegeResult.value.error)
    } else {
      collegesMasterList.value = collegeResult.value.data || []
    }
  }
}

const fetchFilterOptions = async () => {
  filterOptionsLoading.value = true

  try {
    await Promise.all([
      fetchStudentsForFilterOptions(),
      fetchMasterFilterTables(),
    ])
  } catch (error) {
    console.error("Failed to fetch filter options:", error)
  } finally {
    filterOptionsLoading.value = false
  }
}

const fetchAttendanceLogs = async () => {
  loading.value = true
  errorMessage.value = ""

  try {
    const result = await getAttendanceLogs({
      filters: buildFilters(),
      page: currentPage.value,
      pageSize: itemsPerPage,
    })

    logs.value = result.data || []
    totalRecords.value = result.count || 0
  } catch (error: unknown) {
    console.error("Failed to fetch attendance logs:", error)

    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = "Failed to load attendance logs."
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchFilterOptions()
  await fetchAttendanceLogs()
})

const formatDateTime = (value: string | null) => {
  if (!value) return "--"

  return new Date(value).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const uniquePrograms = computed(() => {
  const fromProgramsTable = programsMasterList.value
    .filter((program) => program.is_active !== false)
    .filter((program) => !isGraduateStudiesValue(program.program_code))
    .filter((program) => !isGraduateStudiesValue(program.program_name))
    .map((program) => program.program_code)

  const fromStudents = studentFilterRows.value
    .filter((student) => isUndergraduateYearLevel(student.year_level))
    .filter((student) => !isGraduateStudiesValue(student.program))
    .filter((student) => !isGraduateStudiesValue(student.college))
    .map((student) => student.program)

  return getUniqueSortedValues([...fromProgramsTable, ...fromStudents])
})

const uniqueColleges = computed(() => {
  const allowedCollegeCodes = collegesMasterList.value
    .filter((college) => !isGraduateStudiesValue(college.code))
    .filter((college) => !isGraduateStudiesValue(college.name))
    .map((college) => normalizeCode(college.code))

  const fromCollegesTable = collegesMasterList.value
    .filter((college) => !isGraduateStudiesValue(college.code))
    .filter((college) => !isGraduateStudiesValue(college.name))
    .map((college) => college.code)

  const fromStudents = studentFilterRows.value
    .filter((student) => isUndergraduateYearLevel(student.year_level))
    .map((student) => student.college)
    .filter((college) => {
      const code = normalizeCode(college)
      return allowedCollegeCodes.includes(code)
    })

  return getUniqueSortedValues([...fromCollegesTable, ...fromStudents])
})

const uniqueYearLevels = computed(() => {
  return ["1", "2", "3", "4"]
})

const uniqueAttendanceTypes = computed(() => {
  const values = logs.value
    .map((log) => log.attendance_type)
    .filter(Boolean) as string[]

  const fallbackTypes = ["library", "event", "visitors"]

  return getUniqueSortedValues([...values, ...fallbackTypes])
})

const hasActiveFilters = computed(() => {
  return (
    !!search.value ||
    !!selectedProgram.value ||
    !!selectedCollege.value ||
    !!selectedYearLevel.value ||
    !!selectedAttendanceType.value ||
    !!selectedStatus.value ||
    !!selectedDate.value
  )
})

const emptyMessage = computed(() => {
  if (
    selectedProgram.value ||
    selectedCollege.value ||
    selectedYearLevel.value ||
    selectedDate.value
  ) {
    return "No attendance record found for the selected filter."
  }

  return "No attendance records found."
})

const emptyHint = computed(() => {
  if (selectedProgram.value || selectedCollege.value || selectedYearLevel.value) {
    return "This program, college, or year level exists in the masterlist, but it has no attendance record for the selected date/filter."
  }

  return "Try changing your search or filter selection."
})

const paginatedLogs = computed(() => {
  return logs.value
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalRecords.value / itemsPerPage))
})

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(
  [
    search,
    selectedProgram,
    selectedCollege,
    selectedYearLevel,
    selectedAttendanceType,
    selectedStatus,
    selectedDate,
  ],
  () => {
    currentPage.value = 1
    fetchAttendanceLogs()
  }
)

watch(currentPage, () => {
  fetchAttendanceLogs()
})

const clearFilters = () => {
  search.value = ""
  selectedProgram.value = ""
  selectedCollege.value = ""
  selectedYearLevel.value = ""
  selectedAttendanceType.value = ""
  selectedStatus.value = ""
  selectedDate.value = ""
  currentPage.value = 1
}

const saveExportHistory = async (fileName: string, fileType: string, rowCount: number) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const exportedByName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email ||
      "Unknown User"

    const { error } = await supabase.from("export_batches").insert({
      file_name: fileName,
      file_type: fileType,
      row_count: rowCount,
      uploaded_at: new Date().toISOString(),
      exported_by_name: exportedByName,
      status: "success",
    })

    if (error) {
      console.error("Failed to save export history:", error)
      alert(`Failed to save export history: ${error.message}`)
    }
  } catch (error) {
    console.error("Unexpected export history error:", error)
    alert("Unexpected export history error. Check console.")
  }
}

const getAllAttendanceLogsForExport = async () => {
  const pageSize = 1000
  let page = 1
  let allLogs: AttendanceLog[] = []

  const exportFilters: AttendanceFilters = hasActiveFilters.value
    ? buildFilters()
    : getEmptyFilters()

  while (true) {
    const result = await getAttendanceLogs({
      filters: exportFilters,
      page,
      pageSize,
    })

    const rows = result.data || []
    allLogs = [...allLogs, ...rows]

    if (rows.length < pageSize) {
      break
    }

    page++
  }

  return allLogs
}

const exportToCSV = async () => {
  exporting.value = true
  errorMessage.value = ""

  try {
    const exportLogs = await getAllAttendanceLogsForExport()

    const headers = [
      "ID Number",
      "Student Name",
      "Program",
      "College",
      "Year Level",
      "Attendance Type",
      "Time In",
      "Time Out",
      "Duration (mins)",
    ]

    const rows = exportLogs.map((log) => {
      const student = normalizeStudent(log.students)

      return [
        student.id_number || "",
        `${student.first_name || ""} ${student.last_name || ""}`.trim(),
        student.program || "",
        student.college || "",
        student.year_level || "",
        log.attendance_type || "",
        log.time_in ? formatDateTime(log.time_in) : "",
        log.time_out ? formatDateTime(log.time_out) : "",
        log.duration_minutes ?? "",
      ]
    })

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const fileDate = selectedDate.value || new Date().toISOString().slice(0, 10)

    const fileName = selectedDate.value
      ? `attendance-logs-${selectedDate.value}.csv`
      : hasActiveFilters.value
        ? `attendance-logs-filtered-${fileDate}.csv`
        : `attendance-logs-all-${fileDate}.csv`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    await saveExportHistory(fileName, "CSV", exportLogs.length)
  } catch (error: unknown) {
    console.error("Failed to export attendance logs:", error)

    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = "Failed to export attendance logs."
    }
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="layoutShell">
    <div class="sidebarWrap">
      <Sidebar />
    </div>

    <main class="mainArea">
      <div class="page">
        <div class="wrap">
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
          </div>

          <div class="toolbar">
            <div class="toolbarLeft">
              <div class="stackCol">
                <select v-model="selectedProgram" class="control selectControl">
                  <option value="">All Programs</option>
                  <option
                    v-for="program in uniquePrograms"
                    :key="program"
                    :value="program"
                  >
                    {{ program }}
                  </option>
                </select>

                <input
                  v-model="selectedDate"
                  type="date"
                  class="control inputControl dateControl"
                />
              </div>

              <div class="stackCol">
                <select v-model="selectedCollege" class="control selectControl">
                  <option value="">All Colleges</option>
                  <option
                    v-for="college in uniqueColleges"
                    :key="college"
                    :value="college"
                  >
                    {{ college }}
                  </option>
                </select>

                <button
                  @click="clearFilters"
                  :class="['control actionBtn clearButton', { clearButtonActive: hasActiveFilters }]"
                >
                  Reset
                </button>
              </div>

              <select v-model="selectedYearLevel" class="control selectControl narrow">
                <option value="">All Year</option>
                <option
                  v-for="year in uniqueYearLevels"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>

              <select
                v-model="selectedAttendanceType"
                class="control selectControl medium"
              >
                <option value="">All Types</option>
                <option
                  v-for="type in uniqueAttendanceTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="toolbarRight">
              <button
                @click="exportToCSV"
                class="exportBtn"
                :disabled="exporting"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                <span>{{ exporting ? "Exporting..." : "Export CSV" }}</span>
              </button>

              <input
                v-model="search"
                type="text"
                placeholder="Search ID number or student name..."
                class="control searchControl"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="errorBox">
            {{ errorMessage }}
          </div>

          <div class="tableShell">
            <div class="tableScroll">
              <table class="tbl">
                <thead>
                  <tr>
                    <th>ID Number</th>
                    <th>Student Name</th>
                    <th>Program</th>
                    <th>College</th>
                    <th>Year Level</th>
                    <th>Attendance Type</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Duration</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="loading">
                    <td colspan="9" class="empty">
                      Loading attendance logs...
                    </td>
                  </tr>

                  <tr v-else-if="paginatedLogs.length === 0">
                    <td colspan="9" class="empty">
                      No attendance records found.
                      <div class="emptyHint">
                        Try changing your search or filter selection.
                      </div>
                    </td>
                  </tr>

                  <tr
                    v-for="log in paginatedLogs"
                    :key="log.id"
                  >
                    <td data-label="ID Number" class="strong">
                      {{ normalizeStudent(log.students).id_number || "--" }}
                    </td>

                    <td data-label="Student Name">
                      {{
                        `${normalizeStudent(log.students).first_name || ""} ${normalizeStudent(log.students).last_name || ""}`.trim() || "--"
                      }}
                    </td>

                    <td data-label="Program">
                      {{ normalizeStudent(log.students).program || "--" }}
                    </td>

                    <td data-label="College">
                      {{ normalizeStudent(log.students).college || "--" }}
                    </td>

                    <td data-label="Year Level">
                      {{ normalizeStudent(log.students).year_level || "--" }}
                    </td>

                    <td data-label="Attendance Type">
                      {{ log.attendance_type || "--" }}
                    </td>

                    <td data-label="Time In">
                      {{ formatDateTime(log.time_in) }}
                    </td>

                    <td data-label="Time Out">
                      {{ formatDateTime(log.time_out) }}
                    </td>

                    <td data-label="Duration" class="muted">
                      {{ log.duration_minutes !== null && log.duration_minutes !== undefined ? `${log.duration_minutes} mins` : "--" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="foot">
              <div class="footText">
                Tip: Use the filters and search to narrow down records faster.
              </div>

              <div class="pager" v-if="totalRecords > itemsPerPage">
                <button
                  v-if="currentPage > 1"
                  class="pagerBtn"
                  @click="goToPreviousPage"
                >
                  Previous
                </button>

                <button
                  v-if="currentPage < totalPages"
                  class="pagerBtn"
                  @click="goToNextPage"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div class="summaryBar">
            <span class="summaryText">
              Showing
              <span class="summaryStrong">
                {{ totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
              </span>
              -
              <span class="summaryStrong">
                {{ Math.min(currentPage * itemsPerPage, totalRecords) }}
              </span>
              of <span class="summaryStrong">{{ totalRecords }}</span> records
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  --primary: #0d2b0f;
  --primary-2: #165b1b;
  --background-color: var(--color-slate-50);
  --card: rgba(255, 255, 255, 0.92);
  --border: rgba(13, 43, 15, 0.09);
  --shadow: rgba(13, 43, 15, 0.07);
  --danger: #d32f2f;
  --info: #0288d1;

  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: clamp(10px, 2vw, 8px);
  background: linear-gradient(180deg, var(--bg) 0%, #ffffff 100%);
}

.wrap {
  width: 100%;
  height: 100%;
  margin: 0;
}

.headBlock {
  padding: 20px clamp(14px, 2vw, 24px) 16px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, #ffffff 0%, var(--bg-strip) 100%);
}

.titleHero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  color: #003b0f;
}

.heroTitleAccent {
  color: #efb72d;
}

.heroUnderline {
  margin-top: 14px;
  width: 150px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #214b1f 0%, #c49317 100%);
}

.toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px clamp(14px, 2vw, 24px) 10px;
  flex-wrap: wrap;
}

.toolbarLeft {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbarRight {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  margin-left: auto;
  width: 340px;
  max-width: 100%;
}

.exportBtn {
  width: 170px;
  height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 18px;
  background: #0a3a10;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 160ms ease;
  box-shadow: 0 8px 18px rgba(10, 58, 16, 0.18);
}

.exportBtn:hover:not(:disabled) {
  background: linear-gradient(180deg, #165b1b 0%, #1d6a22 100%);
  transform: translateY(-1px);
}

.exportBtn:active {
  transform: translateY(0);
}

.exportBtn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.stackCol {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control {
  height: 52px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: #ffffff;
  color: rgba(13, 43, 15, 0.85);
  box-shadow: 0 8px 18px rgba(13, 43, 15, 0.04);
  box-sizing: border-box;
}

.selectControl,
.inputControl,
.searchControl,
.actionBtn {
  font-size: 0.65rem;
  font-weight: 700;
}

.selectControl {
  min-width: 176px;
  padding: 0 16px;
  outline: none;
}

.selectControl.narrow {
  min-width: 138px;
}

.selectControl.medium {
  min-width: 158px;
}

.inputControl {
  min-width: 176px;
  padding: 0 16px;
  outline: none;
}

.dateControl {
  appearance: auto;
}

.searchControl {
  width: min(390px, 100%);
  min-width: 280px;
  padding: 0 16px;
  outline: none;
}

.searchControl::placeholder,
.inputControl::placeholder {
  color: rgba(13, 43, 15, 0.35);
  font-weight: 800;
}

.actionBtn {
  min-width: 176px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.clearButton {
  background: linear-gradient(180deg, #f9fbf8);
  color: rgba(13, 43, 15, 0.78);
  border: 1px solid rgba(13, 43, 15, 0.1);
}

.clearButton:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ece6d8 100%);
  color: #0d2b0f;
  border-color: rgba(13, 43, 15, 0.18);
  box-shadow: 0 10px 20px rgba(13, 43, 15, 0.08);
  transform: translateY(-1px);
}

.clearButton:active {
  transform: translateY(0);
}

.clearButton:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(239, 183, 45, 0.22),
    0 10px 20px rgba(13, 43, 15, 0.08);
}

.clearButtonActive {
  background: linear-gradient(180deg, #efb72d 0%, #dca514 100%);
  color: #0d2b0f;
  border-color: rgba(205, 145, 9, 0.45);
  box-shadow: 0 10px 22px rgba(239, 183, 45, 0.22);
}

.clearButtonActive:hover {
  background: linear-gradient(180deg, #f3bf3b 0%, #d69d09 100%);
  color: #08210b;
  box-shadow: 0 12px 24px rgba(239, 183, 45, 0.28);
}

.summaryBar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2px clamp(14px, 2vw, 24px) 10px;
}

.summaryText {
  font-size: 13px;
  font-weight: 700;
  color: rgba(13, 43, 15, 0.58);
}

.summaryStrong {
  font-weight: 900;
  color: rgba(13, 43, 15, 0.92);
}

.errorBox {
  margin: 0 clamp(14px, 2vw, 24px) 10px;
  border-radius: 16px;
  border: 1px solid rgba(211, 47, 47, 0.16);
  background: rgba(211, 47, 47, 0.08);
  padding: 12px 14px;
  color: #b71c1c;
  font-weight: 800;
}

.tableShell {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(10px, 1.6vw, 10px);
}

.tableScroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 18px;
  border: 1px solid var(--border);
  background:
    radial-gradient(900px circle at 18% 18%, rgba(34, 197, 94, 0.14), transparent 60%),
    radial-gradient(700px circle at 85% 35%, rgba(16, 185, 129, 0.1), transparent 62%),
    linear-gradient(180deg, #f4fbf6 0%, #eef8f1 55%, #ffffff 100%);
  scrollbar-width: none;
}

.tableScroll::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.tbl {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.tbl tbody tr {
  background: #ffffff;
}

.tbl thead tr {
  background: var(--primary);
}

.tbl th {
  text-align: left;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 900;
  white-space: nowrap;
}

.tbl td {
  padding: 14px 16px;
  border-top: 1px solid var(--border);
  font-size: 0.65rem;
  color: rgba(13, 43, 15, 0.85);
  vertical-align: middle;
  white-space: nowrap;
}

.tbl tbody tr:hover {
  background: rgba(239, 231, 217, 0.55);
}

.muted {
  color: rgba(13, 43, 15, 0.65);
}

.strong {
  font-weight: 900;
  color: rgba(13, 43, 15, 0.92);
}

.empty {
  text-align: center;
  padding: 28px 16px;
  color: rgba(13, 43, 15, 0.55);
  font-weight: 800;
}

.emptyHint {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(13, 43, 15, 0.45);
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 6px 2px;
}

.footText {
  font-size: 12px;
  color: rgba(13, 43, 15, 0.55);
  padding-left: 6px;
}

.pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagerBtn {
  border: none;
  background: #0d2b0f;
  color: #fff;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

@media (max-width: 1100px) {
  .toolbar {
    align-items: stretch;
  }

  .toolbarRight {
    width: 100%;
    margin-left: 0;
    justify-content: stretch;
  }

  .searchControl {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 640px) {
  .toolbarLeft {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }

  .stackCol {
    width: 100%;
  }

  .selectControl,
  .inputControl,
  .actionBtn,
  .searchControl {
    width: 100%;
    min-width: 0;
  }

  .summaryBar {
    justify-content: flex-start;
  }

  .tbl thead {
    display: none;
  }

  .tbl,
  .tbl tbody,
  .tbl tr,
  .tbl td {
    display: block;
    width: 100%;
    white-space: normal;
  }

  .tbl tr {
    border-top: 1px solid var(--border);
    padding: 10px 10px 6px;
  }

  .tbl td {
    border: 0;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .tbl td::before {
    content: attr(data-label);
    font-weight: 900;
    color: rgba(13, 43, 15, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 10px;
    line-height: 1.2;
  }
}

.layoutShell {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--bg) 0%, #ffffff 100%);
}

.sidebarWrap {
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
  z-index: 30;
}

.mainArea {
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.headBlock,
.toolbar,
.errorBox,
.tableShell,
.summaryBar {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideUp 0.6s ease forwards;
}

.headBlock {
  animation-delay: 0.08s;
}

.toolbar {
  animation-delay: 0.18s;
}

.errorBox,
.tableShell {
  animation-delay: 0.3s;
}

.summaryBar {
  animation-delay: 0.42s;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(1px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
</style>