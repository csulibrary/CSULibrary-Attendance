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
          <span class="font-bold text-gray-400">Manage Role</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">Role</span>
          <span class="hero-word-gold"> Management</span>
        </h1>
        <p class="hero-subtitle">Define roles and assign them to system users.</p>
      </header>

      <!-- CONTENT -->
      <div class="px-6 pb-10 mt-3 space-y-6">

        <!-- Add New Role -->
        <div class="panel-animate bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden" style="animation-delay: 0.1s">
          <div class="px-6 py-4 border-b border-[#d4e4da]">
            <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Create New Role</p>
          </div>
          <div class="px-6 py-5 flex flex-col sm:flex-row gap-3">
            <input
              v-model="newRoleName"
              type="text"
              placeholder="e.g. Editor, Moderator..."
              @keyup.enter="addNewRoleDefinition"
              class="role-input flex-1"
            />
            <button
              @click="addNewRoleDefinition"
              class="btn-primary whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Role to System
            </button>
          </div>

          <!-- Active Roles Preview -->
          <div class="px-6 pb-5 flex flex-wrap gap-2">
            <span
              v-for="role in availableRoles"
              :key="role"
              class="role-chip"
            >
              {{ role.charAt(0).toUpperCase() + role.slice(1) }}
            </span>
          </div>
        </div>

        <!-- User Cards -->
        <div class="panel-animate" style="animation-delay: 0.2s">
          <div class="mb-3">
            <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Assign Roles to Users</p>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-[#c2d4cb]">
            <svg class="spin mb-3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <p class="text-xs text-[#7a9e90]">Loading users...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-[#c2d4cb]">
            <div class="w-14 h-14 rounded-2xl bg-[#e6f2ec] border border-[#a8ccb8] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#4a7060] uppercase tracking-widest mb-1">No Users Found</p>
            <p class="text-xs text-[#7a9e90]">No users are registered in the system yet.</p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="user in users"
              :key="user.id"
              class="user-card bg-white rounded-2xl border border-[#c2d4cb] p-5 hover:border-[#8ab5a0] transition-all"
            >
              <!-- Avatar + Name -->
              <div class="flex items-center gap-3 mb-4">
                <div class="avatar">
                  {{ user.first_name?.[0] }}{{ user.last_name?.[0] }}
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-[#0d2b0f] truncate">
                    {{ user.first_name }} {{ user.last_name }}
                  </h3>
                  <p class="text-xs text-[#7a9e90] truncate">{{ user.email }}</p>
                </div>
              </div>

              <!-- Role Selector -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">Assigned Role</label>
                <div class="flex items-center gap-2">
                  <div class="relative flex-1">
                    <select
                      v-model="user.role"
                      @change="updateRole(user)"
                      :disabled="updatingId === user.id"
                      class="role-select w-full"
                    >
                      <option v-for="role in availableRoles" :key="role" :value="role">
                        {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                      </option>
                    </select>
                    <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4a7060]">
                      <svg width="10" height="7" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </span>
                  </div>

                  <!-- Spinner -->
                  <svg v-if="updatingId === user.id" class="spin flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-4 pt-3 border-t border-[#eaf2ed] flex justify-between items-center">
                <span class="text-[10px] text-[#9ab5a8]">
                  Last login: {{ user.last_login_at || 'Never' }}
                </span>
                <transition name="saved">
                  <span v-if="successId === user.id" class="text-[11px] font-semibold text-[#16a34a]">
                    ✓ Saved
                  </span>
                </transition>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { userService, type User } from '@/services/userService'

const users         = ref<User[]>([])
const availableRoles = ref(['admin', 'staff', 'user', 'guest'])
const newRoleName   = ref('')
const updatingId    = ref<string | null>(null)
const successId     = ref<string | null>(null)
const isLoading     = ref(true)

async function loadData() {
  isLoading.value = true
  try {
    users.value = await userService.getAllUsers()
  } catch {
    alert('Failed to fetch users.')
  } finally {
    isLoading.value = false
  }
}

function addNewRoleDefinition() {
  const role = newRoleName.value.toLowerCase().trim()
  if (!role) return
  if (!availableRoles.value.includes(role)) {
    availableRoles.value.push(role)
  }
  newRoleName.value = ''
}

async function updateRole(user: User) {
  updatingId.value = user.id
  successId.value  = null
  try {
    await userService.updateUserRole(user.id, user.role)
    successId.value = user.id
    setTimeout(() => { successId.value = null }, 2000)
  } catch {
    alert('Failed to update role.')
  } finally {
    updatingId.value = null
  }
}

onMounted(loadData)
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

/* ── ROLE INPUT ── */
.role-input {
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: #0d2b0f;
  background: #f0f4f1;
  border: 1.5px solid #c2d4cb;
  border-radius: 8px;
  padding: 0.55rem 0.8rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.role-input::placeholder { color: #9ab5a8; }
.role-input:focus {
  border-color: #0d2b0f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13,43,15,0.1);
}

/* ── ROLE CHIP ── */
.role-chip {
  font-family: 'Poppins', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: #16613a;
  background: #e6f2ec;
  border: 1px solid #a8ccb8;
  border-radius: 99px;
  padding: 0.2rem 0.75rem;
}

/* ── BUTTON ── */
.btn-primary {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  background: #0d2b0f;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover { background: #183d1b; transform: translateY(-1px); }

/* ── AVATAR ── */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e6f2ec;
  border: 1.5px solid #a8ccb8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #16613a;
  flex-shrink: 0;
}

/* ── USER CARD ── */
.user-card { transition: border-color 0.2s, box-shadow 0.2s; }
.user-card:hover { box-shadow: 0 4px 16px rgba(13,43,15,0.08); }

/* ── ROLE SELECT ── */
.role-select {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  color: #0d2b0f;
  background: #f0f4f1;
  border: 1.5px solid #c2d4cb;
  border-radius: 8px;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.role-select:focus {
  border-color: #0d2b0f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13,43,15,0.1);
}
.role-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── SPINNER ── */
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── SAVED BADGE TRANSITION ── */
.saved-enter-active { transition: all 0.25s ease; }
.saved-leave-active { transition: all 0.25s ease; }
.saved-enter-from, .saved-leave-to { opacity: 0; transform: translateY(4px); }

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