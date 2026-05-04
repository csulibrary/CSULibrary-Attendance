<template>
  <aside
    @mouseenter="isCollapsed = false"
    @mouseleave="isCollapsed = true"
    :class="[isCollapsed ? 'w-20' : 'w-72']"
    class="bg-[#062009] h-screen flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out relative shrink-0"
  >
    <!-- LOGO -->
    <div class="p-6 border-b border-white/5 flex items-center overflow-hidden h-24">
      <div
        class="min-w-[40px] h-10 rounded flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        @click="goTo('/admin')"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f9a825"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>

      <transition name="fade-fast">
        <h1
          v-if="!isCollapsed"
          class="ml-3 text-white font-black tracking-widest text-sm uppercase truncate"
        >
          Library Admin
        </h1>
      </transition>
    </div>

    <!-- NAVIGATION -->
    <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="goTo(item.route)"
        :class="[
          isActiveRoute(item.route)
            ? 'bg-white font-black shadow-xl scale-105'
            : 'text-white/80 hover:bg-white/10 hover:text-white',
        ]"
        class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 outline-none"
      >
        <span
          <span
  class="min-w-[32px] flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.8]"
          :class="isActiveRoute(item.route) ? 'text-[#062009]' : 'text-[#f9a825]'"
          v-html="item.icon"
        ></span>

        <transition name="fade-fast">
          <span
            v-if="!isCollapsed"
            class="ml-2 whitespace-nowrap uppercase tracking-widest text-[11px] font-bold"
            :class="isActiveRoute(item.route) ? 'text-[#062009]' : 'text-white'"
          >
            {{ item.label }}
          </span>
        </transition>
      </button>
      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 outline-none text-white/80 hover:bg-[#ff1a1a] hover:text-white group"
      >
        <span class="min-w-[32px] flex items-center justify-center text-[#f9a825]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>

        <transition name="fade-fast">
          <span
            v-if="!isCollapsed"
            class="ml-2 whitespace-nowrap uppercase tracking-widest text-[11px] font-bold text-white"
          >
            Logout
          </span>
        </transition>
      </button>
    </nav>

    <!-- USER FOOTER -->
    <div class="p-4 bg-black/20 border-t border-white/5 flex flex-col gap-3">
      <!-- User Info -->
      <div class="flex items-center gap-3">
        <div
          class="min-w-[40px] h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white font-bold"
        >
          {{ roleInitial }}
        </div>

        <transition name="fade-fast">
          <div v-if="!isCollapsed" class="overflow-hidden text-white uppercase">
            <p class="text-[10px] font-black tracking-tight"> {{ role || 'User' }}</p>
            <p class="text-[9px] text-[#f9a825] font-bold italic opacity-90">Session Active</p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'

const firstName = ref('')
const role = ref('')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('first_name, role')
      .eq('email', user.email)
      .single()

    if (data) {
      firstName.value = data.first_name
      role.value = data.role
    }
  }
})

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(true)

function goTo(path: string) {
  router.push(path)
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}

const menuItems = [
  {
    name: 'DASHBOARD',
    label: 'Dashboard',
    route: '/admin',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM3 21h8v-6H3v6zM13 3v6h8V3h-8z"/>
    </svg>`,
  },

  {
    name: 'ADD EVENT',
    label: 'Add Event',
    route: '/admin/event',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <line x1="16" y1="3" x2="16" y2="7"/>
      <line x1="8" y1="3" x2="8" y2="7"/>
      <line x1="3" y1="11" x2="21" y2="11"/>
      <line x1="12" y1="14" x2="12" y2="18"/>
      <line x1="10" y1="16" x2="14" y2="16"/>
    </svg>`,
  },

  {
    name: 'IMPORT RECORDS',
    label: 'Import Records',
    route: '/admin/attendance/import',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3v12"/>
      <path d="M8 11l4 4 4-4"/>
      <rect x="4" y="17" width="16" height="4" rx="1"/>
    </svg>`,
  },

  {
    name: 'ATTENDANCE OVERVIEW',
    label: 'Attendance Overview',
    route: '/admin/attendance',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 17 9 11 13 15 21 7"/>
      <polyline points="14 7 21 7 21 14"/>
    </svg>`,
  },

  {
    name: 'PAGE SETTINGS',
    label: 'Page Settings',
    route: '/admin/attendance/settings',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0A1.7 1.7 0 0 0 10 3.2V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z"/>
    </svg>`,
  },

  {
    name: 'REPORT & ANALYTICS',
    label: 'Report & Analytics',
    route: '/admin/attendance/report',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>`,
  },

  {
    name: 'SEARCH ATTENDANCE',
    label: 'Search Attendance',
    route: '/admin/attendance/logs',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>`,
  },

  {
    name: 'SEARCH STUDENTS',
    label: 'Search Students',
    route: '/admin/attendance/students',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="9" cy="7" r="4"/>
      <path d="M17 11l2 2 4-4"/>
      <path d="M5 21v-2a4 4 0 0 1 4-4h3"/>
    </svg>`,
  },

  {
    name: 'MANAGE VISITORS',
    label: 'Manage Visitors',
    route: '/admin/attendance/visitors',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="9" cy="7" r="4"/>
      <circle cx="17" cy="7" r="4"/>
      <path d="M2 21v-2a4 4 0 0 1 4-4h6"/>
      <path d="M14 21v-2a4 4 0 0 1 4-4h2"/>
    </svg>`,
  },
]

const roleInitial = computed(() => {
  if (role.value === 'staff') return 'ST'
  if (role.value === 'admin') return 'ADM'
  if (role.value === 'super_admin') return 'SADM'
  return '?'
})

const activeMenuRoute = computed(() => {
  const currentPath = route.path

  const matches = menuItems
    .map((item) => item.route)
    .filter((itemRoute) => {
      if (itemRoute === '/admin') {
        return currentPath === '/admin'
      }

      return currentPath === itemRoute || currentPath.startsWith(`${itemRoute}/`)
    })

  if (!matches.length) {
    return ''
  }

  // Keep only one active sidebar item by preferring the most specific route.
  return matches.sort((a, b) => b.length - a.length)[0]
})

const isActiveRoute = (itemRoute: string): boolean => {
  return activeMenuRoute.value === itemRoute
}
</script>

<style scoped>
.fade-fast-enter-active {
  transition: opacity 0.3s ease 0.2s;
}
.fade-fast-leave-active {
  transition: opacity 0.1s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
