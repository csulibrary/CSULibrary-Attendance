<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="'SERVICES'"></Sidebar>

    <main class="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
      <header class="report-header intro-header">
        <div class="header-left">
          <div class="header-breadcrumb !mb-0">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/services/curriculum')"
            >
              BACK
            </span>

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>

            <span>Curriculum</span>
          </div>
          <h1
            class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
          >
            <span
              class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[170px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
              >Program</span
            ><span class="text-yellow-500"> Study</span>
          </h1>
          <p class="header-sub">
            Create a new curriculum information to share with the academic community.
          </p>
        </div>
      </header>

      <section
        class="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-xl font-bold uppercase tracking-wide text-[#164d23]">
            Four-Year Degree Plan
          </h2>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {{ semesterBlocks.length }} semesters
          </p>
        </div>

        <div
          v-if="isLoading"
          class="rounded-lg border border-slate-200 bg-slate-50 px-6 py-8 text-center"
        >
          <p class="text-sm text-slate-600">Loading program study plan...</p>
        </div>

        <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-6 py-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <div v-else>
          <!-- Year Sections -->
          <div class="space-y-8">
            <div v-for="yearNum in 4" :key="`year-${yearNum}`" class="space-y-4">
              <!-- Year Header -->
              <div class="flex items-center gap-3 border-b-2 border-[#164d23]/20 pb-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-[#164d23] text-sm font-bold text-white"
                >
                  {{ yearNum }}
                </div>
                <h3 class="text-lg font-bold uppercase tracking-wide text-[#164d23]">
                  Year {{ yearNum }}
                </h3>
              </div>

              <!-- Semester Grid for this Year -->
              <div class="grid gap-4 md:grid-cols-2">
                <article
                  v-for="semesterNum in [1, 2]"
                  :key="`${yearNum}-${semesterNum}`"
                  class="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div
                    class="mb-4 flex items-center justify-between border-b border-[#164d23]/10 pb-3"
                  >
                    <h4 class="text-sm font-bold uppercase tracking-wide text-[#164d23]">
                      Semester {{ semesterNum }}
                    </h4>
                    <span
                      class="rounded-full bg-[#f9a825]/20 px-2 py-1 text-xs font-semibold text-[#f9a825]"
                    >
                      {{ getSemesterBlockData(yearNum, semesterNum).rows.length }} courses
                    </span>
                  </div>

                  <ul
                    v-if="getSemesterBlockData(yearNum, semesterNum).rows.length"
                    class="space-y-3"
                  >
                    <li
                      v-for="row in getSemesterBlockData(yearNum, semesterNum).rows"
                      :key="row.id"
                      class="flex flex-col gap-2 border-l-2 border-[#f9a825] bg-white px-4 py-3 rounded transition hover:bg-[#f7faf8]"
                    >
                      <div class="flex items-start justify-between gap-2">
                        <p class="font-semibold text-slate-900 text-sm">
                          {{ row.course_code || row.subject_code || 'N/A' }}
                        </p>
                        <span
                          v-if="row.units"
                          class="whitespace-nowrap rounded-md bg-[#164d23]/10 px-2 py-1 text-xs font-semibold text-[#164d23]"
                        >
                          {{ row.units }} units
                        </span>
                      </div>
                      <p class="text-xs text-slate-600">
                        {{ row.course_title || row.subject_title || 'Untitled' }}
                      </p>
                    </li>
                  </ul>

                  <div v-else class="flex items-center justify-center py-6 text-center">
                    <p class="text-sm text-slate-500">No courses for this semester</p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <!-- Unassigned Courses Section -->
          <div v-if="unassignedRows.length" class="mt-10 space-y-4">
            <div class="flex items-center gap-3 border-b-2 border-amber-500/30 pb-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white"
              >
                !
              </div>
              <h3 class="text-lg font-bold uppercase tracking-wide text-amber-700">
                Courses Pending Semester Assignment
              </h3>
            </div>

            <article class="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <ul class="space-y-3">
                <li
                  v-for="row in unassignedRows"
                  :key="row.id"
                  class="flex flex-col gap-2 border-l-2 border-amber-500 bg-white px-4 py-3 rounded transition hover:bg-amber-50/50"
                >
                  <div class="flex items-start justify-between gap-2">
                    <p class="font-semibold text-slate-900 text-sm">
                      {{ row.course_code || row.subject_code || 'N/A' }}
                    </p>
                    <span
                      v-if="row.units"
                      class="whitespace-nowrap rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"
                    >
                      {{ row.units }} units
                    </span>
                  </div>
                  <p class="text-xs text-slate-600">
                    {{ row.course_title || row.subject_title || 'Untitled' }}
                  </p>
                  <p class="text-xs text-amber-600 font-medium">
                    {{ row.semester_label || 'No semester label provided' }}
                  </p>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useCurriculumData } from '@/composables/useCurriculumData'
import type { ProgramStudyPlanRow } from '@/types/Curriculum'

const route = useRoute()
const router = useRouter()

const {
  activeProgramId,
  activeSpecializationId,
  isLoading,
  errorMessage,
  studyPlans,
  fetchCurriculumData,
} = useCurriculumData()

type SemesterBlock = {
  key: string
  label: string
  year: number
  semester: number
  rows: ProgramStudyPlanRow[]
}

const semesterBlueprint: Array<Omit<SemesterBlock, 'rows'>> = [
  { key: '1-1', label: 'FIRST YEAR, FIRST SEMESTER', year: 1, semester: 1 },
  { key: '1-2', label: 'FIRST YEAR, SECOND SEMESTER', year: 1, semester: 2 },
  { key: '2-1', label: 'SECOND YEAR, FIRST SEMESTER', year: 2, semester: 1 },
  { key: '2-2', label: 'SECOND YEAR, SECOND SEMESTER', year: 2, semester: 2 },
  { key: '3-1', label: 'THIRD YEAR, FIRST SEMESTER', year: 3, semester: 1 },
  { key: '3-2', label: 'THIRD YEAR, SECOND SEMESTER', year: 3, semester: 2 },
  { key: '4-1', label: 'FOURTH YEAR, FIRST SEMESTER', year: 4, semester: 1 },
  { key: '4-2', label: 'FOURTH YEAR, SECOND SEMESTER', year: 4, semester: 2 },
]

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const matchesSemesterBlock = (
  row: ProgramStudyPlanRow,
  block: Omit<SemesterBlock, 'rows'>,
): boolean => {
  if (row.year_level != null && row.semester != null) {
    return Number(row.year_level) === block.year && Number(row.semester) === block.semester
  }

  const semesterLabel = normalizeText(row.semester_label || '')
  const blockLabel = normalizeText(block.label)
  const blockKey = normalizeText(block.key)

  if (!semesterLabel) {
    return false
  }

  return (
    semesterLabel === blockLabel ||
    semesterLabel.includes(blockLabel) ||
    semesterLabel.includes(blockKey)
  )
}

const semesterBlocks = computed<SemesterBlock[]>(() => {
  return semesterBlueprint.map((slot) => ({
    ...slot,
    rows: studyPlans.value.filter((row) => matchesSemesterBlock(row, slot)),
  }))
})

const unassignedRows = computed(() => {
  const assignedRowIds = new Set(
    semesterBlocks.value.flatMap((block) => block.rows.map((row) => row.id)),
  )

  return studyPlans.value.filter((row) => !assignedRowIds.has(row.id))
})

// Helper to get semester block data for a specific year and semester
const getSemesterBlockData = (year: number, semester: number): SemesterBlock => {
  return (
    semesterBlocks.value.find((block) => block.year === year && block.semester === semester) || {
      key: `${year}-${semester}`,
      label: `Year ${year}, Semester ${semester}`,
      year,
      semester,
      rows: [],
    }
  )
}

const goBackToCurriculumInfo = async (): Promise<void> => {
  if (!activeProgramId.value) {
    await router.push({ name: 'services-curriculum' })
    return
  }

  await router.push({
    name: 'curriculum-info-dynamic',
    params: {
      programId: activeProgramId.value,
      ...(activeSpecializationId.value ? { specializationId: activeSpecializationId.value } : {}),
    },
  })
}

onMounted(() => {
  void fetchCurriculumData(route, { allowAllStudyPlans: true })
})

watch(
  () => route.fullPath,
  () => {
    void fetchCurriculumData(route, { allowAllStudyPlans: true })
  },
)
</script>

<style scoped>
.header-sub {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>
