<template>
  <div class="w-full py-6 px-4 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 gap-4">
      <div class="w-10 h-10 rounded-full border-4 border-[#1b5e20] border-t-transparent animate-spin"></div>
      <span style="color: #888; font-size: 0.9rem">Loading article...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="!announcement" class="text-center py-32">
      <p style="color: #888">Failed to load article. Please try again later.</p>
      <button @click="loadAnnouncement" class="mt-4 px-4 py-2 rounded text-white text-sm" style="background: #1b5e20">Retry</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- LEFT: Article (2/3) -->
      <div class="lg:col-span-2">
        <!-- Back Button + Tags -->
        <div class="flex items-center gap-3 mb-3">
          <button
            @click="$router.back()"
            class="inline-flex items-center gap-1 text-sm font-semibold text-[#1b5e20] hover:underline"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span style="font-size: 0.75rem; font-weight: 700; color: #1b5e20; border-left: 3px solid #1b5e20; padding-left: 8px">News</span>
          <span style="font-size: 0.75rem; font-weight: 700; color: #1b5e20; border-left: 3px solid #f9a825; padding-left: 8px">Caraga State University Library</span>
        </div>

        <!-- Title -->
        <h1 style="font-size: 2rem; font-weight: 900; color: #0d2b0f; line-height: 1.3" class="mb-4">
          {{ announcement.title }}
        </h1>

        <!-- Meta -->
        <div class="flex gap-4 mb-6" style="font-size: 0.8rem; color: #666">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" style="color: #1b5e20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(announcement.created_at) }}
          </span>
        </div>

        <!-- Main Image -->
        <div v-if="announcement.image_url" class="mb-8">
          <img
            :src="announcement.image_url"
            :alt="announcement.title"
            class="w-full object-cover rounded-sm"
          />
        </div>

        <!-- Content paragraphs -->
        <template v-if="announcement.content">
          <p
            v-for="(para, i) in contentParagraphs"
            :key="i"
            class="mb-6"
            style="font-size: 1rem; color: #222; line-height: 1.8; text-align: justify"
          >
            {{ para }}
          </p>
        </template>
      </div>

      <!-- RIGHT: Library Updates -->
      <div>
        <h2 style="font-size: 1.2rem; font-weight: 900; color: #0d2b0f; border-bottom: 3px solid #f9a825; padding-bottom: 8px" class="mb-4">
          LIBRARY UPDATES
        </h2>

        <!-- Loading sidebar -->
        <div v-if="isSidebarLoading" class="space-y-4">
          <div v-for="n in 4" :key="n" class="flex gap-3 animate-pulse">
            <div class="w-20 h-16 rounded flex-shrink-0" style="background: #e8efe8"></div>
            <div class="flex-1 flex flex-col gap-2 justify-center">
              <div style="height: 12px; background: #e8efe8; border-radius: 4px"></div>
              <div style="height: 10px; background: #e8efe8; border-radius: 4px; width: 60%"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <div
            v-for="(post, i) in sidebarPosts"
            :key="i"
            class="flex gap-3 mb-4 cursor-pointer group"
            @click="router.push(getAnnouncementRoute(post))"
          >
            <img
              :src="post.image_url ?? undefined"
              :alt="post.title"
              class="w-20 h-16 object-cover rounded flex-shrink-0 group-hover:brightness-90 transition-all duration-200"
            />
            <div class="flex flex-col justify-center min-w-0">
              <span class="group-hover:underline" style="font-size: 0.85rem; font-weight: 700; color: #1b5e20; line-height: 1.4">
                {{ post.title }}
              </span>
              <p style="font-size: 0.75rem; color: #888" class="mt-1">{{ formatDate(post.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SCROLL TO TOP -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-50 rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:opacity-90"
        style="background: #0d2b0f"
      >
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const showScrollTop = ref(false)

type AnnouncementRow = {
  id: string
  title: string
  content: string | null
  image_url: string | null
  created_at: string
  slug?: string | null
}

const announcement = ref<AnnouncementRow | null>(null)
const isLoading = ref(true)
const sidebarPosts = ref<AnnouncementRow[]>([])
const isSidebarLoading = ref(true)

async function loadAnnouncement() {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, content, image_url, created_at, slug')
      .eq('slug', 'bsp')
      .single()
    if (error) throw error
    announcement.value = data
  } catch (e) {
    console.error('Failed to load BSP announcement:', e)
    announcement.value = null
  } finally {
    isLoading.value = false
  }
}

async function loadSidebarPosts() {
  isSidebarLoading.value = true
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, image_url, created_at, slug')
      .eq('type', 'news')
      .neq('slug', 'bsp')
      .not('slug', 'is', null)
      .order('created_at', { ascending: false })
      .limit(4)
    if (error) throw error
    // ✅ Fix: map content: null to satisfy AnnouncementRow type
    sidebarPosts.value = (data ?? []).map(post => ({ ...post, content: null }))
  } catch (e) {
    console.error('Failed to load sidebar posts:', e)
    sidebarPosts.value = []
  } finally {
    isSidebarLoading.value = false
  }
}

function getAnnouncementRoute(post: AnnouncementRow) {
  const slug = post.slug
  if (slug === 'nbwc') return { name: 'nbwcpage' }
  if (slug === 'starbooks') return { name: 'starbooks' }
  return { name: 'bcppage' }
}

const contentParagraphs = computed(() => {
  if (!announcement.value?.content) return []
  return announcement.value.content.split('\n\n').filter((p) => p.trim())
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleScroll = () => { showScrollTop.value = window.scrollY > 300 }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  window.addEventListener('scroll', handleScroll)
  await Promise.all([loadAnnouncement(), loadSidebarPosts()])
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>