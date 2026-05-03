<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import ModalRBAC from '@/components/ModalRBAC.vue'
import { useRBACModal } from '@/composables/useRBACModal'

const route = useRoute()
const router = useRouter()
const { isOpen, openModal, closeModal } = useRBACModal()

watch(
  () => route.query.denied,
  (val) => {
    if (val) openModal()
  },
  { immediate: true }
)

const handleConfirm = () => {
  closeModal()
  router.push('/admin') // or dashboard
}
</script>

<!-- max-w-7xl -->

<template>
  <div class="min-h-screen w-full flex flex-col bg-slate-50">
    <main class="flex-grow w-full !p-0 !m-0">
      <RouterView />
    </main>

    <ModalRBAC
      :isOpen="isOpen"
      @close="closeModal"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  max-width: 100vw;
}

#app {
  width: 100%;
}
</style>