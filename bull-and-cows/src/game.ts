export type GameBase = 'bin' | 'oct' | 'dec' | 'hex';

export function createDigitValidator(base: GameBase) {
  return (char: string): boolean => {
    return false;
  };
}

export function isValidGuess(guess: string, length: number, base: GameBase): boolean {
  return false;
}
