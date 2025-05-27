import { ref } from 'vue'
import { httpClient } from '@/utils/httpClient'
import type { AuthTokens, AuthResponse, AuthError } from '@/types/auth'

export interface UseAuth {
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  encryptTokens: (tokens: AuthTokens) => string
  decryptTokens: (encrypted: string) => AuthTokens | null
  getStoredTokens: () => AuthTokens | null
  getTokenInfo: () => { isValid: boolean; expiresIn?: number; email?: string } | null
  decodeJwt: (token: string) => any | null
}

interface ApiResponse<T> {
  data: T
}

// Utilidades de encriptación/desencriptación
const encryptTokens = (tokens: AuthTokens): string => {
  // TODO: Implementar encriptación real
  return btoa(JSON.stringify(tokens))
}

const decryptTokens = (encrypted: string): AuthTokens | null => {
  try {
    return JSON.parse(atob(encrypted))
  } catch {
    return null
  }
}

const getStoredTokens = (): AuthTokens | null => {
  const encrypted = localStorage.getItem('auth_tokens')
  if (!encrypted) {
    return null
  }
  
  const tokens = decryptTokens(encrypted)
  if (!tokens) {
    return null
  }
  
  if (!tokens.token) {
    return null
  }
  
  return tokens
}

// Función para decodificar un token JWT sin verificar la firma
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Función para verificar la validez del token
const checkTokenValidity = (token: string): { isValid: boolean; expiresIn?: number } => {
  if (!token) return { isValid: false };
  
  try {
    const decoded = decodeJwt(token);
    if (!decoded) return { isValid: false };
    
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { isValid: false, expiresIn: 0 };
    }
    
    const expiresIn = decoded.exp ? decoded.exp - now : undefined;
    return { isValid: true, expiresIn };
  } catch (e) {
    return { isValid: false };
  }
};

export const useAuth = (): UseAuth => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const storeTokens = (tokens: AuthTokens) => {
    const encrypted = encryptTokens(tokens)
    localStorage.setItem('auth_tokens', encrypted)
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await httpClient.post<any>('/backoffice/auth/login', {
        email,
        password
      })
      
      // Verificar si la respuesta contiene token y refreshToken directamente o dentro de data
      const responseData = response.data ? response.data : response;
      
      // Verificar que al menos tenemos un token de acceso
      if (!responseData || !responseData.token) {
        throw new Error('Respuesta de autenticación inválida: token no encontrado');
      }
      
      // En este backend, puede que no haya refreshToken y usamos el mismo token para ambos
      const tokens = { 
        token: responseData.token,
        // Si no hay refreshToken, usar el mismo token como refreshToken
        refreshToken: responseData.refreshToken || responseData.token,
        email 
      };
      
      storeTokens(tokens);
    } catch (e: any) {
      error.value = e.message || 'Ha ocurrido un error'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await httpClient.post<any>('/backoffice/auth/register', {
        email,
        password
      })
      
      // Verificar si la respuesta contiene token directamente o dentro de data
      const responseData = response.data ? response.data : response;
      
      // Verificar que al menos tenemos un token de acceso
      const tokenValue = responseData.token || responseData.access_token;
      const refreshTokenValue = responseData.refreshToken || responseData.refresh_token || tokenValue;
      
      if (!tokenValue) {
        throw new Error('Respuesta de registro inválida: token no encontrado');
      }
      
      const tokens = { 
        token: tokenValue,
        // Si no hay refreshToken, usar el mismo token como refreshToken
        refreshToken: refreshTokenValue,
        email 
      };
      
      storeTokens(tokens);
    } catch (e: any) {
      error.value = e.message || 'Ha ocurrido un error'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    localStorage.removeItem('auth_tokens')
  }

  const isAuthenticated = (): boolean => {
    const tokens = getStoredTokens()
    if (!tokens?.token) return false;
    
    // Verificar que el token tenga el formato correcto de JWT (3 partes separadas por punto)
    const tokenParts = tokens.token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    
    // Usar la función de verificación de token
    const { isValid } = checkTokenValidity(tokens.token);
    
    return isValid;
  }
  
  // Obtener información del token actual
  const getTokenInfo = () => {
    const tokens = getStoredTokens();
    if (!tokens?.token) return null;
    
    const validityInfo = checkTokenValidity(tokens.token);
    return {
      ...validityInfo,
      email: tokens.email
    };
  }

  return {
    isLoading: isLoading.value,
    error: error.value,
    login,
    register,
    logout,
    isAuthenticated,
    encryptTokens,
    decryptTokens,
    getStoredTokens,
    decodeJwt,
    getTokenInfo
  }
}
