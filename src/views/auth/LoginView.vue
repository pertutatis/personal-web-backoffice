<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-wrapper">
        <h2 class="text-2xl font-bold mb-6">Iniciar sesión</h2>
        
        <form @submit.prevent="handleLogin" class="login-form" data-cy="login-form">
          <!-- Mensaje de error -->
          <div v-if="error" class="error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" data-cy="login-error">
            {{ error }}
          </div>
          
          <!-- Campo de usuario -->
          <div class="mb-4">
            <label for="username" class="block text-gray-700 font-medium mb-2">Usuario</label>
            <input
              id="username"
              type="text"
              v-model="username"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce tu nombre de usuario"
              required
              data-cy="username-input"
            />
          </div>
          
          <!-- Campo de contraseña -->
          <div class="mb-6">
            <label for="password" class="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce tu contraseña"
              required
              data-cy="password-input"
            />
          </div>
          
          <!-- Botón de login -->
          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="isLoading"
            data-cy="login-button"
          >
            <span v-if="isLoading">Iniciando sesión...</span>
            <span v-else>Iniciar sesión</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

// Para propósitos de pruebas, aceptamos credenciales simples
// En una aplicación real, esto debe conectarse con un servicio de autenticación
const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  // Simulamos una validación de credenciales
  try {
    // Esto es solo para pruebas - en producción usaríamos una API real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username.value === 'usuario_test' && password.value === 'contraseña_test') {
      // Login exitoso - almacenamos en localStorage o en un estado global
      localStorage.setItem('user', JSON.stringify({ 
        username: username.value,
        isAuthenticated: true
      }));
      
      // Redirigimos al dashboard
      router.push('/dashboard');
    } else {
      // Credenciales incorrectas
      error.value = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
    }
  } catch (e) {
    error.value = 'Error al iniciar sesión. Por favor, intenta de nuevo más tarde.';
    console.error('Error de login:', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
}

.login-form-wrapper {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
