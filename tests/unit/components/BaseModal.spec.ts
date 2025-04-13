import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '../../../src/components/ui/BaseModal.vue'

// Mock para Teleport ya que Vue Test Utils no lo soporta nativamente
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    Teleport: (props, { slots }) => {
      return {
        render() {
          return slots.default ? slots.default() : []
        }
      }
    }
  }
})

describe('BaseModal.vue', () => {
  beforeEach(() => {
    // Configurar el DOM antes de cada test
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    // Limpiar después de cada test
    vi.restoreAllMocks()
  })

  it('no renderiza el modal cuando modelValue es false', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: false,
        title: 'Modal de prueba'
      },
      slots: {
        default: '<p>Contenido del modal</p>'
      }
    })
    
    // El modal no debería estar visible
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('renderiza el modal cuando modelValue es true', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Modal de prueba'
      },
      slots: {
        default: '<p>Contenido del modal</p>'
      }
    })
    
    // El modal debería estar visible
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    
    // Debería tener el título correcto
    const title = wrapper.find('h3')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Modal de prueba')
    
    // Debería mostrar el contenido
    expect(wrapper.html()).toContain('<p>Contenido del modal</p>')
  })

  it('muestra el botón de cierre por defecto', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Modal con botón de cierre'
      }
    })
    
    const closeButton = wrapper.find('button')
    expect(closeButton.exists()).toBe(true)
  })

  it('no muestra el botón de cierre cuando showClose es false', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Modal sin botón de cierre',
        showClose: false
      }
    })
    
    // No debería haber botón de cierre en el header
    const header = wrapper.find('.border-b')
    expect(header.exists()).toBe(true)
    expect(header.find('button').exists()).toBe(false)
  })

  it('emite update:modelValue y close cuando se hace clic en el botón de cierre', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Modal con evento close'
      }
    })
    
    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('aplica la clase de tamaño correcta según la prop size', () => {
    const sizes = [
      { prop: 'sm', class: 'sm:max-w-sm' },
      { prop: 'md', class: 'sm:max-w-md' },
      { prop: 'lg', class: 'sm:max-w-lg' },
      { prop: 'xl', class: 'sm:max-w-xl' },
      { prop: 'full', class: 'sm:max-w-4xl' }
    ]
    
    for (const size of sizes) {
      const wrapper = mount(BaseModal, {
        props: {
          modelValue: true,
          size: size.prop
        }
      })
      
      const modalContent = wrapper.find('.bg-white.dark\\:bg-gray-800')
      expect(modalContent.classes()).toContain(size.class)
    }
  })

  it('renderiza footer cuando se proporciona el slot footer', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<p>Contenido principal</p>',
        footer: '<button>Aceptar</button><button>Cancelar</button>'
      }
    })
    
    const footer = wrapper.find('.border-t')
    expect(footer.exists()).toBe(true)
    expect(footer.html()).toContain('<button>Aceptar</button>')
    expect(footer.html()).toContain('<button>Cancelar</button>')
  })

  it('cierra el modal al hacer clic en el backdrop si closeOnBackdrop es true', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        closeOnBackdrop: true
      }
    })
    
    // Simular clic en el backdrop
    const backdrop = wrapper.find('.fixed.inset-0')
    await backdrop.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('no cierra el modal al hacer clic en el backdrop si closeOnBackdrop es false', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        closeOnBackdrop: false
      }
    })
    
    // Simular clic en el backdrop
    const backdrop = wrapper.find('.fixed.inset-0')
    await backdrop.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})
