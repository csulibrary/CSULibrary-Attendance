<template>
  <div class="page-layout">
    <Sidebar :activeTab="'SERVICES'" />

    <main class="portal-root">
      <div class="glow-spot-left"></div>
      <div class="glow-spot-right"></div>

      <div class="dashboard-wrapper">
        <header class="dashboard-header">
          <div class="branding-group">
            <div class="header-breadcrumb !mb-2">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>SERVICES</span>
            </div>

            <h1 class="portal-main-title">
              <span class="word-forest word-underlined">Library</span>
              <span class="word-mustard"> Services</span>
            </h1>

            <p class="portal-subtitle">
              Comprehensive overview of institutional engagement and borrowing patterns
            </p>
          </div>
        </header>

        <section class="nav-bento-grid">
          <!-- ── HERO: Room Reservation ── -->
          <div class="bento-card card-hero">
            <div class="hero-noise"></div>
            <div class="hero-glow"></div>
            <div class="hero-inner">
              <div class="hero-top">
                <span class="hero-tag">
                  <span class="hero-tag-dot"></span>
                  FACILITY MANAGEMENT
                </span>
                <div class="hero-bars">
                  <div class="hbar" style="height: 35%"></div>
                  <div class="hbar" style="height: 60%"></div>
                  <div class="hbar" style="height: 45%"></div>
                  <div class="hbar accent" style="height: 85%"></div>
                  <div class="hbar" style="height: 55%"></div>
                </div>
              </div>

              <div class="hero-body">
                <h2 class="hero-title">Room<br /><em>Reservation</em></h2>
                <p class="hero-desc">
                  Control campus facility availability, approve pending requests, and manage
                  hardware allocation.
                </p>
              </div>

              <div class="hero-stats-row">
                <div class="hstat">
                  <span class="hstat-n">24</span>
                  <span class="hstat-l">Rooms</span>
                </div>
                <div class="hstat-divider"></div>
                <div class="hstat">
                  <span class="hstat-n">8</span>
                  <span class="hstat-l">Pending</span>
                </div>
                <div class="hstat-divider"></div>
                <div class="hstat">
                  <span class="hstat-n">3</span>
                  <span class="hstat-l">Today</span>
                </div>
              </div>

              <button class="hero-cta" @click="router.push('/admin/services/reservations')">
                <span>MANAGE ROOMS</span>
                <div class="hero-cta-icon">
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 10 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- ── CURRICULUM ── -->
          <div class="bento-card card-curriculum">
            <div class="cur-inner">
              <div class="cur-head">
                <div class="cur-icon-wrap">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path
                      d="M12 14l6.16-3.422A12.083 12.083 0 0 1 18.818 17.5L12 20.055l-6.818-2.555A12.083 12.083 0 0 1 5.84 10.578L12 14z"
                    />
                    <path d="M12 14v7" />
                  </svg>
                </div>
                <span class="cur-eyebrow">BORROWING</span>
              </div>

              <div class="cur-number">348</div>
              <div class="cur-label">Active Subjects</div>
              <div class="cur-meta">
                <span class="cur-up">↑ 1.8%</span>
                <span class="cur-since">vs last semester</span>
              </div>

              <div class="cur-track">
                <div class="cur-fill forest" style="width: 60%"></div>
                <div class="cur-fill mustard" style="width: 28%"></div>
                <div class="cur-fill faint" style="width: 12%"></div>
              </div>

              <div class="cur-tags">
                <span class="cur-tag">Undergraduate</span>
                <span class="cur-tag cur-tag--gold">Graduate</span>
              </div>

              <button class="cur-cta" @click="router.push('/admin/services/borrowing')">
                MANAGE BORROWING
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');

/* --- PAGE STRUCTURE --- */
.page-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f9fbfb;
}
.portal-root {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-y: auto;
  font-family: 'Poppins', sans-serif;
}
.dashboard-wrapper {
  width: 100%;
  max-width: 1400px;
  padding: 2rem 2rem 4rem;
  z-index: 10;
  position: relative;
}

/* --- HEADER --- */
.dashboard-header {
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}
.path-navigation {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 1.2rem;
}
.path-chevron {
  width: 12px;
  height: 12px;
  color: #cbd5e1;
}
.active-path {
  font-size: 11px;
  font-weight: 800;
  color: #0d2b0f;
}
.portal-main-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0;
  display: inline-block;
}
.word-forest {
  color: #0d2b0f;
}
.word-mustard {
  color: #e6a800;
}
.word-underlined {
  position: relative;
  display: inline-block;
}
.word-underlined::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #0d2b0f, #e6a800);
  border-radius: 3px;
}
.portal-subtitle {
  font-size: 0.95rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
}

/* ══ BENTO GRID ══ */
.nav-bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 340px 280px;
  gap: 20px;
}

.card-hero {
  grid-column: 1 / 4;
  grid-row: 1;
}

/* ── HERO CARD ── */
.card-hero {
  background: linear-gradient(150deg, #0a2010 0%, #122b14 50%, #0d2b0f 100%);
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(13, 43, 15, 0.28);
  transition:
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.45s;
}
.card-hero:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 60px rgba(13, 43, 15, 0.35);
}
.hero-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  background-size: 150px;
  opacity: 0.4;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(230, 168, 0, 0.1) 0%, transparent 65%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 32px 44px;
  display: grid;
  grid-template-columns: 1fr 1fr 280px;
  grid-template-rows: auto 1fr auto;
  column-gap: 40px;
  box-sizing: border-box;
}
.hero-top {
  grid-column: 1 / 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.hero-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.35);
}
.hero-tag-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 8px #4caf50;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.hero-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 32px;
}
.hbar {
  width: 5px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.hbar.accent {
  background: #e6a800;
}
.hero-body {
  grid-column: 1 / 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1;
  color: white;
  margin: 0 0 14px;
  letter-spacing: -0.02em;
}
.hero-title em {
  font-style: italic;
  color: #facc15;
}
.hero-desc {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.75;
  max-width: 300px;
}
.hero-stats-row {
  grid-column: 3;
  grid-row: 2 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
  gap: 14px;
  margin-bottom: 0;
  align-self: stretch;
}
.hstat {
  flex: unset;
  text-align: center;
  width: 100%;
}
.hstat-n {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 1.7rem;
  font-weight: 900;
  color: white;
  line-height: 1;
  letter-spacing: -0.03em;
}
.hstat-l {
  display: block;
  font-size: 0.58rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-top: 3px;
}
.hstat-divider {
  width: 80%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
.hero-cta {
  grid-column: 1 / 3;
  grid-row: 3;
  align-self: end;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  height: 50px;
  padding: 0 8px 0 24px;
  background: #facc15;
  color: #0d2b0f;
  border-radius: 16px;
  margin-top: 1.5%;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(250, 204, 21, 0.3);
}
.hero-cta:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(250, 204, 21, 0.2);
}
.hero-cta-icon {
  width: 42px;
  height: 42px;
  background: rgba(13, 43, 15, 0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── RECORDS CARD ── */
.card-records {
  background: white;
  border-radius: 32px;
  border: 1px solid rgba(13, 43, 15, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.45s;
}
.card-records:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(13, 43, 15, 0.1);
}
.rec-inner {
  padding: 28px 32px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.rec-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.rec-icon-wrap {
  width: 38px;
  height: 38px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d2b0f;
}
.rec-eyebrow {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #e6a800;
  background: rgba(230, 168, 0, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}
.rec-number {
  font-family: 'Poppins', sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
  color: #0d2b0f;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 4px;
}
.rec-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.rec-up {
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 3px 8px;
  border-radius: 6px;
}
.rec-since {
  font-size: 0.68rem;
  color: #94a3b8;
}
.rec-track {
  display: flex;
  height: 5px;
  border-radius: 10px;
  overflow: hidden;
  gap: 2px;
  margin-bottom: 0;
}
.rec-fill {
  border-radius: 10px;
  height: 100%;
}
.rec-fill.forest {
  background: #0d2b0f;
}
.rec-fill.mustard {
  background: #e6a800;
}
.rec-fill.faint {
  background: #e2e8f0;
}
.rec-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  width: 100%;
  height: 44px;
  padding: 0 18px;
  background: #0d2b0f;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s;
}
.rec-cta:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(13, 43, 15, 0.25);
}

/* ── CURRICULUM CARD ── */
.card-curriculum {
  background: white;
  border-radius: 32px;
  border: 1px solid rgba(13, 43, 15, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.45s;
}
.card-curriculum:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(13, 43, 15, 0.1);
}
.cur-inner {
  padding: 28px 32px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cur-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.cur-icon-wrap {
  width: 38px;
  height: 38px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d2b0f;
}
.cur-eyebrow {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #e6a800;
  background: rgba(230, 168, 0, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}
.cur-number {
  font-family: 'Poppins', sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
  color: #0d2b0f;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2px;
}
.cur-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(13, 43, 15, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 4px;
}
.cur-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.cur-up {
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 3px 8px;
  border-radius: 6px;
}
.cur-since {
  font-size: 0.68rem;
  color: #94a3b8;
}
.cur-track {
  display: flex;
  height: 5px;
  border-radius: 10px;
  overflow: hidden;
  gap: 2px;
  margin-bottom: 8px;
}
.cur-fill {
  border-radius: 10px;
  height: 100%;
}
.cur-fill.forest {
  background: #0d2b0f;
}
.cur-fill.mustard {
  background: #e6a800;
}
.cur-fill.faint {
  background: #e2e8f0;
}
.cur-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 0;
  flex-wrap: wrap;
}
.cur-tag {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(13, 43, 15, 0.06);
  color: #0d2b0f;
}
.cur-tag--gold {
  background: rgba(230, 168, 0, 0.1);
  color: #c8930a;
}
.cur-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  width: 100%;
  height: 44px;
  padding: 0 18px;
  background: #0d2b0f;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s;
}
.cur-cta:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(13, 43, 15, 0.25);
}

/* ── GALLERY CARD ── */
.card-gal {
  background: white;
  border-radius: 32px;
  border: 1px solid rgba(13, 43, 15, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.45s;
}
.card-gal:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(13, 43, 15, 0.1);
}
.gal-inner {
  padding: 28px 32px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.gal-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.gal-icon-wrap {
  width: 38px;
  height: 38px;
  background: rgba(13, 43, 15, 0.06);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d2b0f;
}
.gal-eyebrow {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #e6a800;
  background: rgba(230, 168, 0, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}
.gal-number {
  font-family: 'Poppins', sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
  color: #0d2b0f;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2px;
}
.gal-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(13, 43, 15, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 4px;
}
.gal-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.gal-up {
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 3px 8px;
  border-radius: 6px;
}
.gal-since {
  font-size: 0.68rem;
  color: #94a3b8;
}
.gal-track {
  display: flex;
  height: 5px;
  border-radius: 10px;
  overflow: hidden;
  gap: 2px;
  margin-bottom: 8px;
}
.gal-fill {
  border-radius: 10px;
  height: 100%;
}
.gal-fill.forest {
  background: #0d2b0f;
}
.gal-fill.mustard {
  background: #e6a800;
}
.gal-fill.faint {
  background: #e2e8f0;
}
.gal-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 0;
  flex-wrap: wrap;
}
.gal-tag {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(13, 43, 15, 0.06);
  color: #0d2b0f;
}
.gal-tag--gold {
  background: rgba(230, 168, 0, 0.1);
  color: #c8930a;
}
.gal-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  width: 100%;
  height: 44px;
  padding: 0 18px;
  background: #0d2b0f;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s;
}
.gal-cta:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(13, 43, 15, 0.25);
}

/* =========================
   PAGE ENTER ANIMATIONS
========================= */

.dashboard-header,
.card-hero,
.card-records,
.card-curriculum,
.card-gal {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(6px);
  animation: servicesFadeUp 0.7s ease forwards;
  will-change: opacity, transform, filter;
}

.dashboard-header {
  animation-delay: 0.08s;
}

.card-hero {
  animation-delay: 0.18s;
}

.card-records {
  animation-delay: 0.3s;
}

.card-curriculum {
  animation-delay: 0.4s;
}

.card-gal {
  animation-delay: 0.5s;
}

/* inner hero content stagger */
.hero-tag,
.hero-bars,
.hero-title,
.hero-desc,
.hero-stats-row,
.hero-cta {
  opacity: 0;
  transform: translateY(16px);
  animation: servicesFadeUpSoft 0.55s ease forwards;
}

.hero-tag {
  animation-delay: 0.28s;
}

.hero-bars {
  animation-delay: 0.34s;
}

.hero-title {
  animation-delay: 0.4s;
}

.hero-desc {
  animation-delay: 0.48s;
}

.hero-stats-row {
  animation-delay: 0.56s;
}

.hero-cta {
  animation-delay: 0.64s;
}

/* smaller cards content reveal */
.rec-head,
.rec-number,
.rec-meta,
.rec-track,
.rec-cta,
.cur-head,
.cur-number,
.cur-label,
.cur-meta,
.cur-track,
.cur-tags,
.cur-cta,
.gal-head,
.gal-number,
.gal-label,
.gal-meta,
.gal-track,
.gal-tags,
.gal-cta {
  opacity: 0;
  transform: translateY(12px);
  animation: servicesFadeUpSoft 0.5s ease forwards;
}

.rec-head { animation-delay: 0.38s; }
.rec-number { animation-delay: 0.44s; }
.rec-meta { animation-delay: 0.5s; }
.rec-track { animation-delay: 0.56s; }
.rec-cta { animation-delay: 0.62s; }

.cur-head { animation-delay: 0.48s; }
.cur-number { animation-delay: 0.54s; }
.cur-label { animation-delay: 0.58s; }
.cur-meta { animation-delay: 0.62s; }
.cur-track { animation-delay: 0.68s; }
.cur-tags { animation-delay: 0.74s; }
.cur-cta { animation-delay: 0.8s; }

.gal-head { animation-delay: 0.58s; }
.gal-number { animation-delay: 0.64s; }
.gal-label { animation-delay: 0.68s; }
.gal-meta { animation-delay: 0.72s; }
.gal-track { animation-delay: 0.78s; }
.gal-tags { animation-delay: 0.84s; }
.gal-cta { animation-delay: 0.9s; }

/* optional glow entrance */
.glow-spot-left,
.glow-spot-right {
  opacity: 0;
  animation: servicesGlowIn 1s ease forwards;
}

.glow-spot-left {
  animation-delay: 0.15s;
}

.glow-spot-right {
  animation-delay: 0.25s;
}

/* smoother hover feel */
.card-hero,
.card-records,
.card-curriculum,
.card-gal {
  backface-visibility: hidden;
  transform-origin: center;
}

/* =========================
   KEYFRAMES
========================= */

@keyframes servicesFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
    filter: blur(1px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes servicesFadeUpSoft {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes servicesGlowIn {
  from {
    opacity: 0;
    transform: scale(0.92);
    filter: blur(1px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}
</style>
