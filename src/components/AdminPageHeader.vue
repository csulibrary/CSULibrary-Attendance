<script setup lang="ts">
import { computed } from 'vue'

type BreadcrumbItem = string | { label: string; to?: string }

const props = defineProps<{
  breadcrumbs: BreadcrumbItem[]
  title: string
}>()

const getLabel = (item: BreadcrumbItem) => (typeof item === 'string' ? item : item.label)
const getTo = (item: BreadcrumbItem) => (typeof item === 'string' ? undefined : item.to)
const hasLink = (item: BreadcrumbItem) => typeof item !== 'string' && Boolean(item.to)

const titleParts = computed(() => {
  const words = props.title.trim().split(/\s+/)
  if (words.length <= 1) {
    return { first: props.title, rest: '' }
  }

  return {
    first: words[0],
    rest: words.slice(1).join(' '),
  }
})
</script>

<template>
  <header class="attn-header admin-page-header">
    <div class="space-y-4">
      <div class="relative group">
        <nav class="header-breadcrumb admin-page-breadcrumb !mb-2" aria-label="Breadcrumb">
          <template v-for="(crumb, index) in breadcrumbs" :key="`${getLabel(crumb)}-${index}`">
            <RouterLink v-if="hasLink(crumb)" :to="getTo(crumb)!" class="admin-page-breadcrumb__item">
              {{ getLabel(crumb) }}
            </RouterLink>
            <span v-else class="admin-page-breadcrumb__item">{{ getLabel(crumb) }}</span>
            <svg
              v-if="index < breadcrumbs.length - 1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </template>
        </nav>

        <h1 class="header-title intro-title admin-page-title">
          <span class="admin-page-title__dark">{{ titleParts.first }}</span>
          <span v-if="titleParts.rest" class="admin-page-title__accent"> {{ titleParts.rest }}</span>
        </h1>

        <div v-if="$slots.subtitle" class="header-sub admin-page-subtitle">
          <slot name="subtitle" />
        </div>

        <div v-if="$slots.actions" class="admin-page-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-page-header {
  padding: 1.5rem;
}

.admin-page-header__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-page-header__content {
  min-width: 0;
}

.admin-page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(13, 43, 15, 0.4);
}

.admin-page-breadcrumb svg {
  width: 12px;
  height: 12px;
  opacity: 0.4;
  flex: none;
}

.admin-page-breadcrumb__item {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.admin-page-title {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.admin-page-title__dark {
  color: #0d2b0f;
}

.admin-page-title__accent {
  color: #f9a825;
}

.admin-page-subtitle {
  margin-top: 0.25rem;
  font-size: 0.82rem;
  color: rgba(13, 43, 15, 0.5);
  font-weight: 400;
}

.admin-page-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}
</style>