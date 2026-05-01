<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- SIDEBAR -->
    <div class="sticky top-0 h-screen">
      <Sidebar />
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 py-10 px-6 md:pl-8 md:pr-16" style="font-family: 'Poppins', sans-serif">
      <!-- HEADER -->
      <header class="mb-10">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="header-breadcrumb !mb-0">
            <span>Admin</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Website Management</span>
          </div>
        </div>

        <h1
          class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
        >
          <span
            class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[170px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
            >Website</span
          ><span class="text-yellow-500"> Overview</span>
        </h1>

        <p class="header-sub">Manage website content and system modules</p>
      </header>

      <!-- GRID BUTTONS -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- WEBSITE MEDIA -->
        <div @click="goTo('website')" class="card">
          <h3>Website Media</h3>
          <p>Manage homepage images and assets</p>
        </div>

        <!-- ANNOUNCEMENT -->
        <div @click="goTo('announcement')" class="card">
          <h3>Announcement</h3>
          <p>Post and manage announcements</p>
        </div>

        <!-- GALLERY -->
        <div @click="goTo('services-gallery')" class="card">
          <h3>Gallery</h3>
          <p>Manage library gallery images</p>
        </div>

        <!-- PERSONNEL -->
        <div @click="goTo('admin-personnel')" class="card">
          <h3>Personnel</h3>
          <p>Manage staff and personnel</p>
        </div>

        <!-- RECORDS -->
        <div @click="goTo('services-records')" class="card">
          <h3>Records</h3>
          <p>Manage public records</p>
        </div>

        <!-- SERVICES (NO LINK) -->
        <div @click="goTo('website-services')" class="card">
          <h3>Services</h3>
          <p>Manage website's Services tab and Library's services</p>
        </div>

        <!-- ABOUT US (NO LINK) -->
        <div @click="goTo('website-about')" class="card">
          <h3>About Us</h3>
          <p>Manage Library's About displayed in the website</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()

const goTo = (name: string) => {
  router.push({ name })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

/* CARD STYLE */
.card {
  background: white;
  border-radius: 1.5rem;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid #164d23;
}

.card h3 {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 6px;
}

.card p {
  color: #6b7280;
  font-size: 14px;
}

/* HOVER EFFECT */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  background: #0b2010;
  color: white;
  border-color: #0b2010;
}

.card:hover p {
  color: #d1d5db;
}

/* DISABLED */
.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card.disabled:hover {
  transform: none;
  background: white;
  color: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-sub {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 8px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>
