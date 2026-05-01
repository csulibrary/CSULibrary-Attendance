<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar />

    <main class="reservation-root flex-1 overflow-y-auto">
      <!-- HEADER -->
      <header class="reservation-header intro-header">
        <div class="header-left">
          <div class="header-breadcrumb !mb-2">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/services')"
              >BACK</span
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>RESERVATION MANAGEMENT</span>
          </div>

          <h1 class="header-title intro-title">
            Room <span class="text-yellow-500"> Reservation</span>
          </h1>

          <p class="header-sub">
            Manage room occupancies, view schedules, and process faculty reservations.
          </p>
        </div>

        <div class="header-right">
          <button class="export-btn" @click="openModal('booking')">+ New Booking</button>
        </div>
      </header>

      <!-- KPI -->
      <div class="reservation-kpi-strip">
        <div
          v-for="(stat, i) in roomStats"
          :key="i"
          class="reservation-kpi-card flex items-center gap-3"
        >
          <!-- ICON -->
          <div
            class="reservation-kpi-icon kpi-reservation-icon flex items-center justify-center"
            :style="{ background: stat.color + '18', color: stat.color }"
          >
            <i :class="stat.icon"></i>
          </div>

          <!-- VALUE -->
          <div class="reservation-kpi-body">
            <div class="reservation-kpi-value">
              {{ stat.value }}
            </div>
            <span class="reservation-kpi-label">
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <!-- LEFT -->
        <div class="col-left">
          <!-- ROOMS -->
          <div class="panel">
            <div
              class="panel-head flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
            >
              <div>
                <h2
                  class="panel-title font-black text-[#0d2b0f] uppercase text-sm tracking-tighter"
                >
                  Real-Time Occupancy
                </h2>
                <p class="panel-sub text-[10px] text-gray-400">
                  Viewing: {{ activeFloor }} Floor | {{ activeWing }} Wing
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <div class="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <button
                    v-for="f in ['2nd Floor', '3rd Floor']"
                    :key="f"
                    @click="activeFloor = f"
                    :class="
                      activeFloor === f
                        ? 'bg-[#0d2b0f] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-200'
                    "
                    class="px-3 py-1 text-[10px] font-black rounded-md transition-all uppercase"
                  >
                    {{ f.replace(' Floor', '') }}
                  </button>
                </div>

                <div class="flex bg-yellow-100 p-1 rounded-lg border border-yellow-200">
                  <button
                    v-for="w in ['Left Wing', 'Right Wing']"
                    :key="w"
                    @click="activeWing = w"
                    :class="
                      activeWing === w
                        ? 'bg-yellow-500 text-[#0d2b0f] shadow-sm'
                        : 'text-yellow-700 hover:bg-yellow-200'
                    "
                    class="px-3 py-1 text-[10px] font-black rounded-md transition-all uppercase"
                  >
                    {{ w.replace(' Wing', '') }} Wing
                  </button>
                </div>
              </div>
            </div>

            <div class="overflow-y-auto pr-2 max-h-125 custom-scroll">
              <div v-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="room in filteredRooms"
                  :key="room.id"
                  class="rounded-xl p-4 border transition-all"
                  :style="
                    room.status === 'Occupied'
                      ? 'border-color:#ffcdd2;background:#fff8f8'
                      : 'border-color:#c8e6c9;background:#f9fdf9'
                  "
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center gap-2">
                        <i :class="getRoomIcon(room.room_type)"></i>
                        <h3 class="font-black text-[#0d2b0f]">{{ room.name }}</h3>
                      </div>
                      <p class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                        {{ room.floor }} • {{ room.wing }} • {{ formatRoomType(room.room_type) }}
                      </p>
                    </div>
                    <span
                      class="badge px-2 py-1 rounded text-[9px] font-black uppercase"
                      :class="
                        room.status === 'Occupied'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      "
                    >
                      {{ room.status }}
                    </span>
                  </div>

                  <div
                    v-if="room.status === 'Occupied'"
                    class="mb-4 bg-white/50 p-2 rounded border border-red-100"
                  >
                    <p class="text-[10px] uppercase font-bold text-gray-400">Current Session</p>
                    <p class="text-xs font-bold text-[#1b5e20]">{{ room.currentSession?.title }}</p>
                    <p class="text-[10px] text-gray-500">{{ room.currentSession?.time }}</p>
                  </div>
                  <div
                    v-else
                    class="empty-state mb-4 py-2 border border-dashed border-gray-200 rounded text-center text-[10px] text-gray-400 italic"
                  >
                    No Active Session
                  </div>

                  <div class="flex gap-2 pt-3 border-t border-black/5">
                    <button
                      class="btn-outline flex-1 border border-gray-300 py-1.5 rounded text-[10px] font-bold"
                      @click="openModal('schedule', room)"
                    >
                      View Sched
                    </button>
                    <button
                      v-if="room.status === 'Occupied'"
                      class="btn-dark flex-1 bg-[#0d2b0f] text-white py-1.5 rounded text-[10px] font-bold"
                      @click="openModal('endSession', room)"
                    >
                      End Session
                    </button>
                    <button
                      v-else
                      class="btn-yellow flex-1 bg-yellow-500 text-[#0d2b0f] py-1.5 rounded text-[10px] font-bold"
                      @click="openModal('quickBook', room)"
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="py-20 text-center border-2 border-dashed rounded-2xl">
                <p class="text-gray-400 font-bold uppercase text-xs tracking-widest text-balance">
                  No rooms found in the {{ activeWing }} Wing of the {{ activeFloor }} Floor.
                </p>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head flex justify-between items-center">
              <h2 class="panel-title text-sm">Recent & Upcoming Reservations</h2>
              <span class="text-[10px] text-gray-400"
                >Total: {{ upcomingReservations.length }}</span
              >
            </div>

            <div class="table-container">
              <table class="report-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Activity / Purpose</th>
                    <th>Requester (ID)</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="res in upcomingReservations" :key="res.id">
                    <td class="text-[11px]">
                      <div class="font-bold">{{ res.date }}</div>
                      <div class="text-gray-500">{{ res.time }}</div>
                    </td>

                    <td>
                      <div class="font-medium">{{ res.activity }}</div>
                      <div class="text-[10px] text-gray-400 italic">Room: {{ res.room_name }}</div>
                    </td>

                    <td class="text-[11px]">{{ res.requester }}</td>

                    <td>
                      <span :class="['badge', res.status.toLowerCase()]">
                        {{ res.status }}
                      </span>
                    </td>

                    <td class="text-right">
                      <div class="flex justify-end gap-3">
                        <button
                          v-if="res.status === 'pending'"
                          @click="updateStatus(res.id, 'reserved')"
                          class="btn-accept"
                        >
                          <i class="fas fa-check mr-1"></i> Accept
                        </button>

                        <button @click="deleteReservation(res.id)" class="btn-delete">
                          <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="upcomingReservations.length === 0">
                    <td colspan="5" class="text-center py-10 text-gray-400">
                      No reservations found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="col-right">
          <!-- STAFF CHECKLIST -->
          <div class="panel staff-panel">
            <h2 class="right-title font-bold mb-3 text-yellow-500" style="font-size: 1.1rem">
              Staff Checklist
            </h2>

            <ul class="staff-list">
              <li v-for="(step, i) in steps" :key="i">
                <span class="step-number">{{ i + 1 }}</span>
                {{ step }}
              </li>
            </ul>
          </div>

          <!-- AMENITIES / EQUIPMENT -->
          <div class="panel">
            <h2 class="panel-title text-sm">Equipment Check</h2>

            <div v-for="(item, i) in amenities" :key="i" class="equipment-row">
              <span class="equipment-name">
                {{ item.name }}
              </span>

              <span class="equipment-dot" :class="item.working ? 'dot-green' : 'dot-red'"> </span>
            </div>

            <button class="btn-outline mt-3 w-full" @click="openModal('equipment')">
              Update Inventory
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="modals.booking" class="modal">
      <div class="modal-box max-w-2xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="modal-title text-2xl font-bold text-gray-800">New Reservation</h2>
          <div class="text-right">
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label class="text-[10px] font-bold uppercase text-gray-500">Floor</label>
                <select v-model="selectedFloor" class="input">
                  <option value="">All</option>
                  <option v-for="f in availableFloors" :key="f">{{ f }}</option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase text-gray-500">Wing</label>
                <select v-model="selectedWing" class="input">
                  <option value="">All</option>
                  <option v-for="w in availableWings" :key="w">{{ w }}</option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase text-gray-500">Room Type</label>
                <select v-model="selectedRoomType" class="input">
                  <option value="">All</option>
                  <option v-for="type in availableRoomTypes" :key="type" :value="type">
                    {{ formatRoomType(type) }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase text-gray-500">Select Room</label>
                <select v-model="selectedRoomId" class="input">
                  <option value="">Select Room</option>
                  <option v-for="room in filteredRoomOptions" :key="room.id" :value="room.id">
                    {{ room.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] font-bold uppercase text-gray-400">Floor / Wing</label>
                <p class="text-sm font-semibold">
                  {{ selectedRoom?.floor || '---' }} - {{ selectedRoom?.wing || '---' }}
                </p>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-gray-400">Room Type</label>
                <p class="text-sm font-semibold capitalize">
                  {{ selectedRoom?.room_type?.replace('_', ' ') || '---' }}
                </p>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-bold uppercase text-gray-500">Purpose of Use</label>
              <input
                v-model="bookingForm.activity"
                placeholder="e.g. Thesis Defense"
                class="input"
              />
            </div>

            <div>
              <label class="text-[10px] font-bold uppercase text-gray-500"
                >Representative (Requester)</label
              >
              <input
                v-model="bookingForm.requester"
                list="student-ids"
                placeholder="Type ID Number"
                class="input"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] font-bold uppercase text-gray-400">College (Auto)</label>
                <input v-model="bookingForm.program" readonly class="input bg-gray-100 text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-gray-400">Year (Auto)</label>
                <input
                  v-model="bookingForm.year_level"
                  readonly
                  class="input bg-gray-100 text-xs"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div
              class="p-4 border rounded-lg transition-all"
              :class="
                selectedRoom?.room_type === 'nap_pad'
                  ? 'bg-gray-100 border-gray-200 opacity-70'
                  : 'bg-blue-50/50 border-blue-100'
              "
            >
              <label
                class="text-[10px] font-bold uppercase block mb-2"
                :class="selectedRoom?.room_type === 'nap_pad' ? 'text-gray-500' : 'text-blue-600'"
              >
                Group Members (Participants)
                <span
                  v-if="selectedRoom?.room_type === 'discussion'"
                  class="text-[9px] lowercase font-normal italic"
                  >(Required)</span
                >
              </label>

              <div class="flex gap-2" v-if="selectedRoom?.room_type !== 'nap_pad'">
                <input
                  list="student-ids"
                  id="participant-input"
                  placeholder="Search by ID"
                  class="input flex-1 bg-white"
                />
                <button
                  @click="handleAddParticipantFromInput('participant-input')"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm transition-colors"
                >
                  Add
                </button>
              </div>

              <div v-else class="text-[10px] text-gray-500 italic py-2">
                <i class="fas fa-user-slash mr-1"></i> Individual use only (Nap Pad).
              </div>

              <div class="flex flex-wrap gap-2 mt-3 max-h-[100px] overflow-y-auto">
                <div
                  v-for="p in selectedParticipants"
                  :key="p.id_number"
                  class="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-[11px] flex items-center shadow-sm"
                >
                  {{ p.last_name }}, {{ p.first_name[0] }}.
                  <button
                    @click="removeParticipant(p.id_number)"
                    class="ml-2 text-red-500 font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <span
                  v-if="selectedParticipants.length === 0 && selectedRoom?.room_type !== 'nap_pad'"
                  class="text-[10px] text-gray-400 italic"
                  >No members added yet.</span
                >
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div class="flex justify-between items-end">
                <div class="flex-1">
                  <label class="text-[10px] font-bold uppercase text-gray-500">Date</label>
                  <input v-model="bookingForm.date" type="date" class="input" />
                </div>
                <div v-if="selectedRoom" class="ml-4 mb-2">
                  <span
                    class="text-[9px] font-black px-2 py-1 rounded bg-yellow-100 text-yellow-700 uppercase"
                  >
                    Limit:
                    {{
                      selectedRoom.room_type === 'nap_pad'
                        ? '45 Mins'
                        : selectedRoom.room_type === 'discussion'
                          ? '2 Hours'
                          : 'N/A'
                    }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500">Start Time</label>
                  <input v-model="bookingForm.time" type="time" class="input" />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase text-gray-500">End Time</label>
                  <input v-model="bookingForm.endTime" type="time" class="input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions mt-8 pt-4 border-t border-gray-100">
          <button class="btn-cancel" @click="closeModals">Cancel</button>
          <button class="btn-confirm w-full md:w-auto px-10" @click="createBooking">
            Create Reservation
          </button>
        </div>
      </div>
    </div>

    <div v-if="modals.quickBook" class="modal">
      <div class="modal-box">
        <h2 class="modal-title text-xl font-bold mb-4">Quick Book: {{ selectedRoom?.name }}</h2>

        <div class="space-y-3">
          <label class="text-[10px] font-bold uppercase text-gray-500">Session Title</label>
          <input v-model="bookingForm.activity" placeholder="Walk-in Session" class="input" />

          <label class="text-[10px] font-bold uppercase text-gray-500">Requester ID</label>
          <input
            v-model="bookingForm.requester"
            list="student-ids"
            placeholder="Enter ID Number"
            class="input"
          />

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] font-bold uppercase text-gray-400">Program</label>
              <input v-model="bookingForm.program" readonly class="input bg-gray-100 text-xs" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase text-gray-400">Year</label>
              <input v-model="bookingForm.year_level" readonly class="input bg-gray-100 text-xs" />
            </div>
          </div>

          <div class="border-t pt-3 mt-3">
            <label class="text-[10px] font-bold uppercase text-gray-500">Add Companions</label>
            <div class="flex gap-2">
              <input
                list="student-ids"
                id="quick-part-input"
                placeholder="Search Member ID"
                class="input text-xs"
              />
              <button
                @click="handleAddParticipantFromInput('quick-part-input')"
                class="bg-gray-800 text-white px-3 py-1 rounded text-xs"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <div
                v-for="p in selectedParticipants"
                :key="p.id_number"
                class="bg-gray-100 px-2 py-0.5 rounded text-[10px] flex items-center"
              >
                {{ p.last_name }}, {{ p.first_name }}
                <button @click="removeParticipant(p.id_number)" class="ml-1 text-red-500">×</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2">
            <div>
              <label class="text-[10px] font-bold uppercase text-gray-500">Starts At</label>
              <input v-model="bookingForm.time" type="time" class="input" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase text-gray-500">Ends At</label>
              <input v-model="bookingForm.endTime" type="time" class="input" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase text-gray-500">Date</label>
            <input v-model="bookingForm.date" type="date" class="input" />
          </div>
        </div>

        <div class="modal-actions mt-6">
          <button class="btn-cancel" @click="closeModals">Cancel</button>
          <button class="btn-confirm" @click="confirmQuickBook">Start Session Now</button>
        </div>
      </div>
    </div>

    <datalist id="student-ids">
      <option v-for="std in studentsList" :key="std.id_number" :value="std.id_number">
        {{ std.last_name }}, {{ std.first_name }} ({{ std.program }})
      </option>
    </datalist>

    <!-- END SESSION -->
    <div v-if="modals.endSession" class="modal">
      <div class="modal-box text-center">
        <h2 class="modal-title">End Session?</h2>

        <p class="text-sm mb-4 p-5">This will free {{ selectedRoom?.name }}</p>

        <div class="modal-actions justify-center">
          <button class="btn-cancel" @click="closeModals">Cancel</button>
          <button
            class="btn-confirm-session bg-red-700 text-white font-semibold"
            style="padding: 10px; border-radius: 5px; font-size: 14px"
            @click="confirmEndSession"
          >
            End Session
          </button>
        </div>
      </div>
    </div>

    <!-- SCHEDULE -->
    <div v-if="modals.schedule" class="modal">
      <div class="modal-box">
        <h2 class="modal-title">{{ selectedRoom?.name }} Schedule</h2>

        <p class="text-sm text-gray-500">Schedule preview will appear here.</p>

        <div class="modal-actions">
          <button class="btn-confirm" @click="closeModals">Close</button>
        </div>
      </div>
    </div>

    <!-- EQUIPMENT MODAL -->
    <div v-if="modals.equipment" class="modal">
      <div class="modal-box">
        <h2 class="modal-title">Update Equipment Inventory</h2>

        <!-- ADD EQUIPMENT -->
        <div class="flex gap-2 mb-4 items-center">
          <input
            v-model="newEquipment"
            placeholder="New equipment"
            class="input"
            style="height: 2.5rem; width: 80%; margin-bottom: 0"
          />
          <button class="btn-confirm-add" @click="addEquipment">Add</button>
        </div>

        <!-- EQUIPMENT LIST -->
        <div class="space-y-2 max-h-50 overflow-y-auto">
          <div v-for="(item, i) in amenities" :key="i" class="equipment-edit">
            <span>{{ item.name }}</span>

            <div class="flex gap-2">
              <button class="btn-cancel-inventory" @click="removeEquipment(i)">Delete</button>
            </div>
          </div>
        </div>

        <div class="btn-actions-inventory">
          <button class="btn-confirm" @click="closeModals">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'
import '@/assets/styles/avr-reservation.css'

/* =====================================================
  TYPES & INTERFACES
===================================================== */
interface Room {
  id: string
  name: string
  floor: string
  wing: string
  room_type: string
  status: 'Available' | 'Occupied'
  currentSession?: { title: string; time: string } | null
}

interface Student {
  id_number: string
  first_name: string
  last_name: string
  program: string
  year_level: string
}

/* =====================================================
  VIEW STATE & FILTERS
===================================================== */
const activeFloor = ref('2nd Floor')
const activeWing = ref('Left Wing')
const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// Room Dropdown Filters (Inside Modal)
const selectedFloor = ref('')
const selectedWing = ref('')
const selectedRoomType = ref('')
const selectedRoomId = ref('')

/* =====================================================
  DATA REPOSITORIES
===================================================== */
const rooms = ref<Room[]>([])
const studentsList = ref<Student[]>([])
const upcomingReservations = ref<any[]>([])
const selectedParticipants = ref<Student[]>([])
const newEquipment = ref('')

const amenities = ref([
  { name: 'Projector', working: true },
  { name: 'Sound System', working: true },
  { name: 'Aircon Units', working: false },
])

const steps = ref([
  'Verify Student ID / Faculty ID',
  'Check Room Availability',
  'Log Equipment Borrowed',
  'Issue Room Key / Access',
])

const modals = ref({
  booking: false,
  quickBook: false,
  endSession: false,
  schedule: false,
  equipment: false,
})

const bookingForm = ref({
  room_id: null as string | null,
  requester: '',
  program: '',
  year_level: '',
  activity: '',
  date: new Date().toISOString().split('T')[0],
  time: '',
  endTime: '',
  status: 'pending',
})

/* =====================================================
  COMPUTED PROPERTIES (FILTERING)
===================================================== */
const filteredRooms = computed(() =>
  rooms.value.filter((r) => r.floor === activeFloor.value && r.wing === activeWing.value),
)

const availableFloors = computed(() => [...new Set(rooms.value.map((r) => r.floor))])
const availableWings = computed(() => [...new Set(rooms.value.map((r) => r.wing))])
const availableRoomTypes = computed(() => [...new Set(rooms.value.map((r) => r.room_type))])

const filteredRoomOptions = computed(() => {
  return rooms.value.filter((r) => {
    return (
      (!selectedFloor.value || r.floor === selectedFloor.value) &&
      (!selectedWing.value || r.wing === selectedWing.value) &&
      (!selectedRoomType.value || r.room_type === selectedRoomType.value)
    )
  })
})

const selectedRoom = computed(() => rooms.value.find((r) => r.id === selectedRoomId.value) || null)

const roomStats = computed(() => [
  { label: 'Total Rooms', value: rooms.value.length, icon: 'fas fa-door-open', color: '#0d2b0f' },
  {
    label: 'Available',
    value: rooms.value.filter((r) => r.status === 'Available').length,
    icon: 'fas fa-check-circle',
    color: '#2e7d32',
  },
  {
    label: 'Occupied',
    value: rooms.value.filter((r) => r.status === 'Occupied').length,
    icon: 'fas fa-clock',
    color: '#d32f2f',
  },
  {
    label: 'Pending',
    value: upcomingReservations.value.filter((res) => res.status === 'pending').length,
    icon: 'fas fa-calendar-alt',
    color: '#f57c00',
  },
])

/* =====================================================
  WATCHERS (AUTO-FILL)
===================================================== */
watch(
  () => bookingForm.value.requester,
  (newId) => {
    const student = studentsList.value.find((s) => s.id_number === newId)
    if (student) {
      bookingForm.value.program = student.program
      bookingForm.value.year_level = student.year_level
    } else {
      bookingForm.value.program = ''
      bookingForm.value.year_level = ''
    }
  },
)

/* =====================================================
  SUPABASE METHODS
===================================================== */
async function refreshData() {
  const { data: roomData } = await supabase
    .from('rooms')
    .select('*, room_reservations(*)')
    .order('name')
  const { data: resData } = await supabase
    .from('room_reservations')
    .select('*, rooms(name)')
    .order('booking_date', { ascending: false })
  const { data: studData } = await supabase.from('students').select('*')

  if (roomData) {
    rooms.value = roomData.map((r: any) => {
      const active = r.room_reservations?.find((res: any) => res.status === 'ongoing')
      return {
        ...r,
        status: active ? 'Occupied' : 'Available',
        currentSession: active
          ? { title: active.purpose, time: `${active.start_time} - ${active.end_time}` }
          : null,
      }
    })
  }

  if (resData) {
    upcomingReservations.value = resData.map((r) => ({
      id: r.id,
      date: r.booking_date,
      time: r.start_time,
      activity: r.purpose,
      requester: r.representative_student_id,
      status: r.status,
      room_name: r.rooms?.name,
    }))
  }

  if (studData) studentsList.value = studData
}

async function createBooking() {
  if (!selectedRoom.value) return alert('Please select a room first.')

  const start = bookingForm.value.time
  const end = bookingForm.value.endTime

  if (start && end) {
    // Convert time strings to Date objects for calculation
    const startTime = new Date(`2026-01-01T${start}`)
    const endTime = new Date(`2026-01-01T${end}`)

    // Calculate difference in minutes
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

    if (durationInMinutes <= 0) {
      return alert('Error: End time must be after start time.')
    }

    // 1. NAP PAD CONSTRAINTS (Max 45 Mins, 0 Participants)
    if (selectedRoom.value.room_type === 'nap_pad') {
      if (durationInMinutes > 45) {
        return alert('Error: Nap Pad sessions are strictly limited to 45 minutes.')
      }
      if (selectedParticipants.value.length > 0) {
        return alert('Error: Nap Pads are for individual use only. Please remove participants.')
      }
    }

    // 2. DISCUSSION ROOM CONSTRAINTS (Max 2 Hours, Must have Participants)
    if (selectedRoom.value.room_type === 'discussion') {
      if (durationInMinutes > 120) {
        return alert('Error: Discussion Room sessions are limited to 2 hours (120 mins).')
      }
      if (selectedParticipants.value.length === 0) {
        return alert('Error: Discussion Rooms require at least one participant/companion.')
      }
    }
  } else {
    return alert('Please fill in both Start and End times.')
  }

  // --- DATABASE INSERTION (Only runs if validations pass) ---
  const { data: res, error } = await supabase
    .from('room_reservations')
    .insert([
      {
        room_id: selectedRoomId.value,
        representative_student_id: bookingForm.value.requester,
        booking_date: bookingForm.value.date,
        start_time: start,
        end_time: end,
        purpose: bookingForm.value.activity,
        status: 'pending',
        program: bookingForm.value.program,
        year_level: bookingForm.value.year_level,
      },
    ])
    .select()
    .single()

  if (error) return alert(error.message)

  // Insert participants if any
  if (selectedParticipants.value.length > 0) {
    const pData = selectedParticipants.value.map((p) => ({
      reservation_id: res.id,
      student_id: p.id_number,
    }))
    await supabase.from('room_reservation_participants').insert(pData)
  }

  alert('Reservation successfully created!')
  closeModals()
  refreshData()
}

watch([() => bookingForm.value.time, () => selectedRoom.value], ([newTime, room]) => {
  if (!newTime || !room) return

  const [hours, minutes] = newTime.split(':').map(Number)
  const startDate = new Date()

  let duration = 60
  if (room.room_type === 'nap_pad') duration = 45
  if (room.room_type === 'discussion') duration = 120

  const endDate = new Date(startDate.getTime() + duration * 60000)
  bookingForm.value.endTime = endDate.toTimeString().slice(0, 5)
})

// confirm booking

async function confirmQuickBook() {
  if (!selectedRoom.value) return
  const now = new Date().toTimeString().slice(0, 5)

  const { error } = await supabase.from('room_reservations').insert([
    {
      room_id: selectedRoom.value.id,
      representative_student_id: bookingForm.value.requester,
      booking_date: new Date().toISOString().split('T')[0],
      start_time: now,
      end_time: bookingForm.value.endTime || '17:00',
      purpose: bookingForm.value.activity || 'Quick Session',
      status: 'ongoing',
      program: bookingForm.value.program,
      year_level: bookingForm.value.year_level,
    },
  ])

  if (error) return alert(error.message)
  closeModals()
  refreshData()
}

async function confirmEndSession() {
  if (!selectedRoom.value) return
  const { error } = await supabase
    .from('room_reservations')
    .update({ status: 'completed' })
    .eq('room_id', selectedRoom.value.id)
    .eq('status', 'ongoing')

  if (error) alert(error.message)
  closeModals()
  refreshData()
}

async function updateStatus(id: string, status: string) {
  await supabase.from('room_reservations').update({ status }).eq('id', id)
  refreshData()
}

async function deleteReservation(id: string) {
  if (confirm('Are you sure you want to delete this?')) {
    await supabase.from('room_reservations').delete().eq('id', id)
    refreshData()
  }
}

/* =====================================================
  HELPERS
==================================================== */
function formatRoomType(type: string) {
  return type?.replace('_', ' ') || 'General'
}

function getRoomIcon(type: string) {
  const icons: Record<string, string> = {
    avr: 'fas fa-film',
    discussion: 'fas fa-comments',
    quiet_room: 'fas fa-leaf',
    nap_pad: 'fas fa-bed',
  }
  return icons[type] || 'fas fa-door-closed'
}

function handleAddParticipantFromInput(inputId: string) {
  const input = document.getElementById(inputId) as HTMLInputElement
  const student = studentsList.value.find((s) => s.id_number === input.value)
  if (student && !selectedParticipants.value.find((p) => p.id_number === student.id_number)) {
    selectedParticipants.value.push(student)
    input.value = ''
  }
}

function removeParticipant(id: string) {
  selectedParticipants.value = selectedParticipants.value.filter((p) => p.id_number !== id)
}

function openModal(type: keyof typeof modals.value, room?: any) {
  if (room) {
    selectedRoomId.value = room.id
    selectedFloor.value = room.floor
    selectedWing.value = room.wing
    selectedRoomType.value = room.room_type
  }
  modals.value[type] = true
}

function closeModals() {
  Object.keys(modals.value).forEach((k) => (modals.value[k as keyof typeof modals.value] = false))
  selectedParticipants.value = []
  bookingForm.value = {
    room_id: null,
    requester: '',
    program: '',
    year_level: '',
    activity: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    endTime: '',
    status: 'pending',
  }
}

function addEquipment() {
  if (newEquipment.value) {
    amenities.value.push({ name: newEquipment.value, working: true })
    newEquipment.value = ''
  }
}

function removeEquipment(index: number) {
  amenities.value.splice(index, 1)
}

onMounted(refreshData)
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #eee;
}

.report-table thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
  box-shadow: inset 0 -1px 0 #eee;
}

.table-container::-webkit-scrollbar {
  width: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}

.custom-scroll {
  height: calc(100vh - 300px);
}

.col-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-box {
  background: white;
  padding: 35px;
  border-radius: 12px;
  width: 600px;
}

.modal-title {
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.input {
  width: 100%;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 13.5px;
}

.btn-confirm {
  background: #0d2b0f;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
}

.btn-cancel {
  background: #eee;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
}

.btn-outline {
  flex: 1;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
}

.btn-cancel-inventory {
  background-color: #c62828;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-cancel-inventory:hover {
  background-color: #a50e0e;
}

.btn-confirm-add {
  background: #0d2b0f;
  color: white;
  height: 2.5rem;
  padding: 0 25px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-confirm-add:hover {
  background: #1b5e20;
}

.btn-outline-inventory {
  margin-top: 0;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  background: white;
  cursor: pointer;
}

.btn-dark {
  flex: 1;
  font-size: 13px;
  background: #0d2b0f;
  color: white;
  border-radius: 6px;
  padding: 6px;
}

.btn-yellow {
  flex: 1;
  font-size: 13px;
  background: #f9a825;
  color: #0d2b0f;
  border-radius: 6px;
  padding: 6px;
}

.empty-state {
  text-align: center;
  border: 2px dashed #ddd;
  padding: 10px;
  font-size: 12px;
  color: #999;
}

.badge {
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.badge-red {
  background: #f8d7da;
  color: #721c24;
}

.badge-green {
  background: #d4edda;
  color: #155724;
}

.col-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.staff-panel {
  background: #0d2b0f;
  color: white;
}

.staff-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12.5px;
}

.step-number {
  background: #f9a825;
  color: #0d2b0f;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
}

.equipment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 13.5px;
}

.equipment-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-green {
  background: #2ecc71;
}

.dot-red {
  background: #e74c3c;
}

.equipment-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
}
</style>
