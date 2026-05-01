<template>
  <div class="page-shell">
    <Sidebar />

    <div class="page-scroll">
      <!-- HEADER -->
      <header class="attn-header">
        <div>
          <div
            class="flex mb-3 items-center gap-1.5 leading-none text-[0.68rem] font-bold tracking-[0.15em] uppercase text-[rgba(13,43,15,0.4)]"
          >
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/attendance')"
              >BACK</span
            >
            <svg
              class="w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Library settings</span>
          </div>

          <h1 class="hero-title">
            <span class="hero-word-dark hero-underlined">Library</span>
            <span class="hero-word-gold"> Settings</span>
          </h1>
          <p class="hero-subtitle">Configure app background, video, and system preferences</p>
        </div>
      </header>

      <!-- ERROR BANNER -->
      <div v-if="errorMsg" class="error-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ errorMsg }}
        <button @click="errorMsg = null" class="banner-close">✕</button>
      </div>

      <!-- SUCCESS BANNER -->
      <div v-if="successMsg" class="success-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ successMsg }}
        <button @click="successMsg = null" class="banner-close">✕</button>
      </div>

      <!-- CARDS -->
      <div class="settings-wrapper" v-if="!loading">
        <!-- ① APP BACKGROUND -->
        <div class="settings-card" :class="{ 'settings-card--editing': editing }">
          <div class="card-eyebrow-row">
            <div class="card-eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                style="width: 13px; height: 13px"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 15l5-5 4 4 3-3 6 6" />
              </svg>
              App Background
            </div>
            <div class="card-actions">
              <button v-if="!editing" class="action-btn action-btn--edit" @click="editSection">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button v-if="editing" class="action-btn action-btn--cancel" @click="cancelEdit">
                Cancel
              </button>
              <button
                v-if="editing"
                class="action-btn action-btn--save"
                @click="saveSection"
                :disabled="saving"
              >
                <span v-if="saving" class="btn-spinner btn-spinner--white"></span>
                {{ saving ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </div>

          <div class="field-stack">
            <div class="field-col">
              <label class="field-label">Background Image</label>
              <div class="upload-area" :class="{ 'upload-area--active': editing }">
                <div v-if="settings.bg_path" class="media-preview">
                  <img :src="settings.bg_path" alt="Background preview" class="media-thumb" />
                  <div class="media-info">
                    <span class="media-name">Background set</span>
                    <span class="media-url">{{ settings.bg_path }}</span>
                  </div>
                  <button
                    v-if="editing"
                    class="media-change-btn"
                    :disabled="uploadingBg"
                    @click="bgFileInput?.click()"
                  >
                    <span v-if="uploadingBg" class="btn-spinner"></span>
                    {{ uploadingBg ? 'Uploading…' : 'Change' }}
                  </button>
                </div>
                <button
                  v-else
                  class="upload-empty-btn"
                  :disabled="!editing || uploadingBg"
                  @click="bgFileInput?.click()"
                >
                  <span v-if="uploadingBg" class="btn-spinner btn-spinner--gold"></span>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    style="width: 18px; height: 18px"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {{
                    uploadingBg
                      ? 'Uploading…'
                      : editing
                        ? 'Click to upload image'
                        : 'No background selected'
                  }}
                </button>
                <input
                  ref="bgFileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onBgFileChange"
                />
              </div>
            </div>

            <!-- Meta -->
            <div class="meta-row" v-if="lastUpdated || editedByEmail">
              <div v-if="lastUpdated" class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Last saved: {{ lastUpdated }}
              </div>
              <div v-if="editedByEmail" class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                By: {{ editedByEmail }}
              </div>
            </div>
          </div>
        </div>

        <!-- ② VIDEO -->
        <div class="settings-card" :class="{ 'settings-card--editing': editingVideo }">
          <div class="card-eyebrow-row">
            <div class="card-eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                style="width: 13px; height: 13px"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              App Video
            </div>
            <div class="card-actions">
              <button
                v-if="!editingVideo"
                class="action-btn action-btn--edit"
                @click="editingVideo = true"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                v-if="editingVideo"
                class="action-btn action-btn--cancel"
                @click="editingVideo = false"
              >
                Cancel
              </button>
              <button
                v-if="editingVideo"
                class="action-btn action-btn--save"
                @click="saveVideo"
                :disabled="savingVideo"
              >
                <span v-if="savingVideo" class="btn-spinner btn-spinner--white"></span>
                {{ savingVideo ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </div>

          <div class="field-stack">
            <div class="field-col">
              <label class="field-label">Video File</label>
              <div class="upload-area" :class="{ 'upload-area--active': editingVideo }">
                <div v-if="settings.video_path" class="media-preview">
                  <div class="video-thumb-wrap">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      class="video-play-icon"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  </div>
                  <div class="media-info">
                    <span class="media-name">Video set</span>
                    <span class="media-url">{{ settings.video_path }}</span>
                  </div>
                  <button
                    v-if="editingVideo"
                    class="media-change-btn"
                    :disabled="uploadingVideo"
                    @click="videoFileInput?.click()"
                  >
                    <span v-if="uploadingVideo" class="btn-spinner"></span>
                    {{ uploadingVideo ? 'Uploading…' : 'Change' }}
                  </button>
                </div>
                <button
                  v-else
                  class="upload-empty-btn"
                  :disabled="!editingVideo || uploadingVideo"
                  @click="videoFileInput?.click()"
                >
                  <span v-if="uploadingVideo" class="btn-spinner btn-spinner--gold"></span>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    style="width: 18px; height: 18px"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  {{
                    uploadingVideo
                      ? 'Uploading…'
                      : editingVideo
                        ? 'Click to upload video'
                        : 'No video selected'
                  }}
                </button>
                <div v-if="uploadingVideo && videoProgress > 0" class="progress-wrap">
                  <div class="progress-bar" :style="{ width: videoProgress + '%' }"></div>
                  <span class="progress-label">{{ videoProgress }}%</span>
                </div>
                <input
                  ref="videoFileInput"
                  type="file"
                  accept="video/*"
                  style="display: none"
                  @change="onVideoFileChange"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ③ TIME OUT TOGGLE -->
        <div class="settings-card">
          <div class="card-eyebrow-row">
            <div class="card-eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                style="width: 13px; height: 13px"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 7v5l3 3" />
              </svg>
              Time Out Feature
            </div>
          </div>

          <div class="field-stack">
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Enable Time Out</span>
                <span class="toggle-desc">
                  When enabled, students can log their time out from the system. Disabling this will
                  hide the time out option.
                </span>
              </div>
              <button
                class="toggle-switch"
                :class="{ 'toggle-switch--on': settings.time_out_enabled }"
                @click="onToggleTimeOut"
                :disabled="savingToggle"
                :aria-label="settings.time_out_enabled ? 'Disable time out' : 'Enable time out'"
              >
                <span class="toggle-knob">
                  <span v-if="savingToggle" class="btn-spinner btn-spinner--sm"></span>
                  <svg
                    v-else-if="settings.time_out_enabled"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    style="width: 10px; height: 10px"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </button>
            </div>
            <div class="status-badge-row">
              <div
                class="status-badge"
                :class="settings.time_out_enabled ? 'status-badge--on' : 'status-badge--off'"
              >
                <span class="status-dot"></span>
                {{ settings.time_out_enabled ? 'Time Out is ENABLED' : 'Time Out is DISABLED' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        Loading settings…
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

// ── Supabase config ───────────────────────────────────────────────
const TABLE_NAME = 'attendance_page'
const ELEMENT_NAME = 'school_info'

// One bucket only for both image and video
const STORAGE_BUCKET = 'attendance_video'

// ── Banners ───────────────────────────────────────────────────────
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

// ── Loading / editing state ───────────────────────────────────────
const loading = ref(false)
const saving = ref(false)
const savingVideo = ref(false)
const savingToggle = ref(false)
const uploadingBg = ref(false)
const uploadingVideo = ref(false)
const videoProgress = ref(0)
const editing = ref(false)
const editingVideo = ref(false)

// ── Meta ──────────────────────────────────────────────────────────
const lastUpdated = ref<string | null>(null)
const editedByEmail = ref<string | null>(null)

// ── File input refs ───────────────────────────────────────────────
const bgFileInput = ref<HTMLInputElement | null>(null)
const videoFileInput = ref<HTMLInputElement | null>(null)

// ── Settings ──────────────────────────────────────────────────────
const settings = reactive({
  bg_path: '',
  bg_storage_path: '',
  video_path: '',
  video_storage_path: '',
  time_out_enabled: true,
})

const pageRowId = ref<string | null>(null)

// ── Helpers ───────────────────────────────────────────────────────
function showSuccess(message: string) {
  successMsg.value = message
  errorMsg.value = null

  window.setTimeout(() => {
    successMsg.value = null
  }, 2500)
}

function showError(message: string) {
  errorMsg.value = message
  successMsg.value = null
}

function formatDateTime(value?: string | null) {
  if (!value) return null

  try {
    return new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Manila',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function safeParseElementForm(value: unknown) {
  if (!value || value === 'EMPTY') {
    return {}
  }

  if (typeof value === 'object') {
    return value as Record<string, any>
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }

  return {}
}

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}

async function getFileUrl(path: string) {
  if (!path) return ''

  // Works for private bucket
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60)

  if (!error && data?.signedUrl) {
    return data.signedUrl
  }

  // Fallback if bucket is public
  const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return publicData.publicUrl
}

async function uploadFileToStorage(file: File, folder: string) {
  const fileExt = file.name.split('.').pop()
  const cleanName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase()

  const filePath = `${folder}/${Date.now()}-${cleanName}.${fileExt}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    throw error
  }

  return filePath
}

async function saveSettingsToSupabase() {
  const user = await getCurrentUser()

  const elementForm = {
    bg_path: settings.bg_path,
    bg_storage_path: settings.bg_storage_path,
    video_path: settings.video_path,
    video_storage_path: settings.video_storage_path,
    time_out_enabled: settings.time_out_enabled,
  }

  const payload = {
    element_name: ELEMENT_NAME,
    element_form: JSON.stringify(elementForm),
    edited_by: user?.id ?? null,
    edited_at: new Date().toISOString(),
  }

  if (pageRowId.value) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq('id', pageRowId.value)
      .select('id, edited_at')
      .single()

    if (error) throw error

    lastUpdated.value = formatDateTime(data?.edited_at)
    editedByEmail.value = user?.email ?? null
    return
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select('id, edited_at')
    .single()

  if (error) throw error

  pageRowId.value = data.id
  lastUpdated.value = formatDateTime(data?.edited_at)
  editedByEmail.value = user?.email ?? null
}

// ── Load existing settings ────────────────────────────────────────
async function loadSettings() {
  loading.value = true
  errorMsg.value = null

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id, element_name, element_form, edited_by, edited_at')
      .eq('element_name', ELEMENT_NAME)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    if (data) {
      pageRowId.value = data.id

      const parsed = safeParseElementForm(data.element_form)

      settings.bg_storage_path = parsed.bg_storage_path || ''
      settings.video_storage_path = parsed.video_storage_path || ''

      settings.bg_path = settings.bg_storage_path
        ? await getFileUrl(settings.bg_storage_path)
        : parsed.bg_path || ''

      settings.video_path = settings.video_storage_path
        ? await getFileUrl(settings.video_storage_path)
        : parsed.video_path || ''

      settings.time_out_enabled =
        typeof parsed.time_out_enabled === 'boolean' ? parsed.time_out_enabled : true

      lastUpdated.value = formatDateTime(data.edited_at)
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    editedByEmail.value = user?.email ?? null
  } catch (error: any) {
    console.error('Failed to load attendance page settings:', error)
    showError(error?.message || 'Failed to load settings.')
  } finally {
    loading.value = false
  }
}

onMounted(loadSettings)

// ── Edit controls ─────────────────────────────────────────────────
function editSection() {
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  errorMsg.value = null
}

async function saveSection() {
  saving.value = true

  try {
    await saveSettingsToSupabase()
    editing.value = false
    showSuccess('Background settings saved.')
  } catch (error: any) {
    console.error('Failed to save background settings:', error)
    showError(error?.message || 'Failed to save background settings.')
  } finally {
    saving.value = false
  }
}

async function saveVideo() {
  savingVideo.value = true

  try {
    await saveSettingsToSupabase()
    editingVideo.value = false
    showSuccess('Video settings saved.')
  } catch (error: any) {
    console.error('Failed to save video settings:', error)
    showError(error?.message || 'Failed to save video settings.')
  } finally {
    savingVideo.value = false
  }
}

// ── Toggle ────────────────────────────────────────────────────────
async function onToggleTimeOut() {
  const previousValue = settings.time_out_enabled
  settings.time_out_enabled = !settings.time_out_enabled
  savingToggle.value = true

  try {
    await saveSettingsToSupabase()
    showSuccess(
      settings.time_out_enabled
        ? 'Time Out feature enabled.'
        : 'Time Out feature disabled.',
    )
  } catch (error: any) {
    settings.time_out_enabled = previousValue
    console.error('Failed to update Time Out setting:', error)
    showError(error?.message || 'Failed to update Time Out setting.')
  } finally {
    savingToggle.value = false
  }
}

// ── Upload handlers ───────────────────────────────────────────────
async function onBgFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please upload a valid image file.')
    input.value = ''
    return
  }

  uploadingBg.value = true

  try {
    const filePath = await uploadFileToStorage(file, 'attendance-page/backgrounds')
    const fileUrl = await getFileUrl(filePath)

    settings.bg_storage_path = filePath
    settings.bg_path = fileUrl

    await saveSettingsToSupabase()

    editing.value = false
    showSuccess('Background image uploaded and saved.')
  } catch (error: any) {
    console.error('Failed to upload background image:', error)
    showError(error?.message || 'Failed to upload background image.')
  } finally {
    uploadingBg.value = false
    input.value = ''
  }
}

async function onVideoFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.type.startsWith('video/')) {
    showError('Please upload a valid video file.')
    input.value = ''
    return
  }

  uploadingVideo.value = true
  videoProgress.value = 10

  try {
    const filePath = await uploadFileToStorage(file, 'attendance-page/videos')

    videoProgress.value = 70

    const fileUrl = await getFileUrl(filePath)

    settings.video_storage_path = filePath
    settings.video_path = fileUrl

    videoProgress.value = 90

    await saveSettingsToSupabase()

    videoProgress.value = 100
    editingVideo.value = false
    showSuccess('Video uploaded and saved.')
  } catch (error: any) {
    console.error('Failed to upload video:', error)
    showError(error?.message || 'Failed to upload video.')
  } finally {
    window.setTimeout(() => {
      videoProgress.value = 0
    }, 700)

    uploadingVideo.value = false
    input.value = ''
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes underlineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* ── Shell ── */
.page-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #edefed;
  font-family: 'DM Sans', sans-serif;
}
.page-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 44px 80px;
  box-sizing: border-box;
}
.page-scroll::-webkit-scrollbar {
  width: 5px;
}
.page-scroll::-webkit-scrollbar-thumb {
  background: rgba(6, 32, 9, 0.1);
  border-radius: 5px;
}

/* ── Header ── */
.attn-header {
  margin-bottom: 28px;
  animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(6, 32, 9, 0.38);
  letter-spacing: 0.04em;
}
.header-breadcrumb svg {
  width: 10px;
  height: 10px;
  opacity: 0.35;
  flex-shrink: 0;
}
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  display: inline-block;
}
.hero-word-dark {
  color: #062009;
}
.hero-word-gold {
  color: #e6a800;
}
.hero-underlined {
  position: relative;
  display: inline-block;
}
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #062009, #f9a825);
  border-radius: 3px;
  transform-origin: left;
  animation: underlineGrow 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-subtitle {
  font-size: 0.82rem;
  color: #6b7280;
  margin-top: 16px;
}

/* ── Banners ── */
.error-banner,
.success-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 0.78rem;
  font-weight: 600;
  animation: slideDown 0.25s ease both;
}
.error-banner {
  background: #fff1f0;
  border: 1.5px solid #ffc9c9;
  color: #c0392b;
}
.success-banner {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  color: #166534;
}
.error-banner svg,
.success-banner svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.banner-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.78rem;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.banner-close:hover {
  opacity: 1;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: rgba(6, 32, 9, 0.4);
  font-size: 0.82rem;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e2e6e0;
  border-top-color: #062009;
  animation: spin 0.7s linear infinite;
}

/* ── Settings wrapper ── */
.settings-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.settings-card:last-child {
  grid-column: 1 / -1;
}

/* ── Card ── */
.settings-card {
  background: #fff;
  border: 1px solid rgba(6, 32, 9, 0.07);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.05);
  animation: cardIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.settings-card:hover {
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 12px 36px rgba(6, 32, 9, 0.09);
}
.settings-card--editing {
  border-color: rgba(200, 147, 10, 0.35);
}

.card-eyebrow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fdfcf9;
  border-bottom: 1px solid #f5edda;
}
.card-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8930a;
}
.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.28rem 0.75rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn svg {
  width: 12px;
  height: 12px;
}
.action-btn--edit {
  border: 1.5px solid #e2e6e0;
  background: #f7f8f5;
  color: #062009;
}
.action-btn--edit:hover {
  background: #eaede4;
  border-color: #c5ccbe;
  transform: translateY(-1px);
}
.action-btn--cancel {
  border: 1.5px solid #e2e6e0;
  background: transparent;
  color: rgba(6, 32, 9, 0.45);
}
.action-btn--cancel:hover {
  background: #f0f2ec;
}
.action-btn--save {
  border: none;
  background: #062009;
  color: #fff;
  box-shadow: 0 2px 8px rgba(6, 32, 9, 0.2);
}
.action-btn--save:hover:not(:disabled) {
  background: #1b5e20;
  transform: translateY(-1px);
}
.action-btn--save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Fields ── */
.field-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}
.field-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 0.69rem;
  font-weight: 600;
  color: rgba(6, 32, 9, 0.4);
  letter-spacing: 0.02em;
}

/* ── Upload area ── */
.upload-area {
  border: 1.5px dashed #d4d8d0;
  border-radius: 10px;
  background: #f7f8f5;
  overflow: hidden;
  transition:
    border-color 0.18s,
    background 0.18s;
}
.upload-area--active {
  border-color: #c8930a;
  background: #fffdf7;
}

.upload-empty-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ba390;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  transition: color 0.15s;
}
.upload-empty-btn:not(:disabled):hover {
  color: #c8930a;
}
.upload-empty-btn:disabled {
  cursor: not-allowed;
}

.media-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}
.media-thumb {
  width: 54px;
  height: 40px;
  object-fit: cover;
  border-radius: 7px;
  border: 1px solid #e2e6e0;
  flex-shrink: 0;
}

.video-thumb-wrap {
  width: 54px;
  height: 40px;
  background: #f0f2ec;
  border-radius: 7px;
  border: 1px solid #e2e6e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.video-play-icon {
  width: 20px;
  height: 20px;
  color: #1b5e20;
}

.media-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.media-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #062009;
}
.media-url {
  font-size: 0.63rem;
  color: #9ba390;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-change-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.25rem 0.7rem;
  border-radius: 7px;
  border: 1.5px solid #e2e6e0;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: #062009;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}
.media-change-btn:hover:not(:disabled) {
  background: #eaede4;
}
.media-change-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Progress bar ── */
.progress-wrap {
  margin: 0 14px 12px;
  background: #e2e6e0;
  border-radius: 99px;
  height: 6px;
  position: relative;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1b5e20, #f9a825);
  border-radius: 99px;
  transition: width 0.3s ease;
}
.progress-label {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #9ba390;
}

/* ── Meta row ── */
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px dashed #eef0ec;
  margin-top: 4px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.67rem;
  color: #9ba390;
}
.meta-item svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* ── Toggle row ── */
.toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}
.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.toggle-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #062009;
}
.toggle-desc {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.5;
  max-width: 420px;
}

.toggle-switch {
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 99px;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.25s ease;
  padding: 0;
}
.toggle-switch--on {
  background: #1b5e20;
}
.toggle-switch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-switch--on .toggle-knob {
  transform: translateX(24px);
}

/* ── Status badge ── */
.status-badge-row {
  margin-top: 4px;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.status-badge--on {
  background: #f0fdf4;
  color: #166534;
  border: 1.5px solid #bbf7d0;
}
.status-badge--off {
  background: #f9fafb;
  color: #6b7280;
  border: 1.5px solid #e5e7eb;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
  animation: pulse 2s ease infinite;
}

/* ── Spinners ── */
.btn-spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(6, 32, 9, 0.2);
  border-top-color: #062009;
  animation: spin 0.65s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
.btn-spinner--white {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
}
.btn-spinner--gold {
  border-color: rgba(200, 147, 10, 0.2);
  border-top-color: #c8930a;
}
.btn-spinner--sm {
  width: 9px;
  height: 9px;
  border-width: 1.5px;
}

/* ── Responsive ── */
@media (max-width: 680px) {
  .page-scroll {
    padding: 20px 16px 60px;
  }
  .settings-wrapper {
    grid-template-columns: 1fr;
  }
  .settings-card:last-child {
    grid-column: auto;
  }
  .toggle-row {
    flex-direction: column;
  }
}
</style>
