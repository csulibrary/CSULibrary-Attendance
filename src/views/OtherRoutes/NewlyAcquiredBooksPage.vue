<template>
  <div class="w-full py-6 px-4 max-w-7xl mx-auto">
    <!-- Back Button + Tags (full width) -->
    <div class="flex items-center gap-3 mb-3">
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-1 text-sm font-semibold text-[#1b5e20] hover:underline"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <span
        style="
          font-size: 0.75rem;
          font-weight: 700;
          color: #1b5e20;
          border-left: 3px solid #1b5e20;
          padding-left: 8px;
        "
        >Services</span
      >
      <span
        style="
          font-size: 0.75rem;
          font-weight: 700;
          color: #1b5e20;
          border-left: 3px solid #f9a825;
          padding-left: 8px;
        "
        >Caraga State University Library</span
      >
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- LEFT: Main Content (2/3) -->
      <div class="lg:col-span-2">
        <!-- Page Header -->
        <div class="mb-6">
          <h1
            style="font-size: 2rem; font-weight: 900; color: #0d2b0f; line-height: 1.3"
            class="mb-2"
          >
            Newly Acquired Books
          </h1>
          <p style="font-size: 0.95rem; color: #555; line-height: 1.6">
            Browse and download the latest list of newly acquired books per college at Caraga State
            University Library.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style="color: #aaa"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search college..."
            class="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style="border: 2px solid #e0e0e0; color: #333; font-weight: 500"
          />
        </div>

        <!-- College Cards -->
        <div class="flex flex-col gap-3">
          <div
            v-for="(college, i) in filteredColleges"
            :key="i"
            class="flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 hover:shadow-md group"
            style="border: 2px solid #e8f5e9; background: #f9fdf9"
          >
            <!-- Left -->
            <div class="flex items-center gap-4">
              <!-- Icon -->
              <div
                class="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style="background: #e8f5e9"
              >
                <svg
                  class="w-5 h-5"
                  style="color: #1b5e20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <!-- Text -->
              <div>
                <p style="font-size: 0.95rem; font-weight: 800; color: #0d2b0f">
                  {{ college.name }}
                </p>
                <p style="font-size: 0.75rem; color: #1b5e20; font-weight: 700">
                  {{ college.file }}
                </p>
              </div>
            </div>

            <!-- Download Button -->
            <a
              :href="college.href"
              download
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex-shrink-0"
              style="background: #0d2b0f; color: white; font-size: 0.8rem"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </a>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredColleges.length === 0"
            class="rounded-xl p-10 text-center"
            style="border: 2px dashed #e0e0e0"
          >
            <svg
              class="w-10 h-10 mx-auto mb-3"
              style="color: #ccc"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p style="font-size: 0.9rem; color: #aaa; font-weight: 600">No college found.</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Sidebar (1/3) -->
      <div class="lg:col-span-1 self-start">
        <div class="sticky top-6 flex flex-col gap-4">
          <!-- Summary Card -->
          <div
            class="rounded-xl p-5"
            style="background: linear-gradient(135deg, #0d2b0f 0%, #1b5e20 100%); color: white"
          >
            <p
              style="
                font-size: 0.75rem;
                opacity: 0.7;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.1em;
              "
              class="mb-1"
            >
              Total Colleges
            </p>
            <p style="font-size: 2.5rem; font-weight: 900; line-height: 1">{{ colleges.length }}</p>
            <div
              class="mt-3 pt-3 flex items-center gap-2"
              style="border-top: 1px solid rgba(255, 255, 255, 0.2)"
            >
              <svg
                class="w-4 h-4"
                style="opacity: 0.7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p style="font-size: 0.8rem; opacity: 0.85">Lists available for download</p>
            </div>
          </div>

          <!-- How to Download -->
          <div class="rounded-xl p-5" style="border: 2px solid #fff3cd; background: #fffdf0">
            <h3
              style="font-size: 1rem; font-weight: 900; color: #0d2b0f"
              class="mb-4 flex items-center gap-2"
            >
              How to Download
            </h3>
            <div class="flex flex-col gap-3">
              <div v-for="(step, i) in steps" :key="i" class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style="background: #0d2b0f; font-size: 0.7rem; font-weight: 800"
                >
                  {{ i + 1 }}
                </div>
                <p style="font-size: 0.8rem; color: #444; line-height: 1.5; padding-top: 2px">
                  {{ step }}
                </p>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div
            class="rounded-xl p-5 flex items-center gap-4"
            style="background: #0d2b0f; color: white"
          >
            <div class="p-3 rounded-xl flex-shrink-0" style="background: rgba(255, 255, 255, 0.1)">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p style="font-size: 0.75rem; opacity: 0.7; font-weight: 600">Inquiries</p>
              <p style="font-size: 0.9rem; font-weight: 800">CSU Library Office</p>
              <p style="font-size: 0.78rem; opacity: 0.8">library@carsu.edu.ph</p>
            </div>
          </div>

          <!-- Library Updates -->
          <div>
            <h2
              style="
                font-size: 1.2rem;
                font-weight: 900;
                color: #0d2b0f;
                border-bottom: 3px solid #f9a825;
                padding-bottom: 8px;
              "
              class="mb-4"
            >
              LIBRARY UPDATES
            </h2>
            <div
              v-for="(post, i) in latestPosts"
              :key="i"
              class="flex gap-3 mb-4 cursor-pointer group"
              @click="router.push(post.route)"
            >
              <img
                :src="post.image"
                :alt="post.title"
                class="w-20 h-16 object-cover rounded flex-shrink-0 group-hover:brightness-90 transition-all duration-200"
              />
              <div class="flex flex-col justify-center min-w-0">
                <span
                  class="group-hover:underline"
                  style="font-size: 0.85rem; font-weight: 700; color: #1b5e20; line-height: 1.4"
                >
                  {{ post.title }}
                </span>
                <p style="font-size: 0.75rem; color: #888" class="mt-1">{{ post.date }}</p>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

/* ── Search ───────────────────────────────────────────── */
const searchQuery = ref('')

/* ── Colleges Data ────────────────────────────────────── */
const colleges = [
  { name: 'College of Agriculture and Agri-Industries', file: 'CAA.docx', href: '#' },
  { name: 'College of Humanities and Social Sciences', file: 'CHASS.docx', href: '#' },
  { name: 'College of Computing and Information Sciences', file: 'CCIS.docx', href: '#' },
  { name: 'College of Education', file: 'CED.docx', href: '#' },
  { name: 'College of Mathematics Natural Sciences', file: 'CMNS.docx', href: '#' },

  {
    name: 'College of Engineering and Geo-Sciences',
    file: 'CEGS.docx',
    href: '#',
  },
  { name: 'College of Forestry and Environmental Sciences', file: 'CoFES.docx', href: '#' },
]

const filteredColleges = computed(() =>
  colleges.filter((c) => c.name.toLowerCase().includes(searchQuery.value.toLowerCase())),
)

/* ── Steps ────────────────────────────────────────────── */
const steps = [
  'Find your college from the list on the left.',
  'Click the Download button beside the college name.',
  'Open the .docx file to view the full list of newly acquired books.',
]

/* ── Scroll to Top ────────────────────────────────────── */
const showScrollTop = ref(false)
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

/* ── Latest Posts ─────────────────────────────────────── */
const latestPosts = [
  {
    image: new URL('@/assets/images/card1.jpg', import.meta.url).href,
    title: 'BSP Knowledge Resource Network',
    date: 'February 19, 2026',
    route: { name: 'bcppage' },
  },
  {
    image: new URL('@/assets/images/card2.jpg', import.meta.url).href,
    title: 'National Book Week Celebration',
    date: 'February 19, 2026',
    route: { name: 'nbwcpage' },
  },
  {
    image: new URL('@/assets/images/card3.png', import.meta.url).href,
    title: 'STARBOOKS - DOST-STII',
    date: 'February 19, 2026',
    route: { name: 'starbooks' },
  },
  {
    image: new URL('@/assets/images/reservation.jpg', import.meta.url).href,
    title: 'AVR Reservation',
    date: 'February 19, 2026',
    route: { name: 'avr' },
  },
  {
    image: new URL('@/assets/images/top.jpg', import.meta.url).href,
    title: 'Top Library Borrowers and Visitors',
    date: 'February 19, 2026',
    route: { name: 'top-borrowers' },
  },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
