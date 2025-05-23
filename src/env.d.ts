/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// Declaración de módulos Vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Variables de entorno
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare los tipos globales aquí
declare global {
  interface Window {
    // Añade propiedades globales de window aquí si son necesarias
  }
}

// Extensiones de Vitest
declare module 'vitest' {
  interface CustomMatchers<R = unknown> {
    toHaveBeenCalledWithToken(token: string): R
  }
}

// DOMPurify
declare module 'dompurify' {
  interface DOMPurifyI {
    sanitize(source: string | Node): string
  }
  const DOMPurify: DOMPurifyI
  export default DOMPurify
}

// Extensiones de Vue
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cleanup?: () => void
  }
}
