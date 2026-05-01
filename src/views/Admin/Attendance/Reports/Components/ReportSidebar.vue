<template>
  <aside class="space-y-5">
    <section class="rounded-2xl bg-white p-5 shadow-sm border border-[#e3eee8]">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-widest text-[#5f7f73]">Report Scope</p>
        <span class="text-[10px] text-[#8aa79b]">Select one</span>
      </div>

      <!-- Options -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="opt in reportTypes"
          :key="opt.value"
          @click="$emit('update:modelValue', opt.value)"
          class="relative px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-full transition-all duration-200 border"
          :class="
            modelValue === opt.value
              ? 'bg-gradient-to-r from-[#0d2b0f] to-[#174d1b] text-white border-transparent scale-105 shadow-md'
              : 'bg-[#f6faf7] text-[#3d6455] border-[#d7e6dd] hover:border-[#0d2b0f] hover:bg-[#edf6f0] hover:scale-105'
          "
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm border border-[#e3eee8]">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-[#5f7f73]">Guide</p>
      </div>

      <!-- Items -->
      <div class="space-y-3">
        <!-- Item -->
        <div
          class="flex items-start gap-3 p-3 rounded-xl bg-[#f6faf7] hover:bg-[#edf6f0] transition"
        >
          <span
            class="shrink-0 bg-[#E1F5EE] text-[#0F6E56] text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
          >
            All
          </span>
          <p class="text-[13px] text-[#3d6455] leading-snug">Daily totals and summary table</p>
        </div>

        <!-- Item -->
        <div
          class="flex items-start gap-3 p-3 rounded-xl bg-[#f6f9fc] hover:bg-[#edf3f8] transition"
        >
          <span
            class="shrink-0 bg-[#E6F1FB] text-[#185FA5] text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
          >
            By College
          </span>
          <p class="text-[13px] text-[#3d6455] leading-snug">
            Multi-chart breakdown by program and year level
          </p>
        </div>

        <!-- Item -->
        <div
          class="flex items-start gap-3 p-3 rounded-xl bg-[#f7f6fd] hover:bg-[#efedfb] transition"
        >
          <span
            class="shrink-0 bg-[#EEEDFE] text-[#534AB7] text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
          >
            Specific
          </span>
          <p class="text-[13px] text-[#3d6455] leading-snug">
            Focused analytics cards with targeted PDF outputs
          </p>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import type { ReportType } from '../Composables/useReportData'

defineProps<{
  modelValue: ReportType
}>()

defineEmits<{
  'update:modelValue': [value: ReportType]
}>()

const reportTypes: { label: string; value: ReportType }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'BY COLLEGE', value: 'college' },
  { label: 'SPECIFIC', value: 'specific' },
]
</script>
