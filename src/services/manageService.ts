// src/services/manageService.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FunctionalComponent } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import { BookOpen } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

export interface Service {
  id: string
  title: string
  description: string
  icon: FunctionalComponent<LucideIcons.LucideProps>
  icon_name: string
  order_num: number
  edited_by: string | null
  edited_at: string | null
  // local edit state (not in DB)
  editing: boolean
  editTitle: string
  editDescription: string
  editIcon: FunctionalComponent<LucideIcons.LucideProps>
  iconSearch: string
}

function resolveIcon(name: string): FunctionalComponent<LucideIcons.LucideProps> {
  const icon = (LucideIcons as Record<string, unknown>)[name]
  if (typeof icon === 'function') return icon as FunctionalComponent<LucideIcons.LucideProps>
  return BookOpen as FunctionalComponent<LucideIcons.LucideProps>
}

function resolveIconName(component: FunctionalComponent<LucideIcons.LucideProps>): string {
  const entry = Object.entries(LucideIcons).find(([, v]) => v === component)
  return entry ? entry[0] : 'BookOpen'
}

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── FETCH ───────────────────────────────────────────────────────────────────
  async function fetchServices() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('website_services')
        .select('*')
        .order('order_num', { ascending: true })

      if (err) throw err

      services.value = (data ?? []).map(row => ({
        id: String(row.id),
        title: row.title,
        description: row.description,
        icon: resolveIcon(row.icon),
        icon_name: row.icon ?? 'BookOpen',
        order_num: row.order_num ?? 0,
        edited_by: row.edited_by ?? null,
        edited_at: row.edited_at ?? null,
        // local edit state
        editing: false,
        editTitle: '',
        editDescription: '',
        editIcon: resolveIcon(row.icon),
        iconSearch: '',
      }))
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch services'
    } finally {
      loading.value = false
    }
  }

  // ─── ADD ─────────────────────────────────────────────────────────────────────
  async function addService(payload: {
    id: string
    title: string
    description: string
    icon: FunctionalComponent<LucideIcons.LucideProps>
  }) {
    const icon_name = resolveIconName(payload.icon)
    const max_order = services.value.reduce((m, s) => Math.max(m, s.order_num ?? 0), 0)

    const { data, error: err } = await supabase
      .from('website_services')
      .insert({
        title: payload.title,
        description: payload.description,
        icon: icon_name,
        order_num: max_order + 1,
      })
      .select()
      .single()

    if (err) throw err

    services.value.push({
      id: String(data.id),
      title: data.title,
      description: data.description,
      icon: resolveIcon(data.icon),
      icon_name: data.icon ?? 'BookOpen',
      order_num: data.order_num ?? 0,
      edited_by: data.edited_by ?? null,
      edited_at: data.edited_at ?? null,
      editing: false,
      editTitle: '',
      editDescription: '',
      editIcon: resolveIcon(data.icon),
      iconSearch: '',
    })
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────
  async function updateService(
    id: string,
    updates: Partial<Pick<Service, 'title' | 'description' | 'icon'>>
  ) {
    const icon_name = updates.icon ? resolveIconName(updates.icon) : undefined

    const { error: err } = await supabase
      .from('website_services')
      .update({
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(icon_name !== undefined && { icon: icon_name }),
        edited_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (err) throw err

    const s = services.value.find(s => s.id === id)
    if (s) {
      if (updates.title !== undefined) s.title = updates.title
      if (updates.description !== undefined) s.description = updates.description
      if (updates.icon !== undefined) {
        s.icon = updates.icon
        s.icon_name = icon_name!
      }
      s.edited_at = new Date().toISOString()
    }
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────────
  async function deleteService(id: string) {
    const { error: err } = await supabase
      .from('website_services')
      .delete()
      .eq('id', id)

    if (err) throw err

    services.value = services.value.filter(s => s.id !== id)
  }

  return { services, loading, error, fetchServices, addService, updateService, deleteService }
})