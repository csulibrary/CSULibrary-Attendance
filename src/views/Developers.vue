<template>
  <div class="w-full min-h-screen relative overflow-hidden" style="background-color: #ffffff">
    <div class="absolute inset-0 pointer-events-none opacity-[0.015]" style="
        background-image: radial-gradient(#003300 1px, transparent 1px);
        background-size: 32px 32px;
      "></div>

    <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
      style="background: radial-gradient(circle, #003300, transparent)"></div>

    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-10"
      style="background: radial-gradient(circle, #003300, transparent)"></div>

    <div class="max-w-6xl mx-auto px-6 py-10 relative z-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-6">
          <div class="flex items-center justify-center">
            <video :src="ccisImg" class="w-28 h-28 md:w-35 md:h-35 object-contain" autoplay muted loop
              playsinline></video>
          </div>
        </div>

        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 border"
          style="background-color: #00330010; border-color: #00330030">
          <span class="text-[10px] font-bold uppercase tracking-[0.35em]" style="color: #003300">
            Development Team
          </span>
        </div>

        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
          Meet the <span class="anim-shimmer">Developers</span>
        </h1>

        <p class="text-sm max-w-xl mx-auto leading-relaxed" style="color: #00330099">
          The dedicated team of BS Information Technology students behind the CSU Library Management
          System.
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="(member, index) in teamMembers" :key="index" @click="openModal(member)"
          class="card-animate group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1 hover:shadow-xl border"
          :style="{
            borderColor: '#00330015',
            boxShadow: '0 2px 12px rgba(0, 51, 0, 0.06)',
            animationDelay: `${index * 0.1}s`,
          }">
          <div class="h-1 w-full" style="background: linear-gradient(90deg, #003300, #006600)"></div>

          <div class="p-6 flex flex-col items-center text-center">
            <div class="relative mb-4">
              <div
                class="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-all duration-300"
                style="background-color: #003300"></div>

              <div
                class="relative w-28 h-28 rounded-full overflow-hidden border-4 transition-all duration-300 group-hover:border-[#003300]"
                style="border-color: #00330020">
                <img :src="member.image" class="w-full h-full object-cover object-top" />
              </div>
            </div>

            <h3
              class="text-sm font-black uppercase tracking-tight leading-snug mb-1 transition-colors duration-300 group-hover:text-[#003300]"
              style="color: #1a1a1a">
              {{ member.name }}
            </h3>

            <span
              class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all duration-300"
              style="background-color: #00330010; color: #003300">
              {{ member.role }}
            </span>

            <div
              class="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <span class="text-[10px] font-bold uppercase tracking-widest" style="color: #003300">
                View Profile
              </span>

              <svg class="w-3 h-3" style="color: #003300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer note -->
      <div class="mt-14 text-center">
        <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border"
          style="background-color: #ffffff; border-color: #00330020">
          <video :src="ccisImg" class="w-5 h-5 object-contain" autoplay muted loop playsinline></video>

          <span class="text-xs font-semibold" style="color: #00330099">
            Caraga State University · BS Information Technology · 4th Year
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="pop">
      <div v-if="selectedMember" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        style="background-color: rgba(0, 51, 0, 0.45)" @click.self="closeModal">
        <div class="relative w-full max-w-md bg-white overflow-hidden rounded-3xl border shadow-2xl"
          style="border-color: #00330020">
          <!-- Green Header -->
          <div class="relative h-40 overflow-visible"
            style="background: linear-gradient(135deg, #002200 0%, #003300 60%, #004400 100%)">
            <div class="absolute inset-0 opacity-[0.06]" style="
                background-image: radial-gradient(white 1px, transparent 1px);
                background-size: 18px 18px;
              "></div>

            <div class="absolute bottom-0 left-0 right-0 h-10"
              style="background: linear-gradient(to top, white, transparent)"></div>

            <div class="absolute top-5 left-6">
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
                Caraga State University
              </p>
              <p class="text-[10px] font-black uppercase tracking-widest text-white/70">
                CSU Library System
              </p>
            </div>

            <button @click="closeModal"
              class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-white/20"
              style="
                background-color: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
              ">
              <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div class="w-36 h-36 rounded-xl p-[3px] shadow-xl"
                style="background: linear-gradient(135deg, #003300, #006600)">
                <div class="w-full h-full rounded-xl overflow-hidden border-4 border-white">
                  <img :src="selectedMember.image" class="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="pt-24 px-8 text-center">
            <h2 class="text-xl font-black uppercase tracking-tight" style="color: #003300">
              {{ selectedMember.name }}
            </h2>

            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest"
              style="background-color: #00330008; border-color: #00330025; color: #003300">
              {{ selectedMember.role }}
            </div>

            <!-- GitHub Button -->
            <!-- GitHub Button -->
            <div class="mt-2">
              <a :href="selectedMember.github" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 hover:bg-[#003300] hover:text-white"
                style="background-color: #ffffff; border-color: #00330025; color: #003300" @click.stop>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>

            <div class="my-3 flex items-center gap-3">
              <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, #00330020)"></div>

              <span class="text-[9px] uppercase tracking-[0.3em] font-bold" style="color: #00330060">
                Profile
              </span>

              <div class="h-px flex-1" style="background: linear-gradient(90deg, #00330020, transparent)"></div>
            </div>

            <div class="text-left p-5 rounded-2xl border-l-4 relative"
              style="background-color: #00330005; border-color: #003300">
              <div class="absolute top-3 left-4 text-5xl leading-none font-black opacity-10" style="color: #003300">
                "
              </div>

              <p class="relative text-xs leading-relaxed font-medium italic pt-3" style="color: #333">
                {{ selectedMember.bio }}
              </p>
            </div>

            <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border mt-3"
              style="background-color: #ffffff; border-color: #00330020">
              <video :src="ccisImg" class="w-5 h-5 object-contain" autoplay muted loop playsinline></video>

              <span class="text-xs font-semibold" style="color: #00330099">
                Caraga State University · BS Information Technology · 4th Year
              </span>
            </div>

            <button @click="closeModal"
              class="mt-2 mb-2 w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              style="background: linear-gradient(135deg, #002200, #003300)">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Scroll to Top -->
  <Transition name="fade">
    <button v-if="showScrollTop" @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:opacity-90"
      style="background: #003300">
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import ccisImg from '@/assets/images/CSU-LOGO-.mp4'
import edenImg from '@/assets/images/EDEN.png'
import omaimahImg from '@/assets/images/OMAIMAH.png'
import pearlImg from '@/assets/images/PEARL.png'
import dyannaImg from '@/assets/images/DYANNA.png'
import jennyImg from '@/assets/images/JENNY.jpg'
import reonestImg from '@/assets/images/REONEST.png'
import joyImg from '@/assets/images/JOY.png'
import christineImg from '@/assets/images/CHRISTINE.png'

const showScrollTop = ref(false)

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

interface Member {
  name: string
  role: string
  image: string
  bio: string
  github: string
}

const selectedMember = ref<Member | null>(null)

const teamMembers = ref<Member[]>([
  {
    name: 'Eden Grace M. Bughao',
    role: 'Project Lead / System Architect',
    image: edenImg,
    bio: '4th Year BS Information Technology student with interests in web development and database systems. Dedicated to creating efficient and scalable solutions for real-world problems.',
    github: 'https://github.com/blueuches',
  },
  {
    name: 'Pearl Janette G. Cacayan',
    role: 'Full-Stack Developer / Frontend Lead',
    image: pearlImg,
    bio: '4th Year BS Information Technology student with interest in backend development. Focused on building reliable and efficient applications.',
    github: 'https://github.com/pearljanettecacayan',
  },
  {
    name: 'Dyanna Joy S. Castro',
    role: 'Full-Stack Developer / Backend Lead',
    image: dyannaImg,
    bio: '4th Year BS Information Technology student with interest in mobile and web development. Interested in building practical and innovative applications.',
    github: 'https://github.com/dyannacastro',
  },
  {
    name: 'Jenny Mae Q. De La Torre',
    role: 'Full-Stack Developer / Backend Lead',
    image: jennyImg,
    bio: '4th Year BS Information Technology student with strong interest in backend development and system architecture. Focused on creating reliable and efficient systems.',
    github: 'https://github.com/jennymaedelatorre',
  },
  {
    name: 'Omaimah K. Ameril',
    role: 'Full-Stack Developer',
    image: omaimahImg,
    bio: '4th Year BS Information Technology student with interests in software development and system design. Passionate about building functional and user-friendly applications.',
    github: 'https://github.com/username5',
  },
  {
    name: 'Christine Mae L. Lagura',
    role: 'Full-Stack Developer',
    image: christineImg,
    bio: '4th Year BS Information Technology student with interest in software engineering and project development. Interested in building real-world systems.',
    github: 'https://github.com/tinaylagura-T',
  },
  {
    name: 'Reonest Arjayle L. Espina',
    role: 'Full-Stack Developer',
    image: reonestImg,
    bio: '4th Year BS Information Technology student with interest in backend development and system optimization. Focused on improving performance and reliability of systems.',
    github: 'https://github.com/reonestarjayleespina',
  },
  {
    name: 'Marry Joy L. Bersabal',
    role: 'Frontend Developer',
    image: joyImg,
    bio: '4th Year BS Information Technology student with interest in UI/UX design and frontend development. Passionate about crafting clean, intuitive, and accessible user interfaces.',
    github: 'https://github.com/MarryJoyBersabal',
  },
])

const openModal = (member: Member) => {
  selectedMember.value = member
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedMember.value = null
  document.body.style.overflow = 'auto'
  scrollToTop()
}
</script>

<style scoped>
.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-leave-active {
  transition: all 0.2s ease-in;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.88);
}

/* Card entrance animation */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-animate {
  animation: fadeUp 0.5s ease forwards;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.anim-shimmer {
  background: linear-gradient(90deg, #003300 25%, #006600 50%, #003300 75%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }

  100% {
    background-position: 200% center;
  }
}
</style>