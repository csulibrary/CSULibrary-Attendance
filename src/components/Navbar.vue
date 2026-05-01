<template>
  <header class="fixed top-0 left-0 w-full bg-white border-t-4 border-[#FBC02D] shadow-sm z-50">
    <div class="w-full px-6 lg:px-10">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <img src="/csu-logo.png" alt="University Logo" class="w-40 h-auto" />
          <div class="flex flex-col font-serif leading-tight text-[#003300]"></div>
        </div>

        <nav class="hidden xl:flex items-center">
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-link">
            {{ link.name }}
          </RouterLink>
        </nav>

        <div class="xl:hidden">
          <button class="p-2 text-[#f9dc07]">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- IMPORTANT: add spacer so content won't hide under fixed navbar -->
  <div class="h-20"></div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'announcement', path: '/announcements' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'personnel', path: '/personnel' },
  { name: 'Records', path: '/records' },
  { name: 'services', path: '/services' },
  { name: 'About Us', path: '/about' },
  { name: 'Admin', path: '/admin/login' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

.font-serif {
  font-family: Georgia, serif;
}

.nav-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #003300;
  transition: all 0.3s ease;
  text-transform: capitalize;
  margin: 0 10px;
}

.nav-link:hover {
  color: #009900;
}

/* Active route */
.router-link-active {
  color: #009900;
  border-bottom: 2px solid #f9dc07;
}
</style>
