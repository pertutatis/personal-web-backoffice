import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../../../src/components/ui/BaseInput.vue'

describe('BaseInput.vue', () => {
  it('renderiza correctamente con propiedades por defecto', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: ''
      }
    })
    
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('id')).toBe('test-input')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('muestra correctamente la etiqueta cuando se proporciona', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        label: 'Nombre completo'
      }
    })
    
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Nombre completo')
    expect(label.attributes('for')).toBe('test-input')
  })

  it('marca como requerido cuando required=true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        label: 'Campo requerido',
        required: true
      }
    })
    
    const label = wrapper.find('label')
    expect(label.text()).toContain('Campo requerido')
    expect(label.html()).toContain('<span class="text-red-600">*</span>')
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })

  it('aplica clases de error cuando hay un error', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        error: 'Este campo es obligatorio'
      }
    })
    
    // Verificar que el input tiene la clase de error
    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red-500')
    
    // Verificar que se muestra el mensaje de error
    const errorEl = wrapper.find('.text-red-600')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Este campo es obligatorio')
  })

  it('muestra el mensaje de ayuda cuando se proporciona', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        hint: 'Introduce tu nombre completo'
      }
    })
    
    const hintEl = wrapper.find('.text-gray-500')
    expect(hintEl.exists()).toBe(true)
    expect(hintEl.text()).toBe('Introduce tu nombre completo')
  })

  it('no muestra el hint cuando hay un error', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        hint: 'Introduce tu nombre completo',
        error: 'Este campo es obligatorio'
      }
    })
    
    // Debe mostrar el error, no el hint
    const errorEl = wrapper.find('.text-red-600')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Este campo es obligatorio')
    
    // El hint no debería estar visible
    const hintElements = wrapper.findAll('.text-gray-500')
    expect(hintElements.length).toBe(0)
  })

  it('emite update:modelValue cuando se cambia el valor', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: ''
      }
    })
    
    const input = wrapper.find('input')
    await input.setValue('Nuevo valor')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Nuevo valor'])
  })

  it('emite blur cuando el input pierde el foco', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: ''
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('blur')
    
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('blur').length).toBe(1)
  })

  it('emite focus cuando el input recibe el foco', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: ''
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('focus')
    
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('focus').length).toBe(1)
  })

  it('aplica correctamente las clases de estilo para estado disabled', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        disabled: true
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.classes()).toContain('bg-gray-100')
    expect(input.classes()).toContain('cursor-not-allowed')
  })

  it('aplica correctamente las clases de estilo para estado readonly', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        readonly: true
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
    expect(input.classes()).toContain('bg-gray-50')
    expect(input.classes()).toContain('cursor-not-allowed')
  })

  it('muestra indicador de carga cuando loading=true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        loading: true
      }
    })
    
    const spinner = wrapper.find('svg.animate-spin')
    expect(spinner.exists()).toBe(true)
  })
})
