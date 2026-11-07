import { describe, test, expect } from 'vitest';
import { createDigitValidator, isValidGuess } from './game.js';

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
