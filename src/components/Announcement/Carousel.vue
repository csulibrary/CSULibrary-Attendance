<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { CircleChevronLeft, CircleChevronRight } from 'lucide-vue-next';


const props = defineProps<{
  items: {
    src: string
    text?: string
    span?: string
  }[]
}>()

const currentIndex = ref(0)
let interval: number

const next = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prev = () => {
  if (!props.items.length) return
  currentIndex.value =
    (currentIndex.value - 1 + props.items.length) % props.items.length
}

onMounted(() => {
  if (props.items.length > 1) {
    interval = window.setInterval(next, 5000)
  }
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="relative w-[100%] mx-auto overflow-hidden rounded-2xl">

    <!-- Slides -->
    <div class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(item, index) in items" :key="index" class="min-w-full h-80 relative">
        <!-- Image -->
        <img :src="item.src" class="w-full h-full object-cover" />

        <!-- Text Overlay -->
        <div v-if="item.text || item.span"
          class="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 px-6 py-3 rounded-lg">
          <div v-if="item.text" class="text-white text-2xl font-semibold">
            {{ item.text }}
          </div>

          <div v-if="item.span" class="text-white mt-2 text-base" style="width: 70%;">
            {{ item.span }}
          </div>
        </div>

      </div>
    </div>

    <!-- Dots -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button v-for="(_, index) in items" :key="index" @click="currentIndex = index"
        class="w-4 h-1 rounded-full transition-all" :class="currentIndex === index
          ? 'bg-yellow-500 scale-125'
          : 'bg-white/50 hover:bg-white'" />
    </div>

    <!-- Previous Button -->
    <button @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow transition">
      <CircleChevronLeft class="text-transparent" />
    </button>

    <!-- Next Button -->
    <button @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow transition">
      <CircleChevronRight class="text-transparent" />
    </button>

  </div>

  
</template>

