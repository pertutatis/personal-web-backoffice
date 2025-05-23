declare module 'dompurify' {
  export interface DOMPurifyConfig {
    ALLOWED_TAGS?: string[]
    ALLOWED_ATTR?: string[]
    ADD_TAGS?: string[]
    ADD_ATTR?: string[]
    FORBID_TAGS?: string[]
    FORBID_ATTR?: string[]
    KEEP_CONTENT?: boolean
    RETURN_DOM?: boolean
    RETURN_DOM_FRAGMENT?: boolean
    RETURN_TRUSTED_TYPE?: boolean
    SAFE_FOR_TEMPLATES?: boolean
  }

  interface DOMPurifyStatic {
    sanitize(dirty: string | Node, config?: DOMPurifyConfig): string
    setConfig(cfg: DOMPurifyConfig): void
    clearConfig(): void
    isValidAttribute(tag: string, attr: string, value: string): boolean
    addHook(entryPoint: string, hookFunction: Function): void
    removeHook(entryPoint: string): void
    removeHooks(entryPoint: string): void
    addFilter(filterFunction: Function): void
    removeFilter(filterFunction: Function): void
    removeFilters(): void
    enableSandbox(): void
    disableSandbox(): void
  }

  const DOMPurify: DOMPurifyStatic
  export default DOMPurify
}
