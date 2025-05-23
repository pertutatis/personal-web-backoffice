<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal" :class="[`modal--${size}`]" role="dialog" @click.stop>
          <!-- Header -->
          <div class="modal__header">
            <h3 class="modal__title">
              <slot name="header">{{ title }}</slot>
            </h3>
            <button v-if="showClose" class="modal__close" @click="close" aria-label="Cerrar">
              ×
            </button>
          </div>

          <!-- Content -->
          <div class="modal__content">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer">
              <BaseButton variant="secondary" @click="close">Cancelar</BaseButton>
              <BaseButton variant="primary" @click="confirm">Aceptar</BaseButton>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'BaseModal',
  components: {
    BaseButton
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'confirm', 'close'],
  setup(props, { emit }) {
    // Métodos
    const close = () => {
      emit('update:modelValue', false)
      emit('close')
    }

    const confirm = () => {
      emit('confirm')
    }

    const handleOverlayClick = () => {
      if (props.closeOnOverlay) {
        close()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.closeOnEscape) {
        close()
      }
    }

    // Event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })

    return {
      close,
      confirm,
      handleOverlayClick
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  max-width: 90vw;
}

.modal--sm {
  width: 300px;
}

.modal--md {
  width: 500px;
}

.modal--lg {
  width: 800px;
}

.modal__header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal__close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  padding: 0.25rem;
  cursor: pointer;
  color: #6c757d;
}

.modal__close:hover {
  color: #343a40;
}

.modal__content {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal__footer {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal {
  transform: translateY(-20px);
}

.modal-leave-to .modal {
  transform: translateY(20px);
}
</style>
