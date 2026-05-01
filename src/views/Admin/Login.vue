<template>
  <div
    class="w-full min-h-screen flex items-center justify-center py-6 bg-cover bg-center bg-no-repeat relative font-poppins"
    :style="{ backgroundImage: `url(${libImg})` }"
  >
    <div class="absolute inset-0 bg-black/20"></div>

    <div class="w-full max-w-md mx-auto relative z-10 p-4">
      <div
        class="bg-white/20 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/30 shadow-2xl"
      >
        <div class="mb-10 flex items-center">
          <RouterLink
            to="/"
            class="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all group shadow-lg"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </RouterLink>

          <div class="flex-1 text-center pr-10 mb-1">
            <h2 class="text-4xl font-black text-white tracking-tight leading-none">Login</h2>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-xs uppercase tracking-widest font-bold text-white mb-2 ml-1">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="example@email.com"
              class="w-full px-5 py-3.5 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-green-400 focus:bg-white/20 outline-none transition-all"
              required
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2 ml-1">
              <label class="text-xs uppercase tracking-widest font-bold text-white">
                Password
              </label>
              <a href="#" class="text-xs text-white/60 hover:text-white hover:underline transition">
                Forgot?
              </a>
            </div>

            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-5 py-3.5 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-green-400 focus:bg-white/20 outline-none transition-all"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-[#1b5e20] hover:bg-[#257a2b] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#1b5e20]/20 active:scale-[0.98] transition-all duration-300 border border-white/10 uppercase tracking-widest text-sm"
          >
            Log In
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-white/60 text-sm">
            No Account?
            <RouterLink
              to="/admin/signin"
              class="text-[#00bf63] font-black hover:underline transition-colors duration-200"
            >
              Register Here
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import libImg from '@/assets/images/HERO.png'

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      alert('Please fill in both email and password')
      return
    }

    await login(email.value, password.value)
    // Redirect is handled in useAuth composable
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Login failed')
  }
}
</script>
