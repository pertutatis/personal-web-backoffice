import { DefineComponent } from 'vue'

declare module 'vue' {
  export { DefineComponent }
  
  // Core
  export const ref: <T>(value: T) => { value: T }
  export const computed: <T>(getter: () => T) => { value: T }
  export const reactive: <T extends object>(target: T) => T
  export const toRef: <T extends object, K extends keyof T>(object: T, key: K) => { value: T[K] }
  export const watch: (source: any, callback: any, options?: any) => void
  export const watchEffect: (effect: (onInvalidate: (fn: () => void) => void) => void) => void
  
  // Lifecycle
  export const onMounted: (hook: () => any) => void
  export const onUnmounted: (hook: () => any) => void
  export const onBeforeMount: (hook: () => any) => void
  export const onBeforeUnmount: (hook: () => any) => void
  export const onActivated: (hook: () => any) => void
  export const onDeactivated: (hook: () => any) => void
  export const onBeforeUpdate: (hook: () => any) => void
  export const onUpdated: (hook: () => any) => void
  export const onErrorCaptured: (hook: (err: Error) => boolean | void) => void
  
  // Component
  export const defineProps: <T>() => Readonly<T>
  export const defineEmits: <T>() => T
  export const defineExpose: (exposed: Record<string, any>) => void
  export const withDefaults: <T>(props: T, defaults: Record<string, any>) => T
  
  // Utils
  export const nextTick: (fn?: () => void) => Promise<void>
  export const markRaw: <T extends object>(value: T) => T
  export const isRef: (value: any) => boolean
  export const unref: <T>(ref: T | { value: T }) => T
  export const toRaw: <T>(observed: T) => T
  
  // Types
  export type Ref<T> = { value: T }
  export type ComputedRef<T> = { readonly value: T }
  export type PropType<T> = { __type: T }
  export type ComponentPublicInstance = { $: any }
}

// Global types
declare global {
  interface Window {
    Vue?: any
  }
}
