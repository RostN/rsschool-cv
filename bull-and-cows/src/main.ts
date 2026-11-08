import { GameBase, generateSecret, isValidGuess, evaluateGuess } from './game.js';

interface LeaderboardEntry {
  attempts: number;
  base: string;
  length: number;
  date: string;
}

let secretCode = '';
let gameBase: GameBase = 'dec';
let codeLength = 4;
let attemptsCount = 0;

// Элементы DOM
const setupScreen = document.getElementById('setup-screen') as HTMLDivElement;
const baseSelect = document.getElementById('base-select') as HTMLSelectElement;
const lengthInput = document.getElementById('length-input') as HTMLInputElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;

const gameScreen = document.getElementById('game-screen') as HTMLDivElement;
const gameInfo = document.getElementById('game-info') as HTMLHeadingElement;
const guessInput = document.getElementById('guess-input') as HTMLInputElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const gameLog = document.getElementById('game-log') as HTMLDivElement;

const viewRecordsBtn = document.getElementById('view-records-btn') as HTMLButtonElement;
const recordsScreen = document.getElementById('records-screen') as HTMLDivElement;
const recordsTableContainer = document.getElementById('records-table-container') as HTMLDivElement;
const backToSetupBtn = document.getElementById('back-to-setup-btn') as HTMLButtonElement;

// Новая кнопка возврата во время игры
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;

// Слушатели для экранов рекордов
viewRecordsBtn.addEventListener('click', showLeaderboard);
backToSetupBtn.addEventListener('click', () => {
  recordsScreen.style.display = 'none';
  setupScreen.style.display = 'block';
});

// Слушатель для кнопки "Новая игра" во время игрового процесса
restartBtn.addEventListener('click', () => {
  // Без перезагрузки страницы просто обнуляем состояние и переключаем экран
  secretCode = '';
  attemptsCount = 0;
  gameLog.innerHTML = '';
  guessInput.value = '';
  gameScreen.style.display = 'none';
  setupScreen.style.display = 'block';
});

function getLeaderboard(): LeaderboardEntry[] {
  const data = localStorage.getItem('bulls_cows_leaderboard');
  return data ? JSON.parse(data) : [];
}

function saveRecord(attempts: number, base: string, length: number) {
  const leaderboard = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    attempts,
    base: base.toUpperCase(),
    length,
    date: new Date().toLocaleDateString(),
  };

  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => a.attempts - b.attempts);

  const top10 = leaderboard.slice(0, 10);
  localStorage.setItem('bulls_cows_leaderboard', JSON.stringify(top10));
}

function showLeaderboard() {
  setupScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  recordsScreen.style.display = 'block';

  const leaderboard = getLeaderboard();

  if (leaderboard.length === 0) {
    recordsTableContainer.innerHTML =
      '<p style="text-align: center; color: #a4a4a4;">Рекордов пока нет. Будьте первым!</p>';
    return;
  }

  let tableHtml = `
    <table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 15px;">
      <thead>
        <tr style="border-bottom: 2px solid var(--border); color: #a4a4a4; font-size: 0.9rem;">
          <th style="padding: 8px;">Место</th>
          <th style="padding: 8px; text-align: center;">Попытки</th>
          <th style="padding: 8px; text-align: center;">Режим</th>
          <th style="padding: 8px; text-align: right;">Дата</th>
        </tr>
      </thead>
      <tbody>
  `;

  leaderboard.forEach((entry, index) => {
    tableHtml += `
      <tr style="border-bottom: 1px solid var(--border); font-size: 0.95rem;">
        <td style="padding: 10px 8px; font-weight: bold; color: var(--primary);">${index + 1}</td>
        <td style="padding: 10px 8px; text-align: center; font-weight: bold;">${entry.attempts}</td>
        <td style="padding: 10px 8px; text-align: center; color: #a4a4a4; font-size: 0.85rem;">${entry.base}-${entry.length}</td>
        <td style="padding: 10px 8px; text-align: right; color: #a4a4a4; font-size: 0.85rem;">${entry.date}</td>
      </tr>
    `;
  });

  tableHtml += '</tbody></table>';
  recordsTableContainer.innerHTML = tableHtml;
}

// Старт новой игры
startBtn.addEventListener('click', () => {
  gameBase = baseSelect.value as GameBase;
  codeLength = parseInt(lengthInput.value, 10);

  // 1. Строгая валидация длины от 2 до 6 по ТЗ
  if (codeLength < 2 || codeLength > 6) {
    alert('Длина загаданного числа должна быть строго от 2 до 6 символов!');
    return;
  }

  // Дополнительная проверка для двоичной системы (так как в bin всего 2 уникальные цифры: 0 и 1)
  if (gameBase === 'bin' && codeLength > 2) {
    alert(
      'Для двоичной системы (BIN) максимальная длина числа равна 2, так как цифры не должны повторяться!',
    );
    return;
  }

  secretCode = generateSecret(codeLength, gameBase);
  attemptsCount = 0;
  gameLog.innerHTML = '';
  guessInput.value = '';

  gameInfo.textContent = `Угадайте код из ${codeLength} уникальных символов. Система: ${gameBase.toUpperCase()}.`;

  setupScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  guessInput.focus();
});

function handleGuessSubmit() {
  const guess = guessInput.value.trim();

  if (!isValidGuess(guess, codeLength, gameBase)) {
    alert(
      `Неверный ввод! Ожидается ${codeLength} УНИКАЛЬНЫХ символов для системы ${gameBase.toUpperCase()}.`,
    );
    return;
  }

  attemptsCount++;
  const { bulls, cows } = evaluateGuess(secretCode, guess);

  const logItem = document.createElement('div');
  logItem.className = 'log-item';
  logItem.innerHTML = `
    <span>#${attemptsCount} <strong>${guess.toUpperCase()}</strong></span>
    <span class="stats">🐂 Быки: ${bulls} | 🐄 Коровы: ${cows}</span>
  `;
  gameLog.insertBefore(logItem, gameLog.firstChild);

  guessInput.value = '';
  guessInput.focus();

  if (bulls === codeLength) {
    setTimeout(() => {
      alert(`🎉 Поздравляем! Вы победили за ${attemptsCount} попыток!`);
      saveRecord(attemptsCount, gameBase, codeLength);
      gameScreen.style.display = 'none';
      showLeaderboard();
    }, 100);
  }
}

submitBtn.addEventListener('click', handleGuessSubmit);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuessSubmit();
});
