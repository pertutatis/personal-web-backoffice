<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Registro</h1>
      
      <form 
        data-test="register-form"
        @submit.prevent="handleSubmit"
        class="space-y-4"
      >
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            data-test="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{'border-red-500': emailError}"
          />
          <p 
            v-if="emailError"
            data-test="email-error"
            class="mt-1 text-sm text-red-600"
          >
            {{ emailError }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            data-test="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{'border-red-500': passwordError}"
          />
          <p 
            v-if="passwordError"
            data-test="password-error"
            class="mt-1 text-sm text-red-600"
          >
            {{ passwordError }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            data-test="confirm-password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{'border-red-500': passwordError}"
          />
        </div>

        <!-- Error Message -->
        <div 
          v-if="error"
          data-test="error-message"
          class="p-3 bg-red-100 text-red-700 rounded"
        >
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          data-test="register-button"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            Registrando...
          </template>
          <template v-else>
            Registrarse
          </template>
        </button>

        <!-- Login Link -->
        <p class="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <router-link 
            to="/login" 
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión aquí
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/api/useAuth'

// State
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const emailError = ref('')
const passwordError = ref('')
const error = ref('')
const isLoading = ref(false)

// Composables
const router = useRouter()
const { register } = useAuth()

// Validations
watch(email, () => {
  emailError.value = ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = 'Email inválido'
  }
})

watch([password, confirmPassword], () => {
  passwordError.value = ''
  
  if (password.value && password.value.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    passwordError.value = 'Las contraseñas no coinciden'
  }
})

// Form submission
const handleSubmit = async () => {
  try {
    // Reset errors
    error.value = ''
    emailError.value = ''
    passwordError.value = ''

    // Validate required fields
    if (!email.value) {
      emailError.value = 'El email es requerido'
      return
    }
    if (!password.value) {
      passwordError.value = 'La contraseña es requerida'
      return
    }
    if (!confirmPassword.value) {
      passwordError.value = 'Debe confirmar la contraseña'
      return
    }

    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      passwordError.value = 'Las contraseñas no coinciden'
      return
    }

    // Submit form
    isLoading.value = true
    await register(email.value, password.value)

    // Redirect to dashboard
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Ha ocurrido un error'
  } finally {
    isLoading.value = false
  }
}
</script>
