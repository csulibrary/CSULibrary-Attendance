<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar />

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

    <transition name="toast">
      <div
        v-if="confirmToast.show"
        class="fixed left-1/2 top-1/2 z-[10000] w-[24rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#c8d8ca] bg-white p-5 shadow-2xl"
      >
        <p class="text-base font-semibold text-[#0d2b0f]">{{ confirmToast.message }}</p>
        <div class="mt-3 flex justify-end gap-2">
          <button
            @click="confirmDelete"
            class="rounded-lg bg-[#0d2b0f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b5e20]"
          >
            Yes
          </button>
          <button
            @click="cancelConfirm"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
        </div>
      </div>
    </transition>

    <main ref="reportRootRef" class="report-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="report-header intro-header relative z-[60] overflow-visible">
        <div class="header-left">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div class="header-breadcrumb !mb-0">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>Announcement Management</span>
            </div>
          </div>
          <h1 class="header-title intro-title">
            Library <span class="text-yellow-500">Announcements</span>
          </h1>
          <p class="header-sub">Manage and review all event, general, and news posts.</p>
        </div>

        <!-- DROPDOWN NEW ANNOUNCEMENT -->
        <div class="header-right relative z-50">
          <div class="flex flex-col items-end gap-3">
            <div class="relative z-50 dropdown-wrapper" ref="dropdownRef">
              <button @click="dropdownOpen = !dropdownOpen" class="action-btn">
                <span class="plus-icon" :class="{ 'plus-icon--open': dropdownOpen }">+</span> New
                Announcement
              </button>
              <transition name="dropdown">
                <div v-if="dropdownOpen" class="dropdown-menu">
                  <RouterLink
                    to="/admin/announcement/general"
                    class="dropdown-item whitespace-nowrap"
                    @click="dropdownOpen = false"
                  >
                    New General Announcement
                  </RouterLink>
                  <RouterLink
                    to="/admin/announcement/event"
                    class="dropdown-item whitespace-nowrap"
                    @click="dropdownOpen = false"
                  >
                    New Event Announcement
                  </RouterLink>
                  <RouterLink
                    to="/admin/announcement/news"
                    class="dropdown-item whitespace-nowrap"
                    @click="dropdownOpen = false"
                  >
                    News
                  </RouterLink>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- LOADING SPINNER -->
      <div v-if="isLoading" class="flex justify-center p-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b5e20]"></div>
      </div>

      <!-- ANNOUNCEMENTS SECTION -->
      <section v-else class="overview-shell">
        <div class="overview-kpis">
          <div class="kpi-card">
            <p class="kpi-label">Total Posts</p>
            <p class="kpi-value">
              {{
                eventAnnouncements.length + generalAnnouncements.length + newsAnnouncements.length
              }}
            </p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">This Week</p>
            <p class="kpi-value">{{ thisWeekCount }}</p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Latest Batch</p>
            <p class="kpi-value">{{ latestBatchCount }}</p>
          </div>
        </div>

        <div class="stack-flow">
          <article class="stack-panel">
            <div class="panel-head">
              <h2 class="panel-title">Event Announcements</h2>
              <span class="panel-badge panel-badge-amber"
                >{{ eventAnnouncements.length }} posts</span
              >
            </div>
            <div v-if="eventAnnouncements.length === 0" class="empty-state">
              No event announcements yet.
            </div>
            <div v-else class="stack-list">
              <div
                v-for="event in eventAnnouncements"
                :key="event.id"
                class="row-card row-card-clickable"
                @click="openEventPreview(event)"
              >
                <div v-if="event.images" class="row-thumb-wrap" @click="openEventPreview(event)">
                  <img :src="event.images" class="row-thumb" />
                </div>
                <div
                  v-else
                  class="row-thumb-wrap row-thumb-fallback"
                  @click="openEventPreview(event)"
                >
                  EVENT
                </div>
                <div class="row-body" @click="openEventPreview(event)">
                  <h3 class="row-title">{{ event.title }}</h3>
                  <p class="row-text">{{ event.description }}</p>
                  <div class="row-meta row-meta-split">
                    <p><strong>Event Date:</strong> {{ formatDate(event.start_date) }}</p>
                    <p v-if="event.time_start">
                      <strong>Duration:</strong> {{ formatTime(event.time_start) }} —
                      {{ formatTime(event.time_end) }}
                    </p>
                    <p><strong>Location:</strong> {{ event.location }}</p>
                  </div>
                </div>
                <div class="row-actions">
                  <RouterLink
                    :to="`/admin/announcement/event?id=${event.id}`"
                    class="icon-action"
                    title="Edit Announcement"
                    @click.stop
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </RouterLink>
                  <button
                    @click.stop="deleteAnnouncement(event.id)"
                    class="icon-action icon-action-danger"
                    title="Delete Announcement"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article class="stack-panel">
            <div class="panel-head">
              <h2 class="panel-title">General Announcements</h2>
              <span class="panel-badge">{{ generalAnnouncements.length }} posts</span>
            </div>
            <div v-if="generalAnnouncements.length === 0" class="empty-state">
              No general updates yet.
            </div>
            <div v-else class="stack-list">
              <div
                v-for="announcement in generalAnnouncements"
                :key="announcement.id"
                class="row-card row-card-clickable"
                @click="openGeneralPreview(announcement)"
              >
                <div
                  v-if="announcement.image_url"
                  class="row-thumb-wrap"
                  @click="openGeneralPreview(announcement)"
                >
                  <img :src="announcement.image_url" class="row-thumb" />
                </div>
                <div
                  v-else
                  class="row-thumb-wrap row-thumb-fallback"
                  @click="openGeneralPreview(announcement)"
                >
                  GENERAL
                </div>
                <div class="row-body" @click="openGeneralPreview(announcement)">
                  <h3 class="row-title">{{ announcement.title }}</h3>
                  <p class="row-text">{{ announcement.content }}</p>
                  <div class="row-meta row-meta-right">
                    <p><strong>Posted:</strong> {{ formatDate(announcement.created_at) }}</p>
                  </div>
                </div>
                <div class="row-actions">
                  <RouterLink
                    :to="`/admin/announcement/general?id=${announcement.id}`"
                    class="icon-action"
                    title="Edit General Announcement"
                    @click.stop
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </RouterLink>
                  <button
                    @click.stop="deleteGeneralAnnouncement(announcement.id)"
                    class="icon-action icon-action-danger"
                    title="Delete General Update"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article class="stack-panel">
            <div class="panel-head">
              <h2 class="panel-title">News</h2>
              <span class="panel-badge">{{ newsAnnouncements.length }} posts</span>
            </div>
            <div v-if="newsAnnouncements.length === 0" class="empty-state">No news yet.</div>
            <div v-else class="stack-list">
              <div
                v-for="announcement in newsAnnouncements"
                :key="announcement.id"
                class="row-card row-card-clickable"
                @click="openNewsPreview(announcement)"
              >
                <div
                  v-if="announcement.image_url"
                  class="row-thumb-wrap"
                  @click="openNewsPreview(announcement)"
                >
                  <img :src="announcement.image_url" class="row-thumb" />
                </div>
                <div
                  v-else
                  class="row-thumb-wrap row-thumb-fallback"
                  @click="openNewsPreview(announcement)"
                >
                  NEWS
                </div>
                <div class="row-body" @click="openNewsPreview(announcement)">
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase"
                      :style="getBadgeColor(extractNewsCategory(announcement.title).category)"
                    >
                      {{ getNewsTypeDisplay(extractNewsCategory(announcement.title).category) }}
                    </span>
                  </div>
                  <h3 class="row-title">
                    {{ extractNewsCategory(announcement.title).cleanTitle }}
                  </h3>
                  <p class="row-text">{{ announcement.content }}</p>
                  <div class="row-meta row-meta-right">
                    <p><strong>Posted:</strong> {{ formatDate(announcement.created_at) }}</p>
                  </div>
                </div>
                <div class="row-actions">
                  <RouterLink
                    :to="`/admin/announcement/news?id=${announcement.id}`"
                    class="icon-action"
                    title="Edit News"
                    @click.stop
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </RouterLink>
                  <button
                    @click.stop="deleteNewsAnnouncement(announcement.id)"
                    class="icon-action icon-action-danger"
                    title="Delete News"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <transition name="fade-modal">
      <div v-if="activePreview" class="news-preview-overlay" @click="closePreview">
        <article class="news-preview-card" @click.stop>
          <button
            class="news-preview-close"
            type="button"
            @click="closePreview"
            aria-label="Close preview"
          >
            ×
          </button>

          <div class="news-preview-head">
            <span
              class="inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase"
              :style="activePreview.badgeStyle"
            >
              {{ activePreview.badgeLabel }}
            </span>
            <p class="news-preview-date">
              {{ activePreview.metaLabel }}: {{ formatDate(activePreview.metaDate) }}
            </p>
          </div>

          <h3 class="news-preview-title">{{ activePreview.title }}</h3>

          <img
            v-if="activePreview.imageUrl"
            :src="activePreview.imageUrl"
            class="news-preview-image"
          />

          <p v-if="activePreview.location" class="news-preview-extra">
            <strong>Location:</strong> {{ activePreview.location }}
          </p>

          <p class="news-preview-content">{{ activePreview.content }}</p>
        </article>
      </div>
    </transition>

    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      title="Scroll to top"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

interface EventAnnouncement {
  id: number
  title: string
  description: string
  start_date: string
  location: string
  type: string
  images: string
  time_start: string | null
  time_end: string | null
}

interface GeneralAnnouncement {
  id: string
  title: string
  content: string
  type: string
  image_url: string | null
  created_at: string
}

type PreviewItem = {
  title: string
  content: string
  imageUrl: string | null
  metaLabel: string
  metaDate: string
  location?: string
  badgeLabel: string
  badgeStyle: Record<string, string>
}

const eventAnnouncements = ref<EventAnnouncement[]>([])
const generalAnnouncements = ref<GeneralAnnouncement[]>([])
const newsAnnouncements = ref<GeneralAnnouncement[]>([])
const isLoading = ref(true)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const reportRootRef = ref<HTMLElement | null>(null)
const showScrollTop = ref(false)
const activePreview = ref<PreviewItem | null>(null)
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})
const confirmToast = reactive({
  show: false,
  message: '',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null
let pendingDeleteAction: (() => Promise<void>) | null = null

const thisWeekCount = computed(() => {
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const isWithinWeek = (value: string | null | undefined) => {
    if (!value) return false
    const time = new Date(value).getTime()
    if (Number.isNaN(time)) return false
    return Math.abs(now - time) <= weekMs
  }

  return [
    ...eventAnnouncements.value.map((item) => item.start_date),
    ...generalAnnouncements.value.map((item) => item.created_at),
    ...newsAnnouncements.value.map((item) => item.created_at),
  ].filter((value) => isWithinWeek(value)).length
})

const latestBatchCount = computed(() => {
  return (
    Math.min(eventAnnouncements.value.length, 5) +
    Math.min(generalAnnouncements.value.length, 5) +
    Math.min(newsAnnouncements.value.length, 5)
  )
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 2500)
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message
    if (typeof maybeMessage === 'string') return maybeMessage
  }
  return 'Unknown error'
}

const extractNewsCategory = (title?: string): { category: string; cleanTitle: string } => {
  if (!title) return { category: 'News', cleanTitle: title || '' }

  const match = title.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (match) {
    const cat = (match[1] ?? 'News').trim()
    return {
      category: cat,
      cleanTitle: (match[2] ?? '').trim(),
    }
  }
  return { category: 'News', cleanTitle: title }
}

const getBadgeColor = (category?: string) => {
  const normalizedType = category?.trim().toUpperCase() || 'NEWS'

  if (normalizedType === 'NBWC') {
    return {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    }
  }

  if (normalizedType === 'BSP') {
    return {
      backgroundColor: '#bbf7d0',
      color: '#14532d',
    }
  }

  if (normalizedType === 'STARBOOKS') {
    return {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    }
  }

  return {
    backgroundColor: '#ebf5ec',
    color: '#1b5e20',
  }
}

const getNewsTypeDisplay = (category?: string): string => {
  if (!category) return 'News'
  return category
}

const requestDelete = (message: string, action: () => Promise<void>) => {
  pendingDeleteAction = action
  confirmToast.message = message
  confirmToast.show = true
}

const cancelConfirm = () => {
  pendingDeleteAction = null
  confirmToast.show = false
}

const confirmDelete = async () => {
  if (!pendingDeleteAction) {
    confirmToast.show = false
    return
  }

  const action = pendingDeleteAction
  pendingDeleteAction = null
  confirmToast.show = false
  await action()
}

// --- FETCH ANNOUNCEMENTS() ---
const fetchAnnouncements = async () => {
  try {
    isLoading.value = true
    const [eventsResult, generalResult, newsResult] = await Promise.all([
      // AFTER
      supabase
        .from('events')
        .select('*')
        .eq('type', 'event')
        .order('created_at', { ascending: false }),
      supabase
        .from('announcements')
        .select('id, title, content, type, image_url, created_at')
        .eq('type', 'general')
        .order('created_at', { ascending: false }),
      supabase
        .from('announcements')
        .select('id, title, content, type, image_url, created_at')
        .eq('type', 'news')
        .order('created_at', { ascending: false }),
    ])

    if (eventsResult.error) throw eventsResult.error
    if (generalResult.error) throw generalResult.error
    if (newsResult.error) throw newsResult.error

    eventAnnouncements.value = eventsResult.data || []
    generalAnnouncements.value = generalResult.data || []
    newsAnnouncements.value = newsResult.data || []
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

// --- DELETE ANNOUNCEMENT ---
const deleteAnnouncement = async (id: number) => {
  requestDelete('Are you sure you want to delete this announcement?', async () => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error

      eventAnnouncements.value = eventAnnouncements.value.filter((item) => item.id !== id)
      showToast('Announcement deleted successfully')
    } catch (error) {
      const message = getErrorMessage(error)
      console.error('Error deleting:', error)
      showToast(`Error: ${message}`, 'error')
    }
  })
}

const deleteGeneralAnnouncement = async (id: string) => {
  requestDelete('Are you sure you want to delete this general announcement?', async () => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error

      generalAnnouncements.value = generalAnnouncements.value.filter((item) => item.id !== id)
      showToast('General announcement deleted successfully')
    } catch (error) {
      const message = getErrorMessage(error)
      console.error('Error deleting general update:', error)
      showToast(`Error: ${message}`, 'error')
    }
  })
}

const deleteNewsAnnouncement = async (id: string) => {
  requestDelete('Are you sure you want to delete this news item?', async () => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error

      newsAnnouncements.value = newsAnnouncements.value.filter((item) => item.id !== id)
      showToast('News deleted successfully')
    } catch (error) {
      const message = getErrorMessage(error)
      console.error('Error deleting news:', error)
      showToast(`Error: ${message}`, 'error')
    }
  })
}

// --- FORMAT DATE ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTime = (timeStr: string | null | undefined): string => {
  if (!timeStr) return ''
  const [hourStr, minuteStr] = timeStr.split(':')
  const hour = parseInt(hourStr ?? '0', 10)
  const minute = minuteStr || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${h}:${minute} ${period}`
}

// --- CLOSE DROPDOWN ON CLICK OUTSIDE ---
function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

function handleScrollDepth() {
  const scrollTop = reportRootRef.value?.scrollTop ?? window.scrollY
  showScrollTop.value = scrollTop > 300
}

function scrollToTop() {
  if (reportRootRef.value) {
    reportRootRef.value.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openEventPreview(event: EventAnnouncement) {
  activePreview.value = {
    title: event.title,
    content: event.description,
    imageUrl: event.images || null,
    metaLabel: 'Event Date',
    metaDate: event.start_date,
    location: event.location,
    badgeLabel: 'Event',
    badgeStyle: {
      backgroundColor: '#fff5e5',
      color: '#9a4b00',
    },
  }
}

function openGeneralPreview(announcement: GeneralAnnouncement) {
  activePreview.value = {
    title: announcement.title,
    content: announcement.content,
    imageUrl: announcement.image_url || null,
    metaLabel: 'Posted',
    metaDate: announcement.created_at,
    badgeLabel: 'General',
    badgeStyle: {
      backgroundColor: '#ebf5ec',
      color: '#1b5e20',
    },
  }
}

function openNewsPreview(announcement: GeneralAnnouncement) {
  const newsMeta = extractNewsCategory(announcement.title)
  activePreview.value = {
    title: newsMeta.cleanTitle,
    content: announcement.content,
    imageUrl: announcement.image_url || null,
    metaLabel: 'Posted',
    metaDate: announcement.created_at,
    badgeLabel: getNewsTypeDisplay(newsMeta.category),
    badgeStyle: getBadgeColor(newsMeta.category),
  }
}

function closePreview() {
  activePreview.value = null
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closePreview()
  }
}

onMounted(() => {
  fetchAnnouncements()
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  if (reportRootRef.value) {
    reportRootRef.value.addEventListener('scroll', handleScrollDepth)
  } else {
    window.addEventListener('scroll', handleScrollDepth)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  if (reportRootRef.value) {
    reportRootRef.value.removeEventListener('scroll', handleScrollDepth)
  }
  window.removeEventListener('scroll', handleScrollDepth)
})
</script>

<style scoped>
.overview-shell {
  position: relative;
  z-index: 0;
  padding: 2rem;
}

.overview-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.kpi-card {
  border: 1px solid #dfe6dd;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%);
  border-radius: 16px;
  padding: 16px 18px;
}

.kpi-label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 700;
}

.kpi-value {
  font-size: 1.85rem;
  line-height: 1.1;
  color: #0d2b0f;
  font-weight: 900;
  margin-top: 6px;
}

.overview-grid {
  display: block;
}

.stack-flow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.stack-panel {
  border: 1px solid #dfe6dd;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(13, 43, 15, 0.06);
  padding: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2ed;
}

.panel-title {
  color: #0d2b0f;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.panel-badge {
  border-radius: 999px;
  background: #ebf5ec;
  color: #1b5e20;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.panel-badge-amber {
  background: #fff5e5;
  color: #9a4b00;
}

.stack-list {
  display: grid;
  gap: 14px;
  max-height: calc(100vh - 360px);
  overflow-y: auto;
  padding-right: 4px;
}

.row-card {
  border: 1px solid #e7ece7;
  background: #fbfdfb;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  animation: cardFadeIn 0.35s ease both;
}

.row-card:hover {
  box-shadow: 0 8px 20px rgba(13, 43, 15, 0.1);
  transform: translateY(-1px);
}

.row-card-clickable {
  cursor: pointer;
}

.row-thumb-wrap {
  width: 100%;
  height: 112px;
  border-radius: 12px;
  overflow: hidden;
  background: #e7ece7;
}

.row-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.row-thumb-fallback {
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #446648;
  background: linear-gradient(135deg, #edf4ee 0%, #dae8dc 100%);
}

.row-body {
  min-width: 0;
}

.row-title {
  color: #0d2b0f;
  font-size: 1.08rem;
  line-height: 1.3;
  font-weight: 800;
}

.icon-action {
  color: #9ca3af;
  padding: 2px;
  transition: color 0.2s ease;
}

.icon-action:hover {
  color: #2563eb;
}

.icon-action-danger:hover {
  color: #ef4444;
}

.row-text {
  margin-top: 4px;
  color: #3f5641;
  font-size: 0.95rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-meta {
  margin-top: 10px;
  color: #5b725d;
  font-size: 12px;
  font-weight: 600;
}

.row-meta-split {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.row-meta-right {
  display: flex;
  justify-content: flex-start;
}

.row-actions {
  display: grid;
  align-content: center;
  gap: 8px;
}

.news-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgba(12, 18, 13, 0.38);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 20px;
  pointer-events: auto;
}

.news-preview-card {
  width: min(760px, 100%);
  max-height: min(86vh, 920px);
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #dae5dc;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
  padding: 20px 22px 22px;
  position: relative;
}

.news-preview-close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
}

.news-preview-close:hover {
  color: #111827;
}

.news-preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
}

.news-preview-date {
  color: #5b725d;
  font-size: 14px;
  font-weight: 600;
}

.news-preview-title {
  margin-top: 12px;
  color: #0d2b0f;
  font-size: 1.75rem;
  line-height: 1.25;
  font-weight: 900;
}

.news-preview-image {
  width: 100%;
  height: auto;
  max-height: 320px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 14px;
}

.news-preview-content {
  margin-top: 14px;
  color: #2f4333;
  font-size: 1.15rem;
  line-height: 1.7;
  white-space: pre-wrap;
}

.news-preview-extra {
  margin-top: 12px;
  color: #36533a;
  font-size: 1.05rem;
}

.scroll-top-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 80;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: #06260f;
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-2px);
}

.scroll-top-btn:active {
  transform: translateY(0);
}

.scroll-top-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn {
  border-radius: 0.75rem;
  border: 1px solid #0d2b0f;
  background: #0d2b0f;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.8rem 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: 0.2s ease;
}

.plus-icon {
  display: inline-block;
  font-size: 1.1rem;
  line-height: 1;
  transition: transform 0.25s ease;
}

.plus-icon--open {
  transform: rotate(45deg);
}

.empty-state {
  border: 1px dashed #c7d5c8;
  border-radius: 0.75rem;
  background: #f8fbf8;
  color: #5b725d;
  font-size: 0.9rem;
  padding: 1rem;
  text-align: center;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.4rem;
  z-index: 9999;
  min-width: 14rem;
  width: max-content;
  max-width: calc(100vw - 2rem);
  background: #ffffff;
  border: 1px solid #c8d8ca;
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  padding: 0.25rem 0;
}

.dropdown-wrapper {
  position: relative;
  z-index: 50;
}

.dropdown-item {
  display: block;
  padding: 0.65rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0d2b0f;
  text-decoration: none;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: #ebf5ec;
  color: #1b5e20;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.2s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .stack-list {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .overview-shell {
    padding: 1.15rem;
  }

  .overview-kpis {
    grid-template-columns: 1fr;
  }

  .row-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .row-thumb-wrap {
    height: 176px;
  }

  .row-meta-split {
    flex-direction: column;
    gap: 2px;
  }

  .row-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
