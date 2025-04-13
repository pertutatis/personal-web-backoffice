import { describe, it, expect } from 'vitest'
import { isValidIsbn10, isValidIsbn13, normalizeIsbn } from '../../../src/utils/isbnUtils'

describe('ISBN Validation Functions', () => {
  describe('isValidIsbn10', () => {
    it.each([
      // ISBN-10 válidos
      ['0132350882', true],     // Clean Code (sin X)
      ['087779575X', true],     // Con X como dígito de control
      // ISBN-10 inválidos
      ['0132350881', false],    // Dígito de control incorrecto
      ['01323508', false],      // Muy corto
      ['01323508801', false],   // Muy largo
      ['013235088A', false],    // Carácter no permitido (solo X está permitido en última posición)
      ['X132350882', false]     // X en posición incorrecta
    ])('valida ISBN-10 %s como %s', (isbn, expected) => {
      expect(isValidIsbn10(isbn)).toBe(expected)
    })
  })

  describe('isValidIsbn13', () => {
    it.each([
      // ISBN-13 válidos
      ['9780132350884', true],    // Clean Code
      ['9783161484100', true],    // Ejemplo estándar
      // ISBN-13 inválidos
      ['9780132350883', false],   // Dígito de control incorrecto
      ['978013235088', false],    // Muy corto
      ['97801323508841', false],  // Muy largo
      ['978013235088X', false]    // Carácter no permitido en ISBN-13
    ])('valida ISBN-13 %s como %s', (isbn, expected) => {
      expect(isValidIsbn13(isbn)).toBe(expected)
    })
  })

  describe('normalizeIsbn', () => {
    it.each([
      // Casos de prueba para normalizar ISBN
      ['978-0-13-235088-4', '9780132350884'],  // ISBN-13 con guiones
      ['0-87779-575-X', '087779575X'],         // ISBN-10 con guiones
      ['978 0 13 235088 4', '9780132350884'],  // Con espacios
      ['978-0-13 235088-4', '9780132350884'],  // Combinación de guiones y espacios
      ['9780132350884', '9780132350884']       // Ya normalizado
    ])('normaliza %s a %s', (input, expected) => {
      expect(normalizeIsbn(input)).toBe(expected)
    })
  })
})
