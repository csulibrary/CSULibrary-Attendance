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
          <span class="font-bold text-gray-400">Manage Access</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">User</span>
          <span class="hero-word-gold"> Access</span>
        </h1>
        <p class="hero-subtitle">Activate or deactivate user accounts in the system.</p>
      </header>

      <!-- CONTENT -->
      <div class="px-6 pb-10 mt-3">
        <div class="form-wrapper">

          <!-- User List -->
          <div class="bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden">
            <div class="px-6 py-4 border-b border-[#d4e4da]">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">System Users</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
              <svg class="spin mb-3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <p class="text-xs text-[#7a9e90]">Loading users...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
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

            <!-- User List -->
            <ul v-else class="divide-y divide-[#eaf2ed]">
              <li
                v-for="user in users"
                :key="user.id"
                class="user-row px-6 py-4 flex items-center justify-between hover:bg-[#f7faf8] transition-colors"
              >
                <!-- User Info -->
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-semibold text-[#0d2b0f]">
                    {{ user.first_name }} {{ user.last_name }}
                  </span>
                  <span class="text-xs text-[#7a9e90]">{{ user.email }}</span>
                </div>

                <!-- Status + Action -->
                <div class="flex items-center gap-3">
                  <!-- Status Badge -->
                  <span
                    class="text-xs font-semibold px-3 py-1 rounded-full border"
                    :class="user.is_active
                      ? 'text-[#16613a] bg-[#e6f2ec] border-[#a8ccb8]'
                      : 'text-[#b45309] bg-[#fef3c7] border-[#fcd34d]'"
                  >
                    {{ user.is_active ? 'Active' : 'Deactivated' }}
                  </span>

                  <!-- Toggle Button -->
                  <button
                    @click="handleToggle(user)"
                    :disabled="processingId === user.id"
                    class="toggle-btn text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="user.is_active
                      ? 'text-[#b45309] bg-[#fef3c7] border-[#fcd34d] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626]'
                      : 'text-[#16613a] bg-[#e6f2ec] border-[#a8ccb8] hover:bg-[#0d2b0f] hover:text-white hover:border-[#0d2b0f]'"
                  >
                    <span v-if="processingId === user.id" class="flex items-center gap-1.5">
                      <svg class="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Updating...
                    </span>
                    <span v-else>{{ user.is_active ? 'Deactivate' : 'Activate' }}</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </main>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type === 'error' ? 'toast-error' : ''">
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { userService, type User } from '@/services/userService'

const users       = ref<User[]>([])
const processingId = ref<string | null>(null)
const isLoading   = ref(true)

const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

async function loadUsers() {
  isLoading.value = true
  try {
    users.value = await userService.getAllUsers()
  } catch {
    showToast('Failed to fetch users.', 'error')
  } finally {
    isLoading.value = false
  }
}

async function handleToggle(user: User) {
  processingId.value = user.id
  try {
    await userService.toggleUserStatus(user.id, user.is_active)
    user.is_active = !user.is_active
    showToast(
      `${user.first_name} ${user.last_name} has been ${user.is_active ? 'activated' : 'deactivated'}.`
    )
  } catch (err: any) {
    showToast('Error updating user: ' + err.message, 'error')
  } finally {
    processingId.value = null
  }
}

onMounted(loadUsers)
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

/* ── FORM WRAPPER ── */
.form-wrapper {
  font-family: 'Poppins', sans-serif;
  position: relative;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* ── USER ROW ── */
.user-row { transition: background 0.15s; }

/* ── TOGGLE BUTTON ── */
.toggle-btn:active {
  transform: scale(0.95);
}

/* ── SPINNER ── */
.spin {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #0d2b0f;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.6rem 1.25rem;
  border-radius: 99px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 50;
}
.toast-error { background: #b91c1c; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

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