<template>
  <div class="w-full py-6 px-4 max-w-7xl mx-auto">
    <!-- Back + Breadcrumb -->
    <div class="flex items-center gap-3 mb-6 anim-fade-in">
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-1 text-sm font-semibold text-[#1b5e20] hover:underline"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <span
        style="
          font-size: 0.75rem;
          font-weight: 700;
          color: #1b5e20;
          border-left: 3px solid #1b5e20;
          padding-left: 8px;
        "
        >Services</span
      >
      <span
        style="
          font-size: 0.75rem;
          font-weight: 700;
          color: #1b5e20;
          border-left: 3px solid #f9a825;
          padding-left: 8px;
        "
        >Caraga State University Library</span
      >
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- LEFT: title + main content -->
      <div class="lg:col-span-2 flex flex-col gap-5">
        <!-- Page Header -->
        <div class="anim-slide-up">
          <h1
            style="font-size: 2.2rem; font-weight: 900; color: #0d2b0f; line-height: 1.2"
            class="mb-2"
          >
            Room Reservation
          </h1>
          <p style="font-size: 0.95rem; color: #555; max-width: 520px; line-height: 1.6">
            Browse and reserve available rooms — Nap Pads, Discussion Rooms, and the AVR.
          </p>
        </div>
        <!-- DROPDOWN -->
        <div class="relative anim-fade-in" style="animation-delay: 0.1s" ref="dropdownRef">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-200"
            :style="
              dropdownOpen
                ? 'background:#0d2b0f;color:white;box-shadow:0 8px 32px rgba(13,43,15,0.22);border:2px solid #f9a825;'
                : 'background:white;color:#0d2b0f;border:2px solid rgba(13,43,15,0.15);box-shadow:0 2px 12px rgba(13,43,15,0.06);'
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="dropdownOpen ? 'background:rgba(249,168,37,0.15)' : 'background:#f1f8f1'"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  :stroke="dropdownOpen ? '#f9a825' : '#1b5e20'"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div class="text-left">
                <p
                  style="
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                  "
                  :style="dropdownOpen ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(13,43,15,0.4)'"
                >
                  Select Room
                </p>
                <p style="font-size: 0.92rem; font-weight: 800">
                  {{ selectedRoom ? selectedRoom.name : 'All Rooms' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-black"
                :style="
                  dropdownOpen
                    ? 'background:rgba(249,168,37,0.2);color:#f9a825;'
                    : 'background:#f1f8f1;color:#1b5e20;'
                "
              >
                {{ rooms.length }}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                :stroke="dropdownOpen ? 'rgba(255,255,255,0.7)' : '#1b5e20'"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                }"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </button>

          <!-- Dropdown Panel -->
          <Transition name="dropdown">
            <div
              v-if="dropdownOpen"
              class="absolute left-0 right-0 z-50 mt-2 rounded-2xl overflow-hidden"
              style="
                background: white;
                border: 2px solid rgba(13, 43, 15, 0.1);
                box-shadow: 0 20px 60px rgba(13, 43, 15, 0.18);
              "
            >
              <!-- Search -->
              <div class="px-4 pt-3 pb-2">
                <div
                  class="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style="background: #f1f8f1; border: 1.5px solid rgba(13, 43, 15, 0.08)"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1b5e20"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    v-model="roomSearch"
                    type="text"
                    placeholder="Search rooms..."
                    style="
                      border: none;
                      outline: none;
                      background: transparent;
                      font-size: 0.82rem;
                      font-weight: 600;
                      color: #0d2b0f;
                      width: 100%;
                    "
                  />
                </div>
              </div>

              <!-- Grouped list -->
              <div class="overflow-y-auto" style="max-height: 320px">
                <template v-for="group in groupedRooms" :key="group.value">
                  <div
                    class="px-4 py-1.5 flex items-center gap-2"
                    style="background: #fafafa; border-top: 1px solid rgba(13, 43, 15, 0.06)"
                  >
                    <span v-html="group.icon" style="color: #1b5e20; opacity: 0.5"></span>
                    <span
                      style="
                        font-size: 0.65rem;
                        font-weight: 800;
                        color: rgba(13, 43, 15, 0.4);
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                      "
                      >{{ group.label }}</span
                    >
                    <span
                      class="ml-auto px-1.5 py-0.5 rounded-full"
                      style="
                        background: #f1f8f1;
                        color: #1b5e20;
                        font-weight: 800;
                        font-size: 0.6rem;
                      "
                      >{{ group.rooms.length }}</span
                    >
                  </div>
                  <button
                    v-for="room in group.rooms"
                    :key="room.id"
                    @click="selectRoom(room)"
                    class="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
                    :style="
                      selectedRoom?.id === room.id ? 'background:#f1f8f1;' : 'background:white;'
                    "
                    onmouseenter="this.style.background = '#f8fdf8'"
                    :onmouseleave="`this.style.background='${selectedRoom?.id === room.id ? '#f1f8f1' : 'white'}'`"
                  >
                    <div
                      class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      :style="
                        selectedRoom?.id === room.id ? 'background:#0d2b0f;' : 'background:#f1f8f1;'
                      "
                    >
                      <svg
                        v-if="room.room_type === 'nap_pad'"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        :stroke="selectedRoom?.id === room.id ? '#f9a825' : '#1b5e20'"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M2 4v16M2 8h18a2 2 0 012 2v6a2 2 0 01-2 2H2" />
                        <path d="M6 8v8" />
                      </svg>
                      <svg
                        v-else-if="room.room_type === 'discussion'"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        :stroke="selectedRoom?.id === room.id ? '#f9a825' : '#1b5e20'"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      <svg
                        v-else
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        :stroke="selectedRoom?.id === room.id ? '#f9a825' : '#1b5e20'"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        style="font-size: 0.85rem; font-weight: 800; color: #0d2b0f"
                        class="truncate"
                      >
                        {{ room.name }}
                      </p>
                      <p style="font-size: 0.72rem; color: #888; font-weight: 600">
                        {{ room.floor }} · {{ room.wing }}
                      </p>
                    </div>
                    <svg
                      v-if="selectedRoom?.id === room.id"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1b5e20"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>
                </template>
                <div v-if="groupedRooms.length === 0" class="px-4 py-8 text-center">
                  <p style="font-size: 0.82rem; color: #aaa; font-weight: 600">No rooms found</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3" style="border-top: 1px solid rgba(13, 43, 15, 0.08)">
                <button
                  v-if="selectedRoom"
                  @click="openModal"
                  class="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-150"
                  style="
                    background: #0d2b0f;
                    color: white;
                    font-weight: 800;
                    font-size: 0.82rem;
                    letter-spacing: 0.05em;
                  "
                  onmouseenter="this.style.background = '#1b5e20'"
                  onmouseleave="this.style.background = '#0d2b0f'"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f9a825"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Reserve {{ selectedRoom.name }}
                </button>
                <p
                  v-else
                  style="font-size: 0.75rem; color: #aaa; font-weight: 600; text-align: center"
                >
                  Select a room to reserve
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Selected room preview -->
        <Transition name="fade">
          <div
            v-if="selectedRoom && !dropdownOpen"
            class="rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
            style="
              background: white;
              border: 2px solid rgba(13, 43, 15, 0.1);
              box-shadow: 0 2px 12px rgba(13, 43, 15, 0.06);
              transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
            "
            @click="openModal"
            onmouseenter="
              this.style.borderColor = 'rgba(27,94,32,0.3)'
              this.style.boxShadow = '0 8px 24px rgba(13,43,15,0.12)'
              this.style.transform = 'translateY(-2px)'
            "
            onmouseleave="
              this.style.borderColor = 'rgba(13,43,15,0.1)'
              this.style.boxShadow = '0 2px 12px rgba(13,43,15,0.06)'
              this.style.transform = 'translateY(0)'
            "
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style="background: #0d2b0f"
            >
              <svg
                v-if="selectedRoom.room_type === 'nap_pad'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f9a825"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 4v16M2 8h18a2 2 0 012 2v6a2 2 0 01-2 2H2" />
                <path d="M6 8v8" />
              </svg>
              <svg
                v-else-if="selectedRoom.room_type === 'discussion'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f9a825"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <svg
                v-else
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f9a825"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p
                style="
                  font-size: 0.65rem;
                  font-weight: 700;
                  color: rgba(13, 43, 15, 0.4);
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                "
              >
                Selected Room
              </p>
              <p style="font-size: 1.05rem; font-weight: 900; color: #0d2b0f" class="truncate">
                {{ selectedRoom.name }}
              </p>
              <div class="flex items-center gap-1.5 mt-1">
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  style="background: #f1f8f1; color: #555; font-weight: 700"
                  >{{ selectedRoom.floor }}</span
                >
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  style="background: #f1f8f1; color: #555; font-weight: 700"
                  >{{ selectedRoom.wing }}</span
                >
              </div>
            </div>
            <div
              class="flex items-center gap-1 flex-shrink-0"
              style="color: #1b5e20; font-size: 0.8rem; font-weight: 700"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Reserve
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </Transition>

        <!-- Empty state -->
        <div
          v-if="!selectedRoom && !dropdownOpen"
          class="rounded-2xl p-8 flex flex-col items-center justify-center gap-3"
          style="background: white; border: 2px dashed rgba(13, 43, 15, 0.12); min-height: 160px"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center"
            style="background: #f1f8f1"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1b5e20"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div class="text-center">
            <p style="font-size: 0.9rem; font-weight: 800; color: #0d2b0f">No room selected</p>
            <p style="font-size: 0.78rem; color: #aaa; font-weight: 600; margin-top: 2px">
              Open the dropdown above to choose a room
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT sidebar -->
      <div class="lg:col-span-1 flex flex-col gap-4 self-start sticky top-6">
        <!-- Available Rooms - dark green card, top-aligned with page title like Top Borrowers -->
        <div class="rounded-xl p-5" style="background: #0d2b0f; color: white">
          <p
            style="
              font-size: 0.68rem;
              font-weight: 700;
              color: rgba(255, 255, 255, 0.45);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
            class="mb-1"
          >
            Available Rooms
          </p>
          <p style="font-size: 1.6rem; font-weight: 900; color: white" class="mb-3">
            {{ rooms.length }} Rooms
          </p>
          <div
            style="border-top: 1px solid rgba(255, 255, 255, 0.12)"
            class="pt-3 flex flex-col gap-2"
          >
            <div
              v-for="tab in roomTypes"
              :key="tab.value"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span v-html="tab.icon" style="color: rgba(255, 255, 255, 0.5)"></span>
                <span
                  style="font-size: 0.82rem; font-weight: 600; color: rgba(255, 255, 255, 0.75)"
                  >{{ tab.label }}</span
                >
              </div>
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                style="background: rgba(249, 168, 37, 0.15); color: #f9a825; font-weight: 800"
              >
                {{ rooms.filter((r) => r.room_type === tab.value).length }}
              </span>
            </div>
          </div>
        </div>
        <div class="rounded-xl p-5" style="border: 2px solid #fff3cd; background: #fffdf0">
          <h3 style="font-size: 0.95rem; font-weight: 900; color: #0d2b0f" class="mb-3">
            Operating Hours
          </h3>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1b5e20"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l2 2" />
              </svg>
              <span style="font-size: 0.82rem; font-weight: 700; color: #333"
                >Mon–Fri, 8:00 AM – 6:00 PM</span
              >
            </div>
            <div class="flex items-center gap-2">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l2 2" />
              </svg>
              <span style="font-size: 0.82rem; font-weight: 600; color: #aaa"
                >Weekends: Closed</span
              >
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div
          class="rounded-xl p-5 flex items-center gap-4"
          style="background: #0d2b0f; color: white"
        >
          <div class="p-3 rounded-xl flex-shrink-0" style="background: rgba(255, 255, 255, 0.1)">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <p style="font-size: 0.72rem; opacity: 0.6; font-weight: 600">Inquiries</p>
            <p style="font-size: 0.9rem; font-weight: 800">CSU Library Office</p>
            <p style="font-size: 0.76rem; opacity: 0.75">library@carsu.edu.ph</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <!-- Header -->
            <div class="px-6 py-4 flex items-center gap-3" style="background: #0d2b0f">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style="background: rgba(249, 168, 37, 0.15)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f9a825"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  style="
                    font-size: 0.63rem;
                    color: rgba(255, 255, 255, 0.45);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                  "
                >
                  Reserve
                </p>
                <p style="font-size: 1rem; font-weight: 900; color: white" class="truncate">
                  {{ selectedRoom?.name }}
                </p>
              </div>
              <div class="hidden sm:flex items-center gap-1.5 mr-2">
                <span
                  class="text-xs px-2.5 py-1 rounded-full"
                  style="
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 700;
                  "
                  >{{ selectedRoom?.floor }}</span
                >
                <span
                  class="text-xs px-2.5 py-1 rounded-full"
                  style="background: rgba(249, 168, 37, 0.15); color: #f9a825; font-weight: 700"
                  >{{ selectedRoom?.wing }}</span
                >
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style="background: rgba(255, 255, 255, 0.08)"
                onmouseenter="this.style.background = 'rgba(255,255,255,0.18)'"
                onmouseleave="this.style.background = 'rgba(255,255,255,0.08)'"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6" style="background: white">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="form-label">Full Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Juan dela Cruz"
                    class="form-input"
                    @focus="
                      (e: any) => {
                        e.target.style.borderColor = '#1b5e20'
                        e.target.style.boxShadow = '0 0 0 3px rgba(27,94,32,0.08)'
                      }
                    "
                    @blur="
                      (e: any) => {
                        e.target.style.borderColor = 'rgba(13,43,15,0.12)'
                        e.target.style.boxShadow = 'none'
                      }
                    "
                  />
                </div>
                <div>
                  <label class="form-label">Purpose</label>
                  <input
                    v-model="form.purpose"
                    type="text"
                    placeholder="e.g. Group Study"
                    class="form-input"
                    @focus="
                      (e: any) => {
                        e.target.style.borderColor = '#1b5e20'
                        e.target.style.boxShadow = '0 0 0 3px rgba(27,94,32,0.08)'
                      }
                    "
                    @blur="
                      (e: any) => {
                        e.target.style.borderColor = 'rgba(13,43,15,0.12)'
                        e.target.style.boxShadow = 'none'
                      }
                    "
                  />
                </div>

                <!-- CALENDAR -->
                <div class="sm:col-span-2">
                  <label class="form-label">Date</label>
                  <div
                    class="rounded-xl overflow-hidden"
                    style="border: 2px solid rgba(13, 43, 15, 0.12)"
                  >
                    <!-- Cal header -->
                    <div
                      class="flex items-center justify-between px-4 py-3"
                      style="background: #0d2b0f"
                    >
                      <button
                        @click="prevMonth"
                        class="w-7 h-7 rounded-lg flex items-center justify-center"
                        style="
                          background: rgba(255, 255, 255, 0.1);
                          color: white;
                          transition: background 0.15s;
                        "
                        onmouseenter="this.style.background = 'rgba(255,255,255,0.2)'"
                        onmouseleave="this.style.background = 'rgba(255,255,255,0.1)'"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span style="font-size: 0.9rem; font-weight: 800; color: white"
                        >{{ monthNames[calendarMonth] }} {{ calendarYear }}</span
                      >
                      <button
                        @click="nextMonth"
                        class="w-7 h-7 rounded-lg flex items-center justify-center"
                        style="
                          background: rgba(255, 255, 255, 0.1);
                          color: white;
                          transition: background 0.15s;
                        "
                        onmouseenter="this.style.background = 'rgba(255,255,255,0.2)'"
                        onmouseleave="this.style.background = 'rgba(255,255,255,0.1)'"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                    <!-- Day names -->
                    <div class="grid grid-cols-7 px-2 pt-2" style="background: #f8fdf8">
                      <div
                        v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                        :key="d"
                        class="text-center py-1"
                        style="
                          font-size: 0.62rem;
                          font-weight: 800;
                          color: rgba(13, 43, 15, 0.35);
                          letter-spacing: 0.05em;
                        "
                      >
                        {{ d }}
                      </div>
                    </div>
                    <!-- Day cells -->
                    <div class="grid grid-cols-7 gap-1 p-2" style="background: #f8fdf8">
                      <div
                        v-for="(cell, i) in calendarCells"
                        :key="i"
                        class="cal-cell aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-100"
                        :class="{ 'cal-selectable': cell.day && !cell.disabled }"
                        :style="cellStyle(cell)"
                        @click="cell.day && !cell.disabled ? selectDate(cell) : null"
                      >
                        <span v-if="cell.day">{{ cell.day }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="form.date"
                    class="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg"
                    style="background: #f1f8f1; border: 1px solid rgba(27, 94, 32, 0.15)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1b5e20"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #1b5e20">{{
                      formatDate(form.date)
                    }}</span>
                  </div>
                </div>

                <!-- Times -->
                <div>
                  <label class="form-label">Start Time</label>
                  <input
                    v-model="form.startTime"
                    type="time"
                    min="08:00"
                    max="17:00"
                    class="form-input"
                    @focus="
                      (e: any) => {
                        e.target.style.borderColor = '#1b5e20'
                        e.target.style.boxShadow = '0 0 0 3px rgba(27,94,32,0.08)'
                      }
                    "
                    @blur="
                      (e: any) => {
                        e.target.style.borderColor = 'rgba(13,43,15,0.12)'
                        e.target.style.boxShadow = 'none'
                      }
                    "
                  />
                </div>
                <div>
                  <label class="form-label">End Time</label>
                  <input
                    v-model="form.endTime"
                    type="time"
                    :min="form.startTime || '08:00'"
                    max="17:00"
                    class="form-input"
                    @focus="
                      (e: any) => {
                        e.target.style.borderColor = '#1b5e20'
                        e.target.style.boxShadow = '0 0 0 3px rgba(27,94,32,0.08)'
                      }
                    "
                    @blur="
                      (e: any) => {
                        e.target.style.borderColor = 'rgba(13,43,15,0.12)'
                        e.target.style.boxShadow = 'none'
                      }
                    "
                  />
                  <p
                    v-if="form.endTime && form.startTime && form.endTime <= form.startTime"
                    style="
                      font-size: 0.72rem;
                      color: #c62828;
                      font-weight: 600;
                      margin-top: 5px;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    "
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    End time must be after start time
                  </p>
                </div>
              </div>

              <!-- Summary -->
              <div
                v-if="form.date && form.startTime && form.endTime && form.endTime > form.startTime"
                class="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl"
                style="background: #f1f8f1; border: 1px solid rgba(27, 94, 32, 0.15)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b5e20"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l2 2" />
                </svg>
                <span style="font-size: 0.78rem; font-weight: 700; color: #1b5e20"
                  >{{ formatDate(form.date) }} · {{ form.startTime }} – {{ form.endTime }}</span
                >
              </div>

              <!-- Submit -->
              <button
                @click="submitReservation"
                :disabled="!isFormValid || submitting"
                class="w-full py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                :style="
                  isFormValid && !submitting
                    ? 'background:#0d2b0f;color:white;font-weight:800;font-size:0.88rem;letter-spacing:0.05em;cursor:pointer;box-shadow:0 4px 16px rgba(13,43,15,0.2);'
                    : 'background:rgba(13,43,15,0.08);color:rgba(13,43,15,0.3);font-weight:800;font-size:0.88rem;cursor:not-allowed;'
                "
              >
                <div
                  v-if="submitting"
                  class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                ></div>
                <svg
                  v-else-if="isFormValid"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                {{ submitting ? 'Submitting...' : 'Submit Reservation' }}
              </button>

              <Transition name="fade">
                <div
                  v-if="submitSuccess"
                  class="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style="background: #f1f8f1; border: 1.5px solid #c8e6c9"
                >
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style="background: #1b5e20"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p style="font-size: 0.82rem; font-weight: 800; color: #1b5e20">
                      Reservation submitted!
                    </p>
                    <p style="font-size: 0.72rem; color: rgba(13, 43, 15, 0.5); font-weight: 600">
                      We'll confirm your booking shortly.
                    </p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Room {
  id: string
  name: string
  floor: string
  wing: string
  room_type: string
}

interface CalCell {
  day: number | null
  date: string
  disabled: boolean
  isToday: boolean
  isSelected: boolean
}

const rooms = ref<Room[]>([
  { id: '1', name: 'Male Nap Pad 4', floor: '3rd Floor', wing: 'Left Wing', room_type: 'nap_pad' },
  {
    id: '2',
    name: 'Female Nap Pad 9',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  {
    id: '3',
    name: 'Female Nap Pad 2',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  {
    id: '4',
    name: 'Female Nap Pad 4',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  { id: '5', name: 'Male Nap Pad 2', floor: '3rd Floor', wing: 'Left Wing', room_type: 'nap_pad' },
  {
    id: '6',
    name: 'Female Nap Pad 3',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  {
    id: '7',
    name: 'Female Nap Pad 10',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  {
    id: '8',
    name: 'Female Nap Pad 5',
    floor: '3rd Floor',
    wing: 'Right Wing',
    room_type: 'nap_pad',
  },
  { id: '9', name: 'Male Nap Pad 1', floor: '3rd Floor', wing: 'Left Wing', room_type: 'nap_pad' },
  {
    id: '10',
    name: 'Discussion Room 1',
    floor: '2nd Floor',
    wing: 'Right Wing',
    room_type: 'discussion',
  },
  {
    id: '11',
    name: 'Discussion Room 2',
    floor: '2nd Floor',
    wing: 'Right Wing',
    room_type: 'discussion',
  },
  {
    id: '12',
    name: 'Discussion Room 4',
    floor: '2nd Floor',
    wing: 'Left Wing',
    room_type: 'discussion',
  },
  { id: '13', name: 'AVR', floor: '2nd Floor', wing: 'Left Wing', room_type: 'avr' },
])

const roomTypes = [
  {
    value: 'nap_pad',
    label: 'Nap Pads',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 012 2v6a2 2 0 01-2 2H2"/><path d="M6 8v8"/></svg>`,
  },
  {
    value: 'discussion',
    label: 'Discussion',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  },
  {
    value: 'avr',
    label: 'AVR',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  },
]

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// ── Dropdown ──────────────────────────────────────────────
const dropdownOpen = ref(false)
const roomSearch = ref('')
const selectedRoom = ref<Room | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const groupedRooms = computed(() => {
  const q = roomSearch.value.toLowerCase()
  return roomTypes
    .map((t) => ({
      ...t,
      rooms: rooms.value.filter((r) => r.room_type === t.value && r.name.toLowerCase().includes(q)),
    }))
    .filter((g) => g.rooms.length > 0)
})

function selectRoom(room: Room) {
  selectedRoom.value = room
  dropdownOpen.value = false
  roomSearch.value = ''
}

function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))

// ── Calendar ──────────────────────────────────────────────
const now = new Date()
// Fix: todayStr is guaranteed to be a string via nullish coalescing
const todayStr = now.toISOString().split('T')[0] ?? ''

const calendarMonth = ref(now.getMonth())
const calendarYear = ref(now.getFullYear())

function prevMonth() {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else calendarMonth.value--
}
function nextMonth() {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else calendarMonth.value++
}

const calendarCells = computed<CalCell[]>(() => {
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1).getDay()
  const daysInMonth = new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate()
  const cells: CalCell[] = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, date: '', disabled: true, isToday: false, isSelected: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(calendarMonth.value + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${calendarYear.value}-${mm}-${dd}`
    const dow = new Date(calendarYear.value, calendarMonth.value, d).getDay()
    const isPast = dateStr < todayStr
    const isWeekend = dow === 0 || dow === 6
    cells.push({
      day: d,
      date: dateStr,
      disabled: isPast || isWeekend,
      isToday: dateStr === todayStr,
      isSelected: dateStr === form.value.date,
    })
  }
  return cells
})

function cellStyle(cell: CalCell): string {
  if (!cell.day) return 'cursor:default;'
  if (cell.isSelected)
    return 'background:#0d2b0f;color:white;font-weight:900;cursor:pointer;box-shadow:0 2px 8px rgba(13,43,15,0.25);'
  if (cell.disabled) return 'color:rgba(13,43,15,0.2);cursor:not-allowed;font-weight:600;'
  if (cell.isToday)
    return 'background:#f1f8f1;color:#1b5e20;font-weight:900;border:2px solid #1b5e20;cursor:pointer;'
  return 'color:#0d2b0f;font-weight:700;cursor:pointer;'
}

function selectDate(cell: CalCell) {
  form.value.date = cell.date
}

// ── Modal + Form ──────────────────────────────────────────
const showModal = ref(false)
const submitting = ref(false)
const submitSuccess = ref(false)
const form = ref({ name: '', purpose: '', date: '', startTime: '', endTime: '' })

function openModal() {
  if (!selectedRoom.value) return
  showModal.value = true
  submitSuccess.value = false
  dropdownOpen.value = false
  form.value = { name: '', purpose: '', date: '', startTime: '', endTime: '' }
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  submitSuccess.value = false
  document.body.style.overflow = ''
}

const isFormValid = computed(
  () =>
    form.value.name.trim() !== '' &&
    form.value.purpose.trim() !== '' &&
    form.value.date !== '' &&
    form.value.startTime !== '' &&
    form.value.endTime !== '' &&
    form.value.endTime > form.value.startTime,
)

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

async function submitReservation() {
  if (!isFormValid.value) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 1200))
  submitting.value = false
  submitSuccess.value = true
  form.value = { name: '', purpose: '', date: '', startTime: '', endTime: '' }
  setTimeout(() => closeModal(), 2500)
}
</script>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
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

.anim-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.anim-fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease both;
}

/* Dropdown transitions */
.dropdown-enter-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Calendar hover */
.cal-selectable:hover {
  background: #e8f5e9 !important;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.modal-container {
  width: 100%;
  max-width: 560px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal transitions */
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container {
  transform: scale(0.93) translateY(20px);
}
.modal-leave-to .modal-container {
  transform: scale(0.96) translateY(10px);
}

/* Form */
.form-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #1b5e20;
  display: block;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid rgba(13, 43, 15, 0.12);
  border-radius: 10px;
  font-size: 0.88rem;
  color: #0d2b0f;
  outline: none;
  box-sizing: border-box;
  background: white;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
