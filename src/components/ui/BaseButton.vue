<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <!-- Icono de carga -->
    <span v-if="loading" class="base-button__loader"></span>
    
    <!-- Icono a la izquierda -->
    <span v-if="iconLeft" class="base-button__icon base-button__icon--left">
      <component :is="iconLeft" />
    </span>
    
    <!-- Contenido -->
    <span class="base-button__content">
      <slot></slot>
    </span>
    
    <!-- Icono a la derecha -->
    <span v-if="iconRight" class="base-button__icon base-button__icon--right">
      <component :is="iconRight" />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    variant: {
      type: String as PropType<'primary' | 'secondary' | 'danger' | 'ghost'>,
      default: 'primary'
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: [Object, Function],
      default: null
    },
    iconRight: {
      type: [Object, Function],
      default: null
    }
  }
})
</script>

<style lang="postcss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.base-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Variantes */
.base-button--primary {
  background-color: #0d6efd;
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.base-button--secondary {
  background-color: #6c757d;
  color: white;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #5c636a;
}

.base-button--danger {
  background-color: #dc3545;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #bb2d3b;
}

.base-button--ghost {
  background-color: transparent;
  border-color: currentColor;
}

.base-button--ghost:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Tamaños */
.base-button--sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.base-button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Loader */
.base-button__loader {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Iconos */
.base-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.base-button__icon--left {
  margin-right: 0.5rem;
}

.base-button__icon--right {
  margin-left: 0.5rem;
}
</style>
