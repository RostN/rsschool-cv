import { describe, test, expect } from 'vitest';
import { createDigitValidator, isValidGuess } from './game.js';
import { evaluateGuess } from './game.js';
import { generateSecret } from './game.js';

describe('createDigitValidator', () => {
  test('should validate binary digits', () => {
    const isBin = createDigitValidator('bin');
    expect(isBin('0')).toBe(true);
    expect(isBin('1')).toBe(true);
    expect(isBin('2')).toBe(false);
  });

  test('should validate hex digits case-insensitively', () => {
    const isHex = createDigitValidator('hex');
    expect(isHex('a')).toBe(true);
    expect(isHex('A')).toBe(true);
    expect(isHex('G')).toBe(false);
  });
});

describe('isValidGuess', () => {
  test('should return true for valid unique guesses', () => {
    expect(isValidGuess('10', 2, 'bin')).toBe(true);
    expect(isValidGuess('1234', 4, 'dec')).toBe(true);
    expect(isValidGuess('aB1c', 4, 'hex')).toBe(true);
  });

  test('should return false for incorrect length or repeated digits', () => {
    expect(isValidGuess('101', 2, 'bin')).toBe(false);
    expect(isValidGuess('11', 2, 'bin')).toBe(false);
    expect(isValidGuess('aA12', 4, 'hex')).toBe(false);
  });
});

describe('evaluateGuess', () => {
  test('should return all bulls for perfect match', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  test('should return cows for misplaced digits', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  test('should correctly count bulls and cows mixed together', () => {
    expect(evaluateGuess('1234', '1324')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  test('should be case-insensitive for hexadecimal characters', () => {
    expect(evaluateGuess('aB1c', 'Ab1C')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('aB1c', 'cB1a')).toEqual({ bulls: 2, cows: 2 });
  });
});

describe('generateSecret', () => {
  test('should generate a string of correct length', () => {
    expect(generateSecret(4, 'dec')).toHaveLength(4);
    expect(generateSecret(2, 'bin')).toHaveLength(2);
  });

  test('should generate unique characters', () => {
    const secret = generateSecret(8, 'oct');
    const uniqueChars = new Set(secret.split(''));
    expect(uniqueChars.size).toBe(8);
  });

  test('should generate valid characters for the base', () => {
    const secret = generateSecret(10, 'hex');
    const isValidDigit = createDigitValidator('hex');
    const allValid = secret.split('').every(char => isValidDigit(char));
    expect(allValid).toBe(true);
  });
});
