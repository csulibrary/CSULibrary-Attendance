<template>
  <div class="page-shell">
    <Sidebar :activeTab="'PERSONNEL'" @updateActiveTab="handleTabChange" />

    <main class="page-root">
      <header class="hero">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="header-breadcrumb !mb-3">
            <span>Admin</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Settings Backup</span>
          </div>
        </div>

        <h1 class="header-title intro-title">System <span class="text-yellow-500">Backup</span></h1>
        <p class="hero-subtitle">
          Read-only export of database tables and storage files into one ZIP archive.
        </p>
      </header>

      <section class="backup-grid">
        <article class="backup-card backup-card-main">
          <div class="card-top">
            <div>
              <p class="card-eyebrow">Secure Archive</p>
              <h2 class="card-title">Create Latest Backup</h2>
            </div>
            <span class="stage-pill" :class="`stage-${stage}`">{{ stage }}</span>
          </div>

          <div class="action-row">
            <button class="backup-btn" :disabled="isBackingUp" @click="onDownloadBackup">
              {{ isBackingUp ? 'Preparing Backup...' : 'Download Backup ZIP' }}
            </button>
            <p class="status-text">{{ statusMessage }}</p>
          </div>

          <div class="meter-wrap">
            <div class="meter-label-row">
              <span>ZIP Progress</span>
              <strong>{{ stage === 'zip' ? zipPercent : isBackingUp ? 0 : 100 }}%</strong>
            </div>
            <div class="meter-track">
              <span
                class="meter-fill"
                :style="{ width: `${stage === 'zip' ? zipPercent : isBackingUp ? 8 : 100}%` }"
              ></span>
            </div>
          </div>

          <p v-if="lastError" class="error-text">{{ lastError }}</p>
        </article>

        <article class="backup-card stat-card">
          <p class="stat-label">Tables Exported</p>
          <p class="stat-value">
            {{ completedTables }} <span>/ {{ totalTables }}</span>
          </p>
        </article>

        <article class="backup-card stat-card">
          <p class="stat-label">Storage Files</p>
          <p class="stat-value stat-small">{{ storageProgressText }}</p>
        </article>

        <article class="backup-card stat-card">
          <p class="stat-label">Overall Progress</p>
          <p class="stat-value stat-small">{{ overallProgressText }}</p>
        </article>
      </section>

      <section v-if="warnings.length" class="backup-card warning-card">
        <div class="warn-head">
          <h3>Backup Warnings</h3>
          <span class="warn-count">{{ warnings.length }} item(s)</span>
        </div>
        <ul class="warn-list">
          <li v-for="(warning, idx) in warnings" :key="idx">
            <span class="warn-source">[{{ warning.source }}]</span>
            <span class="warn-name">{{ warning.name }}</span>
            <span class="warn-msg">{{ warning.message }}</span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import { useBackup } from '@/composables/useBackup'

const {
  isBackingUp,
  stage,
  statusMessage,
  lastError,
  completedTables,
  totalTables,
  storageProgressText,
  overallProgressText,
  zipPercent,
  warnings,
  downloadBackup,
} = useBackup()

const onDownloadBackup = async () => {
  await downloadBackup({ fileNamePrefix: 'csu-library-backup' })
}

const handleTabChange = (_tab: string) => {
  // Keep the Sidebar event contract without additional logic here.
}
</script>

<style scoped>
.page-shell {
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at 8% 10%, #f9fbfa 0%, #eef3ef 48%, #e4ece6 100%);
}

.page-root {
  flex: 1;
  padding: 22px 28px 34px;
  overflow-y: auto;
  font-family: 'Poppins', sans-serif;
}

.hero {
  margin-bottom: 18px;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #829184;
  font-weight: 700;
}

.crumb-arrow {
  width: 12px;
  height: 12px;
}

.hero-title {
  margin: 0;
  font-size: clamp(2rem, 3.8vw, 3rem);
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 900;
}

.hero-word-dark {
  color: #0d2b0f;
}

.hero-word-gold {
  color: #e6a800;
}

.hero-subtitle {
  margin: 10px 0 0;
  color: #4f6755;
  font:
    500 0.96rem/1.6 'DM Sans',
    sans-serif;
  max-width: 640px;
}

.backup-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 14px;
}

.backup-card {
  border-radius: 18px;
  border: 1px solid #cdded0;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(13, 43, 15, 0.06);
}

.backup-card-main {
  grid-column: 1 / -1;
  padding: 22px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-eyebrow {
  margin: 0;
  color: #5c7763;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.card-title {
  margin: 8px 0 0;
  color: #0f2a12;
  font-size: 1.35rem;
  font-weight: 800;
}

.stage-pill {
  padding: 6px 12px;
  border-radius: 999px;
  font:
    700 0.73rem/1 'DM Sans',
    sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.stage-idle {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.stage-database,
.stage-storage,
.stage-zip {
  background: #fff7e0;
  color: #a16207;
  border-color: #f3d186;
}

.stage-done {
  background: #e8f7ee;
  color: #166534;
  border-color: #a8d5b8;
}

.stage-error {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fca5a5;
}

.action-row {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.backup-btn {
  border: 1px solid #0d2b0f;
  border-radius: 12px;
  padding: 12px 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #0d2b0f, #1e4f24);
  font:
    700 0.86rem/1 'DM Sans',
    sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.backup-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(13, 43, 15, 0.26);
}

.backup-btn:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.status-text {
  margin: 0;
  color: #4b5f50;
  font:
    600 0.88rem/1.4 'DM Sans',
    sans-serif;
}

.meter-wrap {
  margin-top: 16px;
}

.meter-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  color: #516756;
  font:
    600 0.8rem/1 'DM Sans',
    sans-serif;
}

.meter-track {
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5ece7;
}

.meter-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e6a800, #0f3b15);
  transition: width 0.25s ease;
}

.error-text {
  margin: 12px 0 0;
  color: #b91c1c;
  font:
    600 0.86rem/1.45 'DM Sans',
    sans-serif;
}

.stat-card {
  padding: 18px;
}

.stat-label {
  margin: 0;
  color: #5d7461;
  font:
    700 0.72rem/1 'DM Sans',
    sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stat-value {
  margin: 10px 0 0;
  color: #102813;
  font:
    800 1.7rem/1.1 'Poppins',
    sans-serif;
}

.stat-value span {
  color: #6c8570;
  font-size: 1rem;
  font-weight: 700;
}

.stat-small {
  font-size: 1.08rem;
  line-height: 1.35;
}

.warning-card {
  margin-top: 14px;
  padding: 18px;
  border-color: #f4d899;
  background: #fffdf5;
}

.warn-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.warn-head h3 {
  margin: 0;
  color: #7a4b00;
  font-size: 1.03rem;
  font-weight: 800;
}

.warn-count {
  border-radius: 999px;
  border: 1px solid #f3cf7e;
  padding: 6px 10px;
  background: #fff5d7;
  color: #8a5a08;
  font:
    700 0.72rem/1 'DM Sans',
    sans-serif;
}

.warn-list {
  margin: 12px 0 0;
  padding-left: 18px;
}

.warn-list li {
  margin-bottom: 8px;
  color: #6e4d19;
  font:
    500 0.84rem/1.5 'DM Sans',
    sans-serif;
}

.warn-source {
  margin-right: 6px;
  font-weight: 700;
}

.warn-name {
  margin-right: 6px;
  font-weight: 700;
}

@media (max-width: 980px) {
  .page-root {
    padding: 18px;
  }

  .backup-grid {
    grid-template-columns: 1fr 1fr;
  }

  .backup-card-main {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .backup-grid {
    grid-template-columns: 1fr;
  }

  .card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
