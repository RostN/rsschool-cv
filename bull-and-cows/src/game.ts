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
  let bulls = 0;
  let cows = 0;

  const sLower = secret.toLowerCase();
  const gLower = guess.toLowerCase();

  for (let i = 0; i < gLower.length; i++) {
    if (gLower[i] === sLower[i]) {
      bulls++;
    } else if (sLower.includes(gLower[i])) {
      cows++;
    }
  }

  return { bulls, cows };
}

export function generateSecret(length: number, base: GameBase): string {
  const baseMap: Record<GameBase, string> = {
    bin: '01',
    oct: '01234567',
    dec: '0123456789',
    hex: '0123456789abcdef',
  };

  const allowedChars = baseMap[base].split('');

  // Перемешиваем массив символов случайным образом (Алгоритм Фишера-Йетса)
  for (let i = allowedChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allowedChars[i], allowedChars[j]] = [allowedChars[j], allowedChars[i]];
  }

  // Берем первые length символов и объединяем в строку
  return allowedChars.slice(0, length).join('');
}
