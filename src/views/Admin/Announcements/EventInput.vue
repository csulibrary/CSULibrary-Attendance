<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <Sidebar />

    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed left-1/2 top-6 z-[9999] -translate-x-1/2 px-6 py-4 rounded-2xl text-base font-bold text-white shadow-2xl',
          toast.type === 'success' ? 'bg-[#0d2b0f]' : 'bg-red-600',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <main
      class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50"
      style="font-family: 'Poppins', sans-serif; color: #1a1a1a"
    >
      <!-- HEADER -->
      <div class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between">
        <div class="flex items-center">
          <div class="flex flex-col">
            <div
              class="flex items-center gap-1.5 leading-none text-[0.68rem] font-bold tracking-[0.15em] uppercase text-[rgba(13,43,15,0.4)]"
            >
              <span
                class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
                @click="$router.push('/admin/announcement')"
                >BACK</span
              >
              <svg
                class="w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>EVENT ANNOUNCEMENT</span>
            </div>
            <h1
              class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
            >
              <span
                class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[120px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
                >Event</span
              ><span class="text-yellow-500"> Announcements</span>
            </h1>
            <p class="text-sm text-[rgba(13,43,15,0.5)]">
              Compose and publish updates for the library community.
            </p>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- FORM -->
        <div class="lg:col-span-7 space-y-6">
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- MAIN CARD -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <div class="space-y-6">
                <!-- TYPE SELECTOR -->
                <div>
                  <label
                    class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1"
                  >
                    Type
                  </label>
                  <div class="flex gap-3">
                    <button
                      v-for="option in typeOptions"
                      :key="option.value"
                      type="button"
                      @click="formData.type = option.value"
                      :class="[
                        'flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all',
                        formData.type === option.value
                          ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                          : 'bg-gray-50 text-gray-500 border-gray-300 hover:border-[#2D7231] hover:text-[#2D7231]',
                      ]"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>

                <!-- HEADLINE -->
                <div>
                  <label
                    class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1"
                  >
                    Headline
                  </label>
                  <input
                    v-model="formData.title"
                    type="text"
                    placeholder="What's happening?"
                    class="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-[#2D7231] focus:bg-white text-gray-900 text-lg font-semibold transition-all"
                  />
                </div>

                <!-- DETAILS -->
                <div>
                  <label
                    class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1"
                  >
                    Details
                  </label>
                  <textarea
                    v-model="formData.description"
                    rows="6"
                    placeholder="Provide the full story here..."
                    class="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-[#2D7231] focus:bg-white text-gray-900 resize-none transition-all"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- DATE + FILE -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <label class="text-sm font-bold text-gray-700 uppercase mb-4 block">
                  Publish Date
                </label>
                <input
                  v-model="formData.datePublished"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#2D7231]"
                />
              </div>

              <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <label class="text-sm font-bold text-gray-700 uppercase mb-4 block">
                  Attachment
                </label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            <!-- EVENT DURATION — only for type: event -->
            <transition name="slide-fade">
              <div
                v-if="formData.type === 'event'"
                class="bg-white rounded-3xl p-6 shadow-sm border border-gray-200"
              >
                <label class="text-sm font-bold text-gray-700 uppercase mb-1 block tracking-wider">
                  Event Duration
                </label>
                <p class="text-xs text-gray-400 mb-4 ml-1">
                  Set the start and end time of the event.
                </p>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1"
                    >
                      Time In
                    </label>
                    <input
                      v-model="formData.timeIn"
                      type="time"
                      class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#2D7231] text-gray-900 font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label
                      class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1"
                    >
                      Time Out
                    </label>
                    <input
                      v-model="formData.timeOut"
                      type="time"
                      class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#2D7231] text-gray-900 font-semibold transition-all"
                    />
                  </div>
                </div>
              </div>
            </transition>

            <!-- BUTTONS -->
            <div class="flex items-center gap-4 pt-4">
              <button
                type="button"
                @click="goBack"
                class="flex-1 py-4 rounded-2xl font-bold text-gray-600 border-2 border-gray-300 hover:bg-gray-100 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                class="flex-[2] py-4 rounded-2xl font-bold bg-[#0d2b0f] hover:bg-[#1b5e20] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                {{ isEditing ? 'Update Announcement' : 'Publish Announcement' }}
              </button>
            </div>
          </form>
        </div>

        <!-- LIVE PREVIEW -->
        <div class="lg:col-span-5 hidden lg:block">
        

          <div class="rounded-[2.5rem] p-3 shadow-2xl overflow-hidden border-8 border-gray-200">
            <div class="bg-white rounded-[1.8rem] overflow-hidden min-h-[450px]">
              <!-- IMAGE PREVIEW -->
              <div class="h-44 w-full overflow-hidden">
                <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                <div v-else class="h-full bg-gradient-to-br from-[#2D7231] to-[#0B2010]"></div>
              </div>

              <div class="p-8">
                <span
                  class="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase mb-4 tracking-wider"
                >
                  {{ formData.type || 'Announcement' }}
                </span>

                <h3 class="text-2xl font-bold text-gray-900 leading-tight mb-4">
                  {{ formData.title || 'Your Title Here' }}
                </h3>

                <p class="text-gray-600 text-sm leading-relaxed line-clamp-6">
                  {{ formData.description || 'Start typing to see preview...' }}
                </p>

                <!-- TIME PREVIEW — only for event -->
                <div
                  v-if="formData.type === 'event' && (formData.timeIn || formData.timeOut)"
                  class="mt-4 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-xl w-fit"
                >
                  <svg
                    class="w-3 h-3 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {{ formData.timeIn || '--:--' }} — {{ formData.timeOut || '--:--' }}
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <span class="text-xs font-bold text-gray-500">CSU Admin</span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase">
                    {{ formData.datePublished }}
                  </span>
                </div>

                
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { createEvent, updateEvent } from '@/services/eventService'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const existingImageUrl = ref<string | null>(null)

const today = new Date().toISOString().split('T')[0]
const imagePreview = ref<string | null>(null)

const typeOptions: { value: 'announcement' | 'event' | 'news'; label: string }[] = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'event', label: 'Event' },
  { value: 'news', label: 'News' },
]

const formData = ref({
  title: '',
  description: '',
  attachment: null as File | null,
  datePublished: today,
  type: 'announcement' as 'announcement' | 'event' | 'news',
  timeIn: '',
  timeOut: '',
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 2500)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    formData.value.attachment = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const toDateInputValue = (dateString?: string | null) => {
  if (!dateString) return today
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return today
  return date.toISOString().split('T')[0] || today
}

const loadForEdit = async (id: string) => {
  try {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()

    if (error) throw error
    if (!data) throw new Error('Record not found.')

    formData.value.title = data.title || ''
    formData.value.description = data.description || ''
    formData.value.datePublished = toDateInputValue(data.start_date)
    formData.value.type = data.type || 'announcement'

    // Load existing time_start / time_end — stored as "HH:MM:SS", slice to "HH:MM"
    formData.value.timeIn = data.time_start ? String(data.time_start).slice(0, 5) : ''
    formData.value.timeOut = data.time_end ? String(data.time_end).slice(0, 5) : ''

    existingImageUrl.value = data.images || null
    imagePreview.value = data.images || null
    editingId.value = String(data.id)
    isEditing.value = true
  } catch (error) {
    console.error('Error loading record for edit:', error)
    showToast('Failed to load announcement', 'error')
    setTimeout(() => router.push('/admin/announcement'), 600)
  }
}

const submitForm = async () => {
  if (!formData.value.title.trim()) {
    showToast('Please enter a title', 'error')
    return
  }
  if (!formData.value.description.trim()) {
    showToast('Please enter description', 'error')
    return
  }
  if (formData.value.type === 'event') {
    if (!formData.value.timeIn) {
      showToast('Please set the event start time (Time In)', 'error')
      return
    }
    if (!formData.value.timeOut) {
      showToast('Please set the event end time (Time Out)', 'error')
      return
    }
  }

  try {
    let imageUrl = existingImageUrl.value

    if (formData.value.attachment) {
      const file = formData.value.attachment
      const fileName = `${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('events_images')
        .upload(`events/${fileName}`, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('events_images')
        .getPublicUrl(`events/${fileName}`)

      imageUrl = urlData.publicUrl
    }

    const dateValue = formData.value.datePublished || new Date().toISOString()
    const year = new Date(dateValue).getFullYear()
    const isEvent = formData.value.type === 'event'

    const payload = {
      type: formData.value.type,
      title: formData.value.title,
      description: formData.value.description,
      images: imageUrl,
      year,
      start_date: dateValue,
      end_date: dateValue,
      location: 'Library',
      is_active: true,
      created_by: '81a8d7f2-2277-4fd1-a331-dc545092dcf7',
      // time_start and time_end: only set for events, null for news/announcement
      time_start: isEvent ? formData.value.timeIn || null : null,
      time_end: isEvent ? formData.value.timeOut || null : null,
    }

    if (isEditing.value && editingId.value) {
      await updateEvent(editingId.value, payload)
    } else {
      await createEvent(payload)
    }

    showToast(
      isEditing.value
        ? 'Announcement updated successfully!'
        : 'Announcement published successfully!',
    )
    setTimeout(() => router.push('/admin/announcement'), 400)
  } catch (error) {
    console.error(error)
    showToast('Failed to publish announcement', 'error')
  }
}

const goBack = () => router.push('/admin/announcement')

onMounted(() => {
  const id = route.query.id
  if (typeof id === 'string' && id.trim()) loadForEdit(id)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
@keyframes titleFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-fade-enter-active {
  transition: all 0.25s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
