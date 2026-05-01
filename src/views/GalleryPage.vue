<template>
  <div class="w-full relative min-h-screen flex flex-col items-center bg-white">
    <div class="gallery-hero sr-item">
      <div class="hero-eyebrow">
        <span class="hero-line"></span>
        <span class="hero-label">Explore the CSU Library</span>
      </div>
      <h1 class="hero-title">Library Sections</h1>
    </div>

    <div class="w-full sticky top-0 z-30 px-8 mt-3">
      <div
        class="w-full backdrop-blur-md bg-white/40 py-2 px-8 flex items-center justify-between border border-gray-200 rounded-2xl shadow-lg"
      >
        <div class="flex gap-4">
          <button
            v-for="(floor, i) in floors"
            :key="floor.id"
            @click="activeFloor = floor.id"
            :class="[
              'px-8 py-2.5 rounded-2xl font-black transition-all duration-300 text-xs uppercase tracking-widest border-2 nav-btn',
              activeFloor === floor.id && !searchQuery
                ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow-md'
                : 'bg-transparent border-[#0d2b0f] text-[#0d2b0f] hover:bg-[#1b5e20] hover:border-[#1b5e20] hover:text-white',
            ]"
            :style="{ animationDelay: `${i * 0.12}s` }"
          >
            <i class="fas fa-layer-group mr-2 opacity-50"></i>
            {{ floor.name }}
          </button>
        </div>

        <div class="relative w-full max-w-[320px] nav-search">
          <i
            class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#0d2b0f] opacity-40"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Section..."
            class="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-2 border-[#0d2b0f] text-[#0d2b0f] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#1b5e20]/10 transition-all shadow-inner"
          />
        </div>
      </div>
    </div>

    <div class="w-full px-8 flex flex-col items-center mt-12 relative z-10 pb-20">
      <div
        v-if="searchQuery && displayedFloors.length === 0"
        class="group/empty w-full flex flex-col items-center justify-center py-24 text-center animate-fade-in"
      >
        <div class="relative flex items-center justify-center w-24 h-24 mb-6">
          <div class="absolute inset-0 bg-yellow-500/5 rounded-full animate-pulse"></div>

          <div
            class="relative w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-inner border border-white animate-float"
          >
            <i
              class="fas fa-search-minus text-gray-300 group-hover/empty:text-yellow-600 transition-colors duration-500 fa-2x"
            ></i>
          </div>
        </div>

        <div class="animate-fade-in" style="animation-delay: 0.2s">
          <h3 class="text-xl font-black text-[#0d2b0f] uppercase">No Sections Found</h3>
          <p class="text-gray-500 mt-3 max-w-xs text-sm leading-relaxed mx-auto">
            We couldn't find matches for
            <span class="text-[#0d2b0f] font-bold italic">"{{ searchQuery }}"</span>. Try checking
            your spelling or explore another floor.
          </p>
        </div>

        <button
          @click="searchQuery = ''"
          class="mt-8 px-8 py-3 border-2 border-[#0d2b0f] text-[#0d2b0f] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0d2b0f] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in shadow-lg shadow-[#0d2b0f]/5"
          style="animation-delay: 0.4s"
        >
          <i
            class="fas fa-sync-alt mr-2 group-hover:rotate-180 transition-transform duration-500"
          ></i>
          Clear Search
        </button>
      </div>

      <transition-group name="fade" tag="div" class="w-full">
        <div v-for="floor in displayedFloors" :key="floor.id" class="w-full mb-12">
          <div v-for="wing in floor.wings" :key="wing.name" class="mb-20">
            <div class="flex items-center justify-center mb-10 gap-6 sr-item">
              <span class="text-yellow-600 font-bold tracking-tighter text-sm">{{
                floor.name
              }}</span>
              <h3 class="text-4xl font-black text-[#0d2b0f] uppercase tracking-tighter">
                {{ wing.name }}
              </h3>
              <div class="h-0.5 grow max-w-37.5 bg-linear-to-r from-[#0d2b0f] to-yellow-500"></div>
            </div>

            <div
              v-if="!isLoading && wing.sections.length === 0"
              class="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-4xl bg-gray-50/30 mb-10 group/empty animate-fade-in"
            >
              <div class="relative w-24 h-24 flex items-center justify-center mb-6">
                <div class="absolute inset-0 bg-yellow-500/10 rounded-full animate-ping"></div>

                <div
                  class="relative w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center animate-float"
                >
                  <i
                    class="fas fa-images text-gray-300 fa-2x group-hover/empty:text-yellow-500 transition-colors duration-500"
                  ></i>
                </div>
              </div>

              <h4 class="text-[#0d2b0f] font-black text-sm uppercase mb-2">
                No photos uploaded for this wing yet
              </h4>
              <p class="text-gray-400 text-xs font-medium max-w-80 text-center leading-relaxed">
                Our librarians are still curating photos for this wing. Check back soon!
              </p>
            </div>

            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            ></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <template v-if="isLoading">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-96 rounded-2xl bg-gray-100 animate-pulse relative overflow-hidden"
                >
                  <div class="absolute inset-0 skeleton-shimmer"></div>
                </div>
              </template>

              <template v-else>
                <div
                  v-for="section in wing.sections"
                  :key="section.id"
                  @click="openGallery(section)"
                  @mouseenter="startCarousel(section)"
                  @mouseleave="stopCarousel(section)"
                  class="sr-item group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-3 bg-gray-100"
                >
                  <div
                    class="absolute inset-0 transition-opacity duration-700 bg-cover bg-center"
                    :style="{
                      backgroundImage:
                        section.images.length > 0 ? `url('${section.images[0]}')` : 'none',
                    }"
                  ></div>
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent group-hover:from-[#1b5e20]/95 transition-all duration-500"
                  ></div>

                  <div class="absolute inset-0 p-8 flex flex-col justify-end">
                    <div
                      v-if="section.images && section.images.length > 0"
                      class="mb-3 flex items-center gap-2 w-fit px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <i class="fas fa-images text-yellow-500"></i>
                      {{ section.images.length }} Files
                    </div>

                    <h4
                      class="text-white font-black text-2xl uppercase group-hover:text-yellow-500 transition-colors"
                    >
                      {{ section.title }}
                    </h4>
                    <p class="text-white/70 text-sm mt-2 line-clamp-2">{{ section.description }}</p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <Transition name="fade">
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-xl bg-[#06260f] text-white grid place-items-center shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Scroll to top"
        type="button"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

    <div
      v-if="showModal"
      class="fixed inset-0 z-100 bg-[#0d2b0f]/95 flex items-center justify-center p-4 backdrop-blur-md"
      @click.self="closeModal"
    >
      <button
        @click="closeModal"
        class="absolute top-8 right-8 text-white hover:text-yellow-500 text-5xl z-110 transition-colors"
      >
        &times;
      </button>
      <div class="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl relative">
        <div v-if="selectedSection" class="flex flex-col lg:flex-row h-[85vh] lg:h-[70vh]">
          <div
            class="relative flex-1 bg-black flex items-center justify-center group/viewer overflow-hidden"
          >
            <button
              v-if="selectedSection.images.length > 1"
              @click="prevImg"
              class="absolute left-6 z-10 p-4 rounded-full bg-white/10 text-white hover:bg-yellow-500"
            >
              <i class="fas fa-chevron-left fa-lg"></i>
            </button>
            <img
              :src="selectedSection.images[currentImgIndex]"
              class="w-full h-full object-contain"
            />
            <button
              v-if="selectedSection.images.length > 1"
              @click="nextImg"
              class="absolute right-6 z-10 p-4 rounded-full bg-white/10 text-white hover:bg-yellow-500"
            >
              <i class="fas fa-chevron-right fa-lg"></i>
            </button>
          </div>
          <div class="w-full lg:w-87.5 p-10 flex flex-col justify-between bg-white overflow-y-auto">
            <div>
              <div
                class="inline-block px-3 py-1 rounded-full bg-[#0d2b0f]/10 text-[#0d2b0f] text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                {{ activeFloorName }}
              </div>
              <h2 class="text-[#0d2b0f] text-3xl font-black uppercase mb-4">
                {{ selectedSection.title }}
              </h2>
              <p class="text-gray-600 text-sm">{{ selectedSection.description }}</p>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-8">
              <div
                v-for="(img, idx) in selectedSection.images"
                :key="idx"
                @click="currentImgIndex = idx"
                class="aspect-square rounded-lg cursor-pointer overflow-hidden border-2"
                :class="
                  currentImgIndex === idx ? 'border-yellow-500' : 'border-transparent opacity-40'
                "
              >
                <img :src="img" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getGallerySectionsWithImages } from '@/services/manageGallery'

/* =====================================================
  TYPES & STATE
===================================================== */
interface Section {
  id: string
  title: string
  description: string
  note?: string
  images: string[]
}
interface Wing {
  name: string
  sections: Section[]
}
interface Floor {
  id: string
  name: string
  wings: Wing[]
}

const isLoading = ref(true)
const activeFloor = ref('floor1')
const searchQuery = ref('')
const showModal = ref(false)
const selectedSection = ref<Section | null>(null)
const currentImgIndex = ref(0)
const showScrollTop = ref(false)
const hoverIntervals = new Map<string, any>()

// Utility to reset structure without repetition
const createFloorStructure = (): Floor[] => [
  { id: 'floor1', name: '1st Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
  { id: 'floor2', name: '2nd Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
  { id: 'floor3', name: '3rd Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
]

const floors = ref<Floor[]>(createFloorStructure())

/* =====================================================
  DATA FETCHING (Optimized to 1 Request)
===================================================== */
const fetchGalleryData = async () => {
  try {
    isLoading.value = true
    
    const rawData = await getGallerySectionsWithImages()
    const temp = createFloorStructure()

    rawData.forEach((sec: any) => {
      const formatted: Section = {
        id: sec.id,
        title: sec.section_name,
        description: sec.description,
        note: sec.note,
        images: sec.gallery_images?.map((img: any) => img.image_url) || [],
      }

      const floorObj = temp.find((f) => f.name === sec.floor)
      if (floorObj) {
        const wingObj = floorObj.wings.find((w) => w.name === sec.wing)
        if (wingObj) wingObj.sections.push(formatted)
      }
    })

    floors.value = temp
  } catch (err) {
    console.error('Failed to fetch gallery:', err)
  } finally {
    isLoading.value = false
    nextTick(initObserver)
  }
}

/* =====================================================
  CAROUSEL LOGIC
===================================================== */
const startCarousel = (section: Section) => {
  if (!section.images || section.images.length < 2) return
  stopCarousel(section) 

  const intervalId = setInterval(() => {
    const img = section.images.shift()
    if (img) section.images.push(img)
  }, 1200)

  hoverIntervals.set(section.id, intervalId)
}

const stopCarousel = (section: Section) => {
  const interval = hoverIntervals.get(section.id)
  if (interval) {
    clearInterval(interval)
    hoverIntervals.delete(section.id)
  }
}

/* =====================================================
  COMPUTED & SEARCH
===================================================== */
const activeFloorName = computed(
  () => floors.value.find((f) => f.id === activeFloor.value)?.name || '',
)

const displayedFloors = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()

  if (!q) return floors.value.filter((f) => f.id === activeFloor.value)

  return floors.value
    .map((f) => ({
      ...f,
      wings: f.wings
        .map((w) => ({
          ...w,
          sections: w.sections.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              (s.description && s.description.toLowerCase().includes(q)),
          ),
        }))
        .filter((w) => w.sections.length > 0),
    }))
    .filter((f) => f.wings.length > 0)
})

/* =====================================================
  UTILITIES & LIFECYCLE
===================================================== */
const handleWindowScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let observer: IntersectionObserver | null = null
function initObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view')
      })
    },
    { threshold: 0.1 },
  )
  document.querySelectorAll('.sr-item').forEach((el) => observer?.observe(el))
}

const openGallery = (section: Section) => {
  selectedSection.value = section
  currentImgIndex.value = 0
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const nextImg = () => {

  if (selectedSection.value)

    currentImgIndex.value = (currentImgIndex.value + 1) % selectedSection.value.images.length

}

const prevImg = () => {

  if (selectedSection.value)

    currentImgIndex.value =

      (currentImgIndex.value - 1 + selectedSection.value.images.length) %

      selectedSection.value.images.length

}

onMounted(() => {
  fetchGalleryData()
  window.addEventListener('scroll', handleWindowScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
  if (observer) observer.disconnect()
  
  
  hoverIntervals.forEach((intervalId) => clearInterval(intervalId))
  hoverIntervals.clear()
})

watch([activeFloor, searchQuery], () => {
  setTimeout(initObserver, 200)
})
</script>



<style scoped>
/* Skeleton Animation */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(2deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scroll Reveal Effect */
.sr-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* REVEAL ANIMATION */
.sr-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reveal Animation */
.sr-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ── SCROLL REVEAL ── */
.sr-item {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ── HERO HEADER ── */
.gallery-hero {
  text-align: center;
  padding: 40px 30px 30px;
  width: 100%;
  background: white;
  margin-top: 1.6%;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.hero-line {
  width: 36px;
  height: 2px;
  background: #f9a825;
}

.hero-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #0d2b0f;
}

.hero-title {
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  line-height: 1.02;
  color: #0d2b0f;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

/* ── PAGE TRANSITIONS ── */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ── SCROLL TOP BUTTON ── */
.fade-btn-enter-active,
.fade-btn-leave-active {
  transition: opacity 0.3s ease;
}

.fade-btn-enter-from,
.fade-btn-leave-to {
  opacity: 0;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #0d2b0f;
}

/* ── NAVBAR ANIMATIONS ── */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-btn {
  opacity: 0;
  animation: slideInLeft 0.5s ease forwards;
}

.nav-search {
  opacity: 0;
  animation: slideInRight 0.5s ease 0.36s forwards;
}
</style>
