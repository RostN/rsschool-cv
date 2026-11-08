export type GameBase = 'bin' | 'oct' | 'dec' | 'hex';

export function createDigitValidator(base: GameBase) {
  return (char: string) => false;
}

export function isValidGuess(guess: string, length: number, base: GameBase): boolean {
  return false;
}

export function evaluateGuess(secret: string, guess: string): { bulls: number; cows: number } {
  return { bulls: 0, cows: 0 };
}

export function generateSecret(length: number, base: GameBase, random = Math.random): string {
  return '';
}

export function countPossibleSecrets(length: number, baseAlphabetLength: number): number {
  return 0;
}
