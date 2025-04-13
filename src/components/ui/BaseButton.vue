<template>
  <button 
    :type="type"
    :class="[
      'rounded-md shadow-sm font-medium focus:outline-none transition duration-150 ease-in-out',
      sizeClasses,
      variantClasses,
      disabled ? 'cursor-not-allowed opacity-60' : '',
      block ? 'w-full' : '',
      className
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div class="flex items-center justify-center">
      <!-- Loading spinner -->
      <svg 
        v-if="loading" 
        class="animate-spin mr-2 h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <!-- Button content -->
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'outline', 'ghost'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2.5 py-1.5 text-xs';
    case 'lg':
      return 'px-6 py-3 text-base';
    case 'md':
    default:
      return 'px-4 py-2 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500';
    case 'success':
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
    case 'warning':
      return 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400';
    case 'info':
      return 'bg-blue-400 text-white hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300';
    case 'outline':
      return 'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    case 'ghost':
      return 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    case 'primary':
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  }
});
</script>
