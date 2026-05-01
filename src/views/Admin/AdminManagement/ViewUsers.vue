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
          <span class="font-bold text-gray-400">Manage Users</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-word-dark hero-underlined">System</span>
          <span class="hero-word-gold"> Users</span>
        </h1>
        <p class="hero-subtitle">Overview of all registered users in the system.</p>
      </header>

      <!-- CONTENT -->
      <div class="px-6 pb-10 mt-3">
        <div class="panel-animate" style="animation-delay: 0.1s">

          <!-- Table Card -->
          <div class="bg-white rounded-2xl border border-[#c2d4cb] overflow-hidden">

            <!-- Card Header -->
            <div class="px-6 py-4 border-b border-[#d4e4da] flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#4a7060]">All Users</p>
              <span class="text-xs font-semibold text-[#16613a] bg-[#e6f2ec] border border-[#a8ccb8] rounded-full px-3 py-0.5">
                {{ users.length }} Total
              </span>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
              <svg class="spin mb-3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7060" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <p class="text-xs text-[#7a9e90]">Loading users...</p>
            </div>

            <!-- Empty -->
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

            <!-- Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-[#eaf2ed] bg-[#f7faf8]">
                    <th class="th">Name</th>
                    <th class="th">Email</th>
                    <th class="th">Role</th>
                    <th class="th">Status</th>
                    <th class="th">Created</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#eaf2ed]">
                  <tr
                    v-for="user in users"
                    :key="user.id"
                    class="table-row hover:bg-[#f7faf8] transition-colors"
                  >
                    <!-- Name -->
                    <td class="td">
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          {{ user.first_name?.[0] }}{{ user.last_name?.[0] }}
                        </div>
                        <span class="text-sm font-semibold text-[#0d2b0f]">
                          {{ user.first_name }} {{ user.last_name }}
                        </span>
                      </div>
                    </td>

                    <!-- Email -->
                    <td class="td text-sm text-[#7a9e90]">{{ user.email }}</td>

                    <!-- Role -->
                    <td class="td">
                      <span class="role-chip capitalize">{{ user.role }}</span>
                    </td>

                    <!-- Status -->
                    <td class="td">
                      <span
                        class="status-chip"
                        :class="user.is_active ? 'status-active' : 'status-inactive'"
                      >
                        {{ user.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>

                    <!-- Created -->
                    <td class="td text-sm text-[#7a9e90]">
                      {{ new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) }}
                    </td>
                  </tr>
                </tbody>
              </table>
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

const users     = ref<User[]>([])
const isLoading = ref(true)

async function fetchUsers() {
  try {
    users.value = await userService.getAllUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUsers)
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

/* ── TABLE ── */
.th {
  padding: 0.65rem 1.25rem;
  text-align: left;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a7060;
}

.td {
  padding: 0.85rem 1.25rem;
  white-space: nowrap;
}

/* ── AVATAR ── */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e6f2ec;
  border: 1.5px solid #a8ccb8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #16613a;
  flex-shrink: 0;
}

/* ── ROLE CHIP ── */
.role-chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: #0d2b0f;
  background: #e6f2ec;
  border: 1px solid #a8ccb8;
  border-radius: 99px;
  padding: 0.2rem 0.65rem;
  display: inline-block;
}

/* ── STATUS CHIP ── */
.status-chip {
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 99px;
  padding: 0.2rem 0.65rem;
  display: inline-block;
}
.status-active {
  color: #16613a;
  background: #e6f2ec;
  border: 1px solid #a8ccb8;
}
.status-inactive {
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

/* ── SPINNER ── */
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
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