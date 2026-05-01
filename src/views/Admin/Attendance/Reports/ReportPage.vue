<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f0f4f1]">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-5 md:p-6">
      <div class="header-left">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="header-breadcrumb !mb-0">
            <span>Admin</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span> Attendance</span>
          </div>
        </div>
        <h1 class="header-title intro-title">
          Report <span class="text-yellow-500">Builder</span>
        </h1>
        <p class="header-sub">
          Generate attendance PDFs for ALL, BY COLLEGE, and SPECIFIC analytics flows.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr] mt-5">
        <ReportSidebar v-model="reportType" />

        <section class="space-y-5">
          <div
            v-if="metaError"
            class="rounded-xl border border-[#ef9a9a] bg-[#ffebee] px-4 py-3 text-sm text-[#b71c1c]"
          >
            {{ metaError }}
          </div>

          <div
            v-if="isLoadingMeta"
            class="rounded-xl border border-[#d4e4da] bg-white px-4 py-3 text-sm text-[#4a7060]"
          >
            Loading colleges and programs...
          </div>

          <FilterAll
            v-if="reportType === 'all'"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            @update:date-filter-type="dateFilterType = $event"
            @update:selected-day="selectedDay = $event"
            @update:period-from="periodFrom = $event"
            @update:period-to="periodTo = $event"
            @update:selected-months="selectedMonths = $event"
            @update:selected-year="selectedYear = $event"
          />

          <FilterByCollege
            v-if="reportType === 'college'"
            :colleges="colleges"
            :programs="programOptions"
            :selected-college="selectedCollege"
            :selected-program="selectedProgram"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            @update:selected-college="selectedCollege = $event"
            @update:selected-program="selectedProgram = $event"
            @update:date-filter-type="dateFilterType = $event"
            @update:selected-day="selectedDay = $event"
            @update:period-from="periodFrom = $event"
            @update:period-to="periodTo = $event"
            @update:selected-months="selectedMonths = $event"
            @update:selected-year="selectedYear = $event"
          />

          <FilterSpecific
            v-if="reportType === 'specific'"
            :colleges="colleges"
            :programs="programOptions"
            :selected-college="selectedCollege"
            :selected-program="selectedProgram"
            :selected-specific="selectedSpecific"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            @update:selected-college="selectedCollege = $event"
            @update:selected-program="selectedProgram = $event"
            @update:selected-specific="selectedSpecific = $event"
            @update:date-filter-type="dateFilterType = $event"
            @update:selected-day="selectedDay = $event"
            @update:period-from="periodFrom = $event"
            @update:period-to="periodTo = $event"
            @update:selected-months="selectedMonths = $event"
            @update:selected-year="selectedYear = $event"
          />

          <PreviewAll
            v-if="reportType === 'all'"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            :is-generating="isGenerating"
            :has-blob="hasBlob"
            :summary="reportSummary"
            :error="generateError"
            @generate="onGenerate"
            @download="onDownload"
            @reset="onReset"
          />

          <PreviewByCollege
            v-if="reportType === 'college'"
            :selected-college="selectedCollege"
            :selected-program="selectedProgram"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            :is-generating="isGenerating"
            :has-blob="hasBlob"
            :summary="reportSummary"
            :error="generateError"
            @generate="onGenerate"
            @download="onDownload"
            @reset="onReset"
          />

          <PreviewSpecific
            v-if="reportType === 'specific'"
            :selected-specific="selectedSpecific"
            :selected-college="selectedCollege"
            :selected-program="selectedProgram"
            :date-filter-type="dateFilterType"
            :selected-day="selectedDay"
            :period-from="periodFrom"
            :period-to="periodTo"
            :selected-months="selectedMonths"
            :selected-year="selectedYear"
            :is-generating="isGenerating"
            :has-blob="hasBlob"
            :summary="reportSummary"
            :error="generateError"
            @generate="onGenerate"
            @download="onDownload"
            @reset="onReset"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'
import ReportSidebar from './Components/ReportSidebar.vue'
import FilterAll from './Components/Filters/FilterAll.vue'
import FilterByCollege from './Components/Filters/FilterByCollege.vue'
import FilterSpecific from './Components/Filters/FilterSpecific.vue'
import PreviewAll from './Components/Preview/PreviewAll.vue'
import PreviewByCollege from './Components/Preview/PreviewByCollege.vue'
import PreviewSpecific from './Components/Preview/PreviewSpecific.vue'
import {
  useReportData,
  type DateFilterType,
  type ReportType,
  type SpecificType,
} from './Composables/useReportData'

const report = useReportData(supabase)

const reportType = ref<ReportType>('all')
const dateFilterType = ref<DateFilterType>('day')

const today = new Date().toISOString().slice(0, 10)
const selectedDay = ref<string>(today)
const periodFrom = ref<string>(today)
const periodTo = ref<string>(today)
const selectedMonths = ref<number[]>([new Date().getMonth() + 1])
const selectedYear = ref<number>(new Date().getFullYear())

const selectedCollege = ref<string>('')
const selectedProgram = ref<string>('')
const selectedSpecific = ref<SpecificType>('top_students')

const colleges = computed(() => report.colleges.value)
const programOptions = computed(() => report.filteredPrograms.value(selectedCollege.value))

const isGenerating = computed(() => report.isGenerating.value)
const generateError = computed(() => report.generateError.value)
const reportSummary = computed(() => report.reportSummary.value)
const hasBlob = computed(() => !!report.generatedBlob.value)
const isLoadingMeta = computed(() => report.isLoadingMeta.value)
const metaError = computed(() => report.metaError.value)

onMounted(async () => {
  await report.loadCollegesAndPrograms()
})

watch(selectedCollege, () => {
  if (!selectedCollege.value) selectedProgram.value = ''
})

watch(reportType, () => {
  report.resetGeneration()
})

async function onGenerate() {
  await report.generate({
    reportType: reportType.value,
    dateFilterType: dateFilterType.value,
    selectedDay: selectedDay.value,
    periodFrom: periodFrom.value,
    periodTo: periodTo.value,
    selectedMonths: selectedMonths.value,
    selectedYear: selectedYear.value,
    selectedCollege: selectedCollege.value,
    selectedProgram: selectedProgram.value,
    selectedSpecific: selectedSpecific.value,
  })
}

function onDownload() {
  report.downloadPdf()
}

function onReset() {
  report.resetGeneration()
}
</script>
