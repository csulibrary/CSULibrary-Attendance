<template>
  <section class="py-12 bg-white min-h-screen overflow-hidden">
    <div class="max-[100%] mx-auto px-8">
      <div class="page-inner">
        <div class="section-title section-title-center">
          <span class="section-kicker title-container">
            <span class="kicker-line"></span>
            <span class="kicker-text">WHAT'S HAPPENING AT CSU LIBRARY</span>
          </span>
          <h1 class="section-headline title-headline">ANNOUNCEMENTS</h1>
        </div>
      </div>

      <!-- Month Filter -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <nav class="flex items-center gap-1 overflow-x-auto mx-auto pb-2 scrollbar-hide nav-reveal">
          <button
            v-for="(month, index) in months"
            :key="month"
            @click="selectedEventMonth = month"
            :class="[
              'pill-entrance whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
              selectedEventMonth === month
                ? 'bg-[#003300] text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            :style="{ '--p-i': index }"
          >
            {{ month }}
          </button>
        </nav>
      </div>

      <!-- Carousel -->
      <div v-if="pinnedEvents.length > 0" class="mb-15 relative event-carousel group/carousel">
        <div class="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentPinnedIndex * 100}%)` }"
          >
            <div
              v-for="event in pinnedEvents"
              :key="'pinned-' + event.id"
              class="min-w-full group relative bg-[#0d2b0f] flex flex-col md:flex-row h-auto md:h-[350px]"
              @click="openEventPreview(event)"
            >
              <div class="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                  :src="event.image"
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div class="md:w-1/2 p-10 flex flex-col justify-center space-y-4">
                <span
                  class="bg-[#f9dc07] text-[#ffffff] self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse"
                >
                  PINNED HIGHLIGHT
                </span>
                <h3
                  class="text-3xl font-bold text-white leading-tight group-hover:text-[#f9dc07] transition-colors"
                >
                  {{ event.title }}
                </h3>
                <p class="text-green-100/70 text-sm leading-relaxed line-clamp-3">
                  {{ event.description }}
                </p>
                <div
                  class="pt-4 flex items-center gap-3 text-[#f9dc07] text-xs font-bold uppercase tracking-widest"
                >
                  <span>{{ event.location }}</span>
                  <span class="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span class="text-white/60">{{ event.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

              <div class="section-title section-title-center">
          <span class="section-kicker title-container">
            <span class="kicker-line"></span>
            <span class="kicker-text">EVENT UPDATES</span>
          </span>
          <h2 class="section-headline title-headline"><span>EVENTS </span></h2>
        </div>

      <!-- Grid Events -->
      <div>
        <transition-group
          name="shuffle"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            class="group cursor-pointer event-card"
            :style="{ '--i': index }"
            @click="openEventPreview(event)"
          >
            <div
              class="relative aspect-[16/10] overflow-hidden rounded-3xl mb-5 bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500"
            >
              <img
                :src="event.image"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <!-- Pinned Badge sa Grid -->
              <div class="absolute top-4 left-4" v-if="event.isPinnedGrid">
                <div
                  class="bg-[#f9dc07] text-[#009900] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg border border-[#f9dc07]"
                >
                  PINNED
                </div>
              </div>

              <div class="absolute top-4 right-4">
                <div
                  class="backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm border border-white/20"
                  :style="{ background: '#003300', color: '#fff' }"
                >
                  {{ event.month }} '{{ event.year.slice(-2) }}
                </div>
              </div>
            </div>

            <div
              class="space-y-3 transform transition-transform duration-500 group-hover:translate-x-1"
            >
              <div
                class="flex items-center gap-2 text-yellow-600 text-[10px] font-black uppercase tracking-widest"
              >
                <span>{{ event.location }}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="text-gray-400 font-bold">{{ event.time }}</span>
              </div>
              <h3
                class="text-xl font-extrabold text-gray-900 transition-colors group-hover:text-#009900"
              >
                {{ event.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {{ event.description }}
              </p>
            </div>
          </div>
        </transition-group>
      </div>

      <div v-if="filteredEvents.length === 0" class="text-center py-32">
        <p class="text-gray-400 font-medium italic text-lg">
          No events scheduled for {{ selectedEventMonth }}.
        </p>
      </div>

      <!-- General Announcements -->
      <div class="mt-16" v-if="generalAnnouncements.length > 0">
        <div class="section-title section-title-center">
          <span class="section-kicker title-container">
            <span class="kicker-line"></span>
            <span class="kicker-text">GENERAL UPDATES</span>
          </span>
          <h2 class="section-headline title-headline"><span>GENERAL </span>ANNOUNCEMENTS</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(announcement, index) in generalAnnouncements"
            :key="announcement.id"
            class="group event-card cursor-pointer"
            :style="{ '--i': index }"
            @click="openGeneralPreview(announcement)"
          >
            <div
              class="relative aspect-[16/10] overflow-hidden rounded-3xl mb-5 bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500"
            >
              <img
                v-if="announcement.image_url"
                :src="announcement.image_url"
                :alt="announcement.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#f1f6f1] to-[#dce8de]"></div>

              <div class="absolute top-4 left-4">
                <span class="bg-[#0d2b0f] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg">
                  GENERAL
                </span>
              </div>

              <div class="absolute top-4 right-4">
                <span
                  class="backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm border border-white/20"
                  :style="{ background: '#0d2b0f', color: '#fff' }"
                >
                  {{ formatAnnouncementDate(announcement.created_at) }}
                </span>
              </div>
            </div>

            <div class="space-y-3 transform transition-transform duration-500 group-hover:translate-x-1">
              <h3 class="text-xl font-extrabold text-gray-900 transition-colors group-hover:text-green-800">
                {{ announcement.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {{ announcement.content }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- News -->
      <div class="mt-16" v-if="newsAnnouncements.length > 0">
        <div class="section-title section-title-center">
          <span class="section-kicker title-container">
            <span class="kicker-line"></span>
            <span class="kicker-text">LIBRARY NEWS</span>
          </span>
          <h2 class="section-headline title-headline"><span>LATEST </span>NEWS</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(announcement, index) in newsAnnouncements"
            :key="announcement.id"
            class="group event-card cursor-pointer"
            :style="{ '--i': index }"
            @click="openNewsPreview(announcement)"
          >
            <div
              class="relative aspect-[16/10] overflow-hidden rounded-3xl mb-5 bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500"
            >
              <img
                v-if="announcement.image_url"
                :src="announcement.image_url"
                :alt="announcement.headline"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#eef4ff] to-[#dbe7ff]"></div>

              <div class="absolute top-4 left-4 flex items-center gap-2">
                <span class="bg-[#0d2b0f] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg">
                  NEWS
                </span>
                <span class="bg-white/95 text-[#1f4b99] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg">
                  {{ announcement.category }}
                </span>
              </div>

              <div class="absolute top-4 right-4">
                <span
                  class="backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm border border-white/20"
                  :style="{ background: '#0d2b0f', color: '#fff' }"
                >
                  {{ formatAnnouncementDate(announcement.created_at) }}
                </span>
              </div>
            </div>

            <div class="space-y-3 transform transition-transform duration-500 group-hover:translate-x-1">
              <h3 class="text-xl font-extrabold text-gray-900 transition-colors group-hover:text-green-800">
                {{ announcement.headline }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {{ announcement.content }}
              </p>
            </div>
          </article>
        </div>
      </div>

    </div>

    <transition name="fade-modal">
      <div v-if="activePreview" class="preview-overlay" @click="closePreview">
        <article class="preview-card" @click.stop>
          <button class="preview-close" type="button" @click="closePreview" aria-label="Close preview">×</button>

          <div class="preview-head">
            <span class="preview-badge" :style="activePreview.badgeStyle">
              {{ activePreview.badgeLabel }}
            </span>
            <p class="preview-date">{{ activePreview.metaLabel }}: {{ formatFullDate(activePreview.metaDate) }}</p>
          </div>

          <h3 class="preview-title">{{ activePreview.title }}</h3>

          <img
            v-if="activePreview.imageUrl"
            :src="activePreview.imageUrl"
            :alt="activePreview.title"
            class="preview-image"
          />

          <p v-if="activePreview.location" class="preview-extra">
            <strong>Location:</strong> {{ activePreview.location }}
          </p>

          <p class="preview-content">{{ activePreview.content }}</p>
        </article>
      </div>
    </transition>

    <!-- SCROLL TO TOP -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-50 rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:opacity-90"
        style="background: #003300"
      >
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 11l7-7 7 7"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 17l7-7 7 7"
          />
        </svg>
      </button>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

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

const events = ref<any[]>([])
const generalAnnouncements = ref<any[]>([])
const newsAnnouncements = ref<any[]>([])
const selectedEventMonth = ref('All')
const currentPinnedIndex = ref(0)
const showScrollTop = ref(false)
const activePreview = ref<PreviewItem | null>(null)
let carouselTimer: any = null

const months = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Toggle mode: 'start_date' = schedule based, 'created_at' = upload based
const pinnedMode = ref<'start_date' | 'created_at'>('start_date')

const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('type', 'announcement')
      .order('start_date', { ascending: false })

    if (error) throw error

    // Map events
    events.value = (data || []).map((event, index) => {
      const date = new Date(event.start_date)
      return {
        ...event,
        image: event.images,
        month: date.toLocaleString('en-US', { month: 'long' }),
        year: date.getFullYear().toString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pinned: index < 3, // carousel top 3
        isPinnedGrid: false,
        isLatest: index === 0,
      }
    })

    // Decide pinned grid card based on pinnedMode
    if (events.value.length > 0) {
      let pinnedEvent: any
      if (pinnedMode.value === 'start_date') {
        pinnedEvent = events.value.reduce((prev, curr) =>
          new Date(curr.start_date) > new Date(prev.start_date) ? curr : prev,
        )
      } else {
        pinnedEvent = events.value.reduce((prev, curr) =>
          new Date(curr.created_at) > new Date(prev.created_at) ? curr : prev,
        )
      }
      events.value.forEach((e) => (e.isPinnedGrid = false))
      pinnedEvent.isPinnedGrid = true
    }

    startCarousel()
  } catch (err) {
    console.error('Error fetching events:', err)
  }
}

const splitNewsTitle = (rawTitle: string): { category: string; headline: string } => {
  const match = rawTitle.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (!match) {
    return { category: 'GENERAL', headline: rawTitle }
  }

  const category = (match[1] ?? 'GENERAL').trim().toUpperCase()
  const headline = (match[2] ?? rawTitle).trim()
  return { category, headline }
}

const formatAnnouncementDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const openEventPreview = (event: any) => {
  activePreview.value = {
    title: event.title ?? 'Event Announcement',
    content: event.description ?? '',
    imageUrl: event.image ?? event.images ?? null,
    metaLabel: 'Event Date',
    metaDate: event.start_date ?? event.created_at ?? '',
    location: event.location ?? 'Library',
    badgeLabel: 'EVENT ANNOUNCEMENT',
    badgeStyle: {
      backgroundColor: '#fff0c4',
      color: '#8a4b00',
    },
  }
}

const openGeneralPreview = (announcement: any) => {
  activePreview.value = {
    title: announcement.title ?? 'General Announcement',
    content: announcement.content ?? '',
    imageUrl: announcement.image_url ?? null,
    metaLabel: 'Posted',
    metaDate: announcement.created_at ?? '',
    badgeLabel: 'GENERAL ANNOUNCEMENT',
    badgeStyle: {
      backgroundColor: '#ebf5ec',
      color: '#1b5e20',
    },
  }
}

const openNewsPreview = (announcement: any) => {
  activePreview.value = {
    title: announcement.headline ?? announcement.title ?? 'News',
    content: announcement.content ?? '',
    imageUrl: announcement.image_url ?? null,
    metaLabel: 'Posted',
    metaDate: announcement.created_at ?? '',
    badgeLabel: `NEWS • ${announcement.category ?? 'GENERAL'}`,
    badgeStyle: {
      backgroundColor: '#dce9ff',
      color: '#204a93',
    },
  }
}

const closePreview = () => {
  activePreview.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePreview()
  }
}

const fetchGeneralAndNews = async () => {
  try {
    const [generalResult, newsResult] = await Promise.all([
      supabase
        .from('announcements')
        .select('id, title, content, image_url, created_at, type')
        .eq('type', 'general')
        .order('created_at', { ascending: false }),
      supabase
        .from('announcements')
        .select('id, title, content, image_url, created_at, type')
        .eq('type', 'news')
        .order('created_at', { ascending: false }),
    ])

    if (generalResult.error) throw generalResult.error
    if (newsResult.error) throw newsResult.error

    generalAnnouncements.value = (generalResult.data ?? []).map((item) => ({
      id: item.id,
      title: item.title ?? '',
      content: item.content ?? '',
      image_url: item.image_url ?? null,
      created_at: item.created_at ?? '',
    }))

    newsAnnouncements.value = (newsResult.data ?? []).map((item) => {
      const parsed = splitNewsTitle(item.title ?? '')
      return {
        id: item.id,
        headline: parsed.headline,
        category: parsed.category,
        content: item.content ?? '',
        image_url: item.image_url ?? null,
        created_at: item.created_at ?? '',
      }
    })
  } catch (error) {
    console.error('Error fetching general/news announcements:', error)
    generalAnnouncements.value = []
    newsAnnouncements.value = []
  }
}

const pinnedEvents = computed(() => events.value.filter((e) => e.pinned))

const filteredEvents = computed(() => {
  let list = events.value.filter(
    (e) => selectedEventMonth.value === 'All' || e.month === selectedEventMonth.value,
  )

  return list.sort((a, b) => {
    if (a.isLatest !== b.isLatest) return a.isLatest ? -1 : 1
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })
})

const nextPinned = () => {
  if (pinnedEvents.value.length === 0) return
  currentPinnedIndex.value = (currentPinnedIndex.value + 1) % pinnedEvents.value.length
}

const startCarousel = () => {
  stopCarousel()
  if (pinnedEvents.value.length > 1) {
    carouselTimer = setInterval(nextPinned, 5000)
  }
}

const stopCarousel = () => {
  if (carouselTimer) clearInterval(carouselTimer)
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchEvents()
  fetchGeneralAndNews()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopCarousel()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.section-title {
  width: min(100%, 1500px);
  margin: 8px auto 14px;
  text-align: center;
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.kicker-text {
  font-weight: 800;
  letter-spacing: 6px;
  font-size: 0.7rem;
  color: #003300;
  text-transform: uppercase;
}

.section-headline {
  margin: 10px 0 1%;
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  color: #003300;
  text-transform: uppercase;
}

/* Animations */
@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.title-container {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeSlideUp 0.9s ease forwards;
}
.title-headline {
  opacity: 0;
  transform: translateY(25px);
  animation: fadeSlideUp 1s ease forwards;
  animation-delay: 0.4s;
}
.event-carousel {
  opacity: 0;
  transform: translateY(25px);
  animation: fadeSlideUp 1s ease forwards;
  animation-delay: 0.4s;
}

.kicker-line {
  display: inline-block;
  height: 3px;
  width: 60px;
  background: #f9dc07;
  border-radius: 999px;
  transform: scaleX(0);
  transform-origin: left;
  animation: lineReveal 0.9s ease forwards;
  animation-delay: 0.3s;
}
@keyframes lineReveal {
  to {
    transform: scaleX(1);
  }
}

.pill-entrance {
  opacity: 0;
  transform: translateY(10px);
  animation: pillPop 0.5s ease-out calc(var(--p-i) * 0.05s + 0.4s) forwards;
}
@keyframes pillPop {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.event-card {
  opacity: 0;
  transform: translateY(30px);
  animation: cardIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--i) * 0.1s + 0.5s) forwards;
}
@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grid Shuffle */
.shuffle-move {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.shuffle-enter-active {
  transition: opacity 0.4s ease;
}
.shuffle-enter-from {
  opacity: 0;
}
.shuffle-leave-active {
  display: none;
  position: absolute;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-events-icon {
  animation: floatBounce 1.2s ease-in-out infinite alternate;
}
@keyframes floatBounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
}

.preview-card {
  position: relative;
  width: min(760px, 100%);
  max-height: min(88vh, 820px);
  overflow-y: auto;
  border-radius: 1.6rem;
  background: #ffffff;
  padding: 1.5rem 1.4rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

.preview-close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 999px;
  background: #eef2ef;
  color: #0d2b0f;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-right: 2.2rem;
}

.preview-badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-date {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 700;
}

.preview-title {
  margin-top: 0.9rem;
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 900;
  line-height: 1.2;
  color: #0d2b0f;
}

.preview-image {
  margin-top: 1rem;
  width: 100%;
  max-height: 330px;
  object-fit: cover;
  border-radius: 1rem;
}

.preview-extra {
  margin-top: 1rem;
  color: #374151;
  font-size: 0.92rem;
}

.preview-content {
  margin-top: 0.95rem;
  white-space: pre-wrap;
  color: #4b5563;
  line-height: 1.8;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.2s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}
</style>
