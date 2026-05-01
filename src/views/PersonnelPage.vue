<template>
  <div class="w-full bg-[#f7f5f0] min-h-screen">
    <!-- ===== HERO ===== -->
    <div class="personnel-hero">
      <div class="absolute inset-0 hero-overlay"></div>
      <div class="relative z-10 flex flex-col items-center gap-3">
        <p class="hero-eyebrow anim-eyebrow">Caraga State University</p>
        <h1 class="hero-title anim-title">Library Personnel</h1>
        <div class="hero-divider anim-divider">
          <span class="hero-dot gold anim-dot-1"></span>
          <span class="hero-line anim-line-1"></span>
          <span class="hero-dot green anim-dot-2"></span>
          <span class="hero-line anim-line-2"></span>
          <span class="hero-dot gold anim-dot-3"></span>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="px-6 sm:px-10 lg:px-16 py-20 max-w-6xl mx-auto">
      <!-- ===== LOADING ===== -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="loader-ring"></div>
        <p class="loading-text">Loading personnel...</p>
      </div>

      <template v-else>
        <!-- ===== FEATURED (HEAD) ===== -->
        <div v-if="featuredStaff" class="featured-wrapper mb-24">
          <div class="sr-item flex items-center gap-3 mb-10 justify-center">
            <div class="label-line"></div>
            <span class="label-text">University Librarian</span>
            <div class="label-line"></div>
          </div>

          <div class="sr-item featured-card">
            <div class="featured-accent-bar"></div>
            <div class="featured-photo-wrap">
              <div
                class="absolute inset-0 rounded-full border-4 shadow-md"
                style="background-color: #003300; border-color: #009900"
              ></div>
              <img
                :src="featuredStaff.image_url || defaultAvatar"
                :alt="fullName(featuredStaff)"
                class="featured-photo"
              />
            </div>
            <div class="featured-info">
              <span class="featured-badge">Head of Library Services</span>
              <h2 class="featured-name">{{ fullName(featuredStaff) }}</h2>
              <div class="featured-divider"></div>
              <p v-if="featuredStaff.position" class="featured-position">
                {{ featuredStaff.position }}
              </p>
            </div>
          </div>
        </div>

        <!-- ===== STAFF SECTION LABEL ===== -->
        <div class="sr-item flex items-center gap-3 mb-12">
          <div class="label-line"></div>
          <span class="label-text">Library Staff</span>
          <div class="label-line flex-1"></div>
        </div>

        <!-- ===== STAFF GRID ===== -->
        <div v-if="otherStaff.length > 0" class="staff-grid">
          <div
            v-for="(person, index) in otherStaff"
            :key="person.id"
            class="sr-card staff-card"
            :style="{ transitionDelay: (index % 2) * 0.12 + 's' }"
          >
            <div class="staff-photo-wrap">
              <div
                class="absolute inset-0 rounded-full border-4 shadow-md"
                style="background-color: #003300; border-color: #009900"
              ></div>
              <img
                :src="person.image_url || defaultAvatar"
                :alt="fullName(person)"
                class="staff-photo"
              />
            </div>
            <div class="staff-info">
              <h3 class="staff-name">{{ fullName(person) }}</h3>
              <div class="staff-rule"></div>
              <p v-if="person.position" class="staff-position">{{ person.position }}</p>
            </div>
          </div>
        </div>

        <!-- ===== EMPTY STATE ===== -->
        <div v-else class="flex flex-col items-center py-20 gap-3 opacity-50">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#003300">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
            />
          </svg>
          <p class="text-sm font-semibold tracking-widest uppercase text-[#003300]">
            No staff found
          </p>
        </div>
      </template>
    </div>
  </div>

  <!-- SCROLL TO TOP -->
  <Transition name="fade">
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:opacity-90"
      style="background: #003300"
      aria-label="Scroll to top"
    >
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { personnelService } from '@/services/personnelService'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonnelRow {
  id: string
  first_name: string | null
  last_name: string | null
  professional_titles: string | null
  position: string | null
  role: string | null
  image_url: string | null
  is_active: boolean | null
  created_at: string | null
}

// ─── Default avatar SVG (shown when image_url is empty) ───────────────────────
const defaultAvatar =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzBkMmIwZiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzgiIHI9IjE4IiBmaWxsPSIjNjZiYjZhIi8+PHBhdGggZD0iTTEwIDkwIGMwLTIyIDEzLTM1IDQwLTM1czQwIDEzIDQwIDM1IiBmaWxsPSIjNjZiYjZhIi8+PC9zdmc+'

// ─── State ────────────────────────────────────────────────────────────────────
const staff = ref<PersonnelRow[]>([])
const loading = ref(true)
const showScrollTop = ref(false)
let observer: IntersectionObserver | null = null

// ─── Helper: build full display name from split columns ───────────────────────
function fullName(person: PersonnelRow): string {
  const last = person.last_name?.trim().toUpperCase() ?? ''
  const first = person.first_name?.trim().toUpperCase() ?? ''
  const titles = person.professional_titles?.trim() ?? ''
  const name = [last, first].filter(Boolean).join(', ')
  return titles ? `${name}, ${titles}` : name
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const featuredStaff = computed<PersonnelRow | undefined>(() =>
  staff.value.find((s) => s.role?.toLowerCase() === 'head' && s.is_active !== false),
)

const otherStaff = computed<PersonnelRow[]>(() =>
  staff.value.filter((s) => s.role?.toLowerCase() !== 'head' && s.is_active !== false),
)

// ─── Fetch from Supabase via personnelService ─────────────────────────────────
async function fetchPersonnel() {
  loading.value = true
  try {
    const data = await personnelService.getAll()
    staff.value = (data ?? []) as PersonnelRow[]
  } catch (err) {
    console.error('Failed to fetch personnel:', err)
  } finally {
    loading.value = false
    setTimeout(initObserver, 100)
  }
}

// ─── Scroll ───────────────────────────────────────────────────────────────────
function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Intersection Observer (scroll reveal) ────────────────────────────────────
function initObserver() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        e.isIntersecting ? e.target.classList.add('in-view') : e.target.classList.remove('in-view')
      }),
    { threshold: 0.1 },
  )
  document.querySelectorAll('.sr-item, .sr-card').forEach((el) => observer!.observe(el))
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchPersonnel()
  window.addEventListener('scroll', handleScroll)
  setTimeout(initObserver, 100)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
})
</script>

<style scoped>
/* ================================
   HERO ENTRY ANIMATIONS
================================ */
@keyframes heroFadeDown {
  from {
    opacity: 0;
    transform: translateY(-18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes heroScaleIn {
  from {
    opacity: 0;
    transform: scaleX(0.4);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
@keyframes heroDotPop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  70% {
    transform: scale(1.35);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.anim-eyebrow {
  opacity: 0;
  animation: heroFadeDown 0.6s ease 0.1s forwards;
}
.anim-title {
  opacity: 0;
  animation: heroFadeUp 0.7s ease 0.35s forwards;
}
.anim-divider {
  opacity: 0;
  animation: heroScaleIn 0.55s cubic-bezier(0.23, 1, 0.32, 1) 0.75s forwards;
}
.anim-divider .hero-dot:nth-child(1) {
  opacity: 0;
  animation: heroDotPop 0.4s ease 0.9s forwards;
}
.anim-divider .hero-dot:nth-child(3) {
  opacity: 0;
  animation: heroDotPop 0.4s ease 1.05s forwards;
}
.anim-divider .hero-dot:nth-child(5) {
  opacity: 0;
  animation: heroDotPop 0.4s ease 1.2s forwards;
}

/* ================================
   HERO
================================ */
.personnel-hero {
  width: 100%;
  height: 380px;
  background-image: url('@/assets/images/personnelpage/csu-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(4, 16, 5, 0.72) 0%,
    rgba(13, 43, 15, 0.8) 60%,
    rgba(4, 16, 5, 0.9) 100%
  );
}
.hero-eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.35em;
  color: #f9dc07;
  text-transform: uppercase;
  opacity: 0.85;
}
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1rem, 4vw, 2rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
}
.hero-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}
.hero-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}
.hero-dot.gold {
  background: #f9dc07;
}
.hero-dot.green {
  background: #009900;
}
.hero-line {
  width: 40px;
  height: 1px;
  background: #4d4d4d;
  display: inline-block;
}

/* ================================
   LOADING
================================ */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loader-ring {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(13, 43, 15, 0.12);
  border-top-color: #003300;
  animation: spin 0.7s linear infinite;
}
.loading-text {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.45);
}

/* ================================
   LABELS
================================ */
.label-line {
  height: 1px;
  width: 40px;
  background: linear-gradient(to right, #003300, rgba(13, 43, 15, 0.15));
}
.label-text {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: #003300;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ================================
   FEATURED CARD
================================ */
.featured-wrapper {
  animation: fadeUp 0.7s ease both;
}
.featured-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 48px;
  background: #ffffff;
  border: 1px solid rgba(13, 43, 15, 0.08);
  border-radius: 4px;
  padding: 48px 52px;
  box-shadow: 0 4px 40px rgba(13, 43, 15, 0.07);
  overflow: hidden;
}
.featured-accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #f9dc07, #009900);
}
.featured-photo-wrap {
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: visible;
}
.featured-photo {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 192px;
  height: 224px;
  object-fit: cover;
  border-radius: 50%;
  z-index: 1;
  transition: transform 0.3s ease;
}
.featured-photo:hover {
  transform: translateX(-50%) scale(1.05);
}
.featured-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.featured-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #003300;
  background: #f9dc07;
  padding: 3px 10px;
  border-radius: 2px;
  width: fit-content;
}
.featured-name {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #003300;
  line-height: 1.2;
  letter-spacing: 0.03em;
}
.featured-subtitle {
  font-size: 0.85rem;
  color: #009900;
  font-style: italic;
}
.featured-divider {
  width: 48px;
  height: 2px;
  background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
  border-radius: 2px;
}
.featured-position {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.5);
}

/* ================================
   STAFF GRID
================================ */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.staff-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  background: #ffffff;
  border: 1px solid rgba(13, 43, 15, 0.07);
  border-radius: 4px;
  padding: 24px 28px;
  box-shadow: 0 2px 16px rgba(13, 43, 15, 0.05);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease,
    border-color 0.3s ease;
  overflow: hidden;
  margin-top: 8px;
}
.staff-card:hover {
  box-shadow: 0 8px 32px rgba(13, 43, 15, 0.12);
  transform: translateY(-3px);
  border-color: rgba(249, 168, 37, 0.35);
}
.staff-photo-wrap {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: visible;
}
.staff-photo {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 106px;
  object-fit: cover;
  border-radius: 50%;
  z-index: 1;
  transition: transform 0.3s ease;
}
.staff-card:hover .staff-photo {
  transform: translateX(-50%) scale(1.05);
}
.staff-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.staff-name {
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0d2b0f;
  line-height: 1.3;
  letter-spacing: 0.01em;
}
.staff-rule {
  width: 28px;
  height: 1.5px;
  background: linear-gradient(to right, #f9dc07, rgba(249, 168, 37, 0.2));
  border-radius: 2px;
  transition: width 0.3s ease;
}
.staff-card:hover .staff-rule {
  width: 48px;
}
.staff-subtitle {
  font-size: 0.75rem;
  color: #009900;
  font-style: italic;
  line-height: 1.5;
}
.staff-position {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.45);
}
.staff-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, #f9dc07, #009900);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.staff-card:hover::after {
  transform: scaleX(1);
}

/* ================================
   SCROLL REVEAL
================================ */
.sr-item,
.sr-card {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.sr-item.in-view,
.sr-card.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ================================
   FADE TRANSITION
================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ================================
   ANIMATIONS
================================ */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ================================
   RESPONSIVE
================================ */
@media (max-width: 768px) {
  .personnel-hero {
    height: 280px;
  }
  .hero-title {
    font-size: 1.8rem;
  }
  .featured-card {
    flex-direction: column;
    text-align: center;
    padding: 36px 28px;
    gap: 28px;
  }
  .featured-info {
    align-items: center;
  }
  .featured-badge {
    align-self: center;
  }
  .staff-grid {
    grid-template-columns: 1fr;
  }
}
</style>
