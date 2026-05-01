<template>
  <div class="page-shell">
    <div class="sticky top-0 h-screen">
      <Sidebar :activeTab="'PERSONNEL'" @updateActiveTab="handleTabChange" />
    </div>

    <div class="page-scroll">
      <header class="attn-header">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="header-breadcrumb !mb-3">
            <span>Admin</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>User Management</span>
          </div>
        </div>
        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">User</span>
          <span class="hero-word-gold"> Management</span>
        </h1>
        <p class="hero-subtitle">Manage and review all registered users and their roles.</p>
      </header>

      <div v-if="isAuthorized" class="content-grid">
        <!-- USER MANAGEMENT -->
        <div class="panel" style="--delay: 0.05s">
          <div class="panel-eyebrow">User Management</div>
          <div class="action-list">
            <button
              v-for="(btn, i) in userButtons"
              :key="i"
              :class="['action-btn', `action-btn--${btn.color}`]"
              :style="`--btn-delay: ${0.15 + i * 0.07}s`"
              @click="$router.push(btn.route)"
            >
              <span class="action-icon" v-html="btn.icon" />
              <div class="action-text">
                <span class="action-title">{{ btn.title }}</span>
                <span class="action-desc">{{ btn.desc }}</span>
              </div>
              <svg
                class="action-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ROLE & ACCESS -->
        <div class="panel" style="--delay: 0.12s">
          <div class="panel-eyebrow">Role &amp; Access Control</div>
          <div class="action-list">
            <button
              v-for="(btn, i) in roleButtons"
              :key="i"
              :class="['action-btn', `action-btn--${btn.color}`]"
              :style="`--btn-delay: ${0.2 + i * 0.07}s`"
              @click="$router.push(btn.route)"
            >
              <span class="action-icon" v-html="btn.icon" />
              <div class="action-text">
                <span class="action-title">{{ btn.title }}</span>
                <span class="action-desc">{{ btn.desc }}</span>
              </div>
              <svg
                class="action-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ADMIN SETTINGS -->
        <div class="panel panel--wide" style="--delay: 0.22s">
          <div class="panel-eyebrow">Admin Settings</div>
          <div class="settings-row">
            <button
              v-for="(tile, i) in settingsTiles"
              :key="i"
              class="settings-tile"
              :style="`--tile-delay: ${0.3 + i * 0.08}s`"
              @click="$router.push(tile.route)"
            >
              <span :class="['tile-icon', `tile-icon--${tile.iconStyle}`]" v-html="tile.icon" />
              <span class="tile-label">{{ tile.label }}</span>
              <span class="tile-desc">{{ tile.desc }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="unauthorized">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p>You are not authorized to view this page.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const user = { role: 'admin' }
const isAuthorized = computed(() => ['admin', 'super_admin'].includes(user.role))
const handleTabChange = (tab: string) => console.log('Switched to:', tab)

const iconUsers = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const iconAddUser = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`
const iconStatus = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`
const iconShield = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const iconAssign = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11l-4 4-2-2"/></svg>`
const iconLock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const iconGear = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
const iconFile = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
const iconBackup = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`

const userButtons = [
  {
    color: 'primary',
    route: '/admin/management/view-users',
    title: 'View All Users',
    desc: 'Browse and manage registered accounts',
    icon: iconUsers,
  },
  // {
  //   color: 'success',
  //   route: '/admin/personnel/users/add',
  //   title: 'Add New User',
  //   desc: 'Register a new personnel account',
  //   icon: iconAddUser,
  // },
  {
    color: 'warning',
    route: '/admin/management/activation',
    title: 'Activate / Deactivate',
    desc: 'Toggle user account status',
    icon: iconStatus,
  },
]

const roleButtons = [
  {
    color: 'purple',
    route: '/admin/management/roles',
    title: 'Manage Roles',
    desc: 'Create and edit system roles',
    icon: iconShield,
  },
  {
    color: 'gold',
    route: '/admin/management/permission',
    title: 'Set Permissions',
    desc: 'Define granular access rights',
    icon: iconLock,
  },
]

const settingsTiles = [
  // {
  //   route: '/admin/settings/system',
  //   label: 'System Settings',
  //   desc: 'Configure core preferences',
  //   iconStyle: 'dark',
  //   icon: iconGear,
  // },
  // {
  //   route: '/admin/settings/audit',
  //   label: 'Audit Logs',
  //   desc: 'Review system activity',
  //   iconStyle: 'mid',
  //   icon: iconFile,
  // },
  {
    route: '/admin/settings/backup',
    label: 'Backup',
    desc: 'Safeguard system data',
    iconStyle: 'dark',
    icon: iconBackup,
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes underlineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.page-shell {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  background: #edefed;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

.page-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 44px 80px;
  box-sizing: border-box;
}
.page-scroll::-webkit-scrollbar {
  width: 5px;
}
.page-scroll::-webkit-scrollbar-thumb {
  background: rgba(6, 32, 9, 0.1);
  border-radius: 5px;
}

/* HEADER */
.attn-header {
  margin-bottom: 32px;
  animation: fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 0.7rem;
  font-weight: 1000;
  color: rgba(6, 32, 9, 0.38);
  letter-spacing: 0.04em;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  display: inline-block;
}
.hero-word-dark {
  color: #062009;
}
.hero-word-gold {
  color: #c8930a;
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
}
.hero-underlined {
  position: relative;
  display: inline-block;
}
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #062009, #f9a825);
  border-radius: 3px;
  transform-origin: left;
  animation: underlineGrow 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}
.hero-subtitle {
  font-size: 0.82rem;
  color: #6b7280;
  margin-top: 16px;
}

/* GRID */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

/* PANEL */
.panel {
  background: white;
  border: 1px solid rgba(6, 32, 9, 0.07);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 2px 12px rgba(6, 32, 9, 0.05);
  animation: panelIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s) both;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.panel:hover {
  box-shadow: 0 6px 24px rgba(6, 32, 9, 0.09);
  transform: translateY(-1px);
}
.panel--wide {
  grid-column: 1 / -1;
}

.panel-eyebrow {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #c8930a;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1.5px solid #f5edda;
}

/* ACTION BUTTONS */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid transparent;
  cursor: pointer;
  text-align: left;
  background: #f7f8f5;
  transition:
    background 0.18s,
    border-color 0.18s,
    transform 0.15s,
    box-shadow 0.18s;
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) var(--btn-delay, 0.1s) both;
}
.action-btn:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 14px rgba(6, 32, 9, 0.08);
}
.action-btn:active {
  transform: translateX(0);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
}
.action-icon svg {
  width: 17px;
  height: 17px;
}
.action-icon :deep(svg) {
  width: 17px;
  height: 17px;
}

.action-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1px;
}
.action-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #062009;
  line-height: 1.2;
}
.action-desc {
  font-size: 0.66rem;
  color: #9ba390;
  font-weight: 400;
}

.action-arrow {
  width: 14px;
  height: 14px;
  opacity: 0.25;
  flex-shrink: 0;
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.action-btn:hover .action-arrow {
  opacity: 0.6;
  transform: translateX(2px);
}

/* Button color variants */
.action-btn--primary {
  border-color: rgba(59, 130, 246, 0.15);
}
.action-btn--primary .action-icon {
  background: #eff6ff;
  color: #3b82f6;
}
.action-btn--primary:hover {
  background: #eff6ff;
  border-color: rgba(59, 130, 246, 0.3);
}

.action-btn--success {
  border-color: rgba(6, 32, 9, 0.08);
}
.action-btn--success .action-icon {
  background: #f0fdf4;
  color: #16a34a;
}
.action-btn--success:hover {
  background: #f0fdf4;
  border-color: rgba(22, 163, 74, 0.25);
}

.action-btn--warning {
  border-color: rgba(245, 158, 11, 0.15);
}
.action-btn--warning .action-icon {
  background: #fffbeb;
  color: #d97706;
}
.action-btn--warning:hover {
  background: #fffbeb;
  border-color: rgba(217, 119, 6, 0.3);
}

.action-btn--purple {
  border-color: rgba(139, 92, 246, 0.15);
}
.action-btn--purple .action-icon {
  background: #f5f3ff;
  color: #7c3aed;
}
.action-btn--purple:hover {
  background: #f5f3ff;
  border-color: rgba(124, 58, 237, 0.3);
}

.action-btn--indigo {
  border-color: rgba(99, 102, 241, 0.15);
}
.action-btn--indigo .action-icon {
  background: #eef2ff;
  color: #4f46e5;
}
.action-btn--indigo:hover {
  background: #eef2ff;
  border-color: rgba(79, 70, 229, 0.3);
}

.action-btn--gold {
  border-color: rgba(200, 147, 10, 0.15);
}
.action-btn--gold .action-icon {
  background: #fef9ee;
  color: #c8930a;
}
.action-btn--gold:hover {
  background: #fef9ee;
  border-color: rgba(200, 147, 10, 0.35);
}

/* SETTINGS TILES */
.settings-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.settings-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid rgba(6, 32, 9, 0.08);
  background: #f7f8f5;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.18s,
    border-color 0.18s,
    transform 0.15s,
    box-shadow 0.18s;
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) var(--tile-delay, 0.3s) both;
}
.settings-tile:hover {
  background: #062009;
  border-color: #062009;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 32, 9, 0.2);
}
.settings-tile:hover .tile-icon,
.settings-tile:hover .tile-label,
.settings-tile:hover .tile-desc {
  color: white;
}
.settings-tile:hover .tile-icon--dark,
.settings-tile:hover .tile-icon--mid {
  background: rgba(255, 255, 255, 0.15);
}
.settings-tile:active {
  transform: translateY(0);
}

.tile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  transition:
    background 0.18s,
    color 0.18s;
}
.tile-icon :deep(svg) {
  width: 17px;
  height: 17px;
}
.tile-icon--dark {
  background: #e8ebe5;
  color: #062009;
}
.tile-icon--mid {
  background: #e8ebe5;
  color: #3d5c40;
}

.tile-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #062009;
  transition: color 0.18s;
}
.tile-desc {
  font-size: 0.64rem;
  color: #9ba390;
  font-weight: 400;
  transition: color 0.18s;
}

/* UNAUTHORIZED */
.unauthorized {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 20px;
  color: #9ba390;
}
.unauthorized svg {
  width: 40px;
  height: 40px;
  opacity: 0.4;
}
.unauthorized p {
  font-size: 0.85rem;
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .panel--wide {
    grid-column: 1;
  }
  .settings-row {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 680px) {
  .page-scroll {
    padding: 20px 16px 60px;
  }
}
</style>
