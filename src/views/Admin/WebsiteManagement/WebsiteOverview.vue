<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- SIDEBAR -->
    <div class="sticky top-0 h-screen">
      <Sidebar />
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 py-10 px-6 md:pl-8 md:pr-16" style="font-family: 'Poppins', sans-serif">
      <!-- HEADER -->
      <header class="mb-10 flex items-center gap-4">
        <div>
          <div class="header-breadcrumb">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/website/general')"
            >
              BACK
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>WEBSITE MANAGEMENT</span>
          </div>
          <h1
            class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
          >
            <span
              class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[260px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
              >Web Images</span
            ><span class="text-yellow-500"> Overview</span>
          </h1>

          <p class="header-sub text-gray-600">Manage website visuals and assets</p>
        </div>
      </header>

      <!-- NAVIGATION -->
      <div class="flex gap-4 mb-10 flex-wrap">
        <button
          @click="activeSection = 'carousel'"
          :class="
            activeSection === 'carousel'
              ? 'bg-[#0B2010] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          "
          class="px-6 py-3 rounded-xl font-bold shadow-sm transition"
        >
          Hero Carousel
        </button>

        <button
          @click="activeSection = 'cards'"
          :class="
            activeSection === 'cards'
              ? 'bg-[#0B2010] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          "
          class="px-6 py-3 rounded-xl font-bold shadow-sm transition"
        >
          Feature Cards
        </button>

        <button
          @click="activeSection = 'library'"
          :class="
            activeSection === 'library'
              ? 'bg-[#0B2010] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          "
          class="px-6 py-3 rounded-xl font-bold shadow-sm transition"
        >
          Library Banner
        </button>
      </div>

      <!-- HERO CAROUSEL -->
      <section v-if="activeSection === 'carousel'" class="animate-fade-in">
        <div class="bg-white rounded-3xl shadow-lg p-10">
          <div class="flex justify-between items-center mb-8">
            <h4 class="font-black text-xl">Hero Carousel Slides</h4>

            <button
              @click="goToEditor('New Slide', '')"
              class="px-6 py-3 bg-[#0d2b0f] text-white rounded-xl font-bold hover:bg-[#1b5e20] transition"
            >
              Add Slide
            </button>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="slide in carouselImages"
              :key="slide.id"
              class="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border hover:shadow-md transition"
            >
              <img
                :src="slide.image_url || slide.thumbnail_url"
                class="w-40 h-24 object-cover rounded-xl"
              />
              <div class="flex-1">
                <h5 class="font-bold text-gray-800">{{ slide.title }}</h5>
              </div>
              <button
                @click="goToEditor(slide.title, slide.image_url)"
                class="px-5 py-2 bg-[#0d2b0f] text-white rounded-lg text-sm hover:bg-[#1b5e20] transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURE CARDS -->
      <section v-if="activeSection === 'cards'" class="animate-fade-in">
        <div class="bg-white rounded-3xl shadow-lg p-10">
          <h4 class="font-black text-xl mb-8">Feature Cards</h4>

          <div class="grid md:grid-cols-3 gap-8">
            <div
              v-for="card in featureCards"
              :key="card.id"
              class="aspect-[4/5] bg-gray-50 border-2 border-dashed rounded-3xl overflow-hidden relative"
            >
              <img :src="card.image_url || card.thumbnail_url" class="w-full h-full object-cover" />

              <!-- EDIT BUTTON -->
              <div class="absolute top-2 right-2">
                <button
                  @click.stop="goToEditor(card.title, card.image_url)"
                  class="px-4 py-2 bg-[#0d2b0f] text-white rounded-lg text-sm hover:bg-[#1b5e20] transition"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LIBRARY BANNER -->
      <section v-if="activeSection === 'library'" class="animate-fade-in">
        <div class="bg-white rounded-3xl shadow-lg p-10">
          <h4 class="font-black text-xl mb-8">CSU Library Banner</h4>

          <div class="aspect-[21/9] rounded-3xl overflow-hidden relative group">
            <img
              v-if="libraryBanner"
              :src="libraryBanner.image_url || libraryBanner.thumbnail_url"
              class="w-full h-full object-cover"
            />

            <div
              class="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
            >
              <button
                @click="goToEditor(libraryBanner?.title, libraryBanner?.image_url)"
                class="px-8 py-4 bg-[#0d2b0f] text-white font-bold rounded-xl hover:bg-[#1b5e20] transition"
              >
                Replace Banner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { getAllWebsiteImages } from '@/services/websiteImageService'

const router = useRouter()
const route = useRoute()
const activeSection = ref('carousel')
const mediaItems = ref<any[]>([])

// Load media from backend
const loadMedia = async () => {
  const data = await getAllWebsiteImages()
  mediaItems.value = data
}

// Initial load
onMounted(() => loadMedia())

/* HERO CAROUSEL */
const carouselImages = computed(() =>
  mediaItems.value.filter((item) => item.page === 'homepage' && item.section === 'carousel'),
)

/* FEATURE CARDS */
const featureCards = computed(() =>
  mediaItems.value.filter(
    (item) => item.page === 'homepage' && item.section === 'read-learn-discover',
  ),
)

/* CSU LIBRARY BANNER */
const libraryBanner = computed(() =>
  mediaItems.value.find((item) => item.title === 'CSU Library Main Image'),
)

// Navigate to editor
const goToEditor = (target: string, currentFile: string) => {
  router.push({
    name: 'website-images',
    query: { target, file: currentFile },
  })
}

// Auto-refresh images after returning from editor
router.afterEach((to, from) => {
  // Only reload if we came back from editor page
  if (from.name === 'website-images') {
    loadMedia()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
