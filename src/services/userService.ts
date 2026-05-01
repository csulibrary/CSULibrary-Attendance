import { supabase } from '@/lib/supabase'

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  role: 'admin' | 'staff' | 'user';
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }

    return data as User[];
  },

  async toggleUserStatus(id: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
  async updateUserRole(id: string, newRole: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};