<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type DirectiveBinding } from 'vue'
import { supabase } from '@/lib/supabase'

type MediaType = 'image' | 'video'
type PageType = 'homepage' | 'aboutpage'

type MediaItem = {
  id: string
  title: string
  type: MediaType
  page: PageType
  section: string
  order: number
  category: string
  src: string
  externalLink?: string
  embedUrl?: string
  thumbnail?: string
}

type AboutRow = {
  id?: string
  title: string
  description: string
  edited_by?: string | null
  edited_at?: string | null
  order_num?: number | null
}

type AboutContent = {
  vision: string
  mission: string
  goal: string
  objectives: string[]
  rules: string[]
}

const STORAGE_KEY = 'website-media-v11'
const defaultHeroSrc = new URL('@/assets/csu.jpg', import.meta.url).href

const defaultIconMedia = [
  {
    id: 'default-icon-1',
    title: 'Discovery Icon',
    src: new URL('@/assets/icons/idea.gif', import.meta.url).href,
  },
  {
    id: 'default-icon-2',
    title: 'Learning Icon',
    src: new URL('@/assets/icons/student.gif', import.meta.url).href,
  },
  {
    id: 'default-icon-3',
    title: 'Knowledge Icon',
    src: new URL('@/assets/icons/opportunities.gif', import.meta.url).href,
  },
  {
    id: 'default-icon-4',
    title: 'Networking Icon',
    src: new URL('@/assets/icons/social-life.gif', import.meta.url).href,
  },
]

const defaultAboutContent: AboutContent = {
  vision:
    "The CSU-HERO Learning Commons envisions itself as a prenier repository of knowledge, champoining the university's commitment to becoming a socially engaged, digitally innovative, and entrepreneurial institution-excelling in science, engineering, and the arts by 2028.",
  mission:
    "The CSU-HERO Learning Commons provides resources and delivers essentials services that align with the University's mission as a transformative institution. It remains committed to the fostering a sustainable future for the regiion, the nation, and beyond.",
  goal: 'To ensure a well-organized library system with a vast collection of information and education materials that support the academic programs of the University and respond to the evolving needs of society within the region.',
  objectives: [
    'Ensure the provision and maintainance of efficient facilities and equipment to support high-quality library services and operations.;',
    'Employ committed and competent library personnel to deliver excellent library services.;',
    'Build a collection that meets the standards of modern libraries-not only within Caraga, but also at the national and international levels.;',
    'Establish linkages with local, national, and international academic and research networks to access updated technological information.;',
    'Provide library personnel with a dynamic program for professional development and continous learning.;',
    'Develop and implement a robust monitoring and evaluation system to assess library performance and identify strategies for improvement.;',
  ],
  rules: [
    'Always use appropriate voice level.',
    'No eating and drinking at reader’s area.',
    'Keep away books from rain, water and dust.',
    'Do not write or draw anything in our books.',
    'Cellular Phone should be put to silent mode.',
    'Answering phone calls inside the library is not allowed.',
    'Walk quietly into the library.',
    'Never run around the hallway outside the library premises.',
  ],
}

const mediaItems = ref<MediaItem[]>([])
const aboutContent = ref<AboutContent>({ ...defaultAboutContent })
const loadingAbout = ref(false)
const showScrollTop = ref(false)

function loadMedia() {
  try {
    mediaItems.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    mediaItems.value = []
  }
}

function normalizeMultiline(text: string): string[] {
  return text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function stripLeadingNumber(text: string): string {
  return text.replace(/^\s*\d+\.\s*/, '').trim()
}

function applyRowsToContent(rows: AboutRow[]) {
  const mapped: AboutContent = { ...defaultAboutContent }

  for (const row of rows) {
    const key = row.title?.toLowerCase()?.trim()

    if (key === 'vision') mapped.vision = row.description || defaultAboutContent.vision
    if (key === 'mission') mapped.mission = row.description || defaultAboutContent.mission
    if (key === 'goal') mapped.goal = row.description || defaultAboutContent.goal

    if (key === 'objectives') {
      mapped.objectives = row.description
        ? normalizeMultiline(row.description).map(stripLeadingNumber)
        : defaultAboutContent.objectives.map(stripLeadingNumber)
    }

    if (key === 'rules') {
      mapped.rules = row.description
        ? normalizeMultiline(row.description).map(stripLeadingNumber)
        : defaultAboutContent.rules.map(stripLeadingNumber)
    }
  }

  aboutContent.value = mapped
}

async function loadAboutContent() {
  loadingAbout.value = true

  const { data, error } = await supabase
    .from('about')
    .select('id, title, description, edited_by, edited_at, order_num')
    .order('order_num', { ascending: true })

  loadingAbout.value = false

  if (error) {
    console.error('Failed to load about content:', error)
    aboutContent.value = { ...defaultAboutContent }
    return
  }

  if (!data || data.length === 0) {
    aboutContent.value = { ...defaultAboutContent }
    return
  }

  applyRowsToContent(data as AboutRow[])
}

const heroMedia = computed(() =>
  mediaItems.value
    .filter((item) => item.page === 'aboutpage' && item.section === 'hero' && item.type === 'image')
    .sort((a, b) => a.order - b.order),
)

const iconMedia = computed(() => {
  const icons = mediaItems.value
    .filter(
      (item) => item.page === 'aboutpage' && item.section === 'icons' && item.type === 'image',
    )
    .sort((a, b) => a.order - b.order)

  return icons.length ? icons : defaultIconMedia
})

const heroImageSrc = computed(() => {
  return heroMedia.value[0]?.src || defaultHeroSrc
})

function handleMediaUpdated() {
  loadMedia()
}

function handleAboutUpdated() {
  loadAboutContent()
}

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let io: IntersectionObserver | null = null

const ensureObserver = (): IntersectionObserver | null => {
  if (io) return io

  const reduceMotion =
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    io = null
    return null
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in')
          io?.unobserve(entry.target)
        }
      }
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px',
    },
  )

  return io
}

type RevealBinding = DirectiveBinding<number | string | undefined>

const vReveal = {
  mounted(el: HTMLElement, binding: RevealBinding) {
    const delay = Number(binding.value ?? 0)
    if (delay > 0) el.style.setProperty('--reveal-delay', `${delay}ms`)

    el.classList.add('reveal')

    const obs = ensureObserver()
    if (!obs) {
      el.classList.add('reveal-in')
      return
    }
    obs.observe(el)
  },
  unmounted(el: HTMLElement) {
    io?.unobserve(el)
  },
}

onMounted(async () => {
  loadMedia()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('website-media-updated', handleMediaUpdated)
  window.addEventListener('website-about-updated', handleAboutUpdated)

  await loadAboutContent()
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('website-media-updated', handleMediaUpdated)
  window.removeEventListener('website-about-updated', handleAboutUpdated)
})
</script>

<template>
  <section class="about-page">
    <div class="page-inner" v-reveal>
      <div class="section-title section-title-center">
        <span class="section-kicker">
          <span class="kicker-line"></span>
          <span class="kicker-text">INTRODUCING CSU LIBRARY</span>
        </span>
        <h1 class="section-headline">ABOUT CSU LIBRARY</h1>
      </div>
    </div>

    <div class="hero-bleed" v-reveal="80">
      <div class="hero-wrap hero-overlay">
        <img :src="heroImageSrc" alt="CSU Library" class="hero-img" loading="lazy" />
      </div>
    </div>

    <div class="about-content page-inner">
      <div class="intro-text" v-reveal>
        <p class="mt-5">
          Libraries play a very crucial role in supporting the academic programs of any university
          as it identifies, evaluates, procures, processes, and then makes these learning resources
          available to the faculty and student for their teaching, learning and research
          assignments.
        </p>

        <p class="mt-4">
          The Caraga State University (CSU) Library in support to the attainment of the mandate of
          the University specifically the educational objectives endeavors to provide relevant
          materials and services. It has a program of selection, acquisition, collection maintenance
          and stocking, circulation of relevant materials, and provision of physical facilities and
          professional manpower.
        </p>
      </div>

      <div class="page-inner" v-reveal>
        <div class="icon-wrap icon-mt">
          <div class="icon-pill" v-for="icon in iconMedia" :key="icon.id">
            <img :src="icon.src" :alt="icon.title" class="gif-icon" loading="lazy" />
            <span>{{ icon.title.replace(' Icon', '') }}</span>
          </div>
        </div>
      </div>

      <div class="cards-grid">
        <div class="grid-item" v-reveal>
          <div class="content-box fixed-card">
            <div class="section-block no-top-space">
              <h3 class="green-heading with-accent">Vision</h3>
              <div class="card-body">
                <p class="section-paragraph">
                  {{ aboutContent.vision }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-item" v-reveal="80">
          <div class="content-box fixed-card">
            <div class="section-block no-top-space">
              <h3 class="green-heading with-accent">Mission</h3>
              <div class="card-body">
                <p class="section-paragraph">
                  {{ aboutContent.mission }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-item" v-reveal="160">
          <div class="content-box fixed-card">
            <div class="section-block no-top-space">
              <h3 class="green-heading with-accent">Goal</h3>
              <div class="card-body">
                <p class="section-paragraph">
                  {{ aboutContent.goal }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cards-grid-bottom">
        <div class="grid-item" v-reveal>
          <div class="content-box fixed-card">
            <div class="section-block no-top-space">
              <h3 class="green-heading with-accent bottom-box">Objectives</h3>
              <div class="card-body hide-scrollbar">
                <div class="custom-list-counter">
                  <div
                    v-for="(item, i) in aboutContent.objectives"
                    :key="i"
                    class="custom-list-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-item" v-reveal="80">
          <div class="content-box fixed-card">
            <div class="section-block no-top-space">
              <h3 class="green-heading with-accent bottom-box">Rules and Regulation</h3>
              <div class="card-body hide-scrollbar">
                <div class="custom-list-counter">
                  <div v-for="(item, i) in aboutContent.rules" :key="i" class="custom-list-item">
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingAbout" class="loading-text">Loading about content...</div>
    </div>

    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap;');

.about-page {
  font-family: 'Poppins', sans-serif;
  --page-bg: #f3f4f6;
  --ribbon-green: #003300;
  --accent-orange: #f9dc07;
  --text-color: #003300;
  --float-shadow-green: 13, 43, 15;
  width: 100%;
  min-height: 100vh;
  padding: 24px 0 40px;
  background: var(--page-bg);
}
.page-inner {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 32px !important;
  box-sizing: border-box !important;
}
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 520ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}
.reveal.reveal-in {
  opacity: 1;
  transform: translateY(0);
}
.section-title {
  width: min(100%, 1500px);
  margin: 8px auto 14px;
}
.section-title-center {
  text-align: center;
}
.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-top: 2.5%;
}
.kicker-line {
  width: 54px;
  height: 4px;
  border-radius: 999px;
  background: var(--accent-orange);
}
.kicker-text {
  font-weight: 900;
  letter-spacing: 6px;
  font-size: 0.7rem;
  color: var(--ribbon-green);
  text-transform: uppercase;
}
.section-headline {
  margin: 10px 0 0;
  margin-bottom: 3%;
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  line-height: 1.02;
  color: var(--ribbon-green);
}
.icon-mt {
  margin-top: 32px;
}
.icon-wrap {
  width: min(100%, 1500px);
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.icon-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.06);
}
.gif-icon {
  width: 46px;
  height: 46px;
  object-fit: contain;
  display: block;
}
.hero-bleed {
  width: 100%;
  padding: 0 !important;
  margin: 10px 0 0;
}
.hero-wrap {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  border-radius: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.1),
    0 18px 34px rgba(0, 0, 0, 0.08);
}
.hero-img {
  width: 100%;
  height: 370px;
  object-fit: cover;
  object-position: center;
  display: block;
  position: relative;
  z-index: 0;
  filter: brightness(0.92) contrast(1.03);
}
.hero-overlay {
  position: relative;
}
.hero-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(13, 43, 15, 0.4), rgba(13, 43, 15, 0.68));
}
.about-content {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 32px;
  box-sizing: border-box;
}
.intro-text {
  color: var(--text-color);
  line-height: 1.45;
  font-size: 15px;
  max-width: 1300px;
  margin: 0 auto;
  text-align: center;
}
.intro-text .mt-4 {
  margin-top: 14px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
  perspective: 1200px;
  margin-top: 22px;
}
.cards-grid-bottom {
  width: min(100%, 1500px);
  margin: 20px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
  perspective: 1200px;
}
.grid-item {
  min-width: 0;
  display: flex;
  perspective: 1200px;
}
.content-box {
  width: 100%;
  background: linear-gradient(180deg, #ffffff 50%, #ffffff 100%);
  border-radius: 16px;
  padding: 18px 20px;
  box-sizing: border-box;
  box-shadow:
    0 6px 14px rgba(var(--float-shadow-green), 0.16),
    0 14px 28px rgba(var(--float-shadow-green), 0.12),
    0 2px 4px rgba(var(--float-shadow-green), 0.1);
  position: relative;
  transform: translateY(0);
  transition:
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.grid-item:hover .content-box {
  transform: translateY(-10px) scale(1.02);
  box-shadow:
    0 18px 34px rgba(var(--float-shadow-green), 0.28),
    0 28px 48px rgba(var(--float-shadow-green), 0.2),
    0 10px 20px rgba(var(--float-shadow-green), 0.16);
}
.fixed-card {
  height: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.no-top-space {
  margin-top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.green-heading {
  color: #0d2b0f;
  font-weight: 900;
  font-size: 2rem;
  line-height: 1.1;
  margin: 0;
  flex-shrink: 0;
}
.with-accent {
  position: relative;
  padding-left: 22px;
}
.with-accent::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 6px;
  height: 38px;
  background: var(--accent-orange);
  border-radius: 1px;
}
.card-body {
  margin-top: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.section-paragraph {
  margin: 0 0 0 34px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
}
.custom-list-counter {
  margin: 0 0 0 34px;
  counter-reset: item;
}
.custom-list-item {
  counter-increment: item;
  margin-bottom: 8px;
  position: relative;
  padding-left: 28px;
  color: var(--text-color);
  line-height: 1.32;
  font-size: 0.98rem;
}
.custom-list-item::before {
  content: counter(item) '.';
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 600;
}
.loading-text {
  margin-top: 18px;
  text-align: center;
  color: #475569;
  font-weight: 500;
}

.scroll-top-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 70;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: #003300;
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

@media (max-width: 1100px) {
  .page-inner {
    padding: 0 24px !important;
  }
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .cards-grid-bottom {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .hero-img {
    height: 280px;
  }
}
@media (max-width: 768px) {
  .page-inner {
    padding: 0 14px !important;
    width: 100% !important;
  }
  .kicker-text {
    letter-spacing: 4px;
    font-size: 0.85rem;
  }
  .kicker-line {
    width: 38px;
    height: 4px;
  }
  .hero-img {
    height: 210px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .fixed-card {
    height: auto;
    min-height: 220px;
  }
  .grid-item:hover .content-box {
    transform: none;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.03),
      0 8px 18px rgba(0, 0, 0, 0.04);
  }
}
</style>
