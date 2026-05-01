<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f0f4f1]">

    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN CONTENT -->
    <main class="page-root pl-6 mt-5 flex-1 overflow-y-auto">

      <!-- HEADER -->
      <header class="px-6 pt-5 pb-3">
        <div class="header-breadcrumb">
          <button
            class="flex items-center gap-1.5 text-gray-400 hover:text-[#0d2b0f] transition-colors"
            @click="$router.back()"
          >
            <span class="uppercase tracking-widest">Back</span>
          </button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3 text-gray-400">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span class="font-bold text-gray-400">Manage Students</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">Student</span>
          <span class="hero-word-gold"> Information</span>
        </h1>
        <p class="hero-subtitle">Fill in all required fields to register a student record.</p>
      </header>

      <!-- FORM -->
      <div class="px-6 pb-10 mt-3">
        <div class="form-wrapper">

          <form @submit.prevent="handleSubmit">

            <!-- Student ID -->
            <fieldset class="form-section">
              <div class="field-grid two-col">
                <div class="field-group">
                  <label for="studentId">Student ID <span class="required">*</span></label>
                  <input
                    id="studentId"
                    v-model="form.studentId"
                    type="text"
                    placeholder="e.g. 2023-12345"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <!-- Name Section -->
            <fieldset class="form-section">
              <legend class="section-legend">Full Name</legend>
              <div class="field-grid three-col">
                <div class="field-group">
                  <label for="firstName">First Name <span class="required">*</span></label>
                  <input id="firstName" v-model="form.firstName" type="text" placeholder="e.g. Maria" required />
                </div>
                <div class="field-group">
                  <label for="middleName">Middle Name</label>
                  <input id="middleName" v-model="form.middleName" type="text" placeholder="e.g. Santos" />
                </div>
                <div class="field-group">
                  <label for="lastName">Last Name <span class="required">*</span></label>
                  <input id="lastName" v-model="form.lastName" type="text" placeholder="e.g. dela Cruz" required />
                </div>
              </div>
            </fieldset>

            <!-- Academic Section -->
            <fieldset class="form-section">
              <legend class="section-legend">Academic Details</legend>
              <div class="field-grid two-col">
                <div class="field-group">
                  <label for="college">College <span class="required">*</span></label>
                  <div class="select-wrapper">
                    <select id="college" v-model="form.college" required @change="form.program = ''">
                      <option value="" disabled>Select college</option>
                      <option value="CEGS">College of Engineering and Geo Science</option>
                      <option value="CCIS">College of Computing and Information Technology</option>
                      <option value="CMNS">College of Mathematics and Natural Sciences</option>
                      <option value="CED">College of Education</option>
                      <option value="CAA">College of Agriculture and Agri-Industries</option>
                      <option value="COFES">College of Forestry and Environmental Sciences</option>
                      <option value="CHASS">College of Humanities and Social Sciences</option>
                      <option value="GS">Graduate Studies</option>
                    </select>
                    <span class="select-icon">▾</span>
                  </div>
                </div>
                <div class="field-group">
                  <label for="program">Program <span class="required">*</span></label>
                  <div class="select-wrapper">
                    <select id="program" v-model="form.program" required>
                      <option value="" disabled>Select program</option>
                      <option
                        v-for="prog in filteredPrograms"
                        :key="prog"
                        :value="prog"
                      >
                        {{ prog }}
                      </option>
                    </select>
                    <span class="select-icon">▾</span>
                  </div>
                </div>
              </div>
              <div class="field-grid two-col mt-4">
                <div class="field-group">
                  <label for="yearLevel">Year Level <span class="required">*</span></label>
                  <div class="select-wrapper">
                    <select id="yearLevel" v-model="form.yearLevel" required>
                      <option value="" disabled>Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                    <span class="select-icon">▾</span>
                  </div>
                </div>
                <div class="field-group">
                  <label>Gender <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-label" v-for="g in genders" :key="g.value">
                      <input type="radio" v-model="form.gender" :value="g.value" required />
                      <span class="radio-custom"></span>
                      {{ g.label }}
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" class="btn-ghost" @click="resetForm" :disabled="isLoading">Reset</button>
              <button type="submit" class="btn-primary" :disabled="isLoading">
                <span v-if="!isLoading">Save Student</span>
                <span v-else>Saving...</span>
                <span class="btn-arrow" v-if="!isLoading">→</span>
                <span class="btn-spinner" v-else></span>
              </button>
            </div>

          </form>

          <!-- Toast -->
          <transition name="toast">
            <div v-if="toast.show" :class="['toast', toast.type === 'error' ? 'toast-error' : '']">
              {{ toast.message }}
            </div>
          </transition>

        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import Sidebar from "@/components/Sidebar.vue"

// ── SUPABASE SETUP ─────────────────────────────────────────────
const supabase = createClient(
  'https://yorlzoraugqcntqlgswc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvcmx6b3JhdWdxY250cWxnc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mjc2MDcsImV4cCI6MjA4ODQwMzYwN30._fAIwFyOH60KzAWlGIXOHxSoNSlfCwFM1gyNqK4vjSY'  // Replace with your Supabase anon/public key
)

// ── PROGRAMS BY COLLEGE ────────────────────────────────────────
const programsByCollege: Record<string, string[]> = {
  'CEGS': [
    'BS Agricultural and Biosystem Engineering',
    'BS Civil Engineering',
    'BS Electronics Engineering',
    'BS Geodetic Engineering',
    'BS Geology',
    'BS Mining Engineering'
  ],
  'CCIS': [
    'BS Information Technology',
    'BS Information System',
    'BS Computer Science'
  ],
  'CED': [
    'Bachelor of Secondary Education',
    'Bachelor of Elementary Education'
  ],
  'CMNS': [
    'BS Applied Mathematics',
    'BS Biology',
    'BS Chemistry',
    'BS Marine Biology',
    'BS Mathematics',
    'BS Physics'
  ],
  'CAA': ['BS Agriculture'],
  'COFES': [
    'BS Agroforestry',
    'BS Environmental Science',
    'BS Forestry'
  ],
  'CHASS': [
    'AB Sociology',
    'BS Psychology',
    'BS Social Work'
  ],
  'GS': [
    'Doctor of Education',
    'Master of Arts in Education',
    'Master of Arts in Public Administration',
    'Master of Science Education',
    'Master of Science in Biology',
    'Master of Science in Mathematics',
    'Master of Science in Mathematics Education',
    'PHD in Mathematics',
    'PHD in Mathematics Education',
    'PHD in Science Education'
  ],
}

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

// ── FORM STATE ─────────────────────────────────────────────────
const emptyForm = () => ({
  studentId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  college: '',
  program: '',
  yearLevel: '',
  gender: '',
})

const form = reactive(emptyForm())
const isLoading = ref(false)
const toast = reactive({ show: false, message: '', type: 'success' })

const filteredPrograms = computed(() => programsByCollege[form.college] || [])

// ── HELPERS ────────────────────────────────────────────────────
function resetForm() {
  Object.assign(form, emptyForm())
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3500)
}

// ── SUBMIT ─────────────────────────────────────────────────────
async function handleSubmit() {
  isLoading.value = true

  try {
    const { error } = await supabase.from('students').insert({
      id_number: form.studentId,
      first_name:  form.firstName.toUpperCase(),
      middle_name: form.middleName ? form.middleName.toUpperCase() : null,
      last_name:   form.lastName.toUpperCase(),
      college:     form.college,
      program:     form.program,
      year_level:  Number(form.yearLevel),
      gender:      form.gender.toUpperCase(),
    })

    if (error) throw error

    showToast('✓ Student record saved successfully!')
    resetForm()

  } catch (err: any) {
    console.error('Supabase error:', err)
    showToast(`✗ ${err.message ?? 'Failed to save. Please try again.'}`, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.page-root {
  font-family: 'Poppins', sans-serif;
}

/* ── BREADCRUMB ── */
.header-breadcrumb {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #9ca3af;
  animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

/* ── HERO TITLE ── */
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
.hero-word-dark { color: #0d2b0f; }
.hero-word-gold { color: #e6a800; }
.hero-underlined {
  position: relative;
  display: inline-block;
}
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #0d2b0f, #e6a800);
  border-radius: 3px;
  transform-origin: left;
  animation: underlineGrow 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.hero-subtitle {
  font-size: 0.88rem;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}

/* ── FORM WRAPPER ── */
.form-wrapper {
  font-family: 'Poppins', sans-serif;
  position: relative;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* ── SECTIONS ── */
.form-section {
  border: none;
  padding: 0;
  margin: 0 0 1.75rem;
}

.section-legend {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4a7060;
  display: block;
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #c2d4cb;
  width: 100%;
}

/* ── GRIDS ── */
.field-grid { display: grid; gap: 1rem; }
.three-col  { grid-template-columns: repeat(3, 1fr); }
.two-col    { grid-template-columns: repeat(2, 1fr); }

@media (max-width: 640px) {
  .three-col, .two-col { grid-template-columns: 1fr; }
}

/* ── FIELD GROUP ── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4a7060;
}

.required { color: #c9773a; }

/* ── INPUTS ── */
input[type="text"],
select {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: #0d2b0f;
  background: #f0f4f1;
  border: 1.5px solid #c2d4cb;
  border-radius: 8px;
  padding: 0.55rem 0.8rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  box-sizing: border-box;
}

input[type="text"]::placeholder { color: #9ab5a8; }

input[type="text"]:focus,
select:focus {
  border-color: #0d2b0f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13,43,15,0.1);
}

/* ── DISABLED STATE ── */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-wrapper { position: relative; }
.select-wrapper select { cursor: pointer; padding-right: 2rem; }
.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7060;
  pointer-events: none;
  font-size: 0.85rem;
}

/* ── RADIO ── */
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-top: 0.4rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #3d6455;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

.radio-label input[type="radio"] { display: none; }

.radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #c2d4cb;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: border-color 0.2s;
  flex-shrink: 0;
  background: #f0f4f1;
}

.radio-label input[type="radio"]:checked + .radio-custom {
  border-color: #0d2b0f;
  background: #0d2b0f;
}
.radio-label input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
}

/* ── ACTIONS ── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid #d4e4da;
}

.btn-ghost {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #4a7060;
  background: transparent;
  border: 1.5px solid #c2d4cb;
  border-radius: 8px;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover:not(:disabled) { border-color: #0d2b0f; color: #0d2b0f; }

.btn-primary {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  background: #0d2b0f;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, transform 0.15s;
  min-width: 130px;
  justify-content: center;
}
.btn-primary:hover:not(:disabled) { background: #183d1b; transform: translateY(-1px); }
.btn-arrow { transition: transform 0.2s; }
.btn-primary:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }

/* ── SPINNER ── */
.btn-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #0d2b0f;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.6rem 1.25rem;
  border-radius: 99px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 50;
}
.toast-error { background: #7f1d1d; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ── KEYFRAMES ── */
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
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>