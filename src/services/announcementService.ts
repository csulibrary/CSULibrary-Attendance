import { supabase } from "@/lib/supabase"

/**
 * Get all announcements
 */
export const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select(`
      *,
      users (
        id,
      ), 
      events (
        id,
        title,
        start_date,
        location
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching announcements:", error)
    throw error
  }

  return data
}


/**
 * Get single announcement
 */
export const getAnnouncementById = async (announcementId: string) => {
  const { data, error } = await supabase
    .from("announcements")
    .select(`
      *,
      users (
        id,
        full_name
      ),
      events (
        id,
        title,
        start_date,
        location
      )
    `)
    .eq("id", announcementId)
    .single()

  if (error) {
    console.error("Error fetching announcement:", error)
    throw error
  }

  return data
}


/**
 * Create announcement
 */
export const createAnnouncement = async (announcementData: {
  type?: string
  title: string
  content?: string
  image_url?: string
  event_id?: string | null
  created_by?: string
}) => {
  const { data, error } = await supabase
    .from("announcements")
    .insert([announcementData])
    .select()
    .single()

  if (error) {
    console.error("Error creating announcement:", error)
    throw error
  }

  return data
}


/**
 * Update announcement
 */
export const updateAnnouncement = async (
  announcementId: string,
  updates: {
    type?: string
    title?: string
    content?: string
    image_url?: string
    event_id?: string | null
    updated_at?: string
  }
) => {
  const { data, error } = await supabase
    .from("announcements")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", announcementId)
    .select()
    .single()

  if (error) {
    console.error("Error updating announcement:", error)
    throw error
  }

  return data
}


/**
 * Delete announcement
 */
export const deleteAnnouncement = async (announcementId: string) => {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId)

  if (error) {
    console.error("Error deleting announcement:", error)
    throw error
  }

  return true
}