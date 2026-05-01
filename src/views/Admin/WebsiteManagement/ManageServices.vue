<template>
  <div class="flex h-screen w-full overflow-hidden bg-white">
    <Sidebar />

    <main class="flex-1 overflow-y-auto relative">
      <!-- HEADER -->
      <header class="px-10 py-8">
        <div class="flex justify-between items-start gap-8 flex-wrap">
          <!-- LEFT SIDE -->
          <div>
            <!-- BREADCRUMB -->
            <div class="header-breadcrumb text-gray-400">
              <button
                @click="$router.back()"
                class="back-btn flex items-center gap-1.5 text-gray-400 hover:text-[#0d2b0f] transition-colors"
              >
                <span class="uppercase tracking-widest">Back</span>
              </button>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                class="w-3 h-3"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>

              <span class="text-gray-4000 transition font-bold"> Manage Services </span>
            </div>
            <!-- TITLE -->
            <h1 class="hero-title">
              <span class="hero-word-dark hero-underlined">Manage</span>
              <span class="hero-word-gold"> Services</span>
            </h1>
            <p class="hero-subtitle">Update service content, descriptions, and visibility.</p>
          </div>

          <!-- BUTTON -->
          <button
            @click="openAddModal"
            class="add-btn bg-[#0d2b0f] hover:bg-[#0d2b0f]/90 mt-10 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 font-bold"
          >
            + Add Service
          </button>
        </div>
      </header>

      <!-- TOAST -->
      <transition name="toast">
        <div
          v-if="toast.show"
          class="fixed top-6 right-6 text-white px-5 py-3 rounded-lg shadow-xl z-50"
          :class="toast.error ? 'bg-red-600' : 'bg-[#0d2b0f]'"
        >
          {{ toast.message }}
        </div>
      </transition>

      <!-- LOADING -->
      <div v-if="store.loading" class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-8 h-8 border-4 border-[#0d2b0f] border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-sm text-gray-500">Loading services...</p>
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="store.error" class="flex items-center justify-center py-32">
        <div class="text-center">
          <p class="text-red-500 font-semibold mb-2">Failed to load services</p>
          <p class="text-sm text-gray-400 mb-4">{{ store.error }}</p>
          <button
            @click="store.fetchServices()"
            class="bg-[#0d2b0f] text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- CONTENT -->
      <div v-else class="p-10">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div
            v-for="(service, index) in store.services"
            :key="service.id"
            class="card-animate border rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
            :style="{ animationDelay: `${index * 80}ms` }"
          >
            <!-- CARD HEADER -->
            <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
              <div class="flex items-center gap-3">
                <component :is="service.icon" class="card-icon w-5 h-5 text-[#0d2b0f]" />
                <h3 class="text-sm font-bold text-[#0d2b0f]">{{ service.title }}</h3>
              </div>
              <div class="flex gap-2">
                <button
                  @click="toggleEdit(service)"
                  class="bg-[#f9a825] text-white px-3 py-1 rounded text-xs"
                >
                  {{ service.editing ? 'Editing...' : 'Edit' }}
                </button>
                <button
                  @click="handleDelete(service.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- VIEW -->
            <div v-if="!service.editing" class="p-6 space-y-2">
              <p class="text-sm text-gray-600">{{ service.description }}</p>
              <div v-if="service.edited_at" class="text-xs text-gray-400 mt-2">
                Last edited: {{ formatDate(service.edited_at) }}
                <span v-if="service.edited_by"> by {{ service.edited_by }}</span>
              </div>
            </div>

            <!-- EDIT -->
            <div v-else class="p-6 space-y-4 edit-panel">
              <!-- ICON PICKER -->
              <div>
                <label class="text-xs font-semibold uppercase text-gray-600 mb-2 block">Icon</label>
                <input
                  v-model="service.iconSearch"
                  class="w-full px-3 py-1.5 border rounded text-sm mb-2"
                  placeholder="Search icon... (e.g. 'star', 'cart', 'home')"
                />
                <div class="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto border rounded p-1">
                  <button
                    v-for="iconOption in getFilteredIcons(service.iconSearch)"
                    :key="iconOption.name"
                    @click="service.editIcon = iconOption.component"
                    :title="iconOption.name"
                    :class="[
                      'p-2 border rounded flex flex-col items-center gap-1',
                      service.editIcon === iconOption.component
                        ? 'border-[#0d2b0f] bg-[#0d2b0f]/10'
                        : 'border-gray-200 hover:border-gray-400',
                    ]"
                  >
                    <component :is="iconOption.component" class="w-4 h-4" />
                    <span class="text-[9px] text-gray-500 truncate w-full text-center">
                      {{ iconOption.name }}
                    </span>
                  </button>
                </div>
                <p
                  v-if="getFilteredIcons(service.iconSearch).length === 0"
                  class="text-xs text-gray-400 mt-1 text-center"
                >
                  No icons found for "{{ service.iconSearch }}"
                </p>
              </div>

              <input
                v-model="service.editTitle"
                class="w-full px-4 py-2 border rounded text-sm"
                placeholder="Title"
              />

              <textarea
                v-model="service.editDescription"
                rows="3"
                class="w-full px-4 py-2 border rounded text-sm"
                placeholder="Description"
              ></textarea>

              <div class="flex justify-end gap-2">
                <button
                  @click="cancelEdit(service)"
                  class="border px-4 py-2 rounded text-sm"
                  :disabled="saving"
                >
                  Cancel
                </button>
                <button
                  @click="saveService(service)"
                  class="bg-[#0d2b0f] text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                  :disabled="saving"
                >
                  <span
                    v-if="saving"
                    class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></span>
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </div>

          <!-- EMPTY -->
          <div v-if="store.services.length === 0" class="col-span-full text-center py-20">
            <p class="text-gray-500">No services yet. Click "+ Add Service" to get started.</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- ADD MODAL -->
  <div
    v-if="addModal.open"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-40 modal-backdrop"
  >
    <div
      class="modal-content bg-white p-6 rounded-xl w-[440px] space-y-4 max-h-[90vh] overflow-y-auto"
    >
      <h3 class="font-bold text-lg">Add Service</h3>

      <!-- ICON PICKER -->
      <div>
        <label class="text-xs font-semibold uppercase text-gray-600 mb-2 block">Select Icon</label>
        <input
          v-model="addModal.iconSearch"
          class="w-full px-3 py-1.5 border rounded text-sm mb-2"
          placeholder="Search icon... (e.g. 'star', 'cart', 'home')"
        />
        <div class="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto border rounded p-1">
          <button
            v-for="iconOption in getFilteredIcons(addModal.iconSearch)"
            :key="iconOption.name"
            @click="addModal.icon = iconOption.component"
            :title="iconOption.name"
            :class="[
              'p-2 border rounded flex flex-col items-center gap-1',
              addModal.icon === iconOption.component
                ? 'border-[#0d2b0f] bg-[#0d2b0f]/10'
                : 'border-gray-200 hover:border-gray-400',
            ]"
          >
            <component :is="iconOption.component" class="w-4 h-4" />
            <span class="text-[9px] text-gray-500 truncate w-full text-center">
              {{ iconOption.name }}
            </span>
          </button>
        </div>
        <p
          v-if="getFilteredIcons(addModal.iconSearch).length === 0"
          class="text-xs text-gray-400 mt-1 text-center"
        >
          No icons found for "{{ addModal.iconSearch }}"
        </p>
      </div>

      <input v-model="addModal.title" class="w-full px-4 py-2 border rounded" placeholder="Title" />

      <textarea
        v-model="addModal.description"
        class="w-full px-4 py-2 border rounded"
        placeholder="Description"
      ></textarea>

      <div class="flex justify-end gap-2">
        <button @click="closeAddModal" class="border px-4 py-2 rounded" :disabled="saving">
          Cancel
        </button>
        <button
          @click="handleAdd"
          class="bg-[#0d2b0f] text-white px-4 py-2 rounded flex items-center gap-2"
          :disabled="saving"
        >
          <span
            v-if="saving"
            class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          {{ saving ? 'Adding...' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FunctionalComponent } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import * as LucideIcons from 'lucide-vue-next'
import { useServicesStore } from '@/services/manageService'
import type { Service } from '@/services/manageService'

const store = useServicesStore()
const saving = ref(false)

onMounted(() => {
  store.fetchServices()
})

// ── ICON HELPERS ──────────────────────────────────────────────────────────────
const allIcons: { name: string; component: FunctionalComponent<LucideIcons.LucideProps> }[] =
  Object.entries(LucideIcons)
    .filter(
      ([name, component]) =>
        /^[A-Z]/.test(name) &&
        typeof component === 'function' &&
        !name.endsWith('Icon') &&
        !['createIcons'].includes(name),
    )
    .map(([name, component]) => ({
      name,
      component: component as FunctionalComponent<LucideIcons.LucideProps>,
    }))

function getFilteredIcons(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return allIcons.slice(0, 40)
  return allIcons.filter((i) => i.name.toLowerCase().includes(q))
}

// ── DATE FORMAT ───────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', error: false })

function showToast(msg: string, isError = false) {
  toast.message = msg
  toast.error = isError
  toast.show = true
  setTimeout(() => (toast.show = false), 2500)
}

// ── EDIT ──────────────────────────────────────────────────────────────────────
function toggleEdit(s: Service) {
  s.editing = true
  s.editTitle = s.title
  s.editDescription = s.description
  s.editIcon = s.icon
  s.iconSearch = ''
}

function cancelEdit(s: Service) {
  s.editing = false
}

async function saveService(s: Service) {
  saving.value = true
  try {
    await store.updateService(s.id, {
      title: s.editTitle,
      description: s.editDescription,
      icon: s.editIcon,
    })
    s.editing = false
    showToast('Service updated!')
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : 'Failed to update service', true)
  } finally {
    saving.value = false
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this service?')) return
  try {
    await store.deleteService(id)
    showToast('Service deleted!')
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : 'Failed to delete service', true)
  }
}

// ── ADD MODAL ─────────────────────────────────────────────────────────────────
const Monitor = LucideIcons.Monitor as FunctionalComponent<LucideIcons.LucideProps>

const addModal = reactive({
  open: false,
  title: '',
  description: '',
  icon: Monitor as FunctionalComponent<LucideIcons.LucideProps>,
  iconSearch: '',
})

function openAddModal() {
  addModal.open = true
}
function closeAddModal() {
  addModal.open = false
  addModal.title = ''
  addModal.description = ''
  addModal.icon = Monitor
  addModal.iconSearch = ''
}

async function handleAdd() {
  if (!addModal.title.trim() || !addModal.description.trim()) {
    showToast('Please fill in all fields', true)
    return
  }
  saving.value = true
  try {
    await store.addService({
      id: '',
      title: addModal.title.trim(),
      description: addModal.description.trim(),
      icon: addModal.icon,
    })
    closeAddModal()
    showToast('Service added!')
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : 'Failed to add service', true)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ─── BREADCRUMB ─── */
.header-breadcrumb {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

/* ─── HERO TITLE ─── */
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
.hero-word-dark {
  color: #0d2b0f;
}
.hero-word-gold {
  color: #e6a800;
}
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
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}

/* ─── ADD BUTTON ─── */
.add-btn {
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}

/* ─── CARD ENTRANCE ─── */
.card-animate {
  opacity: 0;
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── CARD ICON BOUNCE ON HOVER ─── */
.card-animate:hover .card-icon {
  animation: iconBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconBounce {
  0% {
    transform: scale(1) rotate(0deg);
  }
  40% {
    transform: scale(1.35) rotate(-10deg);
  }
  70% {
    transform: scale(0.95) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* ─── EDIT PANEL SLIDE-DOWN ─── */
.edit-panel {
  animation: editSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes editSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── MODAL BACKDROP + CONTENT ─── */
.modal-backdrop {
  animation: backdropIn 0.2s ease both;
}

.modal-content {
  animation: modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes backdropIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── TOAST ─── */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ─── KEYFRAMES ─── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes underlineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
