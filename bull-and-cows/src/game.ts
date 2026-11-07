export type GameBase = 'bin' | 'oct' | 'dec' | 'hex';

export function createDigitValidator(base: GameBase) {
  const baseMap: Record<GameBase, string> = {
    bin: '01',
    oct: '01234567',
    dec: '0123456789',
    hex: '0123456789abcdef',
  };

  const allowedChars = baseMap[base];

  return (char: string): boolean => {
    if (char.length !== 1) return false;
    return allowedChars.includes(char.toLowerCase());
  };
}

export function isValidGuess(guess: string, length: number, base: GameBase): boolean {
  if (guess.length !== length) return false;

  const isDigitValid = createDigitValidator(base);
  const lowerGuess = guess.toLowerCase();
  const chars = lowerGuess.split('');

  const allCharsValid = chars.every((char) => isDigitValid(char));
  if (!allCharsValid) return false;

  const uniqueChars = new Set(chars);
  return uniqueChars.size === length;
}

export function evaluateGuess(secret: string, guess: string): { bulls: number; cows: number } {
  return { bulls: 0, cows: 0 };
}
