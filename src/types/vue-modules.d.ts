// Vue core types
declare module 'vue' {
  export const ref: typeof import('vue').ref
  export const computed: typeof import('vue').computed
  export const reactive: typeof import('vue').reactive
  export const toRef: typeof import('vue').toRef
  export const watch: typeof import('vue').watch
  export const watchEffect: typeof import('vue').watchEffect
  export const onMounted: typeof import('vue').onMounted
  export const onUnmounted: typeof import('vue').onUnmounted
  export const defineComponent: typeof import('vue').defineComponent
  export const PropType: typeof import('vue').PropType
  export const createApp: typeof import('vue').createApp
  export const h: typeof import('vue').h
  export type App<T = any> = import('vue').App<T>
  export type ComponentPublicInstance = import('vue').ComponentPublicInstance
  export type InjectionKey<T> = import('vue').InjectionKey<T>
  export type Ref<T> = import('vue').Ref<T>
  export type ComputedRef<T> = import('vue').ComputedRef<T>
  export type Component = import('vue').Component
}

// Vite env
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue Query types
declare module '@tanstack/vue-query' {
  import type { UseQueryReturnType, UseMutationReturnType } from '@tanstack/vue-query'

  export interface UseQueryOptions<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  > {
    queryKey: TQueryKey
    queryFn: QueryFunction<TQueryFnData, TQueryKey>
    enabled?: boolean
    retry?: boolean | number | ((failureCount: number, error: TError) => boolean)
    retryDelay?: number | ((retryAttempt: number) => number)
    staleTime?: number
    cacheTime?: number
    refetchInterval?: number | false
    refetchIntervalInBackground?: boolean
    refetchOnWindowFocus?: boolean
    refetchOnReconnect?: boolean
    refetchOnMount?: boolean
    suspense?: boolean
    onSuccess?: (data: TData) => void
    onError?: (error: TError) => void
    onSettled?: (data: TData | undefined, error: TError | null) => void
    select?: (data: TQueryFnData) => TData
    initialData?: TData | (() => TData)
    placeholderData?: TQueryFnData | (() => TQueryFnData)
  }

  export interface UseMutationOptions<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
  > {
    mutationKey?: string | readonly unknown[]
    mutationFn: MutationFunction<TData, TVariables>
    onMutate?: (variables: TVariables) => Promise<TContext> | TContext
    onSuccess?: (data: TData, variables: TVariables, context: TContext) => Promise<void> | void
    onError?: (error: TError, variables: TVariables, context: TContext | undefined) => Promise<void> | void
    onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) => Promise<void> | void
    retry?: boolean | number | ((failureCount: number, error: TError) => boolean)
    retryDelay?: number | ((retryAttempt: number) => number)
  }

  export type QueryFunction<T, TQueryKey extends QueryKey = QueryKey> = (
    context: QueryFunctionContext<TQueryKey>
  ) => T | Promise<T>

  export type MutationFunction<TData, TVariables> = (
    variables: TVariables
  ) => Promise<TData>

  export type QueryKey = readonly unknown[]

  export interface QueryFunctionContext<TQueryKey extends QueryKey = QueryKey> {
    queryKey: TQueryKey
    pageParam?: number
    signal?: AbortSignal
  }

  export const QueryClient: any
  export const useQueryClient: () => any
  export const useQuery: <TData = unknown, TError = unknown>(
    options: UseQueryOptions<TData, TError>
  ) => UseQueryReturnType<TData, TError>
  export const useMutation: <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
  ) => UseMutationReturnType<TData, TError, TVariables, TContext>
}
