import { supabase } from "@/lib/supabase"

export type WebsiteMediaType = "image" | "video"
export type WebsitePageType = "homepage" | "aboutpage"

export type WebsiteImageRow = {
  id: string
  page: WebsitePageType
  section: string
  image_url: string | null
  display_order: number
  is_active: boolean
  uploaded_by: string | null
  created_at: string | null
  updated_at: string | null
  media_type: WebsiteMediaType
  video_url: string | null
  title: string | null
  thumbnail_url: string | null
  external_link: string | null
}

export type WebsiteImagePayload = {
  page: WebsitePageType
  section: string
  image_url?: string | null
  display_order: number
  is_active?: boolean
  uploaded_by?: string | null
  media_type: WebsiteMediaType
  video_url?: string | null
  title?: string | null
  thumbnail_url?: string | null
  external_link?: string | null
}

export const getImagesByPage = async (page: 'homepage' | 'aboutpage') => {
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .eq('page', page)
    .eq('is_active', true)
    .order('section', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export const getAllWebsiteImages = async () => {
  const { data, error } = await supabase
    .from("website_images")
    .select("*")
    .order("page", { ascending: true })
    .order("section", { ascending: true })
    .order("display_order", { ascending: true })

  if (error) throw error
  return (data || []) as WebsiteImageRow[]
}

export const createWebsiteImage = async (imageData: WebsiteImagePayload) => {
  const payload: WebsiteImagePayload = {
    ...imageData,
    thumbnail_url:
      imageData.media_type === "image"
        ? (imageData.thumbnail_url ?? imageData.image_url ?? null)
        : (imageData.thumbnail_url ?? null),
  }

  const { data, error } = await supabase
    .from("website_images")
    .insert([
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single()

  if (error) throw error
  return data as WebsiteImageRow
}

export const updateWebsiteImage = async (
  id: string,
  updates: Partial<WebsiteImagePayload>,
) => {
  const normalizedUpdates: Partial<WebsiteImagePayload> = {
    ...updates,
  }

  if (normalizedUpdates.media_type === "image") {
    normalizedUpdates.thumbnail_url =
      normalizedUpdates.thumbnail_url ?? normalizedUpdates.image_url ?? null
    normalizedUpdates.video_url = null
  }

  const { data, error } = await supabase
    .from("website_images")
    .update({
      ...normalizedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as WebsiteImageRow
}

export const deleteWebsiteImage = async (id: string) => {
  const { error } = await supabase
    .from("website_images")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export const uploadWebsiteImage = async (file: File, folder: string) => {
  const safeName = file.name.replace(/\s+/g, "-")
  const fileName = `${Date.now()}-${safeName}`
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from("website_images")
    .upload(filePath, file, {
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from("website_images")
    .getPublicUrl(filePath)

  return data.publicUrl
}

export const uploadWebsiteImageWithName = async (
  file: File,
  folder: string,
  fileName: string,
) => {
  const safeName = fileName.replace(/\s+/g, "-")
  const filePath = `${folder}/${safeName}`

  const { error } = await supabase.storage
    .from("website_images")
    .upload(filePath, file, {
      upsert: true,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from("website_images")
    .getPublicUrl(filePath)

  return data.publicUrl
}