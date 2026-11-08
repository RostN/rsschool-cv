export type GameBase = 'bin' | 'oct' | 'dec' | 'hex';

const BASE_MAP: Record<GameBase, string> = {
  bin: '01',
  oct: '01234567',
  dec: '0123456789',
  hex: '0123456789abcdef',
};

export function createDigitValidator(base: GameBase) {
  const allowed = BASE_MAP[base];
  return (char: string): boolean => {
    if (char.length !== 1) return false;
    return allowed.includes(char.toLowerCase());
  };
}

export function isValidGuess(guess: string, length: number, base: GameBase): boolean {
  if (guess.length !== length) return false;
  const isDigitValid = createDigitValidator(base);
  const chars = guess.toLowerCase().split('');
  
  const allValid = chars.every(isDigitValid);
  const unique = new Set(chars).size === length;
  
  return allValid && unique;
}

export function evaluateGuess(secret: string, guess: string): { bulls: number; cows: number } {
  const sArr = secret.toLowerCase().split('');
  const gArr = guess.toLowerCase().split('');

  // Считаем быков через reduce
  const bulls = gArr.reduce((acc, char, index) => acc + (char === sArr[index] ? 1 : 0), 0);

  // Считаем коров через filter и reduce (угадана, но не на своем месте)
  const cows = gArr.reduce((acc, char, index) => {
    return acc + (char !== sArr[index] && sArr.includes(char) ? 1 : 0);
  }, 0);

  return { bulls, cows };
}

export function generateSecret(length: number, base: GameBase, random = Math.random): string {
  const chars = BASE_MAP[base].split('');
  
  // Функциональный аналог перемешивания без явной мутации циклом: сортировка на основе переданного random источника
  const shuffled = [...chars].sort(() => random() - 0.5);
  return shuffled.slice(0, length).join('');
}

// Мемоизатор для рекурсивной функции расчета вариантов
const memoCache: Record<string, number> = {};

export function countPossibleSecrets(length: number, baseAlphabetLength: number): number {
  const cacheKey = `${length}_${baseAlphabetLength}`;
  if (cacheKey in memoCache) return memoCache[cacheKey];

  // Базовые случаи рекурсии P(n, k)
  if (length === 0) return 1;
  if (length > baseAlphabetLength) return 0;

  // Рекурсивный шаг формулы перестановок: n * P(n-1, k-1)
  const result = baseAlphabetLength * countPossibleSecrets(length - 1, baseAlphabetLength - 1);
  memoCache[cacheKey] = result;
  return result;
}
