<template>
  <div class="w-full min-h-screen bg-gray-50 font-['Poppins'] pb-12 pt-[25px]">

    <div class="w-full px-4 sm:px-6 lg:px-8">

      <Ribbon>Features Page</Ribbon>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

        <div class="flex flex-col w-full h-full rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl">
          <div 
            class="h-48 bg-cover bg-center relative"
            style="background-image: url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80')"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-[#1b5e20]/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 text-white font-bold text-lg">
              Research Clinic
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow text-center">
            <h3 class="text-xl font-bold text-[#1b5e20] mb-2">
              Thesis Support
            </h3>

            <p class="text-sm text-gray-600 leading-relaxed mb-6 text-justify flex-grow">
              Stuck in a research rut or struggling to start your paper? Our librarians provide expert guidance on literature reviews and methodology.
            </p>

            <div class="mt-auto pt-4 border-t border-gray-100">
              <span class="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                Inquire At
              </span>
              <p class="text-[#1b5e20] font-bold text-sm">
                FILIPINIANA SECTION
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full h-full bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl">
          <div 
            @click="isModalOpen = true" 
            class="h-48 relative cursor-pointer group overflow-hidden"
          >
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
              style="background-image: url('https://img.youtube.com/vi/Lv0URTSBniY/hqdefault.jpg')"
            ></div>

            <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-[#ffb74d] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow text-center">
            <h3 class="text-xl font-bold text-[#c68400] mb-2">
              Virtual Tour
            </h3>

          <p class="text-sm text-gray-600 leading-relaxed mb-6 text-justify flex-grow">
             Explore our modern facilities and collection areas from the comfort of your device. Discover where your next big idea starts effectively.
         </p>

            <button 
              @click="isModalOpen = true"
              class="border-2 border-[#1b5e20] text-center text-[#1b5e20] px-4 py-2 text-sm font-semibold hover:bg-[#0d2b0f] hover:text-white hover:underline transition"
            >
              Watch Video
            </button>
          </div>
        </div>

        <div class="flex flex-col w-full h-full bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl">
          <div 
            @click="isOrientationModalOpen = true" 
            class="h-48 relative cursor-pointer group overflow-hidden"
          >
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
              style="background-image: url('https://img.youtube.com/vi/HAEPrH2aYpc/hqdefault.jpg')"
            ></div>

            <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-[#66bb6a] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow text-center">
            <h3 class="text-xl font-bold text-[#2e7d32] mb-2">
              Library Orientation
            </h3>

          <p class="text-sm text-gray-600 leading-relaxed mb-6 text-justify flex-grow">
             First time here? Maximize your academic success by learning how to navigate our physical and digital resource collections effectively.
          </p>

            <button 
              @click="isOrientationModalOpen = true"
              class="border-2 border-[#1b5e20] text-center text-[#1b5e20] px-4 py-2 text-sm font-semibold hover:bg-[#0d2b0f] hover:text-white hover:underline transition"
            >
              Watch Video
            </button>
          </div>
        </div>

      </div>
    </div>
    

    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      @click.self="isModalOpen = false"
    >
      <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <button 
          @click="isModalOpen = false"
          class="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#ffb74d] transition-colors z-10"
        >
          ✕
        </button>
        <iframe 
          class="w-full h-full"
          src="https://www.youtube.com/embed/Lv0URTSBniY?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div 
      v-if="isOrientationModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      @click.self="isOrientationModalOpen = false"
    >
      <div class="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <button 
          @click="isOrientationModalOpen = false"
          class="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#66bb6a] transition-colors z-10"
        >
          ✕
        </button>
        <iframe 
          class="w-full h-full"
          src="https://www.youtube.com/embed/HAEPrH2aYpc?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Ribbon from '@/components/Ribbon.vue';

const isModalOpen = ref(false)
const isOrientationModalOpen = ref(false)
</script>

<style scoped>
:deep(.csu-ribbon-wrap .page-inner) {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 30px;
}
</style>