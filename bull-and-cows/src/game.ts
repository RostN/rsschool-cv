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

  // Используем иммутабельный reduce для поэтапного извлечения уникальных символов
  const selectedChars = Array.from({ length }).reduce<string[]>((acc, _) => {
    // Фильтруем символы, которые ещё не были выбраны
    const remaining = chars.filter((c) => !acc.includes(c));
    const randomIndex = Math.floor(random() * remaining.length);
    return [...acc, remaining[randomIndex]];
  }, []);

  return selectedChars.join('');
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
