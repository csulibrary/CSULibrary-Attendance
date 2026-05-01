<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="'SERVICES'" />

    <main class="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
      <header class="attn-header">
        <div class="space-y-4">
          <div class="relative group">
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <div class="header-breadcrumb !mb-0">
                <span>Admin</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <span>Curriculum</span>
              </div>
            </div>
            <h1 class="header-title intro-title">
              <span class="text-[#0d2b0f]">College</span>
              <span class="text-yellow-500"> Curriculum</span>
            </h1>
            <p class="header-sub">
              Create a new curriculum information to share with the academic community.
            </p>
            <br />
          </div>
        </div>
      </header>

      <section class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Visible Colleges
          </p>
          <p class="mt-1 text-2xl font-bold text-[#164d23]">{{ visibleCollegeCount }}</p>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Programs</p>
          <p class="mt-1 text-2xl font-bold text-[#164d23]">{{ totalProgramCount }}</p>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Open College</p>
          <p class="mt-1 text-2xl font-bold text-[#f9a825]">{{ openCollegeLabel }}</p>
        </article>
      </section>

      <div class="flex justify-end">
        <button
          @click="$router.push('/admin/services/curriculum/edit')"
          class="rounded-lg bg-[#0d2b0f] px-8 py-3 mb-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
        >
          Go to Edit
        </button>
      </div>
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="college in colleges"
          :key="college.code"
          type="button"
          class="rounded-xl border-2 border-[#164d23] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0d2b0f] hover:bg-[#164d23] hover:shadow-md group"
          @click="openCollege(college.code)"
        >
          <p class="text-lg font-bold text-[#164d23] group-hover:text-white transition-colors">
            {{ college.code }}
          </p>
          <p
            class="mt-1 text-sm font-medium text-slate-700 group-hover:text-emerald-100 transition-colors"
          >
            {{ college.name }}
          </p>
          <p
            class="mt-3 text-xs font-semibold text-slate-500 group-hover:text-emerald-200 transition-colors"
          >
            {{ college.programs.length }} programs
          </p>
        </button>
      </section>

      <p v-if="isLoading" class="mt-4 text-sm text-slate-600">Loading colleges and programs...</p>
      <p v-else-if="!colleges.length" class="mt-4 text-sm text-slate-600">
        No college/program records found.
      </p>

      <Transition name="fade-pop">
        <div
          v-if="selectedCollege"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Program list"
          @click.self="closeProgramModal"
        >
          <article class="w-full max-w-3xl rounded-xl bg-white shadow-2xl">
            <header
              class="flex items-start justify-between gap-4 rounded-t-xl bg-[#164d23] px-6 py-4 text-white"
            >
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-[#f9e6a6]">
                  {{ selectedCollege.code }}
                </p>
                <h2 class="text-xl font-bold">{{ selectedCollege.name }}</h2>
                <p class="mt-1 text-sm text-emerald-100">
                  Select a program to view its curriculum details.
                </p>
              </div>
              <button
                type="button"
                class="rounded-md border border-white/40 px-3 py-1 text-lg font-bold leading-none text-white hover:bg-white/15"
                @click="closeProgramModal"
                aria-label="Close program modal"
              >
                X
              </button>
            </header>

            <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div class="space-y-2">
                <div
                  v-for="program in selectedCollege.programs"
                  :key="program.id"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-slate-800">{{ program.name }}</p>
                      <p v-if="program.specializations.length" class="mt-1 text-xs text-slate-500">
                        {{ program.specializations.length }} specialization(s)
                      </p>
                    </div>
                    <button
                      v-if="!program.specializations.length"
                      type="button"
                      class="rounded-lg bg-[#164d23] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#123d1c]"
                      @click="viewCurriculum(program.id)"
                    >
                      View Curriculum
                    </button>
                  </div>

                  <div v-if="program.specializations.length" class="mt-3 space-y-2">
                    <div
                      v-for="specialization in program.specializations"
                      :key="specialization.id"
                      class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <p class="text-sm text-slate-700">{{ specialization.name }}</p>
                      <button
                        type="button"
                        class="rounded-lg bg-[#164d23] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#123d1c]"
                        @click="viewCurriculum(program.id, specialization.id)"
                      >
                        View Curriculum
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

type ProgramItem = {
  id: string
  name: string
  specializations: SpecializationItem[]
}

type SpecializationItem = {
  id: string
  name: string
}

type CollegeItem = {
  code: string
  name: string
  programs: ProgramItem[]
}

type CollegeProgramsRow = {
  code: string
  name: string
  programs: Array<{
    id: string
    program_name: string
    program_specializations: Array<{
      id: string
      program_sp_name: string | null
    }> | null
  }> | null
}

const router = useRouter()

const colleges = ref<CollegeItem[]>([])
const isLoading = ref(false)

const selectedCollegeCode = ref<string | null>(null)

const selectedCollege = computed(() => {
  if (!selectedCollegeCode.value) return null
  return colleges.value.find((item) => item.code === selectedCollegeCode.value) ?? null
})

const visibleCollegeCount = computed(() => colleges.value.length)

const totalProgramCount = computed(() =>
  colleges.value.reduce((sum, college) => sum + college.programs.length, 0),
)

const openCollegeLabel = computed(() => selectedCollege.value?.code ?? 'None')

const openCollege = (collegeCode: string): void => {
  selectedCollegeCode.value = collegeCode
}

const closeProgramModal = (): void => {
  selectedCollegeCode.value = null
}

const fetchCollegesAndPrograms = async (): Promise<void> => {
  isLoading.value = true

  try {
    const { data, error } = await supabase
      .from('colleges')
      .select(
        'code, name, programs(id, program_name, program_specializations(id, program_sp_name))',
      )
      .order('code', { ascending: true })

    if (error) {
      throw error
    }

    const rows = (data as CollegeProgramsRow[] | null) ?? []
    colleges.value = rows.map((college) => ({
      code: college.code,
      name: college.name,
      programs: (college.programs ?? [])
        .map((program) => ({
          id: program.id,
          name: program.program_name,
          specializations: (program.program_specializations ?? [])
            .filter((specialization) => Boolean(specialization?.id))
            .map((specialization) => ({
              id: specialization.id,
              name: specialization.program_sp_name || 'Unnamed Specialization',
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
  } catch (error) {
    console.error('Failed to fetch colleges/programs:', error)
    colleges.value = []
  } finally {
    isLoading.value = false
  }
}

const viewCurriculum = async (programId: string, specializationId?: string): Promise<void> => {
  try {
    if (!programId) {
      alert('Program not found in database.')
      return
    }

    await router.push({
      name: 'curriculum-info-dynamic',
      params: {
        programId,
        ...(specializationId ? { specializationId } : {}),
      },
    })
    closeProgramModal()
  } catch (err) {
    console.error('Navigation error:', err)
    alert('An error occurred. Please try again.')
  }
}

const onEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && selectedCollege.value) {
    closeProgramModal()
  }
}

onMounted(() => {
  void fetchCollegesAndPrograms()
  window.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: opacity 0.2s ease;
}

.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
}

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
.header-breadcrumb svg {
  width: 12px;
  height: 12px;
  opacity: 0.4;
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
  /* Animation */
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}
.hero-word-dark {
  color: #0d2b0f;
}
.hero-word-gold {
  color: #e6a800;
}
.hero-underlined {
  position: relative;
  display: inline-block;
}
</style>
