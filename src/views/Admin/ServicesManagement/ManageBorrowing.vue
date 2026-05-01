<template>
  <div class="shell" :data-mode="isInHouse ? 'in' : 'out'">
    <!-- Ambient Background -->
    <div class="ambient">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="grid-lines"></div>
    </div>

    <Sidebar />

    <div class="main-panel">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">
            <span class="brand-icon">⬡</span>
          </div>
          <div class="brand-text">
            <span class="brand-name">LIBRARY<em>CORE</em></span>
            <span class="brand-sub">Institutional Monitoring System · v2.0</span>
          </div>
        </div>

        <div class="mode-switcher">
          <button
            class="mode-btn"
            :class="{ active: isInHouse }"
            @click="isInHouse = true"
          >
            <span class="mode-dot"></span>
            In-House
          </button>
          <button
            class="mode-btn"
            :class="{ active: !isInHouse }"
            @click="isInHouse = false"
          >
            <span class="mode-dot"></span>
            Loan Out
          </button>
          <div class="mode-slider" :style="{ transform: isInHouse ? 'translateX(0)' : 'translateX(100%)' }"></div>
        </div>

        <div class="live-badge" :class="{ pulse: activeReaders.length > 0 }">
          <span class="live-dot"></span>
          <span class="live-count">{{ activeReaders.length }}</span>
          <span class="live-label">LIVE</span>
        </div>
      </header>

      <div class="workspace">
        <!-- Scanner Terminal -->
        <aside class="terminal-panel">
          <div class="terminal-header">
            <span class="terminal-title">SCAN TERMINAL</span>
            <div class="terminal-lights">
              <span class="tl red"></span>
              <span class="tl yellow"></span>
              <span class="tl green"></span>
            </div>
          </div>

          <div class="terminal-body">
            <div class="field-group">
              <label class="field-label">
                <span class="field-num">01</span>
                Accession Number
              </label>
              <div class="field-wrap">
                <span class="field-icon">📚</span>
                <input
                  v-model="scanBuffer.accession"
                  ref="bookInput"
                  @keyup.enter="focusStudent"
                  type="text"
                  placeholder="Scan book barcode..."
                  class="field-input"
                />
                <div class="field-glow"></div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">
                <span class="field-num">02</span>
                Student ID
              </label>
              <div class="field-wrap">
                <span class="field-icon">🪪</span>
                <input
                  v-model="scanBuffer.studentId"
                  ref="studentInput"
                  @keyup.enter="handleCheckIn"
                  type="text"
                  placeholder="Scan student ID..."
                  class="field-input"
                />
                <div class="field-glow"></div>
              </div>
            </div>

            <button class="confirm-btn" @click="handleCheckIn">
              <span class="confirm-text">CONFIRM ENTRY</span>
              <span class="confirm-arrow">→</span>
            </button>

            <Transition name="status-pop">
              <div v-if="statusMsg" class="status-msg" :class="statusType">
                <span class="status-icon">{{ statusType === 'error' ? '✕' : '✓' }}</span>
                {{ statusMsg }}
              </div>
            </Transition>

            <!-- Stats row -->
            <div class="stat-row">
              <div class="stat">
                <span class="stat-val">{{ totalToday }}</span>
                <span class="stat-lbl">Today</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-val">{{ activeReaders.length }}</span>
                <span class="stat-lbl">Active</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-val">{{ checkedOut }}</span>
                <span class="stat-lbl">Released</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <section class="data-panel">
          <Transition name="panel-fade" mode="out-in">
            <!-- IN-HOUSE VIEW -->
            <div v-if="isInHouse" key="inhouse" class="data-inner">
              <div class="data-header">
                <div>
                  <h2 class="data-title">Active Reading Sessions</h2>
                  <p class="data-sub">Real-time occupancy · Auto-updated</p>
                </div>
                <div class="data-controls">
                  <input v-model="search" type="text" placeholder="Filter records..." class="search-input" />
                </div>
              </div>

              <div v-if="filteredReaders.length > 0" class="records-table">
                <div class="table-head">
                  <span>Student</span>
                  <span>Accession</span>
                  <span>Classification</span>
                  <span>Time In</span>
                  <span>Duration</span>
                  <span></span>
                </div>

                <TransitionGroup name="row" tag="div" class="table-body">
                  <div
                    v-for="(record, index) in filteredReaders"
                    :key="record.id"
                    class="table-row"
                    :style="{ '--i': index }"
                  >
                    <div class="cell cell-student">
                      <div class="avatar">{{ record.studentId.charAt(0).toUpperCase() }}</div>
                      <span class="student-id">{{ record.studentId }}</span>
                    </div>

                    <div class="cell cell-accession">
                      <span class="accession-badge">#{{ record.accession }}</span>
                    </div>

                    <div class="cell cell-ddc">
                      <span class="ddc-tag" :style="{ '--hue': record.hue }">{{ record.ddc }}</span>
                    </div>

                    <div class="cell cell-time">
                      <span class="time-val">{{ record.timeIn }}</span>
                    </div>

                    <div class="cell cell-duration">
                      <span class="duration-val">{{ getDuration(record.timestamp) }}</span>
                    </div>

                    <div class="cell cell-action">
                      <button class="release-btn" @click="handleCheckOut(record.id)">
                        Release
                      </button>
                    </div>
                  </div>
                </TransitionGroup>
              </div>

              <div v-else class="empty-state">
                <div class="empty-icon">◎</div>
                <p class="empty-title">No Active Sessions</p>
                <p class="empty-sub">Scan a book and student ID to begin tracking</p>
              </div>
            </div>

            <!-- LOAN OUT VIEW -->
            <div v-else key="loanout" class="data-inner loan-placeholder">
              <div class="loan-content">
                <div class="loan-icon">📦</div>
                <h3 class="loan-title">Loan Service</h3>
              </div>
            </div>
          </Transition>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const isInHouse = ref(true)
const bookInput = ref(null)
const studentInput = ref(null)
const statusMsg = ref('')
const statusType = ref('success')
const search = ref('')
const totalToday = ref(0)
const checkedOut = ref(0)
let durationInterval = null
let idCounter = 0

const scanBuffer = reactive({ accession: '', studentId: '' })
const activeReaders = ref([])

const DDC_CLASSES = [
  { label: '000 CS', hue: 200 },
  { label: '100 Philosophy', hue: 270 },
  { label: '300 Social Sci', hue: 30 },
  { label: '500 Pure Sci', hue: 170 },
  { label: '600 Technology', hue: 50 },
  { label: '800 Literature', hue: 320 },
]

const getDDC = () => DDC_CLASSES[Math.floor(Math.random() * DDC_CLASSES.length)]

const getDuration = (ts) => {
  const diff = Math.floor((Date.now() - ts) / 1000)
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${m}m ${s}s`
}

// Force reactivity for duration by ticking
const tick = ref(0)
onMounted(() => {
  durationInterval = setInterval(() => tick.value++, 1000)
  bookInput.value?.focus()
})
onUnmounted(() => clearInterval(durationInterval))

const filteredReaders = computed(() => {
  tick.value // subscribe to tick for duration updates
  if (!search.value) return activeReaders.value
  const q = search.value.toLowerCase()
  return activeReaders.value.filter(r =>
    r.studentId.toLowerCase().includes(q) || r.accession.toLowerCase().includes(q)
  )
})

const showStatus = (msg, type = 'success') => {
  statusMsg.value = msg
  statusType.value = type
  setTimeout(() => statusMsg.value = '', 3000)
}

const focusStudent = () => {
  if (scanBuffer.accession) studentInput.value?.focus()
}

const handleCheckIn = () => {
  if (!scanBuffer.accession || !scanBuffer.studentId) {
    showStatus('Both fields are required.', 'error')
    return
  }
  const ddc = getDDC()
  activeReaders.value.unshift({
    id: ++idCounter,
    studentId: scanBuffer.studentId,
    accession: scanBuffer.accession,
    ddc: ddc.label,
    hue: ddc.hue,
    timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: Date.now(),
  })
  totalToday.value++
  showStatus('Entry recorded successfully.')
  scanBuffer.accession = ''
  scanBuffer.studentId = ''
  bookInput.value?.focus()
}

const handleCheckOut = (id) => {
  activeReaders.value = activeReaders.value.filter(r => r.id !== id)
  checkedOut.value++
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

/* ── Reset & Root ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.shell {
  --c-bg:       #ffffff;
  --c-surface:  #012d16;
  --c-border:   rgba(74,183,100,0.12);
  --c-text:     #4c8554;
  --c-muted:    rgb(45, 222, 122);
  --c-accent:   #3ddc6e;
  --c-accent2:  #a3f0b0;
  --c-danger:   #ff5f6d;
  --f-display:  'Syne', sans-serif;
  --f-body:     'Inter', sans-serif;
  --f-mono:     'DM Mono', monospace;
  --r:          16px;

  display: flex;
  min-height: 100vh;
  background: var(--c-bg);
  color: var(--c-text);
  font-family: var(--f-body);
  position: relative;
  overflow: hidden;
}

/* ── Ambient Background ─────────────────────────────── */
.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #1a6b35, transparent 70%);
  top: -200px; left: -100px;
  animation: drift1 20s ease-in-out infinite alternate;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #0e4d22, transparent 70%);
  bottom: -150px; right: -100px;
  animation: drift2 25s ease-in-out infinite alternate;
}
@keyframes drift1 { to { transform: translate(80px, 60px); } }
@keyframes drift2 { to { transform: translate(-60px, -80px); } }

.grid-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(61,220,110,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61,220,110,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Main Panel ─────────────────────────────────────── */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 0 2rem;
}

/* ── Topbar ─────────────────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--c-border);
  gap: 1.5rem;
}

.brand { display: flex; align-items: center; gap: 0.875rem; }

.brand-mark {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
  border-radius: 10px;
  display: grid; place-items: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.brand-name {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.05em;
  display: block;
  line-height: 1;
}
.brand-name em {
  font-style: normal;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.brand-sub {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--c-muted);
  text-transform: uppercase;
  display: block;
  margin-top: 3px;
}

/* Mode switcher */
.mode-switcher {
  display: flex;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 999px;
  padding: 4px;
  position: relative;
  gap: 0;
}
.mode-btn {
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  color: var(--c-muted);
  padding: 0.45rem 1.25rem;
  border-radius: 999px;
  font-family: var(--f-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color 0.25s;
  display: flex; align-items: center; gap: 0.4rem;
}
.mode-btn.active { color: #050d08; }
.mode-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}
.mode-slider {
  position: absolute;
  width: calc(50% - 4px);
  top: 4px; bottom: 4px; left: 4px;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent2));
  border-radius: 999px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
}

/* Live badge */
.live-badge {
  display: flex; align-items: center; gap: 0.45rem;
  background: rgba(79,255,176,0.07);
  border: 1px solid rgba(79,255,176,0.2);
  border-radius: 999px;
  padding: 0.4rem 1rem;
}
.live-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
}
.live-badge.pulse .live-dot {
  animation: livepulse 1.5s ease infinite;
  box-shadow: 0 0 0 0 var(--c-accent);
}
@keyframes livepulse {
  0%   { box-shadow: 0 0 0 0 rgba(61,220,110,0.5); }
  70%  { box-shadow: 0 0 0 7px rgba(61,220,110,0); }
  100% { box-shadow: 0 0 0 0 rgba(61,220,110,0); }
}
.live-count {
  font-family: var(--f-mono);
  font-size: 0.85rem;
  color: var(--c-accent);
  font-weight: 500;
}
.live-label {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--c-muted);
  text-transform: uppercase;
}

/* ── Workspace ──────────────────────────────────────── */
.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0 2rem;
  min-height: 0;
}

/* ── Terminal Panel ─────────────────────────────────── */
.terminal-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-self: start;
  position: sticky;
  top: 1.5rem;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--c-border);
  background: rgba(255,255,255,0.02);
}
.terminal-title {
  font-family: var(--f-mono);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--c-muted);
}
.terminal-lights { display: flex; gap: 6px; }

.terminal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.1rem; }

.field-group { display: flex; flex-direction: column; gap: 0.5rem; }
.field-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--c-muted);
  text-transform: uppercase;
  display: flex; align-items: center; gap: 0.5rem;
}
.field-num {
  background: rgba(79,255,176,0.1);
  color: var(--c-accent);
  font-family: var(--f-mono);
  font-size: 0.6rem;
  padding: 1px 6px;
  border-radius: 4px;
}
.field-wrap {
  position: relative;
  display: flex; align-items: center;
}
.field-icon {
  position: absolute;
  left: 0.875rem;
  font-size: 0.9rem;
  pointer-events: none;
  z-index: 1;
}
.field-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.7rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  color: var(--c-text);
  font-family: var(--f-mono);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.field-input::placeholder { color: rgba(255,255,255,0.15); }
.field-input:focus {
  border-color: var(--c-accent);
  background: rgba(253, 253, 253, 0.04);
}
.field-glow {
  position: absolute; inset: 0;
  border-radius: 10px;
  pointer-events: none;
  transition: box-shadow 0.2s;
}
.field-input:focus ~ .field-glow {
  box-shadow: 0 0 0 3px rgba(61,220,110,0.15);
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent2));
  border: none;
  border-radius: 10px;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: #050d08;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 0.25rem;
}
.confirm-btn:hover { opacity: 0.9; }
.confirm-btn:active { transform: scale(0.98); }
.confirm-arrow { font-size: 1rem; }

.status-msg {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.65rem 0.875rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.status-msg.success {
  background: rgba(79,255,176,0.1);
  border: 1px solid rgba(79,255,176,0.2);
  color: var(--c-accent);
}
.status-msg.error {
  background: rgba(255,79,114,0.1);
  border: 1px solid rgba(255,79,114,0.2);
  color: var(--c-danger);
}
.status-icon {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: currentColor;
  display: grid; place-items: center;
  font-size: 0.55rem;
  color: #080c10;
  flex-shrink: 0;
  font-weight: 900;
}

.stat-row {
  display: flex;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  gap: 0;
}
.stat {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.stat-val {
  font-family: var(--f-display);
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.stat-lbl {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-muted);
}
.stat-divider {
  width: 1px;
  background: var(--c-border);
  margin: 4px 0;
}

/* ── Data Panel ─────────────────────────────────────── */
.data-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.data-inner { display: flex; flex-direction: column; height: 100%; }

.data-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--c-border);
  gap: 1rem;
  background: rgba(255,255,255,0.02);
}
.data-title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.02em;
}
.data-sub {
  font-size: 0.65rem;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2px;
}

.search-input {
  padding: 0.55rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  color: var(--c-text);
  font-family: var(--f-body);
  font-size: 0.8rem;
  outline: none;
  width: 200px;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--c-accent); }
.search-input::placeholder { color: rgba(255,255,255,0.2); }

/* Table */
.records-table { flex: 1; overflow-y: auto; }

.table-head {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 1.2fr 1.2fr 1fr;
  padding: 0.75rem 1.75rem;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-muted);
}

.table-body { display: flex; flex-direction: column; }

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 1.2fr 1.2fr 1fr;
  padding: 0.875rem 1.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  align-items: center;
  transition: background 0.2s;
  animation: rowIn 0.4s ease both;
  animation-delay: calc(var(--i) * 0.04s);
}
.table-row:hover { background: rgba(61,220,110,0.035); }
@keyframes rowIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cell { font-size: 0.85rem; }

.cell-student { display: flex; align-items: center; gap: 0.65rem; }
.avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(61,220,110,0.18), rgba(163,240,176,0.12));
  border: 1px solid rgba(61,220,110,0.25);
  display: grid; place-items: center;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--c-accent);
  flex-shrink: 0;
}
.student-id { font-weight: 600; }

.accession-badge {
  font-family: var(--f-mono);
  font-size: 0.78rem;
  color: var(--c-muted);
  background: rgba(255,255,255,0.04);
  padding: 3px 8px;
  border-radius: 5px;
  border: 1px solid var(--c-border);
}

.ddc-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: hsla(var(--hue), 70%, 50%, 0.12);
  border: 1px solid hsla(var(--hue), 70%, 50%, 0.25);
  color: hsla(var(--hue), 90%, 75%, 1);
  white-space: nowrap;
}

.time-val {
  font-family: var(--f-mono);
  font-size: 0.78rem;
  color: var(--c-muted);
}

.duration-val {
  font-family: var(--f-mono);
  font-size: 0.78rem;
  color: var(--c-accent2);
}

.release-btn {
  padding: 0.35rem 0.875rem;
  border-radius: 6px;
  border: 1px solid rgba(255,79,114,0.3);
  background: rgba(255,79,114,0.08);
  color: var(--c-danger);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
}
.table-row:hover .release-btn { opacity: 1; }
.release-btn:hover {
  background: var(--c-danger);
  color: white;
  border-color: transparent;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.6rem;
  padding: 4rem 2rem;
  opacity: 0.4;
}
.empty-icon {
  font-size: 2.5rem;
  animation: spin 12s linear infinite;
  display: block;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.05em;
}
.empty-sub {
  font-size: 0.75rem;
  color: var(--c-muted);
}

/* Loan Out Placeholder */
.loan-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loan-content {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  text-align: center;
}
.loan-icon { font-size: 3rem; filter: grayscale(1); opacity: 0.4; }
.loan-title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
}
.loan-sub { font-size: 0.8rem; color: var(--c-muted); }
.loan-progress {
  width: 220px; height: 3px;
  background: var(--c-border);
  border-radius: 99px;
  overflow: hidden;
  margin-top: 0.5rem;
}
.loan-bar {
  height: 100%;
  width: 73%;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent2));
  border-radius: 99px;
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
.loan-pct {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  color: var(--c-muted);
}

/* ── Transitions ────────────────────────────────────── */
.status-pop-enter-active, .status-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.status-pop-enter-from { opacity: 0; transform: translateY(6px) scale(0.96); }
.status-pop-leave-to  { opacity: 0; transform: translateY(-4px) scale(0.96); }

.panel-fade-enter-active, .panel-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.panel-fade-enter-from { opacity: 0; transform: translateX(12px); }
.panel-fade-leave-to   { opacity: 0; transform: translateX(-12px); }

.row-enter-active { transition: all 0.35s ease; }
.row-leave-active { transition: all 0.25s ease; position: absolute; width: 100%; }
.row-enter-from   { opacity: 0; transform: translateX(-20px); }
.row-leave-to     { opacity: 0; transform: translateX(20px); }

/* ── Scrollbar ──────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(61,220,110,0.18); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(61,220,110,0.35); }
</style>