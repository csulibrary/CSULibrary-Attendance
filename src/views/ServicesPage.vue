<template>
  <div
    class="relative w-full pb-20 font-poppins antialiased text-white flex flex-col items-center overflow-x-hidden bg-[#f8fafc]"
  >
    <div
      class="absolute top-0 -left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
    ></div>
    <div
      class="absolute top-40 -right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
    ></div>
    <div
      class="absolute bottom-20 left-1/2 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
    ></div>

    <!-- HEADER -->
    <div class="relative z-10 mt-16 mb-6 text-center reveal-header">
      <div class="flex items-center justify-center gap-3 mb-2">
        <span class="block w-10 h-[2px] bg-[#f9dc07] rounded-full"></span>
        <span class="text-[10px] font-extrabold tracking-[0.32em] text-[#003300] uppercase">
          What we offer
        </span>
      </div>
      <h1
        class="services text-5xl md:text-7xl font-black text-[#003300] text-center tracking-tight uppercase leading-none"
      >
        Services
      </h1>
    </div>

    <div class="relative z-10 mt-1 mx-auto px-8 w-full">
      <div class="relative mb-20 text-center">
        <div
          class="inline-block p-8 md:p-10 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-xl max-w-4xl mx-auto"
        >
          <p class="text-gray-700 text-lg md:text-xl font-light leading-relaxed italic">
            "The
            <span class="font-black text-green-900 not-italic border-b-4 border-yellow-500/50"
              >CSU Library</span
            >
            is committed to providing high-quality academic resources, fostering an environment of
            <span class="text-[#003300] font-bold not-italic">innovation and discovery</span>."
          </p>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-10 h-10 border-4 border-[#009900] border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-sm text-gray-500">Loading services...</p>
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="store.error" class="flex items-center justify-center py-32">
        <div class="text-center">
          <p class="text-red-500 font-semibold mb-2">Could not load services</p>
          <p class="text-sm text-gray-400 mb-4">{{ store.error }}</p>
          <button
            @click="store.fetchServices()"
            class="bg-[#003300] text-white px-4 py-2 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- GRID -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <div
          v-for="service in store.services"
          :key="service.id"
          class="reveal-card group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
        >
          <div
            class="h-44 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#009900]/10 to-[#2e7d32]/20"
            ></div>

            <div
              class="relative z-10 p-5 rounded-2xl bg-[#009900]/10 backdrop-blur-sm border border-[#003300]/20 group-hover:bg-[#003300] group-hover:rotate-6 transition-all duration-500"
            >
              <component
                :is="service.icon"
                class="w-10 h-10 text-[#003300] group-hover:text-white transition-colors duration-500"
              />
            </div>
          </div>

          <div class="p-8 text-center">
            <h3
              class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider relative inline-block"
            >
              {{ service.title }}
              <span
                class="block h-1 w-0 group-hover:w-full rounded-full bg-gradient-to-r from-yellow-500 to-green-700 mt-1 transition-all duration-500"
              ></span>
            </h3>

            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
              {{ service.description }}
            </p>
          </div>
        </div>

        <!-- EMPTY -->
        <div
          v-if="!store.loading && store.services.length === 0"
          class="col-span-full text-center py-20"
        >
          <p class="text-gray-400 text-lg">No services available at the moment.</p>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-xl bg-[#06260f] text-white grid place-items-center shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      aria-label="Scroll to top"
      type="button"
    >
      <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useServicesStore } from '@/services/manageService'

const store = useServicesStore()

const showScrollTop = ref(false)
let observer: IntersectionObserver | null = null

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function setupObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-card')
        } else {
          entry.target.classList.remove('show-card')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.reveal-card').forEach((card) => observer?.observe(card))
}

// Re-run observer after services load so cards animate in
watch(
  () => store.services.length,
  async () => {
    await nextTick()
    setupObserver()
  },
)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await store.fetchServices()
  await nextTick()
  setupObserver()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.reveal-card {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

.reveal-card.show-card {
  opacity: 1;
  transform: translateY(0);
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.services {
  margin: 10px 0 0;
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  line-height: 1.02;
}
</style>
