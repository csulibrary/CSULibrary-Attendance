<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="'SERVICES'"></Sidebar>

    <main class="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
      <header class="report-header intro-header">
        <div class="header-left">
          <div class="header-breadcrumb !mb-0">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/services/curriculum')"
            >
              BACK
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Curriculum</span>
          </div>
          <h1
            class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
          >
            <span
              class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[220px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
              >Curriculum</span
            >
            <span class="text-yellow-500"> Information</span>
          </h1>
          <p class="header-sub">
            Create a new curriculum information to share with the academic community.
          </p>
        </div>
      </header>

      <section
        class="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl border border-slate-200 bg-[#f5f3ef] p-8 shadow-sm mt-6"
      >
        <!-- College and Program dropdowns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >College</label
            >
            <select
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            >
              <option value="">Select College...</option>
              <option value="CAA">CAA - College of Agriculture and Agri-Industries</option>
              <option value="CCIS">CCIS - College of Computing and Information Sciences</option>
              <option value="CED">CED - College of Education</option>
              <option value="CEGS">CEGS - College of Engineering and Geo-Sciences</option>
              <option value="CHASS">CHASS - College of Humanities and Social Sciences</option>
              <option value="CMNS">CMNS - College of Mathematics and Natural Sciences</option>
              <option value="COFES">COFES - College of Forestry and Environmental Sciences</option>
              <option value="GS">GS - Graduate Studies</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >Program</label
            >
            <select
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            >
              <option value="">Select Program...</option>
            </select>
          </div>
        </div>

        <!-- Revision No, Legal Basis, Effectivity -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >Revision No.</label
            >
            <input
              type="text"
              placeholder="Revision No."
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >Legal Basis</label
            >
            <input
              type="text"
              placeholder="Legal Basis"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >Effectivity</label
            >
            <input
              type="text"
              placeholder="Effectivity"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >Description</label
          >
          <textarea
            placeholder="Description"
            rows="4"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"
          ></textarea>
        </div>

        <!-- Requirements Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left: Requirements to Complete the Degree -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23]">
              Requirements to Complete the Degree
            </h3>
            <input
              type="text"
              placeholder="Enter the requirement..."
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
            <button
              class="w-fit rounded-lg bg-[#0d2b0f] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
            >
              Add Here
            </button>
          </div>

          <!-- Right: Course Requirements -->
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-2">
              <h4 class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white">
                Requirement #1
              </h4>
              <div class="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Course Name"
                  class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                />
                <input
                  type="text"
                  placeholder="Enter Course Code"
                  class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                />
              </div>
              <button
                class="w-fit rounded-lg bg-[#0d2b0f] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
              >
                Add Here
              </button>
            </div>
            <h4 class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white">
              Requirement #2
            </h4>
            <h4 class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white">
              Requirement #3
            </h4>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.header-sub {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>
