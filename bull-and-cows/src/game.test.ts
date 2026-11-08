import { describe, test, expect } from 'vitest';
import { 
  createDigitValidator, 
  isValidGuess, 
  evaluateGuess, 
  generateSecret, 
  countPossibleSecrets 
} from './game.js';

describe('createDigitValidator', () => {
  test('should validate based on base', () => {
    const isHex = createDigitValidator('hex');
    expect(isHex('a')).toBe(true);
    expect(isHex('A')).toBe(true);
    expect(isHex('G')).toBe(false);
  });
});

describe('isValidGuess', () => {
  test('should validate lengths and uniqueness', () => {
    expect(isValidGuess('1234', 4, 'dec')).toBe(true);
    expect(isValidGuess('1123', 4, 'dec')).toBe(false); // дубликат
    expect(isValidGuess('101', 2, 'bin')).toBe(false); // длина
  });
});

describe('evaluateGuess (Functional approach)', () => {
  test('should correctly count bulls and cows using array methods', () => {
    expect(evaluateGuess('1234', '1324')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('aB1c', 'Ab1C')).toEqual({ bulls: 4, cows: 0 });
  });
});

describe('generateSecret (Deterministic testing)', () => {
  test('should generate predictable secret using mock random source', () => {
    // Передаем кастомную функцию генерации псевдослучайных чисел
    const mockRandom = () => 0.1; 
    const secret = generateSecret(4, 'dec', mockRandom);
    expect(secret).toHaveLength(4);
    // Проверяем, что все символы уникальны
    const unique = new Set(secret.split(''));
    expect(unique.size).toBe(4);
  });
});

describe('countPossibleSecrets (Recursive & Memoized)', () => {
  test('should calculate P(base, length) recursively', () => {
    // P(10, 4) = 10! / (10-4)! = 10 * 9 * 8 * 7 = 5040
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    // P(2, 2) = 2! / 0! = 2
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });
});
