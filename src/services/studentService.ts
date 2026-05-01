import { supabase } from '@/lib/supabase'

const TABLE = 'students'

export const personnelService = {

  async getAll() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true })  // ← i-change sa true

  if (error) throw error
  return data
},

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(person: any) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(person)
      .select()

    if (error) throw error
    return data
  },

  async update(id: string, person: any) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(person)
      .eq('id', id)
      .select()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

}
