import { supabase } from "@/lib/supabase"

/* =====================================================
  TYPES
===================================================== */

export interface GallerySection {
  id?: string
  floor?: string
  wing?: string
  section_name?: string
  description?: string
  created_at?: string
  note?: string
  gallery_images?: GalleryImage[] // Nested relation
}

export interface GalleryImage {
  id?: string
  section_id: string
  image_url: string
  caption?: string
  display_order?: number
  uploaded_by?: string
  created_at?: string
}

/* =====================================================
  OPTIMIZED FETCH (SINGLE REQUEST)
===================================================== */

/**
 * Fetches all sections with their related images in one query.
 */
export const getGallerySectionsWithImages = async () => {
  const { data, error } = await supabase
    .from('gallery_sections')
    .select(`
      *,
      gallery_images (*)
    `)
    .order('created_at', { ascending: true })
    .order('display_order', { referencedTable: 'gallery_images', ascending: true })

  if (error) throw error
  return data as GallerySection[]
}

/* =====================================================
  GALLERY SECTIONS CRUD
===================================================== */

// Get all sections
export const getGallerySections = async () => {
  const { data, error } = await supabase
    .from('gallery_sections')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// Get section by ID
export const getGallerySectionById = async (id: string) => {
  const { data, error } = await supabase
    .from('gallery_sections')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Create new section
export const createGallerySection = async (section: GallerySection) => {
  const { data, error } = await supabase
    .from('gallery_sections')
    .insert(section)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update section
export const updateGallerySection = async (id: string, section: GallerySection) => {
  const { data, error } = await supabase
    .from('gallery_sections')
    .update(section)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete section
export const deleteGallerySection = async (id: string) => {
  const { error } = await supabase
    .from('gallery_sections')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* =====================================================
  GALLERY IMAGES CRUD
===================================================== */

// Get images for a specific section
export const getImagesBySection = async (sectionId: string) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('section_id', sectionId)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
}

// Add image to section
export const addGalleryImage = async (image: GalleryImage) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(image)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update image details
export const updateGalleryImage = async (id: string, image: Partial<GalleryImage>) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(image)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete image
export const deleteGalleryImage = async (id: string) => {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* =====================================================
  IMAGE ORDERING
===================================================== */

// Update display order of an image
export const updateImageOrder = async (id: string, order: number) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update({ display_order: order })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}