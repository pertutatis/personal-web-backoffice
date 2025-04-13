// Este archivo es temporal para depurar la validación de ISBN
import { isValidIsbn10 } from '../src/utils/isbnUtils';

// Valor específico que está fallando en los tests
const testIsbn = '087779575X';
console.log(`Validando ISBN-10: ${testIsbn}`);

// Imprimir el cálculo paso a paso
const digits = testIsbn.split('').map((c) => {
  if (c.toUpperCase() === 'X') {
    return 10;
  }
  return parseInt(c, 10);
});
console.log('Dígitos:', digits.join(', '));

let sum = 0;
for (let i = 0; i < 10; i++) {
  const product = (10 - i) * digits[i];
  sum += product;
  console.log(`Posición ${i}: ${10 - i} * ${digits[i]} = ${product}`);
}

console.log(`Suma total: ${sum}`);
console.log(`Módulo 11: ${sum % 11}`);
console.log(`¿Es válido?: ${sum % 11 === 0}`);

// Validación con nuestra función actual
console.log(`Resultado de isValidIsbn10: ${isValidIsbn10(testIsbn)}`);
