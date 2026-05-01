<template>
  <div class="page-layout">
    <Sidebar :activeTab="'REPORTS'" />
    <div class="rp-root">
      <div class="grain" aria-hidden="true"></div>

      <!-- FLOATING SHAPES -->
      <div class="shape shape-a" aria-hidden="true"></div>
      <div class="shape shape-b" aria-hidden="true"></div>

      <!-- HEADER -->
      <header class="rp-header">
        <div class="rp-header__left">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/analytics')"
              >BACK</span
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Reports & Analytics</span>
          </div>

          <div class="rp-title-wrap">
            <h1 class="rp-title">
              <span class="rp-title--dark">Report</span> <span class="rp-title--gold">Display</span>
            </h1>
            <p class="header-sub">
              Reports display for the top borrowers, top colleges, and top departments
            </p>
          </div>
        </div>

        <div class="rp-header__right">
          <button class="edit-btn" @click="openEditModal">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Report
          </button>
          <button class="export-btn" @click="exportReport">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Export Report
          </button>
        </div>
      </header>

      <!-- TAB BAR -->
      <div class="tab-bar">
        <button
          v-for="(tab, i) in tabs"
          :key="i"
          class="tab-btn"
          :class="{ 'tab-btn--on': activeTab === i }"
          @click="setTab(i)"
        >
          <span class="tab-num">0{{ i + 1 }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-sub">{{ tab.sub }}</span>
          <span
            class="tab-underline"
            :style="activeTab === i ? `background:${tab.accent}` : ''"
          ></span>
        </button>
      </div>

      <!-- CONTENT PANEL -->
      <div class="panel" :key="activeTab">
        <!-- panel kicker -->
        <template v-if="activeTabData">
          <div class="panel-kicker">
            <div
              class="pk-icon"
              :style="`background:${activeTabData.accent}18; color:${activeTabData.accent}`"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                v-html="activeTabData.icon"
              ></svg>
            </div>
            <div class="pk-text">
              <h2 class="pk-title">{{ activeTabData.label }}</h2>
              <p class="pk-desc">{{ activeTabData.desc }}</p>
            </div>
            <div
              class="pk-count"
              :style="`color:${activeTabData.accent};border-color:${activeTabData.accent}33`"
            >
              {{ activeTabData.countLabel }}
            </div>
          </div>

          <!-- rank rows -->
          <div class="rank-list">
            <div
              v-for="(row, i) in currentRows"
              :key="row.name"
              class="rank-row"
              :class="`rank-row--${tier(i)}`"
              :style="`--i:${i}; --accent:${activeTabData.accent}; --bar:${barPct(row)}`"
            >
              <!-- left accent strip -->
              <div class="row-strip" :style="i < 3 ? `background:${tierColor(i)}` : ''"></div>

              <!-- rank badge -->
              <div class="row-rank" :class="`row-rank--${tier(i)}`">
                <svg v-if="i === 0" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>

              <!-- avatar / emblem -->
              <div class="row-avatar" :style="`background:${row.color ?? activeTabData.accent}`">
                {{ row.initials }}
              </div>

              <!-- info -->
              <div class="row-info">
                <span class="row-name">{{ row.name }}</span>
                <div class="row-tags">
                  <span v-for="tag in row.tags" :key="tag" class="rtag">{{ tag }}</span>
                </div>
              </div>

              <!-- progress + count -->
              <div class="row-metric">
                <div class="row-bar-track">
                  <div
                    class="row-bar-fill"
                    :style="`width:var(--bar); background:${activeTabData.accent}`"
                  ></div>
                </div>
                <div class="row-count-wrap">
                  <span class="row-count">{{ row.books.toLocaleString() }}</span>
                  <span class="row-unit">books</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- /panel -->

      <!-- EDIT MODAL -->
      <teleport to="body">
        <transition name="modal-fade">
          <div v-if="editModalOpen" class="modal-backdrop" @click.self="closeEditModal">
            <div class="modal-sheet">
              <!-- Modal Header -->
              <div class="modal-header">
                <div class="modal-header__left">
                  <div class="modal-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="modal-title">Edit Report</h3>
                    <p class="modal-sub">Modify period and ranking data</p>
                  </div>
                </div>
                <button class="modal-close" @click="closeEditModal">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="modal-body">
                <!-- Period -->
                <div class="field-group">
                  <label class="field-label">Report Period</label>
                  <input
                    class="field-input"
                    v-model="editForm.period"
                    placeholder="e.g. February 2026"
                  />
                </div>

                <!-- Tab selector -->
                <div class="field-group">
                  <label class="field-label">Editing Tab</label>
                  <div class="tab-toggle">
                    <button
                      v-for="(t, i) in editForm.tabs"
                      :key="i"
                      class="tt-btn"
                      :class="{ 'tt-btn--on': editTab === i }"
                      @click="editTab = i"
                    >
                      {{ t.label }}
                    </button>
                  </div>
                </div>

                <!-- Section title editor -->
                <div class="field-group" v-if="editForm.tabs[editTab]">
                  <label class="field-label">Section Title</label>
                  <input
                    class="field-input"
                    v-model="editForm.tabs[editTab]!.label"
                    placeholder="e.g. Top Borrowers"
                  />
                </div>

                <!-- Rows editor -->
                <div class="field-group">
                  <div class="rows-header">
                    <label class="field-label" style="margin: 0">
                      {{ editForm.tabs[editTab]?.label }} Entries
                    </label>
                    <button class="add-row-btn" @click="addRow">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Row
                    </button>
                  </div>

                  <div class="edit-rows">
                    <div v-for="(row, ri) in editRows" :key="ri" class="edit-row">
                      <span class="er-num">{{ ri + 1 }}</span>
                      <input class="field-input er-name" v-model="row.name" placeholder="Name" />
                      <input
                        class="field-input er-tag"
                        v-model="row.tag"
                        placeholder="Tag (course/abbr)"
                      />
                      <input
                        class="field-input er-books"
                        v-model.number="row.books"
                        type="number"
                        min="0"
                        placeholder="Books"
                      />
                      <button class="er-del" @click="removeRow(ri)" title="Remove">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <p v-if="editRows.length === 0" class="empty-rows">
                      No entries yet. Click Add Row.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="modal-footer">
                <button class="modal-cancel" @click="closeEditModal">Cancel</button>
                <button class="modal-save" @click="saveEdits">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import { ref, computed } from 'vue'

/* ─── DATE ─── */
const currentDate = computed(() =>
  new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
const currentPeriodRef = ref('February 2026')
const currentPeriod = computed(() => currentPeriodRef.value)

/* ─── TABS ─── */
const activeTab = ref(0)
const setTab = (i: number) => {
  activeTab.value = i
}

const tabs = [
  {
    label: 'Top Borrowers',
    sub: 'Students',
    desc: 'Students with the most borrowed books this period',
    countLabel: '10 students',
    accent: '#1b5e20',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
  },
  {
    label: 'Top Colleges',
    sub: 'Colleges',
    desc: 'Colleges ranked by total library borrowing activity',
    countLabel: '7 colleges',
    accent: '#c8930a',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>',
  },
  {
    label: 'Top Departments',
    sub: 'Departments',
    desc: 'Departments ranked by total library borrowing activity',
    countLabel: '12 depts',
    accent: '#0277bd',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
  },
]

/* ─── HELPERS ─── */
const tier = (i: number) => ['gold', 'silver', 'bronze', 'plain'][Math.min(i, 3)]
const tierColor = (i: number) =>
  ['#f9a825', 'rgba(13,43,15,0.22)', 'rgba(180,90,40,0.45)'][i] ?? 'transparent'

const CC: Record<string, string> = {
  CCIS: '#e65100',
  CEGS: '#7b1c2e',
  CMNS: '#c62828',
  CHASS: '#6a1b9a',
  CAA: '#c8930a',
  COFES: '#1b5e20',
  CED: '#0277bd',
}
const courseCC: Record<string, string> = {
  BSCS: 'CCIS',
  BSIT: 'CCIS',
  BSIS: 'CCIS',
  BSCE: 'CEGS',
  BSME: 'CEGS',
  BSGE: 'CEGS',
  BSGEO: 'CEGS',
  BSABE: 'CEGS',
  BSECE: 'CEGS',
  BSEE: 'CEGS',
  BSEd: 'CED',
  BSMATH: 'CED',
  BSPSYCH: 'CHASS',
  BSABSOCIO: 'CHASS',
  BSF: 'COFES',
  BSN: 'CAA',
  BSBA: 'CMNS',
}

const initials = (n: string) =>
  n
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0] ?? '')
    .join('')
    .toUpperCase()

function exportReport() {
  alert('Export coming soon!')
}

/* ─── DATA ─── */
const borrowers = [
  { name: 'Maria Santos', course: 'BSCS', year: '3rd Year', books: 48 },
  { name: 'Juan dela Cruz', course: 'BSEd', year: '4th Year', books: 43 },
  { name: 'Ana Reyes', course: 'BSIT', year: '2nd Year', books: 39 },
  { name: 'Carlo Mendoza', course: 'BSCE', year: '3rd Year', books: 35 },
  { name: 'Liza Navarro', course: 'BSN', year: '4th Year', books: 31 },
  { name: 'Mark Villanueva', course: 'BSBA', year: '2nd Year', books: 28 },
  { name: 'Rosa Catalan', course: 'BSEE', year: '3rd Year', books: 25 },
  { name: 'Jerome Bautista', course: 'BSME', year: '1st Year', books: 22 },
  { name: 'Trisha Abad', course: 'BSF', year: '4th Year', books: 20 },
  { name: 'Nino Espiritu', course: 'BSMATH', year: '3rd Year', books: 18 },
].map((b) => ({
  ...b,
  initials: initials(b.name),
  color: CC[courseCC[b.course] ?? ''] ?? '#0d2b0f',
  tags: [b.course, b.year],
}))

const colleges = [
  {
    name: 'College of Computing and Information Sciences',
    abbr: 'CCIS',
    students: 1842,
    books: 1240,
  },
  { name: 'College of Engineering and Geosciences', abbr: 'CEGS', students: 1620, books: 1085 },
  { name: 'College of Education', abbr: 'CED', students: 1210, books: 920 },
  { name: 'College of Humanities and Social Sciences', abbr: 'CHASS', students: 890, books: 780 },
  { name: 'College of Agriculture and Agri-Industries', abbr: 'CAA', students: 760, books: 640 },
  {
    name: 'College of Forestry and Environmental Sciences',
    abbr: 'COFES',
    students: 540,
    books: 495,
  },
  { name: 'College of Mathematics and Natural Sciences', abbr: 'CMNS', students: 480, books: 420 },
].map((c) => ({
  ...c,
  initials: c.abbr.slice(0, 2),
  color: CC[c.abbr] ?? '#0d2b0f',
  tags: [c.abbr, `${c.students.toLocaleString()} students`],
}))

const departments = [
  { name: 'BS Information Technology', college: 'CCIS', books: 680 },
  { name: 'BS Computer Science', college: 'CCIS', books: 560 },
  { name: 'BS Information Systems', college: 'CCIS', books: 490 },
  { name: 'BS Civil Engineering', college: 'CEGS', books: 445 },
  { name: 'BS Mechanical Engineering', college: 'CEGS', books: 390 },
  { name: 'BS Geodetic Engineering', college: 'CEGS', books: 350 },
  { name: 'BS Electronics & Comm. Engineering', college: 'CEGS', books: 320 },
  { name: 'BS Geology', college: 'CEGS', books: 295 },
  { name: 'BS Agricultural & Biosystems Engr.', college: 'CEGS', books: 260 },
  { name: 'BS Mathematics', college: 'CED', books: 230 },
  { name: 'BS Psychology', college: 'CHASS', books: 210 },
  { name: 'BS Sociology', college: 'CHASS', books: 185 },
].map((d) => ({
  ...d,
  initials: d.college.slice(0, 2),
  color: CC[d.college] ?? '#0d2b0f',
  tags: [d.college],
}))

const allRows = [borrowers, colleges, departments] as const

// After save, currentRows uses mutable sources sorted by books desc
const currentRows = computed(() => {
  const src = [mutableBorrowers, mutableColleges, mutableDepts][activeTab.value]
  if (!src) return []
  return [...src.value]
    .filter((r) => r.name)
    .sort((a, b) => b.books - a.books)
    .map((r) => ({
      name: r.name,
      books: r.books,
      initials: r.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((x: string) => x[0] ?? '')
        .join('')
        .toUpperCase(),
      color: '#0d2b0f',
      tags: [r.tag],
    }))
})
const barPct = (row: any) => {
  const top = currentRows.value[0]?.books ?? 1
  return `${Math.round((row.books / top) * 100)}%`
}

const activeTabData = computed(() => tabs[activeTab.value] ?? tabs[0])

/* ─── EDIT MODAL ─── */
const editModalOpen = ref(false)
const editTab = ref(0)

// Editable copies of period + tab labels
const editForm = ref({
  period: 'February 2026',
  tabs: tabs.map((t) => ({ label: t.label })),
})

// Mutable data sources
const mutableBorrowers = ref(
  borrowers.map((b) => ({ name: b.name, tag: b.tags[0] ?? '', books: b.books })),
)
const mutableColleges = ref(
  colleges.map((c) => ({ name: c.name, tag: c.tags[0] ?? '', books: c.books })),
)
const mutableDepts = ref(
  departments.map((d) => ({ name: d.name, tag: d.tags[0] ?? '', books: d.books })),
)

const editRowSources = computed(() => [
  mutableBorrowers.value,
  mutableColleges.value,
  mutableDepts.value,
])
const editRows = computed(() => editRowSources.value[editTab.value] ?? [])

function openEditModal() {
  editForm.value.period = currentPeriodRef.value
  editForm.value.tabs = tabs.map((t) => ({ label: t.label }))
  editTab.value = activeTab.value
  editModalOpen.value = true
}

function closeEditModal() {
  editModalOpen.value = false
}

function addRow() {
  editRows.value.push({ name: '', tag: '', books: 0 })
}

function removeRow(i: number) {
  editRows.value.splice(i, 1)
}

function saveEdits() {
  currentPeriodRef.value = editForm.value.period
  // Apply tab label changes back to the live tabs array
  editForm.value.tabs.forEach((t, i) => {
    const tab = tabs[i]
    if (tab) tab.label = t.label
  })
  editModalOpen.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700;800&display=swap');

/* ══════════════════════════════════════════════
   PAGE LAYOUT
══════════════════════════════════════════════ */
.page-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ══════════════════════════════════════════════
   ROOT & TOKENS
══════════════════════════════════════════════ */
.rp-root {
  flex: 1;
  overflow-y: auto;
  --ink: #0a200b;
  --ink-60: rgba(10, 32, 11, 0.6);
  --ink-30: rgba(10, 32, 11, 0.3);
  --ink-10: rgba(10, 32, 11, 0.08);
  --surface: #ffffff;
  --cream: #f4f1ea;
  --gold: #f9a825;
  --r-lg: 22px;
  --r-md: 14px;
  --r-sm: 8px;
  --sh: 0 4px 32px rgba(10, 32, 11, 0.08);

  position: relative;
  background: var(--cream);
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  padding: 36px 44px 88px;
  overflow-x: hidden;
  isolation: isolate;
}

/* ── GRAIN ── */
.grain {
  position: fixed;
  inset: -200%;
  width: 400%;
  height: 400%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* ── SHAPES ── */
.shape {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
}
.shape-a {
  width: 640px;
  height: 640px;
  background: radial-gradient(circle, rgba(27, 94, 32, 0.065) 0%, transparent 70%);
  top: -180px;
  right: -180px;
  filter: blur(60px);
}
.shape-b {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(249, 168, 37, 0.055) 0%, transparent 70%);
  bottom: -100px;
  left: -80px;
  filter: blur(70px);
}

/* all real content above backdrop */
.rp-header,
.tab-bar,
.panel {
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
.rp-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-30);
  margin-bottom: 12px;
}
.crumb-sep {
  opacity: 0.4;
}

.rp-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 8px;
  display: inline-block;
}
.rp-title--dark {
  color: #0d2b0f;
  display: inline-block;
}
.rp-title--dark::after {
  content: '';
  display: block;
  height: 4px;
  width: 100%;
  margin-top: 6px;
  border-radius: 2px;
  background: linear-gradient(to right, #0d2b0f, #f9a825);
}
.rp-title--gold {
  color: #f9a825;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4caf50;
  animation: blink 2.2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  50% {
    opacity: 0.6;
    box-shadow: 0 0 0 5px rgba(76, 175, 80, 0.06);
  }
}

.rp-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.date-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  background: var(--surface);
  border: 1px solid var(--ink-10);
  border-radius: var(--r-sm);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ink-60);
  box-shadow: var(--sh);
  white-space: nowrap;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(10, 32, 11, 0.22);
  transition:
    background 0.2s,
    transform 0.18s,
    box-shadow 0.2s;
}
.export-btn:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(10, 32, 11, 0.28);
}

/* ══════════════════════════════════════════════
   TAB BAR
══════════════════════════════════════════════ */
.tab-bar {
  display: flex;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--ink-10);
  border-radius: var(--r-lg);
  padding: 8px;
  margin-bottom: 20px;
  box-shadow: var(--sh);
  overflow: hidden;
}

.tab-btn {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--r-md);
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
  overflow: hidden;
  text-align: left;
}
.tab-btn:hover {
  background: var(--ink-10);
}
.tab-btn--on {
  background: var(--ink) !important;
}

.tab-num {
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--ink-30);
  transition: color 0.2s;
  font-family: 'Playfair Display', serif;
}

.tab-label {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--ink);
  white-space: nowrap;
  transition: color 0.2s;
}
.tab-btn--on .tab-label {
  color: #fff;
}

.tab-sub {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--ink-30);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}
.tab-btn--on .tab-sub {
  color: rgba(255, 255, 255, 0.4);
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 18px;
  right: 18px;
  height: 2.5px;
  border-radius: 2px 2px 0 0;
  opacity: 0;
  transition:
    opacity 0.25s,
    background 0.25s;
}
.tab-btn:not(.tab-btn--on):hover .tab-underline {
  opacity: 0.3;
  background: var(--ink) !important;
}

/* ══════════════════════════════════════════════
   PANEL
══════════════════════════════════════════════ */
@keyframes panelSlide {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.panel {
  background: var(--surface);
  border: 1px solid var(--ink-10);
  border-radius: var(--r-lg);
  padding: 28px 28px 16px;
  box-shadow: 0 8px 48px rgba(10, 32, 11, 0.09);
  animation: panelSlide 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ─ KICKER ─ */
.panel-kicker {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 18px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--ink-10);
  flex-wrap: wrap;
}
.pk-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pk-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 3px;
  letter-spacing: -0.01em;
}
.pk-desc {
  font-size: 0.68rem;
  color: var(--ink-30);
  margin: 0;
  font-weight: 500;
}
.pk-count {
  margin-left: auto;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid;
  flex-shrink: 0;
}

/* ══════════════════════════════════════════════
   RANK ROWS
══════════════════════════════════════════════ */
@keyframes rowReveal {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rank-row {
  position: relative;
  display: grid;
  grid-template-columns: 4px 32px 38px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 11px 10px 11px 0;
  border-radius: 10px;
  transition: background 0.16s;
  animation: rowReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 0.055s);
}
.rank-row:hover {
  background: rgba(10, 32, 11, 0.024);
}

/* ─ STRIP ─ */
.row-strip {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  background: transparent;
  flex-shrink: 0;
}
.rank-row--gold .row-strip {
  background: #f9a825;
  box-shadow: 0 0 8px rgba(249, 168, 37, 0.4);
}
.rank-row--silver .row-strip {
  background: rgba(10, 32, 11, 0.22);
}
.rank-row--bronze .row-strip {
  background: rgba(180, 90, 40, 0.42);
}

/* ─ RANK BADGE ─ */
.row-rank {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 900;
  flex-shrink: 0;
  font-family: 'Playfair Display', serif;
}
.row-rank--gold {
  background: var(--gold);
  color: #5a3400;
  box-shadow: 0 3px 10px rgba(249, 168, 37, 0.45);
}
.row-rank--silver {
  background: rgba(10, 32, 11, 0.1);
  color: rgba(10, 32, 11, 0.5);
}
.row-rank--bronze {
  background: rgba(180, 90, 40, 0.12);
  color: #7a3a10;
}
.row-rank--plain {
  background: #ede9e1;
  color: var(--ink-30);
}

/* ─ AVATAR ─ */
.row-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

/* ─ INFO ─ */
.row-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.row-name {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.rtag {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 7px;
  background: var(--ink-10);
  color: var(--ink-60);
  border-radius: 4px;
  white-space: nowrap;
}

/* ─ METRIC ─ */
.row-metric {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  min-width: 86px;
}
.row-bar-track {
  width: 80px;
  height: 4px;
  background: #ede9e1;
  border-radius: 3px;
  overflow: hidden;
}
.row-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.9s cubic-bezier(0.23, 1, 0.32, 1);
}
.row-count-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.row-count {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.03em;
  line-height: 1;
}
.row-unit {
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-30);
}

/* ══════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════ */
@media (max-width: 860px) {
  .rp-root {
    padding: 24px 20px 60px;
  }
  .tab-btn {
    padding: 12px 12px;
    gap: 6px;
  }
  .tab-sub {
    display: none;
  }
  .rp-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .rp-header__right {
    width: 100%;
    flex-wrap: wrap;
  }
  .panel {
    padding: 20px 16px 12px;
  }
  .rank-row {
    grid-template-columns: 4px 28px 34px 1fr auto;
    gap: 8px;
  }
  .row-bar-track {
    width: 56px;
  }
}

@media (max-width: 560px) {
  .rank-row {
    grid-template-columns: 4px 28px 1fr auto;
  }
  .row-avatar {
    display: none;
  }
  .tab-label {
    font-size: 0.72rem;
  }
}

/* ══════════════════════════════════════════════
   EDIT BUTTON
══════════════════════════════════════════════ */
.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #fff;
  color: #0a200b;
  border: 1.5px solid rgba(10, 32, 11, 0.15);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(10, 32, 11, 0.07);
  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.18s;
}
.edit-btn:hover {
  background: #f9f6f0;
  border-color: rgba(10, 32, 11, 0.3);
  transform: translateY(-2px);
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 32, 9, 0.55);
  backdrop-filter: blur(3px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-sheet {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(6, 32, 9, 0.28);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(10, 32, 11, 0.08);
  flex-shrink: 0;
}
.modal-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.modal-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(27, 94, 32, 0.1);
  color: #1b5e20;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.modal-title {
  font-size: 0.95rem;
  font-weight: 900;
  color: #0a200b;
  margin: 0 0 2px;
  letter-spacing: -0.01em;
}
.modal-sub {
  font-size: 0.65rem;
  color: rgba(10, 32, 11, 0.45);
  margin: 0;
  font-weight: 500;
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(10, 32, 11, 0.06);
  color: rgba(10, 32, 11, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover {
  background: rgba(10, 32, 11, 0.12);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-body::-webkit-scrollbar {
  width: 4px;
}
.modal-body::-webkit-scrollbar-thumb {
  background: rgba(10, 32, 11, 0.1);
  border-radius: 4px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label {
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10, 32, 11, 0.45);
}
.field-input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid rgba(10, 32, 11, 0.12);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #0a200b;
  background: #fafaf8;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: #1b5e20;
  box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
}

.tab-toggle {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tt-btn {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(10, 32, 11, 0.12);
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(10, 32, 11, 0.5);
  cursor: pointer;
  transition: all 0.15s;
}
.tt-btn--on {
  background: #0a200b;
  color: #fff;
  border-color: #0a200b;
}

.rows-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-row-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 7px;
  border: 1.5px solid rgba(27, 94, 32, 0.3);
  background: rgba(27, 94, 32, 0.06);
  color: #1b5e20;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s;
}
.add-row-btn:hover {
  background: rgba(27, 94, 32, 0.12);
}

.edit-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 2px;
}
.edit-rows::-webkit-scrollbar {
  width: 3px;
}
.edit-rows::-webkit-scrollbar-thumb {
  background: rgba(10, 32, 11, 0.1);
  border-radius: 3px;
}

.edit-row {
  display: grid;
  grid-template-columns: 22px 1fr 100px 72px 28px;
  align-items: center;
  gap: 6px;
}
.er-num {
  font-size: 0.62rem;
  font-weight: 900;
  color: rgba(10, 32, 11, 0.3);
  text-align: center;
}
.er-del {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: rgba(200, 40, 40, 0.08);
  color: #c82828;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;
}
.er-del:hover {
  background: rgba(200, 40, 40, 0.18);
}
.empty-rows {
  text-align: center;
  font-size: 0.72rem;
  color: rgba(10, 32, 11, 0.3);
  padding: 20px 0;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid rgba(10, 32, 11, 0.08);
  flex-shrink: 0;
}
.modal-cancel {
  padding: 9px 20px;
  border-radius: 8px;
  border: 1.5px solid rgba(10, 32, 11, 0.12);
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(10, 32, 11, 0.5);
  cursor: pointer;
  transition: background 0.15s;
}
.modal-cancel:hover {
  background: rgba(10, 32, 11, 0.05);
}
.modal-save {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 22px;
  border-radius: 8px;
  border: none;
  background: #0a200b;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.15s;
}
.modal-save:hover {
  background: #1b5e20;
  transform: translateY(-1px);
}
</style>
