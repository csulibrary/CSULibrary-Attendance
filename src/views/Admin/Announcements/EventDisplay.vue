<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <Sidebar />

    <!-- TOAST -->
    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed left-1/2 top-6 z-[9999] -translate-x-1/2 px-6 py-4 rounded-2xl text-base font-bold text-white shadow-2xl',
          toast.type === 'success' ? 'bg-[#0d2b0f]' : 'bg-red-600',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- DELETE MODAL -->
    <transition name="modal-fade">
      <div
        v-if="deleteModal.show"
        class="fixed inset-0 z-[9000] flex items-center justify-center"
        @click.self="closeDeleteModal"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteModal" />
        <div
          class="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4 border border-gray-100"
          style="animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both"
        >
          <!-- Icon -->
          <div class="flex justify-center mb-5">
            <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-black text-gray-900 text-center mb-2 tracking-tight">Delete Event?</h2>
          <p class="text-sm text-gray-500 text-center mb-1">
            You're about to permanently delete
          </p>
          <p class="text-sm font-bold text-[#0d2b0f] text-center mb-7 px-4 line-clamp-2">
            "{{ deleteModal.title }}"
          </p>
          <p class="text-xs text-gray-400 text-center mb-7">This action cannot be undone.</p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleteModal.loading"
              class="flex-[1.5] py-3.5 rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-95 transition-all text-sm disabled:opacity-60"
            >
              <span v-if="!deleteModal.loading">Yes, Delete</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Deleting…
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- EDIT MODAL -->
    <transition name="modal-fade">
      <div
        v-if="editModal.show"
        class="fixed inset-0 z-[8000] flex items-center justify-center overflow-y-auto py-8"
        @click.self="closeEditModal"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditModal" />
        <div
          class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4 border border-gray-100 overflow-hidden"
          style="animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both"
        >
          <!-- Modal Header -->
          <div class="bg-[#0d2b0f] px-8 pt-7 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-[rgba(255,255,255,0.45)] mb-0.5">EDITING</p>
                <h2 class="text-xl font-black text-white tracking-tight">Edit Event</h2>
              </div>
              <button
                @click="closeEditModal"
                class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-8 space-y-5 max-h-[65vh] overflow-y-auto">
            <!-- Title -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Title</label>
              <input
                v-model="editModal.form.title"
                type="text"
                placeholder="What's happening?"
                class="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2D7231] focus:bg-white text-gray-900 font-semibold transition-all text-sm"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Details</label>
              <textarea
                v-model="editModal.form.description"
                rows="5"
                placeholder="Provide the full story here..."
                class="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2D7231] focus:bg-white text-gray-900 resize-none transition-all text-sm"
              />
            </div>

            <!-- Date + Type -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Date</label>
                <input
                  v-model="editModal.form.datePublished"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2D7231] text-sm transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Type</label>
                <select
                  v-model="editModal.form.type"
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2D7231] text-sm font-semibold text-gray-700 transition-all"
                >
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            <!-- Time fields — only for event -->
            <transition name="slide-fade">
              <div v-if="editModal.form.type === 'event'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Time In</label>
                  <input
                    v-model="editModal.form.timeIn"
                    type="time"
                    class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2D7231] text-sm font-semibold text-gray-700 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Time Out</label>
                  <input
                    v-model="editModal.form.timeOut"
                    type="time"
                    class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2D7231] text-sm font-semibold text-gray-700 transition-all"
                  />
                </div>
              </div>
            </transition>

            <!-- Image upload -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Attachment</label>
              <div v-if="editModal.imagePreview" class="mb-3 rounded-xl overflow-hidden h-32">
                <img :src="editModal.imagePreview" class="w-full h-full object-cover" />
              </div>
              <input
                type="file"
                accept="image/*"
                @change="handleEditFileUpload"
                class="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-8 py-5 border-t border-gray-100 flex gap-3">
            <button
              @click="closeEditModal"
              class="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm"
            >
              Discard
            </button>
            <button
              @click="submitEdit"
              :disabled="editModal.loading"
              class="flex-[2] py-3.5 rounded-2xl font-bold bg-[#0d2b0f] hover:bg-[#1b5e20] text-white shadow-lg active:scale-95 transition-all text-sm disabled:opacity-60"
            >
              <span v-if="!editModal.loading">Update Event</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Saving…
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <main
      class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50"
      style="font-family: 'Poppins', sans-serif; color: #1a1a1a"
    >
      <div class="max-w-7xl mx-auto">

        <!-- HEADER -->
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 leading-none text-[0.68rem] font-bold tracking-[0.15em] uppercase text-[rgba(13,43,15,0.4)]">
              <span>ADMIN</span>
              <svg class="w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7" /></svg>
              <span>EVENT</span>
            </div>
            <h1 class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]">
              <span class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[120px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]">Event</span><span class="text-yellow-500"> Management</span>
            </h1>
            <p class="text-sm text-[rgba(13,43,15,0.5)]">Manage all published library events and updates.</p>
          </div>

          <!-- ADD BUTTON -->
          <button
            @click="$router.push('/admin/event/add')"
            class="flex items-center gap-2.5 px-6 py-3.5 bg-[#0d2b0f] hover:bg-[#1b5e20] text-white font-bold rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm self-start md:self-auto shrink-0"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Event
          </button>
        </div>

        <!-- FILTER TABS -->
        <div class="flex gap-2 mb-7 flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all',
              activeTab === tab.value
                ? 'bg-[#0d2b0f] text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0d2b0f] hover:text-[#0d2b0f]'
            ]"
          >
            {{ tab.label }}
            <span
              :class="[
                'ml-1.5 px-1.5 py-0.5 rounded-md text-[10px]',
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
              ]"
            >{{ getCount(tab.value) }}</span>
          </button>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="n in 6" :key="n" class="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
            <div class="h-44 bg-gray-100" />
            <div class="p-6 space-y-3">
              <div class="h-3 bg-gray-100 rounded-full w-1/4" />
              <div class="h-5 bg-gray-100 rounded-full w-3/4" />
              <div class="h-3 bg-gray-100 rounded-full w-full" />
              <div class="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div
          v-else-if="filteredEvents.length === 0"
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div class="w-20 h-20 rounded-3xl bg-[#0d2b0f]/5 flex items-center justify-center mb-5">
            <svg class="w-9 h-9 text-[#0d2b0f]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <p class="font-black text-gray-300 text-2xl tracking-tight mb-2">No events yet</p>
          <p class="text-sm text-gray-400 mb-6">Add your first event to get started.</p>
          <button
            @click="$router.push('/admin/event/add')"
            class="px-6 py-3 bg-[#0d2b0f] text-white font-bold rounded-2xl text-sm hover:bg-[#1b5e20] transition-all"
          >
            + Add Event
          </button>
        </div>

        <!-- EVENT GRID -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <!-- Card Image -->
            <div class="relative h-44 overflow-hidden">
              <img
                v-if="event.images"
                :src="event.images"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="h-full bg-gradient-to-br from-[#2D7231] to-[#0B2010] flex items-center justify-center"
              >
                <svg class="w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>

              <!-- Type badge -->
              <span
                :class="[
                  'absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  event.type === 'event' ? 'bg-yellow-400/90 text-yellow-900' :
                  event.type === 'news' ? 'bg-blue-500/90 text-white' :
                  'bg-orange-400/90 text-orange-900'
                ]"
              >{{ event.type }}</span>

              <!-- Action buttons — hover reveal -->
              <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  @click="openEditModal(event)"
                  class="w-8 h-8 rounded-xl bg-white/95 shadow-md flex items-center justify-center hover:bg-[#0d2b0f] hover:text-white transition-colors"
                  title="Edit"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  @click="openDeleteModal(event)"
                  class="w-8 h-8 rounded-xl bg-white/95 shadow-md flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <h3 class="font-black text-gray-900 text-base leading-tight mb-2 line-clamp-2 tracking-tight">
                {{ event.title }}
              </h3>
              <p class="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                {{ event.description }}
              </p>

              <!-- Time badge for events -->
              <div
                v-if="event.type === 'event' && (event.time_start || event.time_end)"
                class="mb-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                {{ event.time_start?.slice(0, 5) || '--:--' }} — {{ event.time_end?.slice(0, 5) || '--:--' }}
              </div>

              <!-- Footer -->
              <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {{ formatDate(event.start_date) }}
                </span>
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(event)"
                    class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold border-2 border-gray-200 text-gray-600 hover:border-[#0d2b0f] hover:text-[#0d2b0f] transition-all"
                  >
                    Edit
                  </button>
                  <button
                    @click="openDeleteModal(event)"
                    class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold border-2 border-red-100 text-red-400 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { updateEvent, deleteEvent } from '@/services/eventService'
import { supabase } from '@/lib/supabase'

const router = useRouter()

// ─── Types ───────────────────────────────────────────────────────────────────
interface EventRecord {
  id: string
  title: string
  description: string
  type: 'announcement' | 'event' | 'news'
  images: string | null
  start_date: string | null
  time_start: string | null
  time_end: string | null
  is_active: boolean
}

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const events = ref<EventRecord[]>([])
const activeTab = ref<'all' | 'announcement' | 'event' | 'news'>('all')

const tabs: { value: 'all' | 'announcement' | 'event' | 'news'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'event', label: 'Events' },
]

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const deleteModal = reactive({
  show: false,
  id: null as string | null,
  title: '',
  loading: false,
})

const editModal = reactive({
  show: false,
  id: null as string | null,
  loading: false,
  imagePreview: null as string | null,
  newFile: null as File | null,
  existingImageUrl: null as string | null,
  form: {
    title: '',
    description: '',
    type: 'announcement' as 'announcement' | 'event' | 'news',
    datePublished: '',
    timeIn: '',
    timeOut: '',
  },
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredEvents = computed(() => {
  if (activeTab.value === 'all') return events.value
  return events.value.filter((e) => e.type === activeTab.value)
})

const getCount = (tab: string) => {
  if (tab === 'all') return events.value.length
  return events.value.filter((e) => e.type === tab).length
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.show = false }, 2500)
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const toDateInputValue = (dateString?: string | null): string => {
  const fallback = new Date().toISOString().split('T')[0] as string
  if (!dateString) return fallback
  const d = new Date(dateString)
  return isNaN(d.getTime()) ? fallback : (d.toISOString().split('T')[0] ?? fallback)
}

// ─── Data fetching ────────────────────────────────────────────────────────────
const fetchEvents = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, type, images, start_date, time_start, time_end, is_active')
      .eq('is_active', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    events.value = (data ?? []) as EventRecord[]
  } catch (err) {
    console.error(err)
    showToast('Failed to load events', 'error')
  } finally {
    loading.value = false
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
const openDeleteModal = (event: EventRecord) => {
  deleteModal.id = String(event.id)
  deleteModal.title = event.title
  deleteModal.show = true
  deleteModal.loading = false
}

const closeDeleteModal = () => {
  deleteModal.show = false
  deleteModal.id = null
  deleteModal.title = ''
}

const confirmDelete = async () => {
  if (!deleteModal.id) return
  deleteModal.loading = true
  try {
    await deleteEvent(deleteModal.id)
    events.value = events.value.filter((e) => e.id !== deleteModal.id)
    closeDeleteModal()
    showToast('Event deleted successfully!')
  } catch (err) {
    console.error(err)
    showToast('Failed to delete event', 'error')
  } finally {
    deleteModal.loading = false
  }
}

// ─── Edit ─────────────────────────────────────────────────────────────────────
const openEditModal = (event: EventRecord) => {
  editModal.id = String(event.id)
  editModal.form.title = event.title || ''
  editModal.form.description = event.description || ''
  editModal.form.type = event.type || 'event'
  editModal.form.datePublished = toDateInputValue(event.start_date)
  editModal.form.timeIn = event.time_start ? String(event.time_start).slice(0, 5) : ''
  editModal.form.timeOut = event.time_end ? String(event.time_end).slice(0, 5) : ''
  editModal.imagePreview = event.images || null
  editModal.existingImageUrl = event.images || null
  editModal.newFile = null
  editModal.loading = false
  editModal.show = true
}

const closeEditModal = () => {
  editModal.show = false
  editModal.id = null
  editModal.newFile = null
}

const handleEditFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    editModal.newFile = file
    editModal.imagePreview = URL.createObjectURL(file)
  }
}

const submitEdit = async () => {
  if (!editModal.form.title.trim()) { showToast('Please enter a title', 'error'); return }
  if (!editModal.form.description.trim()) { showToast('Please enter a description', 'error'); return }
  if (editModal.form.type === 'event') {
    if (!editModal.form.timeIn) { showToast('Please set the event start time', 'error'); return }
    if (!editModal.form.timeOut) { showToast('Please set the event end time', 'error'); return }
  }

  editModal.loading = true
  try {
    let imageUrl = editModal.existingImageUrl

    if (editModal.newFile) {
      const file = editModal.newFile
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('events_images')
        .upload(`events/${fileName}`, file)
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage
        .from('events_images')
        .getPublicUrl(`events/${fileName}`)
      imageUrl = urlData.publicUrl
    }

    const dateValue = editModal.form.datePublished || new Date().toISOString()
    const isEvent = editModal.form.type === 'event'

    const payload = {
      type: editModal.form.type,
      title: editModal.form.title,
      description: editModal.form.description,
      images: imageUrl,
      year: new Date(dateValue).getFullYear(),
      start_date: dateValue,
      end_date: dateValue,
      time_start: isEvent ? editModal.form.timeIn || null : null,
      time_end: isEvent ? editModal.form.timeOut || null : null,
    }

    await updateEvent(editModal.id!, payload)

    // Update local state — preserve required id & is_active from existing record
    const idx = events.value.findIndex((e) => e.id === editModal.id)
    if (idx !== -1) {
      const existing = events.value[idx]!
      events.value[idx] = {
        id: existing.id,
        is_active: existing.is_active,
        type: payload.type,
        title: payload.title,
        description: payload.description,
        images: imageUrl ?? null,
        start_date: payload.start_date,
        time_start: payload.time_start,
        time_end: payload.time_end,
      }
    }

    closeEditModal()
    showToast('Event updated successfully!')
  } catch (err) {
    console.error(err)
    showToast('Failed to update event', 'error')
  } finally {
    editModal.loading = false
  }
}

onMounted(fetchEvents)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap');

@keyframes titleFade {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.toast-enter-active, .toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-8px); }

.modal-fade-enter-active { transition: opacity 0.2s ease; }
.modal-fade-leave-active { transition: opacity 0.15s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.slide-fade-enter-active { transition: all 0.25s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>