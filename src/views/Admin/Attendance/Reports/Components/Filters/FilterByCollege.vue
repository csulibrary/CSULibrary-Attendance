<template>
  <section class="rounded-2xl border border-[#c2d4cb] bg-white p-5">
    <h3 class="text-sm font-semibold uppercase tracking-widest text-[#0d2b0f]">
      BY COLLEGE Filters
    </h3>

    <div class="mt-4 space-y-4">
      <div>
        <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
          >College</label
        >
        <select
          :value="selectedCollege"
          class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
          @change="onCollegeChange(($event.target as HTMLSelectElement).value)"
        >
          <option value="">-- Select College --</option>
          <option v-for="college in colleges" :key="college" :value="college">{{ college }}</option>
        </select>
      </div>

      <div>
        <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
          >Program (Optional)</label
        >
        <select
          :value="selectedProgram"
          :disabled="!selectedCollege"
          class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f] disabled:cursor-not-allowed disabled:opacity-60"
          @change="$emit('update:selectedProgram', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Whole College</option>
          <option v-for="program in programs" :key="program" :value="program">{{ program }}</option>
        </select>
      </div>

      <div class="h-px bg-[#d4e4da]" />

      <div>
        <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
          >Date Filter</label
        >
        <div class="mt-2 grid grid-cols-3 gap-2">
          <button
            v-for="opt in dateFilterOptions"
            :key="opt.value"
            class="rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition"
            :class="
              dateFilterType === opt.value
                ? 'border-[#0d2b0f] bg-[#0d2b0f] text-white'
                : 'border-[#c2d4cb] bg-[#f4f8f5] text-[#3d6455] hover:border-[#0d2b0f]'
            "
            @click="$emit('update:dateFilterType', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-if="dateFilterType === 'day'">
        <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
          >Chosen Day</label
        >
        <input
          :value="selectedDay"
          type="date"
          class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
          @input="$emit('update:selectedDay', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div v-if="dateFilterType === 'period'" class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">From</label>
          <input
            :value="periodFrom"
            type="date"
            class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
            @input="$emit('update:periodFrom', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div>
          <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">To</label>
          <input
            :value="periodTo"
            type="date"
            class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
            @input="$emit('update:periodTo', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <div v-if="dateFilterType === 'month'" class="space-y-3">
        <div>
          <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Year</label>
          <select
            :value="selectedYear"
            class="mt-2 w-full rounded-lg border border-[#c2d4cb] bg-[#f4f8f5] px-3 py-2 text-sm text-[#0d2b0f] outline-none focus:border-[#0d2b0f]"
            @change="
              $emit('update:selectedYear', Number(($event.target as HTMLSelectElement).value))
            "
          >
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]"
            >Month(s)</label
          >
          <div class="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4">
            <button
              v-for="m in months"
              :key="m.value"
              class="rounded-lg border px-2 py-2 text-xs font-semibold transition"
              :class="
                selectedMonths.includes(m.value)
                  ? 'border-[#0d2b0f] bg-[#0d2b0f] text-white'
                  : 'border-[#c2d4cb] bg-white text-[#3d6455] hover:border-[#0d2b0f]'
              "
              @click="toggleMonth(m.value)"
            >
              {{ m.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DateFilterType } from '../../Composables/useReportData'

const props = defineProps<{
  colleges: string[]
  programs: string[]
  selectedCollege: string
  selectedProgram: string
  dateFilterType: DateFilterType
  selectedDay: string
  periodFrom: string
  periodTo: string
  selectedMonths: number[]
  selectedYear: number
}>()

const emit = defineEmits<{
  'update:selectedCollege': [value: string]
  'update:selectedProgram': [value: string]
  'update:dateFilterType': [value: DateFilterType]
  'update:selectedDay': [value: string]
  'update:periodFrom': [value: string]
  'update:periodTo': [value: string]
  'update:selectedMonths': [value: number[]]
  'update:selectedYear': [value: number]
}>()

const dateFilterOptions: { label: string; value: DateFilterType }[] = [
  { label: 'Day', value: 'day' },
  { label: 'Period', value: 'period' },
  { label: 'Month', value: 'month' },
]

const months = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
]

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i)

function onCollegeChange(value: string) {
  emit('update:selectedCollege', value)
  emit('update:selectedProgram', '')
}

function toggleMonth(month: number) {
  const exists = props.selectedMonths.includes(month)
  const next = exists
    ? props.selectedMonths.filter((m) => m !== month)
    : [...props.selectedMonths, month]
  emit(
    'update:selectedMonths',
    next.sort((a, b) => a - b),
  )
}
</script>
