<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f0f4f1]">

    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN CONTENT -->
    <main class="page-root pl-6 mt-5 flex-1 overflow-y-auto">

      <!-- HEADER -->
      <header class="px-6 pt-5 pb-3">
        <div class="header-breadcrumb">
          <button
            class="flex items-center gap-1.5 text-gray-400 hover:text-[#0d2b0f] transition-colors"
            @click="$router.back()"
          >
            <span class="uppercase tracking-widest">Back</span>
          </button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3 text-gray-400">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span class="font-bold text-gray-400">Manage Permission</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">System</span>
          <span class="hero-word-gold"> Permissions</span>
        </h1>
        <p class="hero-subtitle">Define which roles have access to specific system functionalities.</p>
      </header>

      <!-- CONTENT -->
      <div class="px-6 pb-10 mt-3">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <!-- LEFT: Role Selector -->
          <div class="lg:col-span-1 space-y-4">

            <!-- Role List -->
            <div class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden" style="animation-delay: 0.1s">
              <div class="px-6 py-4 border-b border-[#d4e4da]">
                <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Select Role to Edit</p>
              </div>
              <div class="px-4 py-4 space-y-2">
                <button
                  v-for="role in roles"
                  :key="role"
                  @click="selectedRole = role"
                  class="role-btn w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all"
                  :class="selectedRole === role
                    ? 'border-[#0d2b0f] bg-[#e6f2ec] text-[#0d2b0f]'
                    : 'border-[#e4ede8] text-[#4a7060] hover:border-[#a8ccb8] hover:bg-[#f7faf8]'"
                >
                  <span class="text-sm font-semibold">{{ role }}</span>
                  <span
                    v-if="selectedRole === role"
                    class="w-2 h-2 rounded-full bg-[#0d2b0f] flex-shrink-0"
                  />
                </button>
              </div>

              <!-- Create Custom Role -->
              <div class="px-4 pb-4">
                <button
                  class="w-full py-2.5 px-4 border-2 border-dashed border-[#c2d4cb] rounded-xl text-[#7a9e90] text-xs font-semibold hover:border-[#0d2b0f] hover:text-[#0d2b0f] transition-all"
                >
                  + Create Custom Role
                </button>
              </div>
            </div>

            <!-- Tip Card -->
            <div class="panel-animate bg-[#0d2b0f] rounded-2xl p-5" style="animation-delay: 0.2s">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#6daa84] mb-2">Pro Tip</p>
              <p class="text-[#b8d9c4] text-xs leading-relaxed">
                Changes here affect all users assigned to the
                <strong class="text-white">{{ selectedRole }}</strong>
                role immediately. Be careful when revoking "Delete" permissions.
              </p>
            </div>

          </div>

          <!-- RIGHT: Permissions Panel -->
          <div class="lg:col-span-2">
            <div class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden" style="animation-delay: 0.15s">

              <!-- Panel Header -->
              <div class="px-6 py-4 border-b border-[#d4e4da] flex items-center justify-between">
                <p class="text-sm font-semibold text-[#0d2b0f]">
                  Permissions for
                  <span class="text-[#e6a800]">"{{ selectedRole }}"</span>
                </p>
                <button class="btn-save">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Changes
                </button>
              </div>

              <!-- Permission Groups -->
              <div class="divide-y divide-[#eaf2ed]">

                <!-- Book Management -->
                <div class="px-6 py-5">
                  <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060] mb-4">Book Management</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="perm in bookPerms"
                      :key="perm.label"
                      class="perm-row"
                    >
                      <span class="text-sm font-medium text-[#0d2b0f]">{{ perm.label }}</span>
                      <button
                        @click="perm.enabled = !perm.enabled"
                        class="toggle-track flex-shrink-0"
                        :class="perm.enabled ? 'toggle-on' : 'toggle-off'"
                      >
                        <span class="toggle-thumb" :class="perm.enabled ? 'translate-x-5' : 'translate-x-0'" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- User Controls -->
                <div class="px-6 py-5">
                  <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060] mb-4">User Controls</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="perm in userPerms"
                      :key="perm.label"
                      class="perm-row"
                    >
                      <span class="text-sm font-medium text-[#0d2b0f]">{{ perm.label }}</span>
                      <button
                        @click="perm.enabled = !perm.enabled"
                        class="toggle-track flex-shrink-0"
                        :class="perm.enabled ? 'toggle-on' : 'toggle-off'"
                      >
                        <span class="toggle-thumb" :class="perm.enabled ? 'translate-x-5' : 'translate-x-0'" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- System Reports -->
                <div class="px-6 py-5">
                  <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060] mb-4">System Reports</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="perm in reportPerms"
                      :key="perm.label"
                      class="perm-row"
                    >
                      <span class="text-sm font-medium text-[#0d2b0f]">{{ perm.label }}</span>
                      <button
                        @click="perm.enabled = !perm.enabled"
                        class="toggle-track flex-shrink-0"
                        :class="perm.enabled ? 'toggle-on' : 'toggle-off'"
                      >
                        <span class="toggle-thumb" :class="perm.enabled ? 'translate-x-5' : 'translate-x-0'" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const roles       = ['Admin', 'Staff', 'Librarian', 'Student']
const selectedRole = ref('Staff')

const bookPerms = reactive([
  { label: 'View Books',      enabled: true  },
  { label: 'Add New Books',   enabled: true  },
  { label: 'Edit Details',    enabled: true  },
  { label: 'Archive Records', enabled: true  },
])

const userPerms = reactive([
  { label: 'View Profiles',   enabled: true  },
  { label: 'Update Roles',    enabled: false },
  { label: 'Reset Passwords', enabled: false },
  { label: 'Ban Users',       enabled: false },
])

const reportPerms = reactive([
  { label: 'Export Financial Logs', enabled: false },
])
</script>

<style scoped>
.page-root {
  font-family: 'Poppins', sans-serif;
}

/* ── BREADCRUMB ── */
.header-breadcrumb {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #9ca3af;
  animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

/* ── HERO TITLE ── */
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  display: inline-block;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}
.hero-word-dark { color: #0d2b0f; }
.hero-word-gold { color: #e6a800; }
.hero-underlined {
  position: relative;
  display: inline-block;
}
.hero-underlined::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #0d2b0f, #e6a800);
  border-radius: 3px;
  transform-origin: left;
  animation: underlineGrow 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.hero-subtitle {
  font-size: 0.88rem;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}

/* ── PANEL ── */
.panel-animate {
  opacity: 0;
  animation: panelIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes panelIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── ROLE BUTTON ── */
.role-btn { text-align: left; }

/* ── SAVE BUTTON ── */
.btn-save {
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  background: #0d2b0f;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.2s, transform 0.15s;
}
.btn-save:hover { background: #183d1b; transform: translateY(-1px); }
.btn-save:active { transform: scale(0.97); }

/* ── PERMISSION ROW ── */
.perm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: #f7faf8;
  border: 1px solid #eaf2ed;
  border-radius: 10px;
}

/* ── TOGGLE ── */
.toggle-track {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 99px;
  border: none;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
}
.toggle-on  { background: #0d2b0f; }
.toggle-off { background: #c2d4cb; }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

/* ── KEYFRAMES ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
</style>