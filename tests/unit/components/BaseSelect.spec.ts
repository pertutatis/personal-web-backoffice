import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '../../../src/components/ui/BaseSelect.vue'

describe('BaseSelect.vue', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3' }
  ]

  it('renderiza correctamente con opciones', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions
      }
    })
    
    // Verifica que se renderiza el select
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    
    // Verifica que se renderizan todas las opciones
    const options = wrapper.findAll('option')
    expect(options.length).toBe(3)
    expect(options[0].text()).toBe('Opción 1')
    expect(options[1].text()).toBe('Opción 2')
    expect(options[2].text()).toBe('Opción 3')
    
    // Verifica los valores de las opciones
    expect(options[0].attributes('value')).toBe('option1')
    expect(options[1].attributes('value')).toBe('option2')
    expect(options[2].attributes('value')).toBe('option3')
  })

  it('muestra la etiqueta cuando se proporciona', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        label: 'Selecciona una opción'
      }
    })
    
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Selecciona una opción')
    expect(label.attributes('for')).toBe('test-select')
  })

  it('marca como requerido cuando required=true', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        label: 'Campo requerido',
        required: true
      }
    })
    
    const label = wrapper.find('label')
    expect(label.text()).toContain('Campo requerido')
    expect(label.html()).toContain('<span class="text-red-600">*</span>')
    expect(wrapper.find('select').attributes('required')).toBeDefined()
  })

  it('muestra placeholder cuando se proporciona', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        placeholder: 'Selecciona...'
      }
    })
    
    // Verifica que el placeholder se renderiza como primera opción
    const options = wrapper.findAll('option')
    expect(options.length).toBe(4) // 3 opciones + placeholder
    expect(options[0].text()).toBe('Selecciona...')
    expect(options[0].attributes('value')).toBe('')
    expect(options[0].attributes('disabled')).toBeDefined()
  })

  it('aplica clases de error cuando hay un error', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        error: 'Debes seleccionar una opción'
      }
    })
    
    // Verificar que el select tiene la clase de error
    const select = wrapper.find('select')
    expect(select.classes()).toContain('border-red-500')
    
    // Verificar que se muestra el mensaje de error
    const errorEl = wrapper.find('.text-red-600')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Debes seleccionar una opción')
  })

  it('muestra el mensaje de ayuda cuando se proporciona y no hay error', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        hint: 'Selecciona la opción que prefieras'
      }
    })
    
    const hintEl = wrapper.find('.text-gray-500')
    expect(hintEl.exists()).toBe(true)
    expect(hintEl.text()).toBe('Selecciona la opción que prefieras')
  })

  it('emite update:modelValue cuando se cambia el valor', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions
      }
    })
    
    const select = wrapper.find('select')
    await select.setValue('option2')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
  })

  it('aplica correctamente las clases de estilo para estado disabled', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        disabled: true
      }
    })
    
    const select = wrapper.find('select')
    expect(select.attributes('disabled')).toBeDefined()
    expect(select.classes()).toContain('bg-gray-100')
    expect(select.classes()).toContain('cursor-not-allowed')
  })

  it('aplica clases personalizadas cuando se proporciona className', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: '',
        options: defaultOptions,
        className: 'custom-class another-class'
      }
    })
    
    const select = wrapper.find('select')
    expect(select.classes()).toContain('custom-class')
    expect(select.classes()).toContain('another-class')
  })
})
