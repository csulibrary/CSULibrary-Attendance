<template>
  <div class="w-full py-6 px-4 max-w-7xl mx-auto">
    <!-- Back Button + Tags -->
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- LEFT: Borrowers List (2/3) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Page Header (inside left col, aligns with sidebar) -->
        <div>
          <h1
            style="font-size: 2.2rem; font-weight: 900; color: #0d2b0f; line-height: 1.2"
            class="mb-2"
          >
            Top Borrowers
          </h1>
          <p style="font-size: 0.95rem; color: #555; max-width: 520px; line-height: 1.6">
            Recognizing the most active readers of Caraga State University Library each month.
          </p>
        </div>

        <!-- Month Filter -->
        <div
          class="rounded-xl p-5"
          style="
            border: 2px solid #e0e0e0;
            box-shadow: 0 4px 24px rgba(13, 43, 15, 0.08);
            background: white;
          "
        >
          <div class="flex items-center gap-2 mb-4">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span
              style="font-size: 0.9rem; font-weight: 700; color: #0d2b0f; letter-spacing: 0.03em"
              >Filter by Month</span
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="month in months"
              :key="month"
              @click="selectedMonth = month"
              class="px-4 py-1.5 rounded-full border transition text-sm font-semibold"
              :style="
                selectedMonth === month
                  ? 'background: #0d2b0f; color: white; border-color: #0d2b0f;'
                  : 'background: white; color: #444; border-color: #ddd;'
              "
            >
              {{ month }}
            </button>
          </div>
        </div>

        <!-- Borrowers List -->
        <div class="flex flex-col gap-3">
          <div
            v-for="(borrower, index) in filteredBorrowers"
            :key="borrower.name + index"
            class="rounded-xl px-5 py-4 flex justify-between items-center transition-all duration-200 hover:shadow-md"
            :style="cardStyle(index)"
          >
            <!-- LEFT -->
            <div class="flex items-center gap-4">
              <!-- Rank -->
              <div class="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <template v-if="index === 0">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#f9a825">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7 2h8.6l.9 2H6.8l.9-2z" />
                  </svg>
                </template>
                <template v-else-if="index === 1">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#9e9e9e">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7 2h8.6l.9 2H6.8l.9-2z" />
                  </svg>
                </template>
                <template v-else-if="index === 2">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#bc8c5b">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7 2h8.6l.9 2H6.8l.9-2z" />
                  </svg>
                </template>
                <template v-else>
                  <span style="font-size: 1rem; font-weight: 800; color: #aaa">{{
                    index + 1
                  }}</span>
                </template>
              </div>

              <!-- Avatar -->
              <div
                class="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0"
                style="background: #e8f5e9; color: #1b5e20; font-weight: 800; font-size: 0.9rem"
              >
                {{ getInitials(borrower.name) }}
              </div>

              <!-- Info -->
              <div>
                <p style="font-size: 0.95rem; font-weight: 800; color: #0d2b0f">
                  {{ borrower.name }}
                </p>
                <p style="font-size: 0.78rem; color: #888; font-weight: 600">
                  {{ borrower.department }}
                </p>
                <p style="font-size: 0.75rem; color: #aaa">Favorite Genre: {{ borrower.genre }}</p>
              </div>
            </div>

            <!-- RIGHT: Book Count -->
            <div class="flex flex-col items-center flex-shrink-0 mr-2">
              <svg
                class="w-5 h-5 mb-1"
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
              <span style="font-size: 1rem; font-weight: 800; color: #1b5e20">{{
                borrower.books
              }}</span>
              <span style="font-size: 0.7rem; color: #888; font-weight: 600">Books</span>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredBorrowers.length === 0"
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
            <p style="font-size: 0.9rem; color: #aaa; font-weight: 600">
              No borrowers found for this month.
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Info Cards (1/3) -->
      <div class="lg:col-span-1 flex flex-col gap-4 self-start sticky top-6">
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
            Current Filter
          </p>
          <p style="font-size: 1.5rem; font-weight: 900">
            {{ selectedMonth }} {{ new Date().getFullYear() }}
          </p>
          <div class="mt-3 pt-3" style="border-top: 1px solid rgba(255, 255, 255, 0.2)">
            <p style="font-size: 0.78rem; opacity: 0.8">Total Borrowers</p>
            <p style="font-size: 1.8rem; font-weight: 900">{{ filteredBorrowers.length }}</p>
          </div>
        </div>

        <!-- Top 3 Podium -->
        <div class="rounded-xl p-5" style="border: 2px solid #e8f5e9; background: #f9fdf9">
          <h3
            style="font-size: 1rem; font-weight: 900; color: #0d2b0f"
            class="mb-4 flex items-center gap-2"
          >
            Top Students
          </h3>
          <div class="flex flex-col gap-3">
            <div
              v-for="(borrower, index) in filteredBorrowers.slice(0, 3)"
              :key="'top-' + index"
              class="flex items-center gap-3 p-3 rounded-lg"
              :style="
                index === 0
                  ? 'background: #fff8e1; border: 1px solid #ffe082;'
                  : index === 1
                    ? 'background: #f5f5f5; border: 1px solid #e0e0e0;'
                    : 'background: #fbe9e7; border: 1px solid #ffccbc;'
              "
            >
              <span>
                <!--  Gold -->
                <svg
                  v-if="index === 0"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f9a825"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="14" r="7" />
                  <path d="M12 11v6M10 13l2-2 2 2" />
                  <path d="M8.5 5.5L6 2h12l-2.5 3.5" />
                  <path d="M8.5 5.5h7" />
                </svg>
                <!--  Silver -->
                <svg
                  v-else-if="index === 1"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="14" r="7" />
                  <path d="M10 12c0-1.1.9-2 2-2s2 .9 2 2c0 1-.6 1.6-1.5 2.2L10 17h4" />
                  <path d="M8.5 5.5L6 2h12l-2.5 3.5" />
                  <path d="M8.5 5.5h7" />
                </svg>
                <!--  Bronze -->
                <svg
                  v-else-if="index === 2"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b45309"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="14" r="7" />
                  <path d="M10 11h2.5a1.5 1.5 0 010 3H10h2.5a1.5 1.5 0 010 3H10" />
                  <path d="M8.5 5.5L6 2h12l-2.5 3.5" />
                  <path d="M8.5 5.5h7" />
                </svg>
              </span>
              <div class="flex-1 min-w-0">
                <p style="font-size: 0.82rem; font-weight: 800; color: #0d2b0f" class="truncate">
                  {{ borrower.name }}
                </p>
                <p style="font-size: 0.72rem; color: #888">{{ borrower.department }}</p>
              </div>
              <span style="font-size: 0.82rem; font-weight: 800; color: #1b5e20"
                >{{ borrower.books }} bks</span
              >
            </div>
            <p
              v-if="filteredBorrowers.length === 0"
              style="font-size: 0.8rem; color: #aaa; text-align: center"
            >
              No data available.
            </p>
          </div>
        </div>

        <!-- Department Legend -->
        <div class="rounded-xl p-5" style="border: 2px solid #e8f5e9; background: #f9fdf9">
          <h3
            style="font-size: 1rem; font-weight: 900; color: #0d2b0f"
            class="mb-4 flex items-center gap-2"
          >
            Departments
          </h3>
          <div class="flex flex-col gap-2">
            <div v-for="dept in departments" :key="dept" class="flex items-center gap-2">
              <svg
                class="w-3.5 h-3.5 flex-shrink-0"
                style="color: #1b5e20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span style="font-size: 0.78rem; color: #333; font-weight: 600">{{ dept }}</span>
            </div>
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

/* ── Month Filter ─────────────────────────────────────── */
const months = [
  'Jan',
  'Feb',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const selectedMonth = ref('March')
const selectedYear = ref('All')
const selectedDepartment = ref('All')

/* ── Borrowers Data ───────────────────────────────────── */
const borrowers = [
  {
    name: 'Juan Dela Cruz',
    books: 25,
    month: 'March',
    year: '2026',
    department: 'CCIS',
    genre: 'Science Fiction',
  },
  {
    name: 'Maria Santos',
    books: 21,
    month: 'March',
    year: '2026',
    department: 'CEGS',
    genre: 'Romance',
  },
  {
    name: 'Carlos Reyes',
    books: 18,
    month: 'Feb',
    year: '2026',
    department: 'CED',
    genre: 'History',
  },
  {
    name: 'Jonh Cruz',
    books: 18,
    month: 'March',
    year: '2026',
    department: 'CED',
    genre: 'History',
  },
  {
    name: 'Kim Taehyung',
    books: 18,
    month: 'March',
    year: '2026',
    department: 'CCIS',
    genre: 'History',
  },
  {
    name: 'Sample Student',
    books: 18,
    month: 'March',
    year: '2026',
    department: 'CHASS',
    genre: 'History',
  },
  {
    name: 'Xaiver Reyes',
    books: 18,
    month: 'Feb',
    year: '2026',
    department: 'CMNS',
    genre: 'History',
  },
]

const departments = ['CCIS', 'CEGS', 'CED', 'CHASS', 'CMNS']

/* ── Computed ─────────────────────────────────────────── */
const filteredBorrowers = computed(() =>
  borrowers
    .filter(
      (b) =>
        (selectedYear.value === 'All' || b.year === selectedYear.value) &&
        (selectedMonth.value === 'All' || b.month === selectedMonth.value) &&
        (selectedDepartment.value === 'All' || b.department === selectedDepartment.value),
    )
    .sort((a, b) => b.books - a.books),
)

/* ── Card Style ───────────────────────────────────────── */
const cardStyle = (index: number) => {
  if (index === 0) return 'background: #fff8e1; border: 2px solid #ffe082;'
  if (index === 1) return 'background: #f5f5f5; border: 2px solid #e0e0e0;'
  if (index === 2) return 'background: #fbe9e7; border: 2px solid #ffccbc;'
  return 'background: white; border: 2px solid #f0f0f0;'
}

/* ── Helpers ──────────────────────────────────────────── */
const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

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
    image: new URL('@/assets/images/newly_acc_books.png', import.meta.url).href,
    title: 'Newly Acquired Books',
    date: 'February 19, 2026',
    route: { name: 'newlyacquiredbooks' },
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
