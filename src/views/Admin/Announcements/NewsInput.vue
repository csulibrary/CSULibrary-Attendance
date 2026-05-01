<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
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

    <main class="report-root flex-1 overflow-y-auto">
      <div class="flex flex-col">
        <div
          class="flex items-center gap-1.5 leading-none text-[0.68rem] font-bold tracking-[0.15em] uppercase text-[rgba(13,43,15,0.4)]"
        >
          <span
            class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
            @click="$router.push('/admin/announcement')"
            >BACK</span
          >
          <svg class="w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span>CREATE NEWS ANNOUNCEMENT</span>
        </div>
        <h1
          class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
        >
          <span
            class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[110px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
            >News</span
          ><span class="text-yellow-500"> Announcements</span>
        </h1>
        <p class="text-sm text-[rgba(13,43,15,0.5)]">
          Latest updates and announcements for everyone.
        </p>
      </div>

      <!-- Form Section -->
      <div class="max-w-4xl mx-auto mt-10 px-4 pb-16">
        <form @submit.prevent="handlePublish" class="space-y-6">
          <!-- News Type -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-3 rounded-lg"
                style="background: linear-gradient(135deg, #2d7231, #0b2010)"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #fdbe33"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h10M7 16h6"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold"
                style="color: #0b2010; font-family: 'Poppins', sans-serif"
              >
                News Type
              </h2>
            </div>
            <div
              style="
                height: 2px;
                background: linear-gradient(to right, #2d7231, #fdbe33, transparent);
                margin-bottom: 24px;
                border-radius: 2px;
              "
            ></div>

            <select
              id="newsType"
              v-model="formData.type"
              class="w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all input-field"
              style="border-color: #2d7231; background-color: #fafafa; color: #0b2010"
              required
            >
              <option value="news_nbwc">NBWC</option>
              <option value="news_bsp">BSP</option>
              <option value="news_starbooks">Starbooks</option>
            </select>
            <p class="text-xs text-gray-500 mt-3" style="font-family: 'Poppins', sans-serif">
              Choose where this news belongs.
            </p>
          </div>

          <!-- News Title -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-3 rounded-lg"
                style="background: linear-gradient(135deg, #2d7231, #0b2010)"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #fdbe33"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold"
                style="color: #0b2010; font-family: 'Poppins', sans-serif"
              >
                News Title
              </h2>
            </div>
            <div
              style="
                height: 2px;
                background: linear-gradient(to right, #2d7231, #fdbe33, transparent);
                margin-bottom: 24px;
                border-radius: 2px;
              "
            ></div>

            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Enter news title (e.g., BSP Knowledge Resource Network)"
              class="w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all input-field"
              style="border-color: #2d7231; background-color: #fafafa; color: #0b2010"
              required
            />
            <p class="text-xs text-gray-500 mt-3" style="font-family: 'Poppins', sans-serif">
              Keep it concise and descriptive (max 100 characters)
            </p>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-3 rounded-lg"
                style="background: linear-gradient(135deg, #2d7231, #0b2010)"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #fdbe33"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold"
                style="color: #0b2010; font-family: 'Poppins', sans-serif"
              >
                Description
              </h2>
            </div>
            <div
              style="
                height: 2px;
                background: linear-gradient(to right, #2d7231, #fdbe33, transparent);
                margin-bottom: 24px;
                border-radius: 2px;
              "
            ></div>

            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Write your news content here..."
              rows="8"
              class="w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all resize-none input-field"
              style="border-color: #2d7231; background-color: #fafafa; color: #0b2010"
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-3" style="font-family: 'Poppins', sans-serif">
              Provide detailed information about your news article (max 2000 characters)
            </p>
          </div>

          <!-- Attachment -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-3 rounded-lg"
                style="background: linear-gradient(135deg, #2d7231, #0b2010)"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #fdbe33"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold"
                style="color: #0b2010; font-family: 'Poppins', sans-serif"
              >
                Attachment (Optional)
              </h2>
            </div>
            <div
              style="
                height: 2px;
                background: linear-gradient(to right, #2d7231, #fdbe33, transparent);
                margin-bottom: 24px;
                border-radius: 2px;
              "
            ></div>

            <div
              class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all attachment-zone"
              style="border-color: #2d7231; background-color: #fafafa"
            >
              <input
                id="attachment"
                type="file"
                @change="handleFileUpload"
                class="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              <label for="attachment" class="cursor-pointer block">
                <svg
                  class="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #2d7231"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p class="font-medium" style="color: #0b2010; font-family: 'Poppins', sans-serif">
                  {{
                    formData.attachment
                      ? formData.attachment.name
                      : 'Click to upload or drag and drop'
                  }}
                </p>
                <p class="text-sm text-gray-500 mt-2" style="font-family: 'Poppins', sans-serif">
                  PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
                </p>
              </label>
            </div>
          </div>

          <!-- Date Published -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-3 rounded-lg"
                style="background: linear-gradient(135deg, #2d7231, #0b2010)"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: #fdbe33"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold"
                style="color: #0b2010; font-family: 'Poppins', sans-serif"
              >
                Publication Date
              </h2>
            </div>
            <div
              style="
                height: 2px;
                background: linear-gradient(to right, #2d7231, #fdbe33, transparent);
                margin-bottom: 24px;
                border-radius: 2px;
              "
            ></div>

            <input
              id="datePublished"
              v-model="formData.datePublished"
              type="date"
              class="w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all input-field"
              style="border-color: #2d7231; background-color: #fafafa; color: #0b2010"
              required
            />
            <p class="text-xs text-gray-500 mt-3" style="font-family: 'Poppins', sans-serif">
              When should this news article be published?
            </p>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4 pt-8">
            <RouterLink
              to="/admin/announcement"
              class="flex-1 px-8 py-4 rounded-xl font-bold text-center transition-all duration-300 btn-cancel"
              style="
                background-color: #fbfbfb;
                color: #0b2010;
                border: 2px solid #d0d0d0;
                text-decoration: none;
              "
            >
              Cancel
            </RouterLink>
            <button
              type="submit"
              class="flex-1 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 btn-submit"
              style="background-color: #0d2b0f"
            >
              {{ isEditing ? 'Update News' : 'Publish News' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'
import '@/assets/styles/report-analytics.css'

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const existingImageUrl = ref<string | null>(null)

const today = new Date().toISOString().split('T')[0] || ''

const formData = ref<{
  type: 'news_nbwc' | 'news_bsp' | 'news_starbooks'
  title: string
  description: string
  attachment: File | null
  datePublished: string
}>({
  type: 'news_nbwc',
  title: '',
  description: '',
  attachment: null,
  datePublished: today,
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

const toDateInputValue = (dateString?: string | null) => {
  if (!dateString) return today
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return today
  return date.toISOString().split('T')[0] || today
}

const parseNewsTypeAndTitle = (
  rawTitle: string,
): { type: 'news_nbwc' | 'news_bsp' | 'news_starbooks'; cleanTitle: string } => {
  const match = rawTitle.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (!match) return { type: 'news_nbwc', cleanTitle: rawTitle }

  const category = (match[1] || '').trim().toUpperCase()
  const cleanTitle = (match[2] || '').trim()

  if (category === 'BSP') return { type: 'news_bsp', cleanTitle }
  if (category === 'STARBOOKS') return { type: 'news_starbooks', cleanTitle }
  return { type: 'news_nbwc', cleanTitle }
}

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
  }
}

const loadForEdit = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, content, image_url, created_at, type')
      .eq('id', id)
      .eq('type', 'news')
      .single()

    if (error) throw error
    if (!data) throw new Error('News item not found.')

    const parsed = parseNewsTypeAndTitle(data.title || '')
    formData.value.type = parsed.type
    formData.value.title = parsed.cleanTitle
    formData.value.description = data.content || ''
    formData.value.datePublished = toDateInputValue(data.created_at)
    existingImageUrl.value = data.image_url || null

    editingId.value = data.id as string
    isEditing.value = true
  } catch (error) {
    console.error('Error loading news for edit:', error)
    const message = error instanceof Error ? error.message : 'Failed to load news item.'
    showToast(message, 'error')
    setTimeout(() => {
      router.push('/admin/announcement')
    }, 600)
  }
}

const handlePublish = async () => {
  if (!formData.value.title.trim()) {
    showToast('Please enter a title', 'error')
    return
  }
  if (!formData.value.description.trim()) {
    showToast('Please enter description', 'error')
    return
  }

  try {
    let imageUrl: string | null = existingImageUrl.value

    if (formData.value.attachment) {
      const file = formData.value.attachment
      const fileName = `${Date.now()}_${file.name}`
      const filePath = `announcements/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('events_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('events_images').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    const datePublished = formData.value.datePublished || today
    const createdAt = `${datePublished}T00:00:00.000Z`

    const payload = {
      type: 'news',
      title: `[${formData.value.type.toUpperCase().replace('NEWS_', '')}] ${formData.value.title.trim()}`,
      content: formData.value.description.trim(),
      image_url: imageUrl,
      event_id: null,
      created_at: createdAt,
    }

    if (isEditing.value && editingId.value) {
      const { error: updateError } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', editingId.value)

      if (updateError) {
        console.error('Update error details:', updateError.message || updateError)
        throw updateError
      }
    } else {
      const { error: insertError } = await supabase.from('announcements').insert([payload])

      if (insertError) {
        console.error('Insert error details:', insertError.message || insertError)
        throw insertError
      }
    }

    showToast(isEditing.value ? 'News updated successfully!' : 'News published successfully!')
    setTimeout(() => {
      router.push('/admin/announcement')
    }, 400)
  } catch (error) {
    console.error('Error publishing news:', error)
    const message = error instanceof Error ? error.message : 'Failed to publish news.'
    showToast(message, 'error')
  }
}

const goBack = () => {
  router.push('/admin/announcement')
}

onMounted(() => {
  const id = route.query.id
  if (typeof id === 'string' && id.trim()) {
    loadForEdit(id)
  }
})
</script>

<style scoped>
.breadcrumb-back {
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  transition: opacity 0.15s ease;
}
.breadcrumb-back:hover {
  opacity: 0.7;
}

.input-field:focus {
  border-color: #f28500 !important;
  box-shadow: 0 0 0 3px rgba(242, 133, 0, 0.1);
}

input::placeholder,
textarea::placeholder {
  color: #bdbdbd;
}

.btn-cancel:hover {
  background-color: #f0f0f0 !important;
}

.btn-submit:hover {
  background-color: #1b5e20 !important;
}

.attachment-zone:hover {
  border-color: #f28500;
  background-color: #fff9e6 !important;
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
</style>
