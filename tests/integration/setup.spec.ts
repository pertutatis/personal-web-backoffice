import { describe, expect, test } from 'vitest';

/**
 * Test de integración simple para verificar que la configuración funciona
 */
describe('Test de integración básico', () => {
  test('debería permitir verificar la integración entre componentes', () => {
    // Este es un test simulado para verificar que la configuración funciona
    const mockComponent = {
      data() {
        return {
          counter: 0
        };
      },
      methods: {
        increment() {
          this.counter++;
        }
      }
    };
    
    // Simulamos la llamada al método
    const data = mockComponent.data();
    mockComponent.methods.increment.call(data);
    
    // Verificamos el resultado
    expect(data.counter).toBe(1);
  });
});
