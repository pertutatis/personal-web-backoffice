// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'

describe('Configuración básica de pruebas', () => {
  test('las pruebas unitarias deberían funcionar correctamente', () => {
    expect(1 + 1).toBe(2)
  })
})
