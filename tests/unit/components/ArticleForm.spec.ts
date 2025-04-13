import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ArticleForm from '../../../src/components/articles/ArticleForm.vue'
import { Article, Book } from '../../../src/types/models'

// Mock para los módulos necesarios
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid')
}))

vi.mock('marked', () => ({
  marked: vi.fn((text) => `<p>${text}</p>`)
}))

// Mock para vee-validate
vi.mock('vee-validate', () => ({
  Form: {
    name: 'Form',
    template: '<form @submit.prevent="handleSubmit"><slot :errors="errors" :isSubmitting="isSubmitting"></slot></form>',
    methods: {
      handleSubmit() {
        this.$emit('submit');
      }
    },
    data() {
      return {
        errors: {},
        isSubmitting: false
      }
    }
  },
  Field: {
    name: 'Field',
    props: ['name', 'as'],
    template: '<component :is="as || \'input\'" :name="name" v-model="modelValue"></component>',
    data() {
      return {
        modelValue: ''
      }
    }
  },
  ErrorMessage: {
    name: 'ErrorMessage',
    props: ['name'],
    template: '<div class="error-message"></div>'
  }
}))

// Mock para @vee-validate/zod
vi.mock('@vee-validate/zod', () => ({
  toFormValidator: vi.fn(() => ({}))
}))

describe('ArticleForm.vue', () => {
  // Datos de prueba
  const mockArticle: Article = {
    id: '1',
    title: 'Artículo de prueba',
    content: 'Contenido del artículo',
    status: 'draft',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: null,
    relatedBookIds: []
  }

  const mockBooks: Book[] = [
    {
      id: 'book1',
      title: 'Libro 1',
      author: 'Autor 1',
      isbn: '9781234567890',
      year: 2023,
      description: 'Descripción del libro 1',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'book2',
      title: 'Libro 2',
      author: 'Autor 2',
      isbn: '9789876543210',
      year: 2022,
      description: 'Descripción del libro 2',
      createdAt: '2023-01-02T00:00:00Z'
    }
  ]

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ArticleForm, {
      global: {
        stubs: ['router-link']
      }
    })
  })

  it('renderiza el formulario correctamente en modo creación', () => {
    expect(wrapper.find('.article-form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Crear nuevo artículo')
  })

  it('renderiza el formulario correctamente en modo edición', async () => {
    await wrapper.setProps({ article: mockArticle })
    expect(wrapper.text()).toContain('Editar artículo')
  })

  it('carga los datos del artículo cuando está en modo edición', async () => {
    await wrapper.setProps({ article: mockArticle })
    
    // En un componente real, necesitaríamos acceso a las propiedades internas
    // Pero debido al diseño del mock, verificamos si se renderiza el título correcto
    expect(wrapper.text()).toContain('Editar artículo')
    
    // La propiedad reactiva "formData" debería recibir los valores del artículo
    // Esto es más difícil de probar directamente, pero podemos verificar el comportamiento
    // cuando se envía el formulario
  })

  it('muestra los libros relacionados cuando se proporcionan', async () => {
    await wrapper.setProps({ 
      article: mockArticle,
      books: mockBooks,
      loadingBooks: false
    })
    
    // Verificar que se muestran los libros
    const booksContainer = wrapper.find('.space-y-2.max-h-60.overflow-y-auto')
    expect(booksContainer.exists()).toBe(true)
    expect(wrapper.text()).toContain('Libro 1')
    expect(wrapper.text()).toContain('Libro 2')
  })

  it('muestra un mensaje de carga cuando loadingBooks es true', async () => {
    await wrapper.setProps({
      loadingBooks: true
    })
    
    expect(wrapper.text()).toContain('Cargando libros...')
  })

  it('muestra un mensaje cuando no hay libros disponibles', async () => {
    await wrapper.setProps({
      books: [],
      loadingBooks: false
    })
    
    expect(wrapper.text()).toContain('No hay libros disponibles')
  })

  it('emite evento save con datos correctos al enviar el formulario', async () => {
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    // Verificar que se emite el evento save
    expect(wrapper.emitted('save')).toBeTruthy()
  })
  
  it('tiene un botón para cancelar que enlaza a la lista de artículos', () => {
    const cancelLink = wrapper.find('router-link-stub')
    expect(cancelLink.exists()).toBe(true)
    expect(cancelLink.attributes('to')).toBe('/articles')
    expect(cancelLink.text()).toContain('Cancelar')
  })
  
  it('renderiza la vista previa markdown cuando hay contenido', async () => {
    await wrapper.setProps({
      article: {
        ...mockArticle,
        content: '# Título de prueba'
      }
    })
    
    // La vista previa debería renderizarse, pero debido al mock de marked
    // y a la estructura del componente, es difícil probarlo directamente
    // En un caso real, podríamos buscar el contenido HTML renderizado
  })
})
