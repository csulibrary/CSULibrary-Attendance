// src/services/recordService.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Types ─────────────────────────────────────────────────────────────────

/** Shape as stored in Supabase */
export interface PublicRecordRow {
  id: string
  title: string | null
  button_label: string | null
  description: string | null
  url: string | null
  created_at: string | null
}

/** Shape used inside the Vue component (hydrated with UI-only fields) */
export interface PublicRecord extends PublicRecordRow {
  // UI-only fields (not persisted to DB)
  iconKey: string
  linkType: 'url' | 'route'
  visible: boolean
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

/**
 * Fetch all records ordered by creation date.
 */
export async function fetchRecords(): Promise<PublicRecordRow[]> {
  const { data, error } = await supabase
    .from('public_records')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Insert a new record. Returns the created row.
 */
export async function createRecord(payload: {
  title: string
  button_label: string
  description: string
  url: string
}): Promise<PublicRecordRow> {
  const { data, error } = await supabase
    .from('public_records')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Update an existing record by id. Returns the updated row.
 */
export async function updateRecord(
  id: string,
  payload: {
    title: string
    button_label: string
    description: string
    url: string
  }
): Promise<PublicRecordRow> {
  const { data, error } = await supabase
    .from('public_records')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Delete a record by id.
 */
export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('public_records')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}