<template>
	<section class="rounded-2xl border border-[#c2d4cb] bg-white p-5">
		<div class="flex items-start justify-between gap-3">
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-widest text-[#0d2b0f]">SPECIFIC Preview</h3>
				<p class="mt-1 text-xs text-[#4a7060]">Focused analytics report based on selected card.</p>
			</div>
			<span class="rounded-full border border-[#a8ccb8] bg-[#e6f2ec] px-3 py-1 text-xs font-semibold text-[#0d2b0f]">
				{{ expectedPages }} pages expected
			</span>
		</div>

		<div class="mt-4 rounded-xl border border-[#d4e4da] bg-[#f4f8f5] p-3 text-sm text-[#3d6455]">
			<p class="font-semibold text-[#0d2b0f]">Current Selection</p>
			<p class="mt-1">Focus: {{ specificLabel }}</p>
			<p class="mt-1">Scope: {{ scopeDescription }}</p>
			<p class="mt-1">{{ dateDescription }}</p>
			<p v-if="summary" class="mt-2 text-xs text-[#4a7060]">Last generated: {{ summary }}</p>
		</div>

		<div class="mt-3 rounded-xl border border-[#e3ece7] bg-white p-3 text-xs text-[#3d6455]">
			<p class="font-semibold uppercase tracking-wide text-[#4a7060]">Planned PDF Pages</p>
			<ol class="mt-2 list-inside list-decimal space-y-1">
				<li v-for="line in plannedPages" :key="line">{{ line }}</li>
			</ol>
		</div>

		<p v-if="error" class="mt-3 rounded-lg border border-[#ef9a9a] bg-[#ffebee] px-3 py-2 text-sm text-[#b71c1c]">
			{{ error }}
		</p>

		<div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
			<button
				class="rounded-lg border border-[#0d2b0f] bg-[#0d2b0f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#143d17] disabled:cursor-not-allowed disabled:opacity-70"
				:disabled="isGenerating"
				@click="$emit('generate')"
			>
				{{ isGenerating ? 'Generating...' : 'Generate PDF' }}
			</button>

			<button
				class="rounded-lg border border-[#a8ccb8] bg-white px-4 py-2 text-sm font-semibold text-[#0d2b0f] transition hover:border-[#0d2b0f] disabled:cursor-not-allowed disabled:opacity-70"
				:disabled="!hasBlob || isGenerating"
				@click="$emit('download')"
			>
				Download PDF
			</button>

			<button
				class="rounded-lg border border-[#d4e4da] bg-[#f8fbf9] px-4 py-2 text-sm font-semibold text-[#3d6455] transition hover:border-[#a8ccb8]"
				@click="$emit('reset')"
			>
				Reset
			</button>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DateFilterType, SpecificType } from '../../Composables/useReportData'

const props = defineProps<{
	selectedSpecific: SpecificType
	selectedCollege: string
	selectedProgram: string
	dateFilterType: DateFilterType
	selectedDay: string
	periodFrom: string
	periodTo: string
	selectedMonths: number[]
	selectedYear: number
	isGenerating: boolean
	hasBlob: boolean
	summary: string
	error: string | null
}>()

defineEmits<{
	generate: []
	download: []
	reset: []
}>()

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const labels: Record<SpecificType, string> = {
	top_students: 'Top Visiting Students',
	peak_hours: 'Peak and Low Hours',
	duration: 'Duration Analysis',
	events: 'Events Report',
}

const pagesByType: Record<SpecificType, string[]> = {
	top_students: ['Top Visiting Students (Bar Chart)', 'Student Details (Table)'],
	peak_hours: ['Attendance Per Hour (Line Chart)', 'Peak vs Low Hours Summary (Table)'],
	duration: ['Average Duration Over Time (Bar Chart)', 'Duration Distribution (Bar Chart)', 'Duration Statistics (Table)'],
	events: ['Attendance Per Event (Bar Chart)', 'Event Details (Table)'],
}

const specificLabel = computed(() => labels[props.selectedSpecific])
const plannedPages = computed(() => pagesByType[props.selectedSpecific])
const expectedPages = computed(() => plannedPages.value.length)

const scopeDescription = computed(() => {
	if (props.selectedProgram) return `${props.selectedProgram} (${props.selectedCollege || 'No college selected'})`
	if (props.selectedCollege) return props.selectedCollege
	return 'All colleges and programs'
})

const dateDescription = computed(() => {
	if (props.dateFilterType === 'day') return `Chosen day: ${props.selectedDay || 'Not selected'}`
	if (props.dateFilterType === 'period') return `Period: ${props.periodFrom || '...'} to ${props.periodTo || '...'}`
	const labels = props.selectedMonths.map((m) => monthNames[m - 1]).filter(Boolean)
	return `Month(s): ${labels.length ? labels.join(', ') : 'None'} ${props.selectedYear}`
})
</script>
