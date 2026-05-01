import { supabase } from '@/lib/supabase'

/**
 * EVENT TYPE
 */
export interface EventData {
  type?: string
  title?: string
  description?: string
  year?: number
  start_date?: string
  end_date?: string
  location?: string
  is_active?: boolean
  created_by?: string
  images?: string | null
  time_start?: string | null
  time_end?: string | null
}

/**
 * Get all events
 */
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      users (
        id,
        full_name
      )
    `,
    )
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    throw error
  }

  return data
}

/**
 * Get single event
 */
export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      users (
        id,
        full_name
      )
    `,
    )
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    throw error
  }

  return data
}

/**
 * Create event
 */
export const createEvent = async (eventData: EventData) => {
  const { data, error } = await supabase.from('events').insert([eventData]).select().single()

  if (error) {
    console.error('Error creating event:', error)
    throw error
  }

  return data
}

/**
 * Update event
 */
export const updateEvent = async (eventId: string, updates: Partial<EventData>) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    throw error
  }

  return data
}

/**
 * Delete event
 */
export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase.from('events').delete().eq('id', eventId)

  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }

  return true
}
