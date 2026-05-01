<template>
  <div
    class="w-full min-h-screen font-['Poppins'] bg-[#f7f5f0] pb-20 pt-[40px] relative overflow-hidden"
  >
    <!-- Decorative background -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#009900]/5 blur-[120px] translate-x-1/3 -translate-y-1/3"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-[#2e7d32]/4 blur-[100px] -translate-x-1/4 translate-y-1/4"
      ></div>
      <svg
        class="absolute inset-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#009900" stroke-width="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <div class="w-full px-2 sm:px-4 lg:px-8 relative z-10">
      <!-- Page Header -->
      <div class="page-header mb-14 text-center">
        <div class="flex mt-8 items-center justify-center gap-3">
          <div class="w-10 h-[2px] bg-[#f9dc07]"></div>
          <span class="text-[10px] font-extrabold tracking-[0.32em] text-[#1a2e1a] uppercase">
            Digital Resources at CSU Library
          </span>
        </div>
        <h1
          class="digital-heading text-[clamp(2.8rem,8vw,5.5rem)] font-black text-[#1a2e1a] uppercase mb-5"
          style="font-family: 'Poppins', sans-serif; letter-spacing: -0.02em"
        >
          Digital Records
        </h1>
        <p
          class="text-[14px] text-[#888] leading-relaxed max-w-lg mx-auto font-normal tracking-wide"
        ></p>
        <p
          class="text-[14px] mt-10 text-[#888] leading-relaxed max-w-xl mx-auto font-normal tracking-wide"
        >
          Your gateway to institutional archives, digital collections, and academic resources —
          organized, accessible, and always available.
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="flex flex-col w-full bg-white rounded-xl overflow-hidden border border-[#009900] shadow-sm animate-pulse"
        >
          <div class="h-44 bg-[#e8f5e9]"></div>
          <div class="p-6 flex flex-col gap-3">
            <div class="h-3 w-24 bg-[#c8e6c9] rounded"></div>
            <div class="h-3 w-full bg-[#e8f5e9] rounded"></div>
            <div class="h-3 w-3/4 bg-[#e8f5e9] rounded"></div>
            <div class="h-9 w-full bg-[#c8e6c9] rounded-lg mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="text-center py-24">
        <div class="inline-flex p-5 rounded-xl bg-red-50 mb-4">
          <svg
            class="w-8 h-8 text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <p class="text-[14px] text-red-400 font-light mb-4">{{ loadError }}</p>
        <button
          @click="loadRecords"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003300] text-white text-[12px] font-semibold tracking-wider uppercase rounded-lg hover:bg-[#009900] transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="records.length === 0" class="text-center py-24">
        <p class="text-[14px] text-[#bbb] font-light">No records available at the moment.</p>
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div
          v-for="(record, index) in records"
          :key="record.id"
          class="record-card group flex flex-col w-full h-full bg-white rounded-xl overflow-hidden border border-[#003300] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
          :style="`animation-delay: ${0.2 + index * 0.1}s`"
        >
          <!-- Icon Banner -->
          <div
            class="relative h-44 flex items-center justify-center bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] overflow-hidden"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#1b5e20]/10 to-[#2e7d32]/20"
            ></div>
            <div
              class="relative z-10 p-5 rounded-2xl bg-[#009900]/10 backdrop-blur-sm border border-[#003300]/20 group-hover:bg-[#003300] group-hover:rotate-6 transition-all duration-500"
            >
              <component
                :is="resolveIcon(record.icon_key)"
                class="w-10 h-10 text-[#003300] group-hover:text-white transition-colors duration-500"
              />
            </div>
            <div
              class="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#1b5e20]/30 rounded-tr-sm"
            ></div>
            <div
              class="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#1b5e20]/30 rounded-bl-sm"
            ></div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-5 h-[2px] bg-[#1b5e20]"></span>
              <h3
                class="text-[15px] font-bold tracking-widest uppercase text-[#1b5e20] font-['Poppins']"
              >
                {{ record.title }}
              </h3>
            </div>
            <p
              class="text-[14px] text-[#555] leading-relaxed mb-6 flex-grow font-['Poppins'] font-light"
            >
              {{ record.description }}
            </p>

            <!-- Internal Router Link -->
            <RouterLink
              v-if="isInternalRoute(record.url)"
              :to="{ name: record.url! }"
              class="record-btn group/btn relative flex items-center justify-between px-4 py-2.5 bg-[#1b5e20] text-white text-[12px] font-semibold tracking-wider uppercase font-['Poppins'] rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#2e7d32]"
            >
              <span class="relative z-10">{{ record.button_label }}</span>
              <svg
                class="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </RouterLink>

            <!-- External URL -->
            <a
              v-else-if="isExternalUrl(record.url)"
              :href="record.url!"
              target="_blank"
              rel="noopener noreferrer"
              class="record-btn group/btn relative flex items-center justify-between px-4 py-2.5 bg-[#1b5e20] text-white text-[12px] font-semibold tracking-wider uppercase font-['Poppins'] rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#2e7d32]"
            >
              <span class="relative z-10">{{ record.button_label }}</span>
              <svg
                class="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <!-- No URL yet -->
            <a
              v-else
              href="#"
              class="record-btn group/btn relative flex items-center justify-between px-4 py-2.5 bg-[#1b5e20] text-white text-[12px] font-semibold tracking-wider uppercase font-['Poppins'] rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#2e7d32]"
            >
              <span class="relative z-10">{{ record.button_label }}</span>
              <svg
                class="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      @click.self="isModalOpen = false"
    >
      <div
        class="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      >
        <button
          @click="isModalOpen = false"
          class="absolute top-4 right-4 text-white/70 hover:text-[#ffb74d] text-2xl font-bold transition-colors z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60"
        >
          ✕
        </button>
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/Lv0URTSBniY?autoplay=1"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Orientation Modal -->
    <div
      v-if="isOrientationModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      @click.self="isOrientationModalOpen = false"
    >
      <div
        class="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      >
        <button
          @click="isOrientationModalOpen = false"
          class="absolute top-4 right-4 text-white/70 hover:text-[#66bb6a] text-2xl font-bold transition-colors z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60"
        >
          ✕
        </button>
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/HAEPrH2aYpc?autoplay=1"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 11l7-7 7 7" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 17l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
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
} from 'lucide-vue-next'

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
)

// ─── Types ────────────────────────────────────────────────────────────────────
interface PublicRecordRow {
  id: string
  title: string | null
  button_label: string | null
  description: string | null
  url: string | null
  icon_key: string | null
  is_visible: boolean
  created_at: string | null
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, unknown> = {
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
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  ShoppingBag,
  Sidebar: SidebarIcon,
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
  FilePen: Pencil,
}

function resolveIcon(key: string | null): unknown {
  return ICON_MAP[key ?? ''] ?? Database
}

// ─── URL helpers ──────────────────────────────────────────────────────────────
function isExternalUrl(url: string | null): boolean {
  if (!url || url.trim() === '') return false
  return url.startsWith('http://') || url.startsWith('https://')
}

function isInternalRoute(url: string | null): boolean {
  if (!url || url.trim() === '') return false
  return !url.startsWith('http://') && !url.startsWith('https://')
}

// ─── State ────────────────────────────────────────────────────────────────────
const records = ref<PublicRecordRow[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)
const isModalOpen = ref(false)
const isOrientationModalOpen = ref(false)
const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function loadRecords() {
  loading.value = true
  loadError.value = null
  try {
    const { data, error } = await supabase
      .from('public_records')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    records.value = (data ?? []) as PublicRecordRow[]
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load records.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecords()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

.page-header {
  opacity: 0;
  animation: cardFadeUp 0.5s ease forwards;
}

.record-card {
  opacity: 0;
  animation: cardFadeUp 0.5s ease forwards;
}

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.record-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.record-btn:hover::after {
  transform: translateX(100%);
}

.digital-heading {
  margin: 10px 0 0;
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  line-height: 1.02;
}

.scroll-top-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 70;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: #06260f;
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-2px);
}

.scroll-top-btn:active {
  transform: translateY(0);
}

.scroll-top-btn svg {
  width: 18px;
  height: 18px;
}
</style>
