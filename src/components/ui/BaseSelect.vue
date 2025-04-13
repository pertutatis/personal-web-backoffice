<template>
  <div class="form-select">
    <label 
      v-if="label" 
      :for="id" 
      class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :name="name"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm appearance-none',
          'focus:outline-none focus:ring-2',
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-700',
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600',
          'text-gray-900 dark:text-white',
          className
        ]"
        @change="handleChange"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <!-- Flecha del select -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg 
          class="h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>
      <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </div>
      <div v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array as () => SelectOption[],
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>
