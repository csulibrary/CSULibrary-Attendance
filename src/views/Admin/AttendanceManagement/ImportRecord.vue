<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <ExcelInstruct 
      :isOpen="isInstructModalOpen" 
@close="closeInstructions" 
  @accepted="handleInstructionsAccepted"
    />

    <main class="report-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="report-header">
        <div>
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/attendance')"
              >BACK</span
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>STUDENT RECORDS</span>
          </div>

          <h1 class="header-title">Import <span style="color: #f9a825">Student Records</span></h1>

          <p class="header-sub">
            Upload a dataset and synchronize it with the CSU student database.
          </p>
        </div>
      </header>

      <div style="display: flex; justify-content: space-between; align-items: center">
        <button
          @click="$router.push('/admin/attendance/import/add')"
          class="bg-[#0d2b0f] hover:bg-[#0d2b0f]/90 text-white mb-5 font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
        >
          Import A Student Manually
        </button>

        <!-- Right: Timestamp -->
        <!-- <h1 style="margin: 0; font-weight: 800">
          Last Import Time: <span style="color: #f9a825">{{ lastImportTime }}</span>
        </h1>  -->
      </div>

      <!-- STEPPER -->
      <section class="panel">
        <div class="stepper">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{
              active: currentStep === i,
              completed: currentStep > i,
              disabled: currentStep < i,
            }"
          >
            <div class="step-circle">
              <svg
                v-if="currentStep > i"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                class="w-4 h-4"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="step-text">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-sub">{{ step.sub }}</span>
            </div>
            <div v-if="i < steps.length - 1" class="step-connector">
              <div class="step-connector-line" :class="{ filled: currentStep > i }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- MAIN PANEL -->
      <section class="panel import-panel">
        <!-- ── STEP 1: UPLOAD ── -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Upload Student Dataset</h2>
              <p class="panel-sub">Upload an XLSX or XLS file containing CSU student records</p>
            </div>
          </div>

          <div
            class="drop-zone"
            :class="{ dragging: isDragging, hasFile: !!uploadedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              hidden
              accept=".xlsx,.xls"
              @change="handleFileUpload"
            />

            <div v-if="!uploadedFile" class="drop-zone-inner">
              <div class="drop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p class="upload-main"><strong>Click to browse</strong> or drag & drop</p>
              <p class="upload-sub">
                Supports .xlsx and .xls formats · Large files (10k+ rows) supported
              </p>
            </div>

            <div v-else class="drop-zone-file">
              <div class="file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="file-info">
                <p class="file-name">{{ uploadedFile.name }}</p>
                <p class="file-size">{{ formatFileSize(uploadedFile.size) }}</p>
              </div>
              <button class="file-remove" @click.stop="removeFile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Column preview after parsing -->
          <div v-if="detectedColumns.length > 0" class="column-preview">
            <p class="column-preview-label">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="inline w-3.5 h-3.5 mr-1"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Detected Columns
            </p>
            <div class="column-tags">
              <span
                v-for="col in detectedColumns"
                :key="col"
                class="column-tag"
                :class="{ mapped: isMappedColumn(col) }"
                >{{ col }}</span
              >
            </div>
            <p v-if="columnWarning" class="column-warning">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="inline w-3.5 h-3.5 mr-1"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {{ columnWarning }}
            </p>
          </div>
        </div>

        <!-- ── STEP 2: VALIDATE ── -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Validate Dataset</h2>
              <p class="panel-sub">Confirm the records detected from the uploaded file</p>
            </div>
          </div>

          <table class="report-table">
            <tbody>
              <tr>
                <td class="validate-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="inline w-4 h-4 mr-2 opacity-50"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  File Name
                </td>
                <td class="text-right font-semibold">{{ fileName }}</td>
              </tr>
              <tr>
                <td class="validate-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="inline w-4 h-4 mr-2 opacity-50"
                  >
                    <path
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Detected Records
                </td>
                <td class="text-right">
                  <span class="record-count-badge"
                    >{{ recordCount.toLocaleString() }} students</span
                  >
                </td>
              </tr>
              <tr>
                <td class="validate-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="inline w-4 h-4 mr-2 opacity-50"
                  >
                    <path d="M4 6h16M4 10h16M4 14h8" />
                  </svg>
                  Columns Found
                </td>
                <td class="text-right font-semibold">{{ detectedColumns.length }}</td>
              </tr>
              <tr>
                <td class="validate-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="inline w-4 h-4 mr-2 opacity-50"
                  >
                    <path
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Estimated Batches
                </td>
                <td class="text-right font-semibold">
                  {{ Math.ceil(recordCount / BATCH_SIZE) }} × {{ BATCH_SIZE }} rows
                </td>
              </tr>
              <tr>
                <td class="validate-label">Status</td>
                <td class="text-right">
                  <span class="status-badge status-ready">
                    <span class="status-dot"></span>
                    Ready for Import
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Sample rows preview -->
          <div v-if="sampleRows.length > 0" class="sample-preview">
            <p class="sample-label">Preview (first 3 rows)</p>
            <div class="sample-table-wrap">
              <table class="sample-table">
                <thead>
                  <tr>
                    <th v-for="col in detectedColumns.slice(0, 6)" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in sampleRows" :key="ri">
                    <td v-for="col in detectedColumns.slice(0, 6)" :key="col">
                      {{ row[col] ?? '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ── STEP 3: SYNC ── -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Sync with Database</h2>
              <p class="panel-sub">
                This will upsert and clean the <strong>students</strong> table using the uploaded
                dataset.
              </p>
            </div>
          </div>

          <!-- Idle state -->
          <div v-if="syncStatus === 'idle'">
            <!-- ── SYNC MODE TOGGLE ── -->
            <div class="sync-mode-toggle">
              <p class="sync-mode-label">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="inline w-4 h-4 mr-1 opacity-60"
                >
                  <path
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Import Mode
              </p>
              <div class="sync-mode-options">
                <button
                  class="sync-mode-option"
                  :class="{ selected: syncMode === 'partial' }"
                  @click="syncMode = 'partial'"
                >
                  <div class="sync-mode-option-header">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="w-4 h-4"
                    >
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Partial Update</span>
                    <span class="sync-mode-badge safe">Safe</span>
                  </div>
                  <p class="sync-mode-desc">
                    Only inserts and updates the records in your file. Nothing is deleted. Use this
                    when uploading a subset of students.
                  </p>
                </button>
                <button
                  class="sync-mode-option"
                  :class="{ selected: syncMode === 'full' }"
                  @click="syncMode = 'full'"
                >
                  <div class="sync-mode-option-header">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="w-4 h-4"
                    >
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Full Sync</span>
                    <span class="sync-mode-badge destructive">Deletes records</span>
                  </div>
                  <p class="sync-mode-desc">
                    Replaces the entire database with this file. Students absent from the file will
                    be permanently deleted.
                  </p>
                </button>
              </div>
            </div>

            <!-- What will happen cards -->
            <div class="sync-info-box">
              <div class="sync-info-row">
                <div class="sync-info-icon insert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p class="sync-info-title">Insert new students</p>
                  <p class="sync-info-desc">Students not yet in the database will be added.</p>
                </div>
              </div>
              <div class="sync-info-row">
                <div class="sync-info-icon update">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <p class="sync-info-title">Update existing students</p>
                  <p class="sync-info-desc">
                    Matching ID numbers will have their records refreshed.
                  </p>
                </div>
              </div>
              <div
                class="sync-info-row"
                :class="{ 'sync-info-row--muted': syncMode === 'partial' }"
              >
                <div class="sync-info-icon delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <p class="sync-info-title">
                    Remove graduated students
                    <span v-if="syncMode === 'partial'" class="sync-skip-badge"
                      >Skipped in Partial Update</span
                    >
                  </p>
                  <p class="sync-info-desc">
                    Students in the database but absent from the file will be deleted
                    (graduated/unenrolled).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="syncStatus === 'loading'" class="loading-state">
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="loading-stats">
              <div class="loading-stat">
                <span class="loading-stat-label">Progress</span>
                <span class="loading-stat-value">{{ progressPercent }}%</span>
              </div>
              <div class="loading-stat">
                <span class="loading-stat-label">Batch</span>
                <span class="loading-stat-value">{{ currentBatch }} / {{ totalBatches }}</span>
              </div>
              <div class="loading-stat">
                <span class="loading-stat-label">Processed</span>
                <span class="loading-stat-value">{{ processedCount.toLocaleString() }} rows</span>
              </div>
              <div class="loading-stat">
                <span class="loading-stat-label">Phase</span>
                <span class="loading-stat-value phase-label">{{ currentPhase }}</span>
              </div>
            </div>
            <div class="loading-log">
              <p v-for="(log, i) in importLogs.slice(-5)" :key="i" class="log-line">{{ log }}</p>
            </div>
            <p class="loading-note">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="inline w-3 h-3 mr-1"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              Please keep this tab open until the import completes.
            </p>
          </div>

          <!-- Success state -->
          <div v-if="syncStatus === 'success'" class="success-state">
            <div class="success-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="success-title">Import Complete!</h3>
            <p class="success-sub">The student database has been synchronized successfully.</p>
            <div class="success-stats">
              <div class="success-stat">
                <span class="success-stat-value insert-color">{{
                  syncResult.inserted.toLocaleString()
                }}</span>
                <span class="success-stat-label">Inserted</span>
              </div>
              <div class="success-stat-divider"></div>
              <div class="success-stat">
                <span class="success-stat-value update-color">{{
                  syncResult.updated.toLocaleString()
                }}</span>
                <span class="success-stat-label">Updated</span>
              </div>
              <div class="success-stat-divider"></div>
              <div class="success-stat">
                <span class="success-stat-value delete-color">{{
                  syncResult.deleted.toLocaleString()
                }}</span>
                <span class="success-stat-label">Deleted</span>
              </div>
            </div>
            <button class="reset-btn" @click="resetImport">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-4 h-4"
              >
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Import Another File
            </button>
          </div>

          <!-- Error state -->
          <div v-if="syncStatus === 'error'" class="error-state">
            <div class="error-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="error-title">Import Failed</h3>
            <p class="error-message">{{ errorMessage }}</p>
            <button class="retry-btn" @click="syncStatus = 'idle'">Try Again</button>
          </div>
        </div>

        <!-- ── CONTROLS ── -->
        <div class="step-controls" v-if="syncStatus !== 'loading' && syncStatus !== 'success'">
          <button v-if="currentStep > 0" class="nav-btn" @click="goBack">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            v-if="currentStep === 0"
            class="nav-btn primary"
            :disabled="!uploadedFile || isParsing"
            @click="goToValidate"
          >
            <span v-if="isParsing" class="btn-spinner"></span>
            <span v-else>Continue</span>
            <svg
              v-if="!isParsing"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button v-if="currentStep === 1" class="nav-btn primary" @click="currentStep = 2">
            Proceed to Sync
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            v-if="currentStep === 2 && syncStatus === 'idle'"
            class="nav-btn primary import-btn"
            @click="importStudents"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4"
            >
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Start Import
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar.vue'
import ExcelInstruct from '@/components/ExcelInstruct.vue'

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// ── Constants ─────────────────────────────────────────────────────────────────
const BATCH_SIZE = 500

// Safety threshold: block Full Sync if the file would delete more than
// 50% of the existing database. Prevents accidental mass-deletion from partial files.
const DELETE_THRESHOLD = 0.5

// Column mapping: Excel header → DB column
const COLUMN_MAP: Record<string, string> = {
  id_number: 'id_number',
  'ID Number': 'id_number',
  'Student ID': 'id_number',
  first_name: 'first_name',
  'First Name': 'first_name',
  middle_name: 'middle_name',
  'Middle Name': 'middle_name',
  last_name: 'last_name',
  'Last Name': 'last_name',
  program: 'program',
  Program: 'program',
  college: 'college',
  College: 'college',
  year_level: 'year_level',
  'Year Level': 'year_level',
  gender: 'gender',
  Gender: 'gender',
  is_active: 'is_active',
}

const REQUIRED_COLUMNS = ['id_number', 'ID Number', 'Student ID']

// ── State ─────────────────────────────────────────────────────────────────────
const activeTab = ref('REPORTS')
const handleTabChange = (name: string) => {
  activeTab.value = name
}

const currentStep = ref(0)
const steps = [
  { title: 'Upload', sub: 'Select dataset' },
  { title: 'Validate', sub: 'Check records' },
  { title: 'Sync', sub: 'Update database' },
]

const isInstructModalOpen = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const isParsing = ref(false)

const fileName = ref('')
const recordCount = ref(0)
const detectedColumns = ref<string[]>([])
const parsedRows = ref<Record<string, any>[]>([])
const sampleRows = ref<Record<string, any>[]>([])
const columnWarning = ref('')

// Sync mode: 'partial' = upsert only (safe), 'full' = upsert + delete (destructive)
type SyncMode = 'partial' | 'full'
const syncMode = ref<SyncMode>('partial')

// Sync state
type SyncStatus = 'idle' | 'loading' | 'success' | 'error'
const syncStatus = ref<SyncStatus>('idle')
const progressPercent = ref(0)
const currentBatch = ref(0)
const totalBatches = ref(0)
const processedCount = ref(0)
const currentPhase = ref('')
const importLogs = ref<string[]>([])
const errorMessage = ref('')

const syncResult = ref({ inserted: 0, updated: 0, deleted: 0 })

const lastImportTime = ref<string>('Loading...')

async function fetchLastImportTime() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    if (data?.created_at) {
      const date = new Date(data.created_at)
      lastImportTime.value = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      lastImportTime.value = 'No records found'
    }
  } catch (err) {
    console.error('Error fetching last import time:', err)
    lastImportTime.value = 'N/A'
  }
}

import { onMounted } from 'vue'
onMounted(() => {
  fetchLastImportTime()
})

// ── Computed ──────────────────────────────────────────────────────────────────
const isMappedColumn = (col: string) => Object.keys(COLUMN_MAP).includes(col)

// ── File Handling ─────────────────────────────────────────────────────────────
function triggerFileInput() {
  if (uploadedFile.value) {
    fileInputRef.value?.click()
  } else {
    isInstructModalOpen.value = true
  }
}

function handleInstructionsAccepted() {
  isInstructModalOpen.value = false;
  setTimeout(() => {
    fileInputRef.value?.click();
  }, 100);
}

// NEW: Function for the "X" button (Just closes)
function closeInstructions() {
  isInstructModalOpen.value = false;
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    processFile(file)
  }
}

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

function processFile(file: File) {
  uploadedFile.value = file
  fileName.value = file.name
  columnWarning.value = ''
  detectedColumns.value = []
  parsedRows.value = []
  sampleRows.value = []
  recordCount.value = 0
}

function removeFile() {
  uploadedFile.value = null
  fileName.value = ''
  detectedColumns.value = []
  parsedRows.value = []
  sampleRows.value = []
  recordCount.value = 0
  columnWarning.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// ── Parse Excel ───────────────────────────────────────────────────────────────
async function parseExcel(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          throw new Error('No worksheet found in uploaded file.')
        }

        const sheet = workbook.Sheets[firstSheetName]
        if (!sheet) {
          throw new Error(`Worksheet "${firstSheetName}" could not be read.`)
        }

        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: null })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

function sanitizeEncoding(val: any): any {
  if (typeof val !== 'string') return val;

  // Map of corrupted sequences to correct characters
  const corrections: Record<string, string> = {
    'Ã‘': 'Ñ',
    'Ã±': 'ñ',
    'Ã ': 'À',
    'Ã©': 'é',
    'Ã³': 'ó',
    // Add others if you encounter more, but these are the most common for PH names
  };

  let cleaned = val;
  Object.entries(corrections).forEach(([corrupt, correct]) => {
    cleaned = cleaned.replace(new RegExp(corrupt, 'g'), correct);
  });

  return cleaned.trim();
}

// ── Map row to DB record ──────────────────────────────────────────────────────
function mapRow(row: Record<string, any>): Record<string, any> | null {
  const mapped: Record<string, any> = {}

  for (const [excelCol, dbCol] of Object.entries(COLUMN_MAP)) {
    if (row[excelCol] !== undefined) {
      let val = row[excelCol]
      val = sanitizeEncoding(val);
      if (dbCol === 'year_level' && val !== null) val = parseInt(String(val), 10) || null
      if (dbCol === 'is_active' && val !== null) val = Boolean(val)
      mapped[dbCol] = val
    }
  }

  if (!mapped.id_number) return null

  // Ensure id_number is always a string
  mapped.id_number = String(mapped.id_number).trim()
  mapped.is_active = mapped.is_active ?? true

  return mapped
}

// ── Go to Validate (parse file) ───────────────────────────────────────────────
async function goToValidate() {
  if (!uploadedFile.value) return
  isParsing.value = true
  columnWarning.value = ''

  try {
    const rows = await parseExcel(uploadedFile.value)
    if (rows.length === 0) throw new Error('The file appears to be empty.')

    const firstRow = rows[0]
    if (!firstRow) {
      throw new Error('Unable to read row data from the uploaded file.')
    }

    detectedColumns.value = Object.keys(firstRow)

    // Check for required ID column
    const hasIdCol = REQUIRED_COLUMNS.some((c) => detectedColumns.value.includes(c))
    if (!hasIdCol) {
      columnWarning.value = `Warning: No recognized ID column found. Expected one of: ${REQUIRED_COLUMNS.join(', ')}`
    }

    const mapped = rows.map(mapRow).filter(Boolean) as Record<string, any>[]
    parsedRows.value = mapped
    recordCount.value = mapped.length
    sampleRows.value = rows.slice(0, 3)

    currentStep.value = 1
  } catch (err: any) {
    columnWarning.value = `Parse error: ${err.message}`
  } finally {
    isParsing.value = false
  }
}

function goBack() {
  if (currentStep.value > 0) currentStep.value--
  syncStatus.value = 'idle'
}

// ── Main Import ───────────────────────────────────────────────────────────────
async function importStudents() {
  if (parsedRows.value.length === 0) return

  syncStatus.value = 'loading'
  progressPercent.value = 0
  currentBatch.value = 0
  processedCount.value = 0
  importLogs.value = []
  syncResult.value = { inserted: 0, updated: 0, deleted: 0 }
  errorMessage.value = ''

  try {
    const rows = parsedRows.value
    const incomingIds = new Set(rows.map((r) => r.id_number))
    const batches = chunkArray(rows, BATCH_SIZE)
    totalBatches.value = batches.length

    // ── Phase 1: Fetch existing IDs ───────────────────────────────────────────
    currentPhase.value = 'Fetching existing records'
    addLog('📋 Fetching existing student IDs from database...')

    const existingIds = await fetchAllExistingIds()
    addLog(`Found ${existingIds.size.toLocaleString()} existing records in DB.`)

    // ── Phase 2: Upsert in batches ────────────────────────────────────────────
    currentPhase.value = 'Upserting records'
    addLog(
      `Starting upsert — ${rows.length.toLocaleString()} records in ${batches.length} batches...`,
    )

    for (let i = 0; i < batches.length; i++) {
      currentBatch.value = i + 1
      const batch = batches[i]
      if (!batch) {
        continue
      }

      const { error } = await supabase.from('students').upsert(batch, { onConflict: 'id_number' })

      if (error) throw new Error(`Batch ${i + 1} upsert failed: ${error.message}`)

      processedCount.value += batch.length
      progressPercent.value = Math.round((processedCount.value / rows.length) * 80) // 80% for upsert
      addLog(
        `✓ Batch ${i + 1}/${batches.length} — ${processedCount.value.toLocaleString()} rows upserted`,
      )
    }

    // Estimate inserts vs updates (approximate)
    syncResult.value.inserted = rows.filter((r) => !existingIds.has(r.id_number)).length
    syncResult.value.updated = rows.filter((r) => existingIds.has(r.id_number)).length

    // ── Phase 3: Delete stale records (Full Sync only) ────────────────────────
    if (syncMode.value === 'full') {
      currentPhase.value = 'Removing stale records'
      addLog('🗑️ Identifying records to delete (no longer enrolled)...')

      const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id))

      if (idsToDelete.length > 0) {
        // ── Safety threshold guard ──────────────────────────────────────────
        // Block the delete if it would wipe out more than DELETE_THRESHOLD (50%)
        // of the database. This prevents accidental mass-deletion when a partial
        // file is accidentally uploaded with Full Sync mode selected.
        const deletionRatio = idsToDelete.length / existingIds.size
        if (deletionRatio > DELETE_THRESHOLD) {
          throw new Error(
            `Blocked: This would delete ${idsToDelete.length.toLocaleString()} records ` +
              `(${Math.round(deletionRatio * 100)}% of the database). ` +
              `This usually means the uploaded file is a partial dataset. ` +
              `Switch to Partial Update mode, or upload the complete student list to use Full Sync.`,
          )
        }

        addLog(`Deleting ${idsToDelete.length.toLocaleString()} stale student records...`)
        const deleteBatches = chunkArray(idsToDelete, 500)

        for (const batch of deleteBatches) {
          const { error } = await supabase.from('students').delete().in('id_number', batch)

          if (error) throw new Error(`Delete failed: ${error.message}`)
        }

        syncResult.value.deleted = idsToDelete.length
        addLog(`✓ Deleted ${idsToDelete.length.toLocaleString()} stale records`)
      } else {
        addLog('✓ No stale records to delete')
      }
    } else {
      // Partial Update — skip delete phase entirely
      addLog('⏭️ Partial Update mode — delete phase skipped. No records removed.')
    }

    progressPercent.value = 100
    currentPhase.value = 'Done'
    addLog('🎉 Import complete!')

    await sleep(500)
    syncStatus.value = 'success'
  } catch (err: any) {
    errorMessage.value = err.message || 'An unexpected error occurred.'
    syncStatus.value = 'error'
    addLog(`❌ Error: ${err.message}`)
  }

  if (syncStatus.value === 'success') {
  await fetchLastImportTime() // Refresh the timestamp
}
}

// ── Fetch all existing IDs (paginated, handles 10k+) ─────────────────────────
async function fetchAllExistingIds(): Promise<Set<string>> {
  const allIds = new Set<string>()
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('students')
      .select('id_number')
      .range(from, from + pageSize - 1)

    if (error) throw new Error(`Failed to fetch existing IDs: ${error.message}`)
    if (!data || data.length === 0) break

    data.forEach((row) => allIds.add(row.id_number))
    if (data.length < pageSize) break
    from += pageSize
  }

  return allIds
}

// ── Reset ─────────────────────────────────────────────────────────────────────
function resetImport() {
  removeFile()
  currentStep.value = 0
  syncStatus.value = 'idle'
  progressPercent.value = 0
  importLogs.value = []
  syncResult.value = { inserted: 0, updated: 0, deleted: 0 }
  syncMode.value = 'partial' // Reset to safe default
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function addLog(msg: string) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false })
  importLogs.value.push(`[${time}] ${msg}`)
}
</script>

<style src="@/assets/styles/report-analytics.css"></style>

<style scoped>
/* ── STEPPER ─────────────────────────────────────── */
.stepper {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 4px 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.step.active {
  opacity: 1;
}
.step.completed {
  opacity: 0.75;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(13, 43, 15, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
  transition: all 0.3s;
  color: rgba(13, 43, 15, 0.4);
}

.step.active .step-circle {
  background: #0d2b0f;
  border-color: #0d2b0f;
  color: white;
  box-shadow: 0 4px 14px rgba(13, 43, 15, 0.3);
}

.step.completed .step-circle {
  background: #f9a825;
  border-color: #f9a825;
  color: #0d2b0f;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.step-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-sub {
  font-size: 0.7rem;
  color: rgba(13, 43, 15, 0.4);
}

.step-connector {
  flex: 1;
  padding: 0 12px;
}

.step-connector-line {
  height: 2px;
  background: rgba(13, 43, 15, 0.1);
  border-radius: 2px;
  transition: background 0.4s;
}

.step-connector-line.filled {
  background: #f9a825;
}

/* ─── Sync Mode Toggle ──────────────────────────── */
.sync-mode-toggle {
  margin-bottom: 20px;
}

.sync-mode-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(13, 43, 15, 0.45);
  margin-bottom: 10px;
}

.sync-mode-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sync-mode-option {
  text-align: left;
  background: white;
  border: 1.5px solid var(--border, #e0ddd8);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: 0.2s;
}

.sync-mode-option:hover {
  border-color: rgba(13, 43, 15, 0.3);
  background: rgba(13, 43, 15, 0.02);
}

.sync-mode-option.selected {
  border-color: #0d2b0f;
  background: rgba(13, 43, 15, 0.04);
  box-shadow: 0 0 0 3px rgba(13, 43, 15, 0.06);
}

.sync-mode-option-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0d2b0f;
  margin-bottom: 6px;
}

.sync-mode-desc {
  font-size: 0.75rem;
  color: rgba(13, 43, 15, 0.5);
  line-height: 1.5;
  margin: 0;
}

.sync-mode-badge {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 99px;
  margin-left: auto;
}

.sync-mode-badge.safe {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}

.sync-mode-badge.destructive {
  background: rgba(198, 40, 40, 0.08);
  color: #c62828;
}

.sync-info-row--muted {
  opacity: 0.4;
}

.sync-skip-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  background: rgba(13, 43, 15, 0.07);
  color: rgba(13, 43, 15, 0.5);
  border-radius: 99px;
  padding: 2px 8px;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .sync-mode-options {
    grid-template-columns: 1fr;
  }
}

/* ── IMPORT PANEL ─────────────────────────────────── */
.import-panel {
  min-height: 320px;
}

.step-content {
  animation: stepIn 0.35s ease;
}

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── DROP ZONE ────────────────────────────────────── */
.drop-zone {
  border: 2px dashed rgba(13, 43, 15, 0.15);
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: rgba(13, 43, 15, 0.01);
  margin-bottom: 20px;
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: #f9a825;
  background: rgba(249, 168, 37, 0.04);
}

.drop-zone.hasFile {
  border-style: solid;
  border-color: rgba(13, 43, 15, 0.15);
  padding: 24px;
}

.drop-zone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.drop-icon {
  width: 52px;
  height: 52px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.drop-icon svg {
  width: 24px;
  color: var(--ink);
  opacity: 0.6;
}

.upload-main {
  font-size: 0.95rem;
  color: var(--ink);
  margin: 0;
}

.upload-sub {
  font-size: 0.75rem;
  color: rgba(13, 43, 15, 0.4);
  margin: 0;
}

/* ── File Display ─────────────────────────────────── */
.drop-zone-file {
  display: flex;
  align-items: center;
  gap: 14px;
}

.file-icon {
  width: 44px;
  height: 44px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon svg {
  width: 22px;
  color: #1b5e20;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--ink);
}

.file-size {
  font-size: 0.73rem;
  color: rgba(13, 43, 15, 0.4);
  margin: 0;
}

.file-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(198, 40, 40, 0.08);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  flex-shrink: 0;
}

.file-remove:hover {
  background: rgba(198, 40, 40, 0.18);
}

.file-remove svg {
  width: 14px;
  color: #c62828;
}

/* ── Column Preview ───────────────────────────────── */
.column-preview {
  margin-top: 4px;
}

.column-preview-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(13, 43, 15, 0.4);
  margin: 0 0 10px;
}

.column-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.column-tag {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(13, 43, 15, 0.06);
  color: rgba(13, 43, 15, 0.5);
  border: 1px solid transparent;
}

.column-tag.mapped {
  background: rgba(27, 94, 32, 0.08);
  color: #1b5e20;
  border-color: rgba(27, 94, 32, 0.2);
}

.column-warning {
  font-size: 0.78rem;
  color: #d97706;
  background: rgba(249, 168, 37, 0.08);
  border: 1px solid rgba(249, 168, 37, 0.25);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0;
}

/* ── Validate ─────────────────────────────────────── */
.validate-label {
  padding: 13px 12px 13px 0;
  font-size: 0.88rem;
  color: rgba(13, 43, 15, 0.55);
}

.record-count-badge {
  font-weight: 800;
  font-size: 0.88rem;
  background: rgba(13, 43, 15, 0.06);
  padding: 3px 10px;
  border-radius: 6px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.status-ready {
  background: rgba(22, 163, 74, 0.08);
  color: #16a34a;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* ── Sample Preview ───────────────────────────────── */
.sample-preview {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.sample-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(13, 43, 15, 0.4);
  margin: 0 0 12px;
}

.sample-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.sample-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.sample-table th {
  background: rgba(13, 43, 15, 0.04);
  padding: 8px 12px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: rgba(13, 43, 15, 0.45);
  text-align: left;
  white-space: nowrap;
}

.sample-table td {
  padding: 8px 12px;
  border-top: 1px solid var(--border);
  color: var(--ink);
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Sync Info ────────────────────────────────────── */
.sync-info-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(13, 43, 15, 0.02);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 8px;
}

.sync-info-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.sync-info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sync-info-icon svg {
  width: 16px;
}

.sync-info-icon.insert {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}
.sync-info-icon.update {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}
.sync-info-icon.delete {
  background: rgba(198, 40, 40, 0.08);
  color: #c62828;
}

.sync-info-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--ink);
}

.sync-info-desc {
  font-size: 0.78rem;
  color: rgba(13, 43, 15, 0.45);
  margin: 0;
}

/* ── Loading State ────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}

.progress-track {
  height: 10px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0d2b0f, #1b5e20 50%, #f9a825);
  border-radius: 99px;
  transition: width 0.4s ease;
}

.loading-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.loading-stat {
  background: rgba(13, 43, 15, 0.03);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loading-stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(13, 43, 15, 0.4);
}

.loading-stat-value {
  font-size: 1rem;
  font-weight: 900;
  color: var(--ink);
}

.phase-label {
  font-size: 0.8rem !important;
  font-weight: 700 !important;
}

.loading-log {
  background: #0d2b0f;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 130px;
  overflow-y: auto;
}

.log-line {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
  margin: 0;
  line-height: 1.5;
}

.log-line:last-child {
  color: #f9a825;
}

.loading-note {
  font-size: 0.75rem;
  color: rgba(13, 43, 15, 0.4);
  text-align: center;
  margin: 0;
}

/* ── Success State ────────────────────────────────── */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0 8px;
  text-align: center;
  animation: stepIn 0.5s ease;
}

.success-icon-wrap {
  width: 60px;
  height: 60px;
  background: rgba(22, 163, 74, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes successPop {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon-wrap svg {
  width: 28px;
  color: #16a34a;
}

.success-title {
  font-size: 1.3rem;
  font-weight: 900;
  margin: 0;
  color: var(--ink);
}

.success-sub {
  font-size: 0.85rem;
  color: rgba(13, 43, 15, 0.45);
  margin: 0;
}

.success-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(13, 43, 15, 0.03);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 32px;
  margin: 8px 0;
  width: 100%;
  justify-content: center;
}

.success-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 32px;
}

.success-stat-value {
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
}

.success-stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(13, 43, 15, 0.4);
}

.success-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

.insert-color {
  color: #16a34a;
}
.update-color {
  color: #2563eb;
}
.delete-color {
  color: #c62828;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(13, 43, 15, 0.06);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ink);
  cursor: pointer;
  transition: 0.2s;
  margin-top: 4px;
}

.reset-btn:hover {
  background: rgba(13, 43, 15, 0.1);
}

/* ── Error State ──────────────────────────────────── */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0 8px;
  text-align: center;
}

.error-icon-wrap {
  width: 60px;
  height: 60px;
  background: rgba(198, 40, 40, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon-wrap svg {
  width: 26px;
  color: #c62828;
}

.error-title {
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0;
  color: #c62828;
}

.error-message {
  font-size: 0.82rem;
  color: rgba(13, 43, 15, 0.5);
  margin: 0;
  max-width: 420px;
  background: rgba(198, 40, 40, 0.04);
  border: 1px solid rgba(198, 40, 40, 0.15);
  border-radius: 8px;
  padding: 10px 16px;
}

.retry-btn {
  padding: 10px 20px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.retry-btn:hover {
  background: #b71c1c;
}

/* ── Controls ─────────────────────────────────────── */
.step-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid var(--border);
  background: white;
  color: var(--ink);
}

.nav-btn:hover:not(:disabled) {
  background: rgba(13, 43, 15, 0.05);
}

.nav-btn.primary {
  background: #0d2b0f;
  color: white;
  border-color: #0d2b0f;
}

.nav-btn.primary:hover:not(:disabled) {
  background: #1b5e20;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(13, 43, 15, 0.2);
}

.nav-btn.import-btn {
  background: linear-gradient(135deg, #0d2b0f, #1b5e20);
  padding: 11px 24px;
  font-size: 0.82rem;
}

.nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 768px) {
  .stepper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .step-connector {
    display: none;
  }
  .loading-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .success-stats {
    padding: 16px;
  }
  .success-stat {
    padding: 0 16px;
  }
}
</style>
