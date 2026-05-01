<template>
  <div class="flex h-screen w-full overflow-hidden bg-white">
    <Sidebar />

    <main ref="recordsMainRef" class="flex-1 overflow-y-auto relative">
      <!-- ═══ PAGE HEADER ═══════════════════════════════════════════════════ -->
      <header class="page-header">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <button @click="$router.push('/admin/website/general')" class="breadcrumb-back">
            Back
          </button>
          <svg
            class="breadcrumb-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="breadcrumb-current">Manage Records</span>
        </div>

        <!-- Title row -->
        <div class="header-title-row">
          <div>
            <h1 class="page-title">Manage <span class="title-accent">Records</span></h1>
            <div class="title-underline"></div>
            <p class="page-subtitle">Manage and update digital record cards on the Records page.</p>
          </div>
          <div class="header-actions">
            <button @click="openAddModal" class="add-card-btn">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Card
            </button>
          </div>
        </div>
      </header>

      <!-- ═══ TOAST ══════════════════════════════════════════════════════════ -->
      <transition name="toast">
        <div
          v-if="toast.show"
          :class="[
            'fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-[13px] font-semibold transition-all font-[\'Poppins\']',
            toast.type === 'success' ? 'bg-[#0d2b0f]' : 'bg-red-600',
          ]"
        >
          <CheckCircle v-if="toast.type === 'success'" class="w-4 h-4" />
          <XCircle v-else class="w-4 h-4" />
          {{ toast.message }}
        </div>
      </transition>

      <!-- ═══ CONTENT ════════════════════════════════════════════════════════ -->
      <div class="page-content">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-24">
          <div class="inline-flex p-5 rounded bg-[#0d2b0f]/06 mb-4 animate-pulse">
            <LayoutGrid class="w-8 h-8 text-[#0d2b0f]/30" />
          </div>
          <p class="text-[14px] text-[#bbb] font-light">Loading records...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="text-center py-24">
          <div class="inline-flex p-5 rounded bg-red-50 mb-4">
            <XCircle class="w-8 h-8 text-red-300" />
          </div>
          <p class="text-[14px] text-red-400 font-light mb-3">{{ loadError }}</p>
          <button @click="loadRecords" class="btn-save text-[11px]">
            <RefreshCw class="w-3.5 h-3.5" /> Retry
          </button>
        </div>

        <!-- Records Cards -->
        <div v-else class="grid grid-cols-1 gap-5">
          <transition-group name="card-list">
            <div
              v-for="(record, index) in records"
              :key="record.id"
              class="manage-card bg-white border border-[#0d2b0f]/8 shadow-sm overflow-hidden"
              :style="`animation-delay: ${0.1 + index * 0.08}s`"
            >
              <!-- Card Header -->
              <div
                class="flex items-center justify-between px-6 py-4 border-b border-[#0d2b0f]/06 bg-[#f7f5f0]"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded bg-[#0d2b0f]/8 border border-[#0d2b0f]/10">
                    <component :is="resolveIcon(record.iconKey)" class="w-4 h-4 text-[#0d2b0f]" />
                  </div>
                  <div>
                    <h3 class="text-[12px] font-extrabold tracking-widest uppercase text-[#0d2b0f]">
                      {{ record.title }}
                    </h3>
                    <span class="text-[10px] text-[#aaa] font-normal"
                      >Card #{{ index + 1 }} · Records Page</span
                    >
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    @click="toggleVisibility(record)"
                    :class="[
                      'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 border rounded',
                      record.visible
                        ? 'bg-[#e8f5e9] text-[#1b5e20] border-[#1b5e20]/20 hover:bg-[#c8e6c9]'
                        : 'bg-[#fafafa] text-[#aaa] border-[#ddd] hover:bg-[#f0f0f0]',
                    ]"
                  >
                    <Eye v-if="record.visible" class="w-3.5 h-3.5" />
                    <EyeOff v-else class="w-3.5 h-3.5" />
                    {{ record.visible ? 'Visible' : 'Hidden' }}
                  </button>
                  <button
                    @click="toggleEdit(record)"
                    :class="[
                      'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 border rounded',
                      record.editing
                        ? 'bg-[#fff3e0] text-[#e65100] border-[#f9a825]/40'
                        : 'bg-white text-[#555] border-[#ddd] hover:border-[#0d2b0f]/30 hover:text-[#0d2b0f]',
                    ]"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    {{ record.editing ? 'Editing...' : 'Edit' }}
                  </button>
                  <button
                    @click="confirmDelete(record)"
                    :disabled="record.deleting"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 border rounded bg-white text-[#c62828] border-[#ffcdd2] hover:bg-[#ffebee] hover:border-[#ef9a9a] disabled:opacity-50"
                  >
                    <Loader2 v-if="record.deleting" class="w-3.5 h-3.5 animate-spin" />
                    <Trash2 v-else class="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              </div>

              <!-- View Mode -->
              <div v-if="!record.editing" class="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="field-label">Button Label</p>
                  <p class="text-[13px] text-[#333] font-medium">{{ record.button_label }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="field-label">
                    {{ record.linkType === 'route' ? 'Router Route Name' : 'Link / URL' }}
                  </p>
                  <p class="text-[13px] text-[#333] font-medium break-all">
                    <span v-if="record.linkType === 'route'" class="text-[#0d2b0f]"
                      >→ route: {{ record.url }}</span
                    >
                    <a
                      v-else
                      :href="record.url ?? '#'"
                      target="_blank"
                      class="text-[#1b5e20] underline underline-offset-2 hover:text-[#2e7d32]"
                      >{{ record.url || '(no link set)' }}</a
                    >
                  </p>
                </div>
                <div class="md:col-span-3">
                  <p class="field-label">Description</p>
                  <p class="text-[13px] text-[#555] leading-relaxed font-light">
                    {{ record.description }}
                  </p>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="field-label mb-1.5 block">Card Title</label>
                  <input
                    v-model="record.draft.title"
                    type="text"
                    class="field"
                    placeholder="e.g. CD-ROM"
                  />
                </div>
                <div>
                  <label class="field-label mb-1.5 block">Button Label</label>
                  <input
                    v-model="record.draft.button_label"
                    type="text"
                    class="field"
                    placeholder="e.g. Download CD-ROM"
                  />
                </div>

                <!-- Icon Picker -->
                <div class="md:col-span-2">
                  <label class="field-label mb-1.5 block">Icon</label>
                  <div class="flex items-center gap-2 flex-wrap">
                    <button
                      v-for="opt in quickIcons"
                      :key="opt.key"
                      @click="record.draft.iconKey = opt.key"
                      :title="opt.label"
                      :class="[
                        'flex flex-col items-center gap-1 px-3 py-2 border transition-all duration-150 text-[9px] font-bold tracking-wider uppercase rounded',
                        record.draft.iconKey === opt.key
                          ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow scale-105'
                          : 'bg-white border-[#ddd] text-[#666] hover:border-[#0d2b0f]/30 hover:text-[#0d2b0f]',
                      ]"
                    >
                      <component :is="opt.component" class="w-4 h-4" />{{ opt.label }}
                    </button>
                    <button
                      @click="openIconBrowser(record.draft)"
                      :class="[
                        'flex flex-col items-center gap-1 px-3 py-2 border transition-all duration-150 text-[9px] font-bold tracking-wider uppercase rounded',
                        !quickIcons.find((o) => o.key === record.draft.iconKey)
                          ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow'
                          : 'bg-[#f0fdf4] border-[#0d2b0f]/20 text-[#0d2b0f] hover:bg-[#e8f5e9]',
                      ]"
                    >
                      <LayoutGrid class="w-4 h-4" />Browse
                    </button>
                    <div
                      v-if="!quickIcons.find((o) => o.key === record.draft.iconKey)"
                      class="flex items-center gap-1.5 px-3 py-2 rounded bg-[#e8f5e9] border border-[#0d2b0f]/15 text-[#0d2b0f]"
                    >
                      <component :is="resolveIcon(record.draft.iconKey)" class="w-4 h-4" />
                      <span class="text-[10px] font-bold tracking-wide">{{
                        record.draft.iconKey
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="field-label mb-1.5 block">Link Type</label>
                  <div class="flex gap-2">
                    <button
                      @click="record.draft.linkType = 'url'"
                      :class="[
                        'flex-1 py-2 text-[12px] font-semibold border transition-all rounded',
                        record.draft.linkType === 'url'
                          ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                          : 'bg-white text-[#888] border-[#ddd] hover:border-[#0d2b0f]/30',
                      ]"
                    >
                      External URL
                    </button>
                    <button
                      @click="record.draft.linkType = 'route'"
                      :class="[
                        'flex-1 py-2 text-[12px] font-semibold border transition-all rounded',
                        record.draft.linkType === 'route'
                          ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                          : 'bg-white text-[#888] border-[#ddd] hover:border-[#0d2b0f]/30',
                      ]"
                    >
                      Router Route
                    </button>
                  </div>
                </div>
                <div>
                  <label class="field-label mb-1.5 block">{{
                    record.draft.linkType === 'route' ? 'Route Name' : 'URL / Google Drive Link'
                  }}</label>
                  <input
                    v-model="record.draft.url"
                    type="text"
                    class="field"
                    :placeholder="
                      record.draft.linkType === 'route'
                        ? 'e.g. eresources'
                        : 'https://drive.google.com/...'
                    "
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="field-label mb-1.5 block">Description</label>
                  <textarea
                    v-model="record.draft.description"
                    rows="3"
                    class="field resize-none"
                    placeholder="Short description shown on the card..."
                  ></textarea>
                </div>
                <div class="md:col-span-2 flex items-center justify-end gap-3 pt-1">
                  <button @click="cancelEdit(record)" class="btn-cancel">Cancel</button>
                  <button @click="saveRecord(record)" :disabled="record.saving" class="btn-save">
                    <Loader2 v-if="record.saving" class="w-3.5 h-3.5 animate-spin" />
                    <Save v-else class="w-3.5 h-3.5" />
                    {{ record.saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </div>
          </transition-group>

          <!-- Empty State -->
          <div v-if="records.length === 0 && !loading" class="text-center py-24">
            <div class="inline-flex p-5 rounded bg-[#0d2b0f]/06 mb-4">
              <LayoutGrid class="w-8 h-8 text-[#0d2b0f]/30" />
            </div>
            <p class="text-[14px] text-[#bbb] font-light">No record cards yet. Add one above!</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- ═══ ADD CARD MODAL ════════════════════════════════════════════════════ -->
  <transition name="modal">
    <div
      v-if="addModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeAddModal"
    >
      <div class="modal-box relative w-full max-w-xl bg-white overflow-hidden shadow-2xl">
        <!-- Modal header -->
        <div class="modal-header">
          <div class="modal-header-accent"></div>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded bg-[#0d2b0f]/8 border border-[#0d2b0f]/10">
              <Plus class="w-4 h-4 text-[#0d2b0f]" />
            </div>
            <div>
              <h3 class="modal-title">Add New Card</h3>
              <span class="text-[11px] text-[#aaa]">This card will appear on the Records page</span>
            </div>
          </div>
          <button @click="closeAddModal" class="modal-close ml-auto">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[65vh] overflow-y-auto">
          <div>
            <label class="field-label mb-1.5 block"
              >Card Title <span class="text-red-400">*</span></label
            >
            <input
              v-model="addModal.form.title"
              type="text"
              class="field"
              placeholder="e.g. Research Portal"
            />
          </div>
          <div>
            <label class="field-label mb-1.5 block"
              >Button Label <span class="text-red-400">*</span></label
            >
            <input
              v-model="addModal.form.button_label"
              type="text"
              class="field"
              placeholder="e.g. Go to Portal"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="field-label mb-1.5 block">Icon <span class="text-red-400">*</span></label>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="opt in quickIcons"
                :key="opt.key"
                @click="addModal.form.iconKey = opt.key"
                :title="opt.label"
                :class="[
                  'flex flex-col items-center gap-1.5 px-3 py-2.5 border transition-all duration-150 text-[9px] font-bold tracking-wider uppercase rounded',
                  addModal.form.iconKey === opt.key
                    ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow-md scale-105'
                    : 'bg-white border-[#ddd] text-[#666] hover:border-[#0d2b0f]/30 hover:text-[#0d2b0f]',
                ]"
              >
                <component :is="opt.component" class="w-5 h-5" />{{ opt.label }}
              </button>
              <button
                @click="openIconBrowser(addModal.form)"
                :class="[
                  'flex flex-col items-center gap-1.5 px-3 py-2.5 border transition-all duration-150 text-[9px] font-bold tracking-wider uppercase rounded',
                  !quickIcons.find((o) => o.key === addModal.form.iconKey)
                    ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow'
                    : 'bg-[#f0fdf4] border-[#0d2b0f]/20 text-[#0d2b0f] hover:bg-[#e8f5e9]',
                ]"
              >
                <LayoutGrid class="w-5 h-5" />Browse
              </button>
              <div
                v-if="!quickIcons.find((o) => o.key === addModal.form.iconKey)"
                class="flex items-center gap-1.5 px-3 py-2.5 rounded bg-[#e8f5e9] border border-[#0d2b0f]/15 text-[#0d2b0f]"
              >
                <component :is="resolveIcon(addModal.form.iconKey)" class="w-5 h-5" />
                <span class="text-[10px] font-bold tracking-wide">{{ addModal.form.iconKey }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="field-label mb-1.5 block">Link Type</label>
            <div class="flex gap-2">
              <button
                @click="addModal.form.linkType = 'url'"
                :class="[
                  'flex-1 py-2 text-[12px] font-semibold border transition-all rounded',
                  addModal.form.linkType === 'url'
                    ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                    : 'bg-white text-[#888] border-[#ddd] hover:border-[#0d2b0f]/30',
                ]"
              >
                External URL
              </button>
              <button
                @click="addModal.form.linkType = 'route'"
                :class="[
                  'flex-1 py-2 text-[12px] font-semibold border transition-all rounded',
                  addModal.form.linkType === 'route'
                    ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                    : 'bg-white text-[#888] border-[#ddd] hover:border-[#0d2b0f]/30',
                ]"
              >
                Router Route
              </button>
            </div>
          </div>
          <div>
            <label class="field-label mb-1.5 block">{{
              addModal.form.linkType === 'route' ? 'Route Name' : 'URL / Google Drive Link'
            }}</label>
            <input
              v-model="addModal.form.url"
              type="text"
              class="field"
              :placeholder="
                addModal.form.linkType === 'route'
                  ? 'e.g. eresources'
                  : 'https://drive.google.com/...'
              "
            />
          </div>
          <div class="sm:col-span-2">
            <label class="field-label mb-1.5 block">Description</label>
            <textarea
              v-model="addModal.form.description"
              rows="3"
              class="field resize-none"
              placeholder="Short description shown on the card..."
            ></textarea>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#0d2b0f]/08 bg-white"
        >
          <button @click="closeAddModal" class="btn-cancel">Cancel</button>
          <button @click="addRecord" :disabled="addModal.saving" class="btn-save">
            <Loader2 v-if="addModal.saving" class="w-3.5 h-3.5 animate-spin" />
            <Plus v-else class="w-3.5 h-3.5" />
            {{ addModal.saving ? 'Adding...' : 'Add Card' }}
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- ═══ ICON BROWSER MODAL ════════════════════════════════════════════════ -->
  <transition name="modal">
    <div
      v-if="iconBrowser.open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="closeIconBrowser"
    >
      <div
        class="modal-box w-full max-w-2xl bg-white overflow-hidden shadow-2xl flex flex-col"
        style="max-height: 85vh"
      >
        <div class="modal-header flex-shrink-0">
          <div class="modal-header-accent"></div>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded bg-[#0d2b0f]/8 border border-[#0d2b0f]/10">
              <LayoutGrid class="w-4 h-4 text-[#0d2b0f]" />
            </div>
            <div>
              <h3 class="modal-title">Browse Icons</h3>
              <span class="text-[11px] text-[#aaa]"
                >{{ filteredBrowseIcons.length }} icons available</span
              >
            </div>
          </div>
          <button @click="closeIconBrowser" class="modal-close ml-auto">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div
          class="px-5 py-3 border-b border-[#0d2b0f]/08 bg-white flex-shrink-0 flex flex-col gap-3"
        >
          <div class="relative">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
            <input
              v-model="iconBrowser.search"
              type="text"
              placeholder="Search icons... (e.g. book, file, chart)"
              class="w-full pl-10 pr-4 py-2.5 border border-[#0d2b0f]/15 bg-white text-[13px] text-[#333] font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#0d2b0f]/15 focus:border-[#0d2b0f]/30 transition rounded"
            />
          </div>
          <div class="flex gap-1.5 flex-wrap">
            <button
              v-for="cat in iconCategories"
              :key="cat.key"
              @click="iconBrowser.category = cat.key"
              :class="[
                'px-3 py-1 text-[10px] font-bold tracking-wide uppercase transition-all border rounded',
                iconBrowser.category === cat.key
                  ? 'bg-[#0d2b0f] text-white border-[#0d2b0f]'
                  : 'bg-white text-[#888] border-[#ddd] hover:border-[#0d2b0f]/30 hover:text-[#0d2b0f]',
              ]"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <div class="overflow-y-auto flex-1 p-4">
          <div v-if="filteredBrowseIcons.length === 0" class="text-center py-12">
            <Search class="w-8 h-8 text-[#ccc] mx-auto mb-2" />
            <p class="text-[13px] text-[#bbb]">No icons found for "{{ iconBrowser.search }}"</p>
          </div>
          <div v-else class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            <button
              v-for="opt in filteredBrowseIcons"
              :key="opt.key"
              @click="selectIconFromBrowser(opt.key)"
              :title="opt.label"
              :class="[
                'flex flex-col items-center gap-1 p-2 border transition-all duration-100 group rounded',
                iconBrowser.selected === opt.key
                  ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow-md scale-105'
                  : 'bg-white border-transparent hover:border-[#0d2b0f]/20 hover:bg-[#f0fdf4] text-[#555] hover:text-[#0d2b0f]',
              ]"
            >
              <component :is="opt.component" class="w-5 h-5 flex-shrink-0" />
              <span
                class="text-[8px] font-semibold tracking-wide text-center leading-tight w-full truncate"
                >{{ opt.label }}</span
              >
            </button>
          </div>
        </div>

        <div
          class="flex items-center justify-between px-6 py-4 border-t border-[#0d2b0f]/08 bg-[#f7f5f0] flex-shrink-0"
        >
          <div class="text-[12px] text-[#888]">
            <span v-if="iconBrowser.selected"
              >Selected:
              <span class="font-bold text-[#0d2b0f]">{{ iconBrowser.selected }}</span></span
            >
            <span v-else class="text-[#ccc]">No icon selected</span>
          </div>
          <div class="flex gap-2">
            <button @click="closeIconBrowser" class="btn-cancel">Cancel</button>
            <button
              @click="confirmIconSelection"
              :disabled="!iconBrowser.selected"
              :class="['btn-save', !iconBrowser.selected && 'opacity-40 cursor-not-allowed']"
            >
              <Check class="w-3.5 h-3.5" />Use This Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- ═══ DELETE CONFIRM MODAL ══════════════════════════════════════════════ -->
  <transition name="modal">
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="deleteTarget = null"
    >
      <div class="modal-box w-full max-w-sm bg-white overflow-hidden shadow-2xl">
        <div class="modal-header">
          <div class="modal-header-accent modal-header-accent-danger"></div>
          <h3 class="modal-title">Delete this card?</h3>
          <button @click="deleteTarget = null" class="modal-close ml-auto">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="px-6 py-5">
          <p class="text-[13px] text-[#666] leading-relaxed">
            <span class="font-semibold text-[#0d2b0f]">"{{ deleteTarget?.title }}"</span>
            will be removed from the Records page. This cannot be undone.
          </p>
        </div>
        <div class="flex gap-3 px-6 pb-6">
          <button @click="deleteTarget = null" class="flex-1 btn-cancel justify-center">
            Cancel
          </button>
          <button @click="deleteRecord" class="flex-1 btn-delete justify-center">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
)

// ─── Supabase helpers (inlined) ───────────────────────────────────────────────
interface PublicRecordRow {
  id: string
  title: string | null
  button_label: string | null
  description: string | null
  url: string | null
  is_visible: boolean
  created_at: string | null
}

async function apiFetchRecords(): Promise<PublicRecordRow[]> {
  const { data, error } = await supabase
    .from('public_records')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as PublicRecordRow[]
}

async function apiCreateRecord(payload: {
  title: string
  button_label: string
  description: string
  url: string
}): Promise<PublicRecordRow> {
  const { data, error } = await supabase.from('public_records').insert([payload]).select().single()
  if (error) throw new Error(error.message)
  return data as PublicRecordRow
}

async function apiUpdateRecord(
  id: string,
  payload: {
    title: string
    button_label: string
    description: string
    url: string
  },
): Promise<PublicRecordRow> {
  const { data, error } = await supabase
    .from('public_records')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as PublicRecordRow
}

async function apiDeleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from('public_records').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
import {
  Upload,
  Disc3,
  BookOpen,
  Database,
  FileText,
  Globe,
  Link,
  Star,
  Archive,
  Award,
  Bell,
  BarChart2,
  BookMarked,
  BookCopy,
  Briefcase,
  Building,
  Camera,
  CheckSquare,
  Clock,
  Cloud,
  Code,
  Coffee,
  Cpu,
  CreditCard,
  Download,
  File,
  FileArchive,
  FileBadge,
  FileImage,
  Film,
  Filter,
  Flag,
  Folder,
  FolderOpen,
  GraduationCap,
  Hash,
  Heart,
  HelpCircle,
  Home,
  ImageIcon,
  Info,
  Inbox,
  Layers,
  Layout,
  Library,
  LifeBuoy,
  List,
  Lock,
  LogIn,
  Mail,
  Map,
  MessageCircle,
  MessageSquare,
  Monitor,
  Moon,
  Music,
  Navigation,
  Package,
  Paperclip,
  PenTool,
  Phone,
  PieChart,
  Pin,
  Printer,
  Radio,
  RefreshCw,
  Save,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  ShoppingBag,
  Sidebar as SidebarIcon,
  Sliders,
  Smartphone,
  Speaker,
  Table,
  Tag,
  Terminal,
  ThumbsUp,
  Ticket,
  ToggleLeft,
  Wrench,
  TrendingUp,
  Tv,
  User,
  Users,
  Video,
  Wifi,
  Zap,
  BookOpenCheck,
  FlaskConical,
  Microscope,
  Atom,
  Dna,
  Pencil,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  X,
  LayoutGrid,
  Check,
  Loader2,
} from 'lucide-vue-next'

// ─── Types ────────────────────────────────────────────────────────────────────
interface IconOption {
  key: string
  label: string
  component: unknown
  category: string
}

interface DraftForm {
  title: string
  description: string
  button_label: string
  url: string
  linkType: 'url' | 'route'
  iconKey: string
}

interface RecordItem {
  id: string
  title: string | null
  description: string | null
  button_label: string | null
  url: string | null
  created_at: string | null
  // UI-only
  iconKey: string
  linkType: 'url' | 'route'
  visible: boolean
  editing: boolean
  saving: boolean
  deleting: boolean
  draft: DraftForm
}

// ─── Icons Registry ───────────────────────────────────────────────────────────
const ALL_ICONS: IconOption[] = [
  { key: 'Upload', label: 'Upload', component: Upload, category: 'files' },
  { key: 'Download', label: 'Download', component: Download, category: 'files' },
  { key: 'File', label: 'File', component: File, category: 'files' },
  { key: 'FileText', label: 'File Text', component: FileText, category: 'files' },
  { key: 'FileImage', label: 'File Image', component: FileImage, category: 'files' },
  { key: 'FileArchive', label: 'Archive', component: FileArchive, category: 'files' },
  { key: 'FileBadge', label: 'Badge', component: FileBadge, category: 'files' },
  { key: 'Folder', label: 'Folder', component: Folder, category: 'files' },
  { key: 'FolderOpen', label: 'Folder Open', component: FolderOpen, category: 'files' },
  { key: 'Archive', label: 'Archive', component: Archive, category: 'files' },
  { key: 'Paperclip', label: 'Paperclip', component: Paperclip, category: 'files' },
  { key: 'Printer', label: 'Printer', component: Printer, category: 'files' },
  { key: 'BookOpen', label: 'Book Open', component: BookOpen, category: 'education' },
  { key: 'BookMarked', label: 'Bookmarked', component: BookMarked, category: 'education' },
  { key: 'BookCopy', label: 'Book Copy', component: BookCopy, category: 'education' },
  { key: 'BookOpenCheck', label: 'Book Check', component: BookOpenCheck, category: 'education' },
  { key: 'Library', label: 'Library', component: Library, category: 'education' },
  { key: 'GraduationCap', label: 'Graduation', component: GraduationCap, category: 'education' },
  { key: 'Microscope', label: 'Microscope', component: Microscope, category: 'education' },
  { key: 'FlaskConical', label: 'Flask', component: FlaskConical, category: 'education' },
  { key: 'Atom', label: 'Atom', component: Atom, category: 'education' },
  { key: 'Dna', label: 'DNA', component: Dna, category: 'education' },
  { key: 'PenTool', label: 'Pen Tool', component: PenTool, category: 'education' },
  { key: 'Database', label: 'Database', component: Database, category: 'tech' },
  { key: 'Server', label: 'Server', component: Server, category: 'tech' },
  { key: 'Cloud', label: 'Cloud', component: Cloud, category: 'tech' },
  { key: 'Cpu', label: 'CPU', component: Cpu, category: 'tech' },
  { key: 'Code', label: 'Code', component: Code, category: 'tech' },
  { key: 'Terminal', label: 'Terminal', component: Terminal, category: 'tech' },
  { key: 'Monitor', label: 'Monitor', component: Monitor, category: 'tech' },
  { key: 'Smartphone', label: 'Phone', component: Smartphone, category: 'tech' },
  { key: 'Wifi', label: 'Wifi', component: Wifi, category: 'tech' },
  { key: 'Layers', label: 'Layers', component: Layers, category: 'tech' },
  { key: 'Disc3', label: 'CD-ROM', component: Disc3, category: 'tech' },
  { key: 'Radio', label: 'Radio', component: Radio, category: 'tech' },
  { key: 'BarChart2', label: 'Bar Chart', component: BarChart2, category: 'charts' },
  { key: 'PieChart', label: 'Pie Chart', component: PieChart, category: 'charts' },
  { key: 'TrendingUp', label: 'Trending Up', component: TrendingUp, category: 'charts' },
  { key: 'Sliders', label: 'Sliders', component: Sliders, category: 'charts' },
  { key: 'Filter', label: 'Filter', component: Filter, category: 'charts' },
  { key: 'Table', label: 'Table', component: Table, category: 'charts' },
  { key: 'Mail', label: 'Mail', component: Mail, category: 'comm' },
  { key: 'MessageCircle', label: 'Message', component: MessageCircle, category: 'comm' },
  { key: 'MessageSquare', label: 'Msg Square', component: MessageSquare, category: 'comm' },
  { key: 'Bell', label: 'Bell', component: Bell, category: 'comm' },
  { key: 'Send', label: 'Send', component: Send, category: 'comm' },
  { key: 'Phone', label: 'Phone', component: Phone, category: 'comm' },
  { key: 'Share', label: 'Share', component: Share, category: 'comm' },
  { key: 'Inbox', label: 'Inbox', component: Inbox, category: 'comm' },
  { key: 'User', label: 'User', component: User, category: 'people' },
  { key: 'Users', label: 'Users', component: Users, category: 'people' },
  { key: 'Building', label: 'Building', component: Building, category: 'people' },
  { key: 'Briefcase', label: 'Briefcase', component: Briefcase, category: 'people' },
  { key: 'Award', label: 'Award', component: Award, category: 'people' },
  { key: 'Heart', label: 'Heart', component: Heart, category: 'people' },
  { key: 'ThumbsUp', label: 'Thumbs Up', component: ThumbsUp, category: 'people' },
  { key: 'Globe', label: 'Globe', component: Globe, category: 'ui' },
  { key: 'Link', label: 'Link', component: Link, category: 'ui' },
  { key: 'Home', label: 'Home', component: Home, category: 'ui' },
  { key: 'Map', label: 'Map', component: Map, category: 'ui' },
  { key: 'Navigation', label: 'Navigation', component: Navigation, category: 'ui' },
  { key: 'Pin', label: 'Pin', component: Pin, category: 'ui' },
  { key: 'Layout', label: 'Layout', component: Layout, category: 'ui' },
  { key: 'Sidebar', label: 'Sidebar', component: SidebarIcon, category: 'ui' },
  { key: 'List', label: 'List', component: List, category: 'ui' },
  { key: 'Settings', label: 'Settings', component: Settings, category: 'ui' },
  { key: 'ToggleLeft', label: 'Toggle', component: ToggleLeft, category: 'ui' },
  { key: 'RefreshCw', label: 'Refresh', component: RefreshCw, category: 'ui' },
  { key: 'LogIn', label: 'Log In', component: LogIn, category: 'ui' },
  { key: 'Lock', label: 'Lock', component: Lock, category: 'ui' },
  { key: 'Shield', label: 'Shield', component: Shield, category: 'ui' },
  { key: 'ImageIcon', label: 'Image', component: ImageIcon, category: 'media' },
  { key: 'Camera', label: 'Camera', component: Camera, category: 'media' },
  { key: 'Film', label: 'Film', component: Film, category: 'media' },
  { key: 'Video', label: 'Video', component: Video, category: 'media' },
  { key: 'Music', label: 'Music', component: Music, category: 'media' },
  { key: 'Speaker', label: 'Speaker', component: Speaker, category: 'media' },
  { key: 'Tv', label: 'TV', component: Tv, category: 'media' },
  { key: 'Star', label: 'Star', component: Star, category: 'misc' },
  { key: 'Zap', label: 'Zap', component: Zap, category: 'misc' },
  { key: 'Flag', label: 'Flag', component: Flag, category: 'misc' },
  { key: 'Tag', label: 'Tag', component: Tag, category: 'misc' },
  { key: 'Hash', label: 'Hash', component: Hash, category: 'misc' },
  { key: 'Package', label: 'Package', component: Package, category: 'misc' },
  { key: 'ShoppingBag', label: 'Bag', component: ShoppingBag, category: 'misc' },
  { key: 'CreditCard', label: 'Card', component: CreditCard, category: 'misc' },
  { key: 'Coffee', label: 'Coffee', component: Coffee, category: 'misc' },
  { key: 'Clock', label: 'Clock', component: Clock, category: 'misc' },
  { key: 'Moon', label: 'Moon', component: Moon, category: 'misc' },
  { key: 'Info', label: 'Info', component: Info, category: 'misc' },
  { key: 'HelpCircle', label: 'Help', component: HelpCircle, category: 'misc' },
  { key: 'LifeBuoy', label: 'Life Buoy', component: LifeBuoy, category: 'misc' },
  { key: 'CheckSquare', label: 'Check', component: CheckSquare, category: 'misc' },
  { key: 'Ticket', label: 'Ticket', component: Ticket, category: 'misc' },
  { key: 'Wrench', label: 'Wrench', component: Wrench, category: 'misc' },
  { key: 'FilePen', label: 'Edit', component: Pencil, category: 'misc' },
]

const quickIcons = ALL_ICONS.filter((o) =>
  ['Upload', 'Disc3', 'BookOpen', 'Database', 'FileText', 'Globe', 'Link', 'Star'].includes(o.key),
)

const iconCategories = [
  { key: 'all', label: 'All' },
  { key: 'files', label: 'Files' },
  { key: 'education', label: 'Education' },
  { key: 'tech', label: 'Tech' },
  { key: 'charts', label: 'Charts' },
  { key: 'comm', label: 'Comms' },
  { key: 'people', label: 'People' },
  { key: 'ui', label: 'UI' },
  { key: 'media', label: 'Media' },
  { key: 'misc', label: 'Misc' },
]

function resolveIcon(key: string): unknown {
  return ALL_ICONS.find((o) => o.key === key)?.component ?? Database
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

// ─── Records State ────────────────────────────────────────────────────────────
const records = ref<RecordItem[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)
const recordsMainRef = ref<HTMLElement | null>(null)

function makeDraft(r: RecordItem): DraftForm {
  return {
    title: r.title ?? '',
    description: r.description ?? '',
    button_label: r.button_label ?? '',
    url: r.url ?? '',
    linkType: r.linkType,
    iconKey: r.iconKey,
  }
}

async function loadRecords() {
  loading.value = true
  loadError.value = null
  try {
    const rows = await apiFetchRecords()
    records.value = rows.map((row: PublicRecordRow) => ({
      ...row,
      iconKey: 'Database',
      linkType: 'url' as const,
      visible: row.is_visible,
      editing: false,
      saving: false,
      deleting: false,
      draft: {
        title: row.title ?? '',
        description: row.description ?? '',
        button_label: row.button_label ?? '',
        url: row.url ?? '',
        linkType: 'url' as const,
        iconKey: 'Database',
      },
    }))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load records.'
    loadError.value = msg
    showToast(msg, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecords()
})

// ─── Edit ─────────────────────────────────────────────────────────────────────
function toggleEdit(record: RecordItem) {
  if (record.editing) {
    cancelEdit(record)
    return
  }
  record.draft = makeDraft(record)
  record.editing = true
}
function cancelEdit(record: RecordItem) {
  record.editing = false
}

async function saveRecord(record: RecordItem) {
  if (!record.draft.title.trim()) {
    showToast('Title cannot be empty.', 'error')
    return
  }
  if (!record.draft.button_label.trim()) {
    showToast('Button label cannot be empty.', 'error')
    return
  }

  record.saving = true
  try {
    const updated = await apiUpdateRecord(record.id, {
      title: record.draft.title.trim(),
      button_label: record.draft.button_label.trim(),
      description: record.draft.description.trim(),
      url: record.draft.url.trim(),
    })
    // Merge updated fields back, preserve UI-only state
    record.title = updated.title
    record.button_label = updated.button_label
    record.description = updated.description
    record.url = updated.url
    record.iconKey = record.draft.iconKey
    record.linkType = record.draft.linkType
    record.editing = false
    showToast(`"${record.title}" updated successfully!`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed.'
    showToast(msg, 'error')
  } finally {
    record.saving = false
  }
}

// ─── Visibility ───────────────────────────────────────────────────────────────
async function toggleVisibility(record: RecordItem) {
  const newVal = !record.visible
  try {
    const { error } = await supabase
      .from('public_records')
      .update({ is_visible: newVal })
      .eq('id', record.id)
    if (error) throw new Error(error.message)
    record.visible = newVal
    showToast(`"${record.title}" is now ${newVal ? 'visible' : 'hidden'} on the Records page.`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update visibility.'
    showToast(msg, 'error')
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteTarget = ref<RecordItem | null>(null)
function confirmDelete(record: RecordItem) {
  deleteTarget.value = record
}

async function deleteRecord() {
  if (!deleteTarget.value) return
  const target = deleteTarget.value
  const name = target.title ?? 'Record'
  deleteTarget.value = null
  target.deleting = true
  try {
    await apiDeleteRecord(target.id)
    records.value = records.value.filter((r) => r.id !== target.id)
    showToast(`"${name}" has been deleted.`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed.'
    showToast(msg, 'error')
    target.deleting = false
  }
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
const emptyForm = (): DraftForm => ({
  title: '',
  description: '',
  button_label: '',
  url: '',
  linkType: 'url',
  iconKey: 'Database',
})
const addModal = reactive({ open: false, saving: false, form: emptyForm() })

function openAddModal() {
  addModal.form = emptyForm()
  addModal.open = true
}
function closeAddModal() {
  addModal.open = false
}

async function addRecord() {
  if (!addModal.form.title.trim()) {
    showToast('Title cannot be empty.', 'error')
    return
  }
  if (!addModal.form.button_label.trim()) {
    showToast('Button label cannot be empty.', 'error')
    return
  }

  addModal.saving = true
  try {
    const created = await apiCreateRecord({
      title: addModal.form.title.trim(),
      button_label: addModal.form.button_label.trim(),
      description: addModal.form.description.trim(),
      url: addModal.form.url.trim(),
    })
    const newRecord: RecordItem = {
      ...created,
      iconKey: addModal.form.iconKey,
      linkType: addModal.form.linkType,
      visible: true,
      editing: false,
      saving: false,
      deleting: false,
      draft: emptyForm(),
    }
    records.value.push(newRecord)
    closeAddModal()
    showToast(`"${newRecord.title}" card added successfully!`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add record.'
    showToast(msg, 'error')
  } finally {
    addModal.saving = false
  }
}

// ─── Icon Browser ─────────────────────────────────────────────────────────────
let iconBrowserTarget: DraftForm | null = null
const iconBrowser = reactive({ open: false, search: '', category: 'all', selected: '' })

const filteredBrowseIcons = computed(() => {
  const q = iconBrowser.search.toLowerCase().trim()
  return ALL_ICONS.filter((o) => {
    const catMatch = iconBrowser.category === 'all' || o.category === iconBrowser.category
    const searchMatch = !q || o.label.toLowerCase().includes(q) || o.key.toLowerCase().includes(q)
    return catMatch && searchMatch
  })
})

function openIconBrowser(target: DraftForm) {
  iconBrowserTarget = target
  iconBrowser.search = ''
  iconBrowser.category = 'all'
  iconBrowser.selected = target.iconKey
  iconBrowser.open = true
}
function closeIconBrowser() {
  iconBrowser.open = false
  iconBrowserTarget = null
}
function selectIconFromBrowser(key: string) {
  iconBrowser.selected = key
}
function confirmIconSelection() {
  if (!iconBrowser.selected || !iconBrowserTarget) return
  iconBrowserTarget.iconKey = iconBrowser.selected
  closeIconBrowser()
  showToast(`Icon "${iconBrowser.selected}" selected!`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
* {
  font-family: 'Poppins', sans-serif;
}

/* ── Page Header ── */
.page-header {
  padding: 32px 40px 28px;
  border-bottom: 1px solid rgba(10, 65, 14, 0.08);
  background: #ffffff;
  flex-shrink: 0;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.breadcrumb-back {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.breadcrumb-back:hover {
  color: rgba(13, 43, 15, 0.9);
}
.breadcrumb-chevron {
  width: 12px;
  height: 12px;
  color: rgba(13, 43, 15, 0.3);
}
.breadcrumb-current {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.4);
}
.header-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.page-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  color: #0d2b0f;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.title-accent {
  color: #f9a825;
}
.title-underline {
  width: 200px;
  height: 4px;
  background: linear-gradient(to right, #1b5e20, #f9a825);
  border-radius: 2px;
  margin: 4px 0 10px;
}
.page-subtitle {
  font-size: 0.82rem;
  color: rgba(13, 43, 15, 0.5);
  font-weight: 400;
  margin-top: 4px;
  max-width: 520px;
}
.header-actions {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
}

/* ── Buttons ── */
.add-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  background: #0d2b0f;
  padding: 8px 18px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  transition:
    background 0.2s,
    transform 0.15s;
}
.add-card-btn:hover {
  background: #1b5e20;
  transform: translateY(-1px);
}
.add-card-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.add-card-btn:hover::after {
  transform: translateX(100%);
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  background: #0d2b0f;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.2s;
}
.btn-save:hover:not(:disabled) {
  background: #1b5e20;
}
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-save::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.btn-save:hover::after {
  transform: translateX(100%);
}

.btn-cancel {
  display: inline-flex;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.55);
  background: transparent;
  border: 1px solid rgba(13, 43, 15, 0.18);
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover {
  border-color: rgba(13, 43, 15, 0.4);
  color: #0d2b0f;
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  background: #b71c1c;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-delete:hover {
  background: #c62828;
}

/* ── Field label ── */
.field-label {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.5);
}

/* ── Form field ── */
.field {
  width: 100%;
  padding: 9px 12px;
  border-radius: 3px;
  border: 1px solid rgba(13, 43, 15, 0.18);
  background: #ffffff;
  font-size: 13px;
  color: #333;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;
}
.field:focus {
  outline: none;
  border-color: rgba(13, 43, 15, 0.4);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13, 43, 15, 0.07);
}

/* ── Content area ── */
.page-content {
  padding: 36px 40px 80px;
  max-width: 1100px;
}

/* ── Cards ── */
.manage-card {
  border-radius: 4px;
  opacity: 0;
  animation: fadeUp 0.45s ease forwards;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Modal ── */
.modal-box {
  border-radius: 4px;
}
.modal-header {
  display: flex;
  align-items: center;
  padding: 18px 20px 18px 24px;
  border-bottom: 1px solid rgba(13, 43, 15, 0.08);
  position: relative;
  gap: 12px;
}
.modal-header-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #f9a825, #1b5e20);
}
.modal-header-accent-danger {
  background: linear-gradient(to bottom, #c62828, #b71c1c);
}
.modal-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0d2b0f;
  letter-spacing: 0.04em;
}
.modal-close {
  color: rgba(13, 43, 15, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  transition:
    color 0.2s,
    background 0.2s;
}
.modal-close:hover {
  color: #0d2b0f;
  background: rgba(13, 43, 15, 0.07);
}

/* ── Transitions ── */
.card-list-enter-active {
  transition: all 0.35s ease;
}
.card-list-leave-active {
  transition: all 0.25s ease;
}
.card-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.card-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.modal-enter-active {
  transition: opacity 0.25s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-box {
  animation: modalPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes modalPop {
  from {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .page-header {
    padding: 24px 20px 20px;
  }
  .page-content {
    padding: 24px 20px 60px;
  }
  .header-title-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
