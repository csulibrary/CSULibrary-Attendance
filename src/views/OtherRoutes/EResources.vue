<template>
  <div class="w-full py-10 px-4 relative" style="min-height: 100vh; background: #f7f5f0">
    <div class="relative" style="z-index: 2; max-width: 1200px; margin: 0 auto">
      <!-- ── HEADER ── -->
      <div class="mb-10">
        <!-- Back Button + Tags -->
        <div class="flex items-center gap-3 mb-3">
          <div class="flex items-center gap-3 mb-3">
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
              >Records</span
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
        </div>

        <!-- Title + Description -->
        <div class="anim-slide-up">
          <h1
            style="font-size: 2.2rem; font-weight: 900; color: #0d2b0f; line-height: 1.2"
            class="mb-2"
          >
            E-Resources
          </h1>
          <p style="font-size: 0.95rem; color: #555; max-width: 520px; line-height: 1.6">
            Academic databases, journals, digital libraries, and open-access platforms supporting
            research and lifelong learning.
          </p>
        </div>

        <!-- Search bar -->
        <div class="relative mt-6" style="max-width: 560px">
          <div
            class="absolute"
            style="left: 16px; top: 50%; transform: translateY(-50%); pointer-events: none"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1b5e20"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="opacity: 0.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Search databases, journals, platforms..."
            style="
              width: 100%;
              padding: 14px 16px 14px 44px;
              border: 2px solid rgba(13, 43, 15, 0.12);
              border-radius: 12px;
              background: white;
              font-size: 0.88rem;
              color: #0d2b0f;
              outline: none;
              box-shadow: 0 2px 16px rgba(13, 43, 15, 0.06);
              transition:
                border-color 0.2s,
                box-shadow 0.2s;
              font-weight: 500;
              box-sizing: border-box;
            "
            @focus="
              ;($event.target as HTMLInputElement).style.borderColor = '#1b5e20'
              ;($event.target as HTMLInputElement).style.boxShadow =
                '0 2px 20px rgba(27,94,32,0.12)'
            "
            @blur="
              ;($event.target as HTMLInputElement).style.borderColor = 'rgba(13,43,15,0.12)'
              ;($event.target as HTMLInputElement).style.boxShadow =
                '0 2px 16px rgba(13,43,15,0.06)'
            "
          />
          <div
            v-if="search"
            class="absolute"
            style="
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: #f9a825;
              color: #0d2b0f;
              font-size: 0.65rem;
              font-weight: 800;
              padding: 3px 9px;
              border-radius: 20px;
            "
          >
            {{ filteredResources.length }} found
          </div>
        </div>
      </div>

      <!-- ── DIVIDER ── -->
      <div class="flex items-center gap-4 mb-8">
        <div
          style="
            height: 1px;
            flex: 1;
            background: linear-gradient(to right, rgba(13, 43, 15, 0.15), transparent);
          "
        ></div>
        <span
          style="
            font-size: 0.6rem;
            font-weight: 800;
            letter-spacing: 0.25em;
            color: rgba(13, 43, 15, 0.35);
            text-transform: uppercase;
          "
          >{{ filteredResources.length }} entries</span
        >
        <div
          style="
            height: 1px;
            flex: 1;
            background: linear-gradient(to left, rgba(13, 43, 15, 0.15), transparent);
          "
        ></div>
      </div>

      <!-- ── RESOURCE GRID ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="(resource, index) in filteredResources"
          :key="index"
          class="group relative"
          style="
            border-radius: 16px;
            background: white;
            border: 1px solid rgba(13, 43, 15, 0.09);
            box-shadow: 0 2px 12px rgba(13, 43, 15, 0.06);
            padding: 22px 24px;
            cursor: default;
            transition:
              transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.35s,
              border-color 0.2s;
          "
          onmouseenter="
            this.style.transform = 'translateY(-4px)'
            this.style.boxShadow = '0 12px 32px rgba(13,43,15,0.12)'
            this.style.borderColor = 'rgba(27,94,32,0.25)'
          "
          onmouseleave="
            this.style.transform = 'translateY(0)'
            this.style.boxShadow = '0 2px 12px rgba(13,43,15,0.06)'
            this.style.borderColor = 'rgba(13,43,15,0.09)'
          "
        >
          <!-- Name -->
          <h3
            style="
              font-size: 0.9rem;
              font-weight: 800;
              color: #0d2b0f;
              line-height: 1.3;
              margin: 0 0 8px;
              padding-right: 24px;
              letter-spacing: -0.01em;
            "
          >
            {{ resource.name }}
          </h3>

          <!-- Description -->
          <p
            style="
              font-size: 0.76rem;
              color: rgba(13, 43, 15, 0.5);
              line-height: 1.7;
              margin: 0 0 16px;
            "
          >
            {{ resource.description }}
          </p>

          <!-- Bottom glow bar -->
          <div
            style="
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(to right, #1b5e20, #f9a825);
              border-radius: 0 0 16px 16px;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            "
            class="card-bar"
          ></div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredResources.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div
          style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(13, 43, 15, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          "
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1b5e20"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="opacity: 0.4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p style="font-size: 1rem; font-weight: 800; color: #0d2b0f; margin-bottom: 6px">
          No results found
        </p>
        <p style="font-size: 0.8rem; color: rgba(13, 43, 15, 0.4)">Try a different keyword</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const search = ref('')

const resources = [
  {
    name: 'Philippine eLib',
    description:
      'A collaborative project of NLP, UP, DOST, DA, and CHED providing access to Philippine scholarly resources.',
  },
  {
    name: 'InfoTrac',
    description:
      'Provides instant access to leading journals and reference sources with powerful discovery tools.',
  },
  {
    name: 'Aardvarknet.info (Asian Resources for Librarians)',
    description:
      'Links to free Asian databases and full-text journals across multiple disciplines.',
  },
  {
    name: 'CiteSeer',
    description:
      'Scientific digital library and search engine focusing on computer and information science literature.',
  },
  {
    name: 'College & Research Libraries (C&RL)',
    description:
      'Official scholarly journal of the Association of College & Research Libraries (ALA division).',
  },
  {
    name: 'D-Lib Magazine',
    description: 'Electronic publication focusing on digital library research and development.',
  },
  {
    name: 'Directory of Open Access Journals (DOAJ)',
    description: 'Provides access to quality-controlled open access scientific journals.',
  },
  {
    name: 'eBook Directory',
    description: 'Directory of free downloadable eBooks across various subjects.',
  },
  {
    name: 'ENR: Engineering News-Record',
    description: 'Engineering and construction industry news, data, and analysis.',
  },
  {
    name: 'Google Scholar',
    description:
      'Search engine for scholarly literature including peer-reviewed papers and theses.',
  },
  {
    name: 'HighWire Press',
    description:
      'Provides access to millions of articles from thousands of journals including PubMed.',
  },
  {
    name: 'Health Research and Development Information Network (HERDIN)',
    description: 'Database of Philippine health research citations and bibliographic records.',
  },
  {
    name: 'HINARI',
    description: 'Provides low-cost or free access to biomedical journals in developing countries.',
  },
  {
    name: 'Homiletic and Pastoral Review',
    description: 'Respected pastoral magazine serving clergy and lay readers.',
  },
  {
    name: 'Journal of Philippine Librarianship (JPL)',
    description: 'Annual publication covering library and information studies in the Philippines.',
  },
  {
    name: 'Library Journal',
    description: 'Professional publication covering library news, reviews, and trends.',
  },
  {
    name: 'OAIster',
    description: 'Searchable collection of freely available academic digital resources.',
  },
  {
    name: 'Open Access Journals',
    description: 'Collection of open access journals useful across disciplines.',
  },
  {
    name: 'PLoS Biology',
    description: 'Peer-reviewed open access journal published by the Public Library of Science.',
  },
  {
    name: 'PLOS One',
    description:
      'Open access journal providing research metrics, citations, and impact indicators.',
  },
  {
    name: 'POPLINE',
    description:
      'Database covering population, family planning, fertility, and health policy topics.',
  },
  {
    name: 'Project Euclid',
    description: 'Scholarly communication platform for mathematics and statistics research.',
  },
  {
    name: 'PubChem',
    description:
      'NIH database providing information on small organic molecules and biomedical research.',
  },
  {
    name: 'Social Science Research Network (SSRN)',
    description: 'Database of scholarly abstracts and downloadable working papers.',
  },
  {
    name: 'World Population Data',
    description: 'Provides demographic data and global population projections.',
  },
  {
    name: 'OMICS International',
    description: 'Open access publisher and conference organizer across multiple disciplines.',
  },
  {
    name: 'Science Publishing Group',
    description: 'Academic publisher offering journal and conference publishing services.',
  },
  {
    name: 'Bookboon',
    description: 'Online publisher of student-focused eBooks in engineering, IT, and business.',
  },
  {
    name: 'Springer',
    description: 'Global publisher providing scientific, technical, and medical research content.',
  },
  {
    name: 'Freebookcentre.net',
    description: 'Links to thousands of free online technical books in computer science and more.',
  },
  {
    name: 'GetFreeEbooks',
    description: 'Platform connecting authors and readers through free legal eBooks.',
  },
  {
    name: 'Google eBookstore',
    description: 'Provides access to free books in various genres with ratings and reviews.',
  },
  {
    name: 'Project Gutenberg',
    description: 'Digital library offering over one million free classic and historical eBooks.',
  },
  {
    name: 'Internet Archive',
    description: 'Non-profit digital library providing historical and academic books.',
  },
  {
    name: 'ManyBooks.net',
    description: 'Offers over 29,000 free eBooks compatible with various e-readers.',
  },
  {
    name: 'LibriVox',
    description: 'Platform offering thousands of free audiobooks including classics.',
  },
  {
    name: 'PDFDRIVE',
    description: 'Search engine allowing preview and download of millions of PDF files.',
  },
]

const filteredResources = computed(() =>
  resources.filter(
    (r) =>
      r.name.toLowerCase().includes(search.value.toLowerCase()) ||
      r.description.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

// Hover card-accent line via JS (since scoped CSS won't work with inline)
onMounted(() => {
  document.querySelectorAll('.group').forEach((card) => {
    const accent = card.querySelector('.card-accent') as HTMLElement
    const bar = card.querySelector('.card-bar') as HTMLElement
    card.addEventListener('mouseenter', () => {
      if (accent) accent.style.transform = 'scaleX(1)'
      if (bar) bar.style.transform = 'scaleX(1)'
    })
    card.addEventListener('mouseleave', () => {
      if (accent) accent.style.transform = 'scaleX(0)'
      if (bar) bar.style.transform = 'scaleX(0)'
    })
  })
})
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
.anim-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>
