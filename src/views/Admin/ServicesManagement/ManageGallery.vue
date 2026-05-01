<template>
  <div class="page-layout">
    <Sidebar :activeTab="'GALLERY'" />
    <div class="w-full relative overflow-y-auto flex flex-col items-center bg-white">
      <!-- HERO -->
      <div class="gallery-hero">
        <div class="header-breadcrumb mb-2!">
          <span
            class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
            @click="$router.push('/admin/website/general')"
            >BACK</span
          >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span>Library Sections</span>
        </div>
        <h1 class="hero-title">
          <span class="hero-title--underlined">Library</span>
          <span class="hero-title--gold"> Sections</span>
        </h1>
        <p class="hero-subtitle">
          Manage the CSU Library Gallery —
          <strong
            >{{ totalSections }} sections · {{ totalPhotos }} photos ·
            {{ floors.length }} floors</strong
          >
        </p>
      </div>

      <!-- FLOOR NAV & SEARCH -->
      <div class="w-full relative top-0 z-30 px-8 mt-3">
        <div
          class="w-full backdrop-blur-md bg-white/80 py-2 px-8 flex items-center justify-between border border-gray-200 rounded-2xl shadow-lg"
        >
          <div class="flex gap-4">
            <button
              v-for="(floor, i) in floors"
              :key="floor.id"
              @click="activeFloor = floor.id"
              :class="[
                'px-8 py-2.5 rounded-2xl font-black transition-all duration-300 text-xs uppercase tracking-widest border-2 nav-btn',
                activeFloor === floor.id && !searchQuery
                  ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow-md'
                  : 'bg-transparent border-[#0d2b0f] text-[#0d2b0f] hover:bg-[#1b5e20] hover:border-[#1b5e20] hover:text-white',
              ]"
              :style="{ animationDelay: `${i * 0.12}s` }"
            >
              {{ floor.name }}
            </button>
          </div>

          <div class="nav-right">
            <div class="relative nav-search">
              <svg
                class="nav-search__icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search Section..."
                class="w-full pl-9 pr-4 py-3 rounded-2xl bg-gray-50 border-2 border-[#0d2b0f] text-[#0d2b0f] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#1b5e20]/10 transition-all shadow-inner"
              />
            </div>
            <button class="btn-new-nav" @click="openAdd()">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Section
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="searchQuery && filteredFloors.length === 0"
        class="flex flex-col items-center justify-center py-24 w-full animate-fade-in"
      >
        <div class="del-icon bg-gray-100! text-gray-300! mb-4!">
          <i class="fas fa-search-minus fa-2x"></i>
        </div>
        <h3 class="modal-title text-gray-400!">No Results Found</h3>
        <p class="hero-subtitle mt-1! text-center!">
          We couldn't find any matches for "<strong>{{ searchQuery }}</strong
          >".<br />
          <span class="text-[0.6rem] opacity-70 text-gray-400">Try checking the spelling.</span>
        </p>
        <button
          @click="searchQuery = ''"
          class="btn-ghost mt-6 py-2! px-5! text-[0.65rem]! rounded-full!"
        >
          <i class="fas fa-times mr-2"></i> Clear Search
        </button>
      </div>

      <!-- SECTIONS GRID -->
      <div class="w-full px-8 flex flex-col items-center mt-12 relative z-10 pb-20">
        <transition-group name="fade" tag="div" class="w-full">
          <div
            v-for="floor in searchQuery ? filteredFloors : activeFloorData"
            :key="floor.id"
            class="w-full mb-12"
          >
            <div v-for="wing in floor.wings" :key="wing.name" class="mb-20">
              <div class="wing-header mb-10">
                <div class="flex items-center gap-6 flex-1">
                  <span class="text-yellow-600 font-bold tracking-tighter text-sm">{{
                    floor.name
                  }}</span>
                  <h3 class="text-4xl font-black text-[#0d2b0f] uppercase tracking-tighter">
                    {{ wing.name }}
                  </h3>
                  <div
                    class="h-0.5 grow max-w-37.5 bg-linear-to-r from-[#0d2b0f] to-yellow-500"
                  ></div>
                </div>
                <button class="btn-wing-add" @click="openAdd(floor.id, wing.name)">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  Add to {{ wing.name }}
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <div
                  v-for="(section, idx) in wing.sections"
                  :key="section.id || idx"
                  class="group relative h-96 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 bg-gray-100 border-2 cursor-pointer border-transparent hover:-translate-y-3"
                  :style="
                    section.images.length > 0
                      ? {
                          backgroundImage: `url('${section.images[0]}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transitionDelay: `${(idx % 4) * 0.08}s`,
                        }
                      : { transitionDelay: `${(idx % 4) * 0.08}s` }
                  "
                  @click="openViewer(section)"
                  @mouseenter="startCarousel(section)"
                  @mouseleave="stopCarousel(section)"
                >
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent group-hover:from-[#1b5e20]/95 transition-all duration-500"
                  ></div>

                  <!-- Admin buttons -->
                  <div class="admin-ctrl" @click.stop>
                    <button
                      class="ac-btn ac-btn--edit"
                      style="border: 1.5px solid #eab308"
                      @click="openEdit(section, floor.id, wing.name)"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      class="ac-btn ac-btn--del"
                      style="border: 1.5px solid #ef4444"
                      @click.stop="askDelete(section, floor.id, wing.name)"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>

                  <!-- Labels & Info -->
                  <div class="absolute top-3 left-3 z-10">
                    <div
                      class="px-3 py-1 rounded-2xl text-[10px] font-bold tracking-widest uppercase shadow-sm bg-[#0d2b0f] text-white"
                    >
                      {{ floor.name }}
                    </div>
                  </div>

                  <div class="absolute inset-0 p-8 flex flex-col justify-end">
                    <div
                      class="w-10 h-1 bg-[#1b5e20] mb-4 rounded-full transition-all group-hover:w-20"
                    ></div>
                    <h4
                      class="text-white font-black text-2xl leading-tight uppercase group-hover:text-yellow-500 transition-colors duration-300"
                    >
                      {{ section.title }}
                    </h4>
                    <p
                      v-if="section.note"
                      class="text-[#66bb6a] text-[10px] font-bold uppercase mt-1 tracking-widest"
                    >
                      {{ section.note }}
                    </p>
                    <p class="text-white/80 text-sm mt-4 line-clamp-3 leading-relaxed">
                      {{ section.description }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-3">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <span class="text-white/38 text-[10px] font-semibold">
                        {{ section.images.length }} photo{{
                          section.images.length !== 1 ? 's' : ''
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- ADD SECTION BUTTON -->
                <button
                  class="relative h-96 rounded-2xl border-2 border-dashed border-[#0d2b0f]/20 bg-transparent flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 hover:border-[#1b5e20] hover:bg-[#f4f9f4] group/add"
                  @click="openAdd(floor.id, wing.name)"
                >
                  <div
                    class="w-14 h-14 rounded-2xl bg-[#0d2b0f]/05 flex items-center justify-center group-hover/add:bg-[#1b5e20]/10 transition-all"
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      class="text-[#0d2b0f]/25 group-hover/add:text-[#1b5e20] transition-colors"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-center px-4">
                    <p
                      class="text-[#0d2b0f]/30 group-hover/add:text-[#1b5e20] text-[11px] font-black uppercase tracking-widest transition-colors"
                    >
                      Add Section
                    </p>
                    <p class="text-[#0d2b0f]/20 text-[10px] mt-1 font-medium">to {{ wing.name }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- =========================
           ADD / EDIT SECTION MODAL
      ============================= -->
      <Transition name="modal">
        <div v-if="formOpen" class="modal-bg" @click.self="closeForm">
          <div class="modal-sheet">
            <!-- HEADER -->
            <div class="modal-head">
              <div>
                <p class="modal-mode">
                  <!-- ✦ as SVG icon -->
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style="
                      display: inline-block;
                      vertical-align: middle;
                      margin-right: 5px;
                      flex-shrink: 0;
                    "
                  >
                    <path
                      d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
                    />
                  </svg>
                  {{ isAdding ? 'New Section' : 'Edit Section' }}
                </p>
                <h3 class="modal-title">
                  {{ isAdding ? 'Add to Gallery' : form.title || 'Edit Section' }}
                </h3>
              </div>
              <button class="icon-btn" @click="closeForm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- BODY -->
            <div class="modal-body">
              <!-- LOCATION -->
              <div class="fg-section">Location</div>
              <div class="fg-row-2">
                <div class="fg">
                  <label>Floor</label>
                  <select v-model="form.floorId" @change="onFloorChange">
                    <option v-for="f in floors" :key="f.id" :value="f.id">{{ f.name }}</option>
                  </select>
                </div>
                <div class="fg">
                  <label>Wing</label>
                  <select v-model="form.wingName">
                    <option value="" disabled>Select Wing</option>
                    <option v-for="opt in wingOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
              </div>

              <!-- SECTION INFO -->
              <div class="fg-section">Section Info</div>
              <div class="fg">
                <label>Title <span class="req">*</span></label>
                <input v-model="form.title" placeholder="e.g. Quiet Room for PWD" />
              </div>
              <div class="fg">
                <label>Description <span class="req">*</span></label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Brief description..."
                ></textarea>
              </div>
              <div class="fg">
                <label>Note <span class="opt">· optional · shows as green label</span></label>
                <input v-model="form.note" placeholder="e.g. Female Only" />
              </div>

              <!-- PHOTOS -->
              <div class="fg-section">
                Photos <span class="photo-pill">{{ form.images.length }} / 10</span>
              </div>
              <div class="photo-grid">
                <div
                  v-for="(img, i) in form.images"
                  :key="i"
                  class="ptile"
                  :class="{ 'ptile--cover': i === 0 }"
                  @click="previewImg = img"
                >
                  <img :src="img" :alt="`Photo ${i + 1}`" />
                  <div class="ptile-over">
                    <span v-if="i === 0" class="cover-badge">Cover</span>
                    <div class="ptile-btns">
                      <!-- ★ as SVG icon -->
                      <button
                        v-if="i > 0"
                        class="pb pb--star"
                        @click.stop="setCover(i)"
                        title="Set as cover"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M12 2l2.9 8.26H23l-7 5.09 2.7 8.26L12 18.77l-6.7 4.84L8 15.35 1 10.26h8.1z"
                          />
                        </svg>
                      </button>
                      <button class="pb pb--del" @click.stop="removePhoto(i)" title="Remove">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                <label v-if="form.images.length < 10" class="photo-slot">
                  <input type="file" accept="image/*" multiple hidden @change="onPhotoUpload" />
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload</span>
                </label>
              </div>
              <p class="photo-hint">
                First photo = cover. Click star to set cover. Click photo to preview.
              </p>
            </div>

            <!-- FOOTER -->
            <div class="modal-foot">
              <button class="btn-ghost" @click="closeForm">Cancel</button>
              <button
                class="btn-save"
                :disabled="!form.title.trim() || !form.description.trim() || isSaving"
                @click="save"
              >
                <span v-if="isSaving">Saving...</span>
                <template v-else>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isAdding ? 'Add to Gallery' : 'Save Changes' }}
                </template>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- =========================
           LIGHTBOX PREVIEW
      ============================= -->
      <Transition name="fade">
        <div v-if="previewImg" class="lightbox-bg" @click="previewImg = null">
          <img :src="previewImg" class="lightbox-img" @click.stop />
          <button class="lightbox-close" @click="previewImg = null">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>

      <!-- =========================
           DELETE CONFIRMATION MODAL
      ============================= -->
      <Transition name="modal">
        <div v-if="delTarget" class="modal-bg" @click.self="delTarget = null">
          <div class="del-modal">
            <h3>Delete "{{ delTarget.sec.title }}"?</h3>
            <p>This action cannot be undone.</p>
            <div class="del-actions">
              <button
                class="btn-ghost"
                style="background-color: green; color: white"
                @click="delTarget = null"
              >
                Cancel
              </button>
              <button class="btn-danger" @click="doDelete">Yes, Delete</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- TOAST -->
      <Transition name="toast">
        <div v-if="toast" class="toast" :class="`toast--${toast.type}`">
          {{ toast.msg }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import '@/assets/styles/manage-gallery.css'

import { supabase } from '@/lib/supabase'
import {
  getGallerySections,
  createGallerySection,
  updateGallerySection,
  deleteGallerySection,
  getImagesBySection,
  addGalleryImage,
  deleteGalleryImage,
} from '@/services/manageGallery'

/* =====================================================
  STATE MANAGEMENT
===================================================== */

const hoverIntervals = new Map()
const previewImg = ref(null)

const startCarousel = (section) => {
  if (!section.images || section.images.length < 2) return
  let index = 0
  hoverIntervals.set(
    section.id,
    setInterval(() => {
      index = (index + 1) % section.images.length
      section.images.unshift(section.images.splice(index, 1)[0])
    }, 1200),
  )
}

const stopCarousel = (section) => {
  const interval = hoverIntervals.get(section.id)
  if (interval) {
    clearInterval(interval)
    hoverIntervals.delete(section.id)
  }
}

const floors = ref([
  {
    id: 1,
    name: '1st Floor',
    wings: [
      { name: 'Left Wing', sections: [] },
      { name: 'Right Wing', sections: [] },
    ],
  },
  {
    id: 2,
    name: '2nd Floor',
    wings: [
      { name: 'Left Wing', sections: [] },
      { name: 'Right Wing', sections: [] },
    ],
  },
  {
    id: 3,
    name: '3rd Floor',
    wings: [
      { name: 'Left Wing', sections: [] },
      { name: 'Right Wing', sections: [] },
    ],
  },
])

const wingOptions = ['Left Wing', 'Right Wing']
const activeFloor = ref(1)
const searchQuery = ref('')
const isSaving = ref(false)
const toast = ref(null)

// Modal/UI States
const formOpen = ref(false)
const viewerOpen = ref(false)
const delTarget = ref(null)
const viewerSection = ref(null)
const viewerImgIndex = ref(0)

// Form State
const isAdding = ref(true)
const form = ref({
  id: null,
  floorId: 1,
  wingName: 'Left Wing',
  title: '',
  description: '',
  note: '',
  images: [],
  newFiles: [],
})

/* =====================================================
  DATA FETCHING (SUPABASE)
===================================================== */
const fetchGalleryData = async () => {
  try {
    const { data: rawSections, error } = await supabase
      .from('gallery_sections') 
      .select(`
        id,
        floor,
        wing,
        section_name,
        description,
        note,
        gallery_images (
          id,
          image_url,
          display_order
        )
      `)

    if (error) throw error

    
    floors.value.forEach((f) => f.wings.forEach((w) => (w.sections = [])))

    for (const sec of rawSections) {
      const formatted = {
        id: sec.id,
        title: sec.section_name,
        description: sec.description,
        note: sec.note,
  
        images: sec.gallery_images
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => i.image_url),
      }

      const floorObj = floors.value.find((f) => f.name === sec.floor)
      if (floorObj) {
        const wingObj = floorObj.wings.find((w) => w.name === sec.wing)
        if (wingObj) wingObj.sections.push(formatted)
      }
    }
  } catch (err) {
    showToast('Failed to load gallery: ' + err.message, 'error')
  }
}

/* =====================================================
  IMAGE UPLOAD
===================================================== */
const uploadImages = async (sectionId) => {
  const uploadedUrls = []
  for (const file of form.value.newFiles) {
    const filePath = `sections/${sectionId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('gallery_images').upload(filePath, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('gallery_images').getPublicUrl(filePath)
    uploadedUrls.push(urlData.publicUrl)
  }
  return uploadedUrls
}

/* =====================================================
  SAVE / ADD / EDIT
===================================================== */
const save = async () => {
  if (!form.value.title || !form.value.description) {
    showToast('Please fill in required fields', 'error')
    return
  }

  isSaving.value = true
  try {
    const sectionPayload = {
      floor: floors.value.find((f) => f.id === form.value.floorId)?.name,
      wing: form.value.wingName,
      section_name: form.value.title,
      description: form.value.description,
      note: form.value.note,
    }

    let sectionId = form.value.id

    
    if (isAdding.value) {
      const created = await createGallerySection(sectionPayload)
      sectionId = created.id
    } else {
      await updateGallerySection(sectionId, sectionPayload)
    }

    
    let finalImageUrls = form.value.images.filter((img) => img.startsWith('http'))
    if (form.value.newFiles.length > 0) {
      const newUrls = await uploadImages(sectionId)
      finalImageUrls = [...finalImageUrls, ...newUrls]
    }

   
    const { error: delError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('section_id', sectionId)
    
    if (delError) throw delError

    
    const imagesToInsert = finalImageUrls.map((url, index) => ({
      section_id: sectionId,
      image_url: url,
      display_order: index
    }))

    if (imagesToInsert.length > 0) {
      const { error: insError } = await supabase
        .from('gallery_images')
        .insert(imagesToInsert)
      if (insError) throw insError
    }

    showToast('Gallery updated successfully!')
    await fetchGalleryData()
    closeForm()
  } catch (err) {
    console.error('Save Error:', err)
    showToast(err.message || 'An error occurred', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchGalleryData)

/* =====================================================
   DELETE SECTION
===================================================== */
const doDelete = async () => {
  try {
    const sectionId = delTarget.value.sec.id

    const imageRecords = await getImagesBySection(sectionId)

    if (imageRecords.length > 0) {
      const pathsToDelete = imageRecords.map(
        (img) => img.image_url.split('/public/gallery_images/')[1],
      )
      const { error: storageErr } = await supabase.storage
        .from('gallery_images')
        .remove(pathsToDelete)
      if (storageErr) console.warn('Storage cleanup failed:', storageErr.message)
    }

    for (const img of imageRecords) await deleteGalleryImage(img.id)
    await deleteGallerySection(sectionId)

    showToast('Section and files deleted', 'success')
    await fetchGalleryData()
    delTarget.value = null
    viewerOpen.value = false
  } catch (err) {
    showToast('Delete failed', 'error')
    console.error(err)
  }
}

const askDelete = (sec, floorId, wingName) => {
  delTarget.value = { sec, floorId, wingName }
}

const askDeleteFromViewer = () => {
  if (!viewerSection.value) return
  delTarget.value = { sec: viewerSection.value }
}

/* =====================================================
   MODAL & VIEWER CONTROLS
===================================================== */
const openAdd = (floorId = 1, wingName = 'Left Wing') => {
  isAdding.value = true
  form.value = {
    id: null,
    floorId,
    wingName,
    title: '',
    description: '',
    note: '',
    images: [],
    newFiles: [],
  }
  formOpen.value = true
}

const openEdit = (section, floorId, wingName) => {
  isAdding.value = false
  form.value = { ...section, floorId, wingName, newFiles: [] }
  formOpen.value = true
}

const openViewer = async (section) => {
  try {
    viewerOpen.value = true
    viewerImgIndex.value = 0
    const imgs = await getImagesBySection(section.id)
    viewerSection.value = {
      ...section,
      images: imgs.map((i) => i.image_url),
    }
  } catch (err) {
    console.error('Failed to fetch images:', err)
    showToast('Failed to load images for viewer', 'error')
  }
}

const closeViewer = () => {
  viewerOpen.value = false
  viewerSection.value = null
}

const prevImg = () => {
  if (!viewerSection.value) return
  viewerImgIndex.value =
    (viewerImgIndex.value - 1 + viewerSection.value.images.length) %
    viewerSection.value.images.length
}

const nextImg = () => {
  if (!viewerSection.value) return
  viewerImgIndex.value = (viewerImgIndex.value + 1) % viewerSection.value.images.length
}

/* =====================================================
  PHOTO HANDLING
===================================================== */
import imageCompression from 'browser-image-compression'

const onPhotoUpload = async (e) => {
  const files = Array.from(e.target.files)
  const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 }

  for (const file of files) {
    try {
      const compressedFile = await imageCompression(file, options)
      form.value.newFiles.push(compressedFile)
      form.value.images.push(URL.createObjectURL(compressedFile))
    } catch (error) {
      console.error('Compression Error:', error)
    }
  }
}

const removePhoto = (idx) => {
  form.value.images.splice(idx, 1)
  if (form.value.newFiles[idx]) form.value.newFiles.splice(idx, 1)
  // close lightbox if the previewed image was removed
  if (previewImg.value && !form.value.images.includes(previewImg.value)) {
    previewImg.value = null
  }
}

const setCover = (idx) => {
  const img = form.value.images.splice(idx, 1)[0]
  form.value.images.unshift(img)
}

/* =====================================================
   SEARCH & COMPUTED DATA
===================================================== */
const activeFloorData = computed(() => floors.value.filter((f) => f.id === activeFloor.value))

const filteredFloors = computed(() => {
  if (!searchQuery.value) return floors.value
  const q = searchQuery.value.toLowerCase()
  return floors.value
    .map((f) => ({
      ...f,
      wings: f.wings
        .map((w) => ({
          ...w,
          sections: w.sections.filter(
            (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
          ),
        }))
        .filter((w) => w.sections.length > 0),
    }))
    .filter((f) => f.wings.length > 0)
})

const totalSections = computed(() =>
  floors.value.reduce((a, f) => a + f.wings.reduce((wa, w) => wa + w.sections.length, 0), 0),
)
const totalPhotos = computed(() =>
  floors.value.reduce(
    (a, f) =>
      a + f.wings.reduce((wa, w) => wa + w.sections.reduce((sa, s) => sa + s.images.length, 0), 0),
    0,
  ),
)

/* =====================================================
 UTILS
===================================================== */
const closeForm = () => {
  previewImg.value = null
  formOpen.value = false
}

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => (toast.value = null), 3000)
}
</script>

<style>
/* ── LIGHTBOX ── */
.lightbox-bg {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  cursor: default;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.15s;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* ── LIGHTBOX TRANSITION ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── MODAL MODE LABEL ── */
.modal-mode {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
