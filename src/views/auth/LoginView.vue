<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
      
      <form 
        data-test="login-form"
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
          data-test="login-button"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            Iniciando sesión...
          </template>
          <template v-else>
            Iniciar Sesión
          </template>
        </button>

        <!-- Register Link -->
        <p class="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?
          <router-link 
            to="/register" 
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Regístrate aquí
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// State
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const error = ref('')
const isLoading = ref(false)

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Validations
watch(email, () => {
  emailError.value = ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = 'Email inválido'
  }
})

watch(password, () => {
  passwordError.value = ''
  if (password.value && password.value.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
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

    // Submit form
    isLoading.value = true
    await authStore.login(email.value, password.value)

    // Redirect
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (e: any) {
    error.value = e.message || 'Ha ocurrido un error'
  } finally {
    isLoading.value = false
  }
}
</script>
