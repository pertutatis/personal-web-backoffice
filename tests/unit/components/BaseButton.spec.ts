import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../../../src/components/ui/BaseButton.vue'

describe('BaseButton.vue', () => {
  it('renderiza correctamente con propiedades por defecto', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Botón de prueba'
      }
    })
    
    expect(wrapper.text()).toBe('Botón de prueba')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).toContain('bg-blue-600') // primary variant
  })

  it('renderiza diferentes variantes correctamente', () => {
    const variants = [
      { prop: 'primary', class: 'bg-blue-600' },
      { prop: 'secondary', class: 'bg-gray-600' },
      { prop: 'danger', class: 'bg-red-600' },
      { prop: 'success', class: 'bg-green-600' },
      { prop: 'warning', class: 'bg-yellow-500' },
      { prop: 'outline', class: 'bg-transparent' }
    ]

    for (const variant of variants) {
      const wrapper = mount(BaseButton, {
        props: { variant: variant.prop },
        slots: { default: 'Botón' }
      })
      expect(wrapper.classes()).toContain(variant.class)
    }
  })

  it('renderiza diferentes tamaños correctamente', () => {
    const sizes = [
      { prop: 'sm', class: 'px-2.5' },
      { prop: 'md', class: 'px-4' },
      { prop: 'lg', class: 'px-6' }
    ]

    for (const size of sizes) {
      const wrapper = mount(BaseButton, {
        props: { size: size.prop },
        slots: { default: 'Botón' }
      })
      expect(wrapper.classes()).toContain(size.class)
    }
  })

  it('muestra el spinner de carga cuando loading=true', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Cargando...' }
    })
    
    // Verifica que se muestra el SVG de spinner
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.classes()).toContain('animate-spin')
    
    // Verifica que el texto aún se muestra
    expect(wrapper.text()).toBe('Cargando...')
    
    // Verifica que el botón está deshabilitado
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('está deshabilitado cuando disabled=true', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Botón' }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })

  it('emite el evento click cuando no está deshabilitado o cargando', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Clic' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.length).toBe(1)
  })

  it('no emite el evento click cuando está deshabilitado', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Clic' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('no emite el evento click cuando está en estado loading', async () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Clic' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('aplica clases personalizadas', () => {
    const wrapper = mount(BaseButton, {
      props: { className: 'test-class another-class' },
      slots: { default: 'Botón' }
    })
    
    expect(wrapper.classes()).toContain('test-class')
    expect(wrapper.classes()).toContain('another-class')
  })
})
