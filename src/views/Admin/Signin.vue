<template>
  <div 
    class="w-full min-h-screen flex items-center justify-center py-6 bg-cover bg-center bg-no-repeat relative font-poppins"
    :style="{ backgroundImage: `url(${libImg})` }"
  >
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="w-full max-w-md mx-auto relative z-10 p-4">
      <div class="bg-white/20 backdrop-blur-md p-8 md:p-8 rounded-3xl border border-white/30 shadow-2xl">
        <div class="mb-5 text-center">
          <h2 class="text-3xl font-bold text-white">Sign Up</h2>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">

          <div>
            <label class="block text-sm font-semibold text-white mb-1">
              First Name
            </label>
            <input
            v-model="firstName"
              type="text"
              placeholder="Juan"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>

                    <div>
            <label class="block text-sm font-semibold text-white mb-1">
              Last Name
            </label>
            <input
             v-model="lastName"
              type="text"
              placeholder="Dela Cruz"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-white mb-1">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@email.com"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-semibold text-white">
                Password
              </label>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold text-white mb-1">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-white mb-1">
              Staff Code
            </label>
            <input
              v-model="staffCode"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-3 py-2 rounded-xl
                     border border-white/40 bg-white/10
                     text-white placeholder-white/60
                     focus:ring-2 focus:ring-green-400
                     focus:border-green-400
                     outline-none transition"
              required
            />
          </div>
          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-[#1b5e20] hover:bg-[#257a2b] text-white font-bold py-4 rounded-2xl
                  shadow-xl shadow-[#1b5e20]/20 
                  active:scale-[0.98] transition-all duration-300
                  border border-white/10 uppercase tracking-widest text-sm"
          >
            Sign In
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-white/80">
              Already have an account?
              <RouterLink
                to="/admin/login"
                class="text-green-400 font-semibold hover:underline"
              >
                Log In
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
import libImg from '@/assets/images/lib.jpg'

const { signup } = useAuth()
const router = useRouter()

const showPassword = ref(false)

// form fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const staffCode = ref('')

// change this later to env variable (important)
const VALID_STAFF_CODE = 'CSULibrary#2026-3-24'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

console.log('VALUES:', {
  firstName: firstName.value,
  lastName: lastName.value,
  email: email.value,
  password: password.value
})

const handleSignup = async () => {
  try {
    // 🔴 validation
    if (!firstName.value || !lastName.value || !email.value || !password.value) {
      alert('Please fill all fields')
      return
    }

    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match')
      return
    }

    // 🔐 staff code check
    if (staffCode.value !== VALID_STAFF_CODE) {
      alert('Invalid staff code')
      return
    }

    // ✅ call signup directly (no splitting anymore)
    await signup({
      email: email.value,
      password: password.value,
      role: 'staff',
      first_name: firstName.value,
      last_name: lastName.value
    })

    alert('Signup successful!')
    router.push('/admin')

  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Signup failed')
  }
}
</script>