// src/composables/useAuth.ts
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { signIn, signOut, signUp } from '@/utils/auth'
import type { Users } from '@/types/users'

// global state (shared across components)
const profile = ref<Users | null>(null)
const session = ref<any>(null)
const loading = ref<boolean>(false)

type SignupPayload = {
  email: string
  password: string
  role: 'admin' | 'staff' | 'super_admin'
  first_name: string
  last_name: string
}

export function useAuth() {
  const router = useRouter()

  // Supabase auth user (NOT your DB user)
  const user = computed(() => session.value?.user ?? null)

  // =========================
  // LOAD SESSION
  // =========================
  const loadSession = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session

    if (session.value) {
      await loadProfile()
    } else {
      profile.value = null
    }
  }

  // =========================
  // LOAD PROFILE (public.users)
  // =========================
  const loadProfile = async () => {
    const userId = session.value?.user?.id

    if (!userId) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        role,
        email,
        first_name,
        last_name
      `)
      .eq('id', userId)
      .single()

    if (error) throw error

    profile.value = {
      id: String(data.id),
      role: data.role,
      email: data.email,
      first_name: data.first_name ?? '',
      last_name: data.last_name ?? '',
    }
  }

  // =========================
  // LOGIN
  // =========================
  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { error } = await signIn(email, password)
      if (error) throw error

      await loadSession()
      redirectByRole()
    } finally {
      loading.value = false
    }
  }

  // =========================
  // SIGNUP
  // =========================
  const signup = async (payload: SignupPayload) => {
    loading.value = true
    try {
      // 1. Create auth user
      const { data, error } = await signUp(payload.email, payload.password)
      if (error) throw error
      if (!data.user?.id) throw new Error('Signup failed: missing user id.')

      // 2. Insert into public.users
      const profileRow: Users = {
        id: data.user.id,
        role: payload.role,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert(profileRow)

      if (insertError) throw insertError

      // 3. Set session
      if (data.session) {
        session.value = data.session
      } else {
        const { data: s } = await supabase.auth.getSession()
        session.value = s.session
      }

      // 4. Set profile locally
      profile.value = profileRow

      // 5. Redirect
      redirectByRole()
    } finally {
      loading.value = false
    }
  }

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    await signOut()
    session.value = null
    profile.value = null
    router.push('/')
  }

  // =========================
  // ROLE-BASED REDIRECT
  // =========================
  const redirectByRole = () => {
    if (!profile.value) return

    switch (profile.value.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'staff':
        router.push('/admin')
        break
      case 'super_admin':
        router.push('/admin')
        break
      default:
        router.push('/not-authorized')
    }
  }

  return {
    session,
    user,      // auth user
    profile,   // DB user
    loading,
    login,
    signup,
    logout,
    loadSession,
  }
}

export default useAuth