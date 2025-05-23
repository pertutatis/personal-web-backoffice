declare module 'vitest' {
  import type { Mock } from 'vitest'

  // Globals
  export const describe: (name: string, fn: () => void) => void
  export const it: (name: string, fn: () => void | Promise<void>) => void
  export const expect: any
  export const beforeEach: (fn: () => void | Promise<void>) => void
  export const afterEach: (fn: () => void | Promise<void>) => void
  export const beforeAll: (fn: () => void | Promise<void>) => void
  export const afterAll: (fn: () => void | Promise<void>) => void

  // Mocks
  export const vi: {
    fn: () => Mock
    mock: (path: string, factory?: () => any) => void
    mocked: <T>(item: T, deep?: boolean) => T extends (...args: any[]) => any ? Mock<any, any> : T
    spyOn: (obj: any, method: string) => Mock
    clearAllMocks: () => void
    resetAllMocks: () => void
    restoreAllMocks: () => void
  }

  // Types
  export type Mock<T = any, Y extends any[] = any[]> = {
    (...args: Y): T
    mockReturnValue: (val: T) => Mock<T, Y>
    mockReturnValueOnce: (val: T) => Mock<T, Y>
    mockResolvedValue: (val: T) => Mock<Promise<T>, Y>
    mockResolvedValueOnce: (val: T) => Mock<Promise<T>, Y>
    mockRejectedValue: (val: any) => Mock<Promise<T>, Y>
    mockRejectedValueOnce: (val: any) => Mock<Promise<T>, Y>
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>
    mockImplementationOnce: (fn: (...args: Y) => T) => Mock<T, Y>
    mockName: (name: string) => Mock<T, Y>
    getMockName: () => string
    mock: {
      calls: Y[]
      instances: T[]
      invocationCallOrder: number[]
      results: { type: string; value: T }[]
      lastCall?: Y
    }
    mockClear: () => Mock<T, Y>
    mockReset: () => Mock<T, Y>
    mockRestore: () => Mock<T, Y>
  }
}

// Extensiones de Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R
      toHaveBeenCalled(): R
      toHaveBeenCalledTimes(n: number): R
      toBeNull(): R
      toBe(expected: any): R
      toEqual(expected: any): R
      toThrow(message?: string | Error | RegExp): R
      toStrictEqual(expected: any): R
      toBeDefined(): R
      toBeUndefined(): R
      toBeTruthy(): R
      toBeFalsy(): R
      toBeInstanceOf(expected: any): R
      toContain(expected: any): R
      toHaveLength(expected: number): R
      toHaveProperty(property: string, value?: any): R
    }
  }

  interface Window {
    vi: typeof vi
  }
}
