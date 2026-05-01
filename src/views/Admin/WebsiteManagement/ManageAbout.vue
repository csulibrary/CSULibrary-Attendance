<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type DirectiveBinding } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar.vue'
import '@/assets/styles/manage-gallery.css'

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

type EditableSection = keyof AboutContent | ''

const route = useRoute()

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

const SECTION_ORDER: Record<keyof AboutContent, number> = {
  vision: 1,
  mission: 2,
  goal: 3,
  objectives: 4,
  rules: 5,
}

const mediaItems = ref<MediaItem[]>([])
const aboutContent = ref<AboutContent>({ ...defaultAboutContent })

const loadingAbout = ref(false)
const savingAbout = ref(false)

const isEditModalOpen = ref(false)
const activeSection = ref<EditableSection>('')
const editTitle = ref('')
const editValue = ref('')

const isAdmin = ref(false)
const currentUserId = ref<string | null>(null)

const isAdminPage = computed(() => route.path.startsWith('/admin'))
const canEdit = computed(() => isAdmin.value || isAdminPage.value)

function loadMedia() {
  try {
    mediaItems.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    mediaItems.value = []
  }
}

async function loadUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    currentUserId.value = null
    isAdmin.value = false
    return
  }

  currentUserId.value = data.user.id

  if (data.user.user_metadata?.role === 'admin') {
    isAdmin.value = true
    return
  }

  const { data: userRow, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (!userError && userRow?.role === 'admin') {
    isAdmin.value = true
    return
  }

  isAdmin.value = false
}

function normalizeMultiline(text: string): string[] {
  return text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
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
        ? normalizeMultiline(row.description)
        : defaultAboutContent.objectives
    }
    if (key === 'rules') {
      mapped.rules = row.description
        ? normalizeMultiline(row.description)
        : defaultAboutContent.rules
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

async function upsertSection(section: keyof AboutContent, value: string) {
  savingAbout.value = true

  const payload = {
    title: section,
    description: value,
    edited_by: currentUserId.value,
    edited_at: new Date().toISOString(),
    order_num: SECTION_ORDER[section],
  }

  const { error } = await supabase.from('about').upsert(payload, { onConflict: 'title' })

  savingAbout.value = false

  if (error) {
    console.error(`Failed to save ${section}:`, error)
    alert(`Failed to save ${section}. Please try again.`)
    return false
  }

  return true
}

function openEditModal(section: keyof AboutContent, title: string) {
  if (!canEdit.value) return

  activeSection.value = section
  editTitle.value = title

  const currentValue = aboutContent.value[section]
  editValue.value = Array.isArray(currentValue) ? currentValue.join('\n') : currentValue

  isEditModalOpen.value = true
}

function closeEditModal() {
  if (savingAbout.value) return

  isEditModalOpen.value = false
  activeSection.value = ''
  editTitle.value = ''
  editValue.value = ''
}

async function saveSection() {
  if (!activeSection.value || !canEdit.value) return

  const section = activeSection.value
  const cleanedValue = editValue.value.trim()

  const ok = await upsertSection(section, cleanedValue)
  if (!ok) return

  await loadAboutContent()
  window.dispatchEvent(new Event('website-about-updated'))
  closeEditModal()
}

function handleMediaUpdated() {
  loadMedia()
}

function handleAboutUpdated() {
  loadAboutContent()
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
  window.addEventListener('website-media-updated', handleMediaUpdated)
  window.addEventListener('website-about-updated', handleAboutUpdated)

  await loadUser()
  await loadAboutContent()
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
  window.removeEventListener('website-media-updated', handleMediaUpdated)
  window.removeEventListener('website-about-updated', handleAboutUpdated)
})
</script>

<template>
  <div class="manage-about-layout">
    <div class="manage-about-sidebar-fixed">
      <Sidebar />
    </div>

    <section class="about-page">
      <div class="manage-about-shell">
        <div class="manage-header">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.back()"
            >
              BACK
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Manage About Us</span>
          </div>

          <h1 class="hero-title">
            <span class="hero-title--underlined">Manage</span>
            <span class="hero-title--gold"> About Us</span>
          </h1>

          <p class="manage-subtitle">
            Update library about content, objectives, rules, and visibility for the About page.
          </p>
        </div>
      </div>

      <div class="manage-about-shell">
        <div class="about-content page-inner">
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
                  <div class="title-row">
                    <h3 class="green-heading with-accent">Vision</h3>
                  </div>

                  <div class="card-body">
                    <p class="section-paragraph">
                      {{ aboutContent.vision }}
                    </p>
                  </div>

                  <div v-if="canEdit" class="card-actions">
                    <button
                      class="edit-btn edit-btn-bottom"
                      @click="openEditModal('vision', 'Vision')"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid-item" v-reveal="80">
              <div class="content-box fixed-card">
                <div class="section-block no-top-space">
                  <div class="title-row">
                    <h3 class="green-heading with-accent">Mission</h3>
                  </div>

                  <div class="card-body">
                    <p class="section-paragraph">
                      {{ aboutContent.mission }}
                    </p>
                  </div>

                  <div v-if="canEdit" class="card-actions">
                    <button
                      class="edit-btn edit-btn-bottom"
                      @click="openEditModal('mission', 'Mission')"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid-item" v-reveal="160">
              <div class="content-box fixed-card">
                <div class="section-block no-top-space">
                  <div class="title-row">
                    <h3 class="green-heading with-accent">Goal</h3>
                  </div>

                  <div class="card-body">
                    <p class="section-paragraph">
                      {{ aboutContent.goal }}
                    </p>
                  </div>

                  <div v-if="canEdit" class="card-actions">
                    <button class="edit-btn edit-btn-bottom" @click="openEditModal('goal', 'Goal')">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cards-grid-bottom">
            <div class="grid-item" v-reveal>
              <div class="content-box fixed-card">
                <div class="section-block no-top-space">
                  <div class="title-row">
                    <h3 class="green-heading with-accent bottom-box">Objectives</h3>
                  </div>

                  <div class="card-body">
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

                  <div v-if="canEdit" class="card-actions">
                    <button
                      class="edit-btn edit-btn-bottom"
                      @click="openEditModal('objectives', 'Objectives')"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid-item" v-reveal="80">
              <div class="content-box fixed-card">
                <div class="section-block no-top-space">
                  <div class="title-row">
                    <h3 class="green-heading with-accent bottom-box">Rules and Regulation</h3>
                  </div>

                  <div class="card-body">
                    <div class="custom-list-counter">
                      <div
                        v-for="(item, i) in aboutContent.rules"
                        :key="i"
                        class="custom-list-item"
                      >
                        {{ item }}
                      </div>
                    </div>
                  </div>

                  <div v-if="canEdit" class="card-actions">
                    <button
                      class="edit-btn edit-btn-bottom"
                      @click="openEditModal('rules', 'Rules and Regulation')"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loadingAbout" class="loading-text">Loading about content...</div>
        </div>
      </div>

      <div v-if="isEditModalOpen" class="modal-backdrop" @click.self="closeEditModal">
        <div class="edit-modal">
          <div class="modal-header">
            <h2>Edit {{ editTitle }}</h2>
            <button class="modal-close" @click="closeEditModal">×</button>
          </div>

          <div class="modal-body">
            <p
              class="helper-text"
              v-if="activeSection === 'objectives' || activeSection === 'rules'"
            >
              Enter one item per line. Keep the numbering if you want it shown exactly the same.
            </p>

            <textarea
              v-model="editValue"
              class="edit-textarea"
              :placeholder="`Enter ${editTitle.toLowerCase()} here...`"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button class="cancel-btn" @click="closeEditModal">Cancel</button>
            <button class="save-btn" :disabled="savingAbout" @click="saveSection">
              {{ savingAbout ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap;');

.manage-about-layout {
  width: 100%;
  min-height: 100vh;
  background: #f3f4f6;
}

.manage-about-sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  height: 100vh;
  z-index: 40;
  overflow: visible;
  transition: width 0.3s ease;
}

.manage-about-sidebar-fixed:hover {
  width: 288px;
}

.about-page {
  font-family: 'Poppins', sans-serif;
  --page-bg: #f3f4f6;
  --ribbon-green: #0d2b0f;
  --accent-orange: #fbc02d;
  --text-color: #1f1f1f;
  --float-shadow-green: 13, 43, 15;
  width: 100%;
  min-height: 100vh;
  padding: 24px 0 40px 80px;
  background: var(--page-bg);
  box-sizing: border-box;
  transition: padding-left 0.3s ease;
}

.manage-about-sidebar-fixed:hover + .about-page {
  padding-left: 288px;
}

.manage-about-shell {
  width: 100%;
  box-sizing: border-box;
  padding: 0 56px 0 32px;
}

.page-inner {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
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

.manage-header {
  margin-bottom: 32px;
}

.manage-subtitle {
  margin: 14px 0 0;
  max-width: 520px;
  margin-top: 1rem;
  font-size: 0.82rem;
  line-height: 1.45;
  color: #7d8f84;
  font-weight: 400;
}

.hero-bleed {
  width: 100%;
  padding: 0 !important;
  margin: 10px 0 0;
}

.hero-wrap {
  width: 100%;
  max-width: none;
  margin: 0;
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
  perspective: 1200px;
  margin-top: 22px;
}

.cards-grid-bottom {
  width: 100%;
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

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.card-body::-webkit-scrollbar {
  display: none;
}

.card-actions {
  margin-top: 16px;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.edit-btn-bottom {
  align-self: flex-end;
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

.edit-btn,
.cancel-btn,
.save-btn,
.modal-close {
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: 0.2s ease;
}

.edit-btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #0d2b0f;
  color: #fff;
}

.edit-btn:hover {
  opacity: 0.92;
}

.loading-text {
  margin-top: 18px;
  text-align: center;
  color: #475569;
  font-weight: 500;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}

.edit-modal {
  width: min(100%, 760px);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-header h2 {
  margin: 0;
  color: #0d2b0f;
  font-size: 1.2rem;
  font-weight: 800;
}

.modal-close {
  background: transparent;
  font-size: 1.8rem;
  line-height: 1;
  color: #334155;
}

.modal-body {
  padding: 18px 22px;
}

.helper-text {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 0.92rem;
}

.edit-textarea {
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 0.96rem;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
}

.edit-textarea:focus {
  border-color: #0d2b0f;
  box-shadow: 0 0 0 3px rgba(13, 43, 15, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 22px 20px;
}

.cancel-btn,
.save-btn {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
}

.cancel-btn {
  background: #e2e8f0;
  color: #1e293b;
}

.save-btn {
  background: #0d2b0f;
  color: #fff;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .manage-about-shell {
    padding: 0 32px 0 24px;
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
  .about-page {
    padding: 24px 0 40px 80px;
  }

  .manage-about-sidebar-fixed:hover {
    width: 80px;
  }

  .manage-about-sidebar-fixed:hover + .about-page {
    padding-left: 80px;
  }

  .manage-about-shell {
    padding: 0 16px;
  }

  .manage-subtitle {
    font-size: 0.95rem;
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

  .title-row {
    gap: 10px;
  }

  .edit-modal {
    width: 100%;
  }
}
</style>
