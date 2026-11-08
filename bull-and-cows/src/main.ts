import {
  GameBase,
  generateSecret,
  isValidGuess,
  evaluateGuess,
  countPossibleSecrets,
  createDigitValidator,
} from './game.js';

interface LeaderboardEntry {
  attempts: number;
  base: string;
  length: number;
  date: string;
  timeSec: number;
}

let secretCode = '';
let gameBase: GameBase = 'dec';
let codeLength = 4;
let startTime = 0;
let matchHistory: Array<{ guess: string; bulls: number; cows: number }> = [];

const BASE_ALPHABET_LENGTHS: Record<GameBase, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
};

const container = document.createElement('div');
container.className = 'container';

const mainTitle = document.createElement('h1');
mainTitle.textContent = '🐂 Быки и Коровы 🐄';
container.appendChild(mainTitle);

const setupScreen = document.createElement('div');
setupScreen.id = 'setup-screen';

const baseGroup = document.createElement('div');
baseGroup.className = 'form-group';
const baseLabel = document.createElement('label');
baseLabel.textContent = 'Система счисления';
const baseSelect = document.createElement('select');
baseSelect.id = 'base-select';
(['dec', 'bin', 'oct', 'hex'] as GameBase[]).forEach((base) => {
  const opt = document.createElement('option');
  opt.value = base;
  opt.textContent =
    base === 'dec'
      ? 'Десятичная (0-9)'
      : base === 'bin'
        ? 'Двоичная (0-1)'
        : base === 'oct'
          ? 'Восьмеричная (0-7)'
          : 'Шестнадцатеричная (0-F)';
  baseSelect.appendChild(opt);
});
baseGroup.appendChild(baseLabel);
baseGroup.appendChild(baseSelect);
setupScreen.appendChild(baseGroup);

const lengthGroup = document.createElement('div');
lengthGroup.className = 'form-group';
const lengthLabel = document.createElement('label');
lengthLabel.id = 'length-label';
const lengthInput = document.createElement('input');
lengthInput.type = 'number';
lengthInput.id = 'length-input';
lengthInput.value = '4';
lengthInput.min = '2';
lengthInput.max = '6';
lengthGroup.appendChild(lengthLabel);
lengthGroup.appendChild(lengthInput);
setupScreen.appendChild(lengthGroup);

const startBtn = document.createElement('button');
startBtn.id = 'start-btn';
startBtn.textContent = 'Начать игру';
setupScreen.appendChild(startBtn);

const viewRecordsBtn = document.createElement('button');
viewRecordsBtn.id = 'view-records-btn';
viewRecordsBtn.textContent = '🏆 Таблица рекордов';
setupScreen.appendChild(viewRecordsBtn);

container.appendChild(setupScreen);

const recordsScreen = document.createElement('div');
recordsScreen.id = 'records-screen';
recordsScreen.style.display = 'none';
const recordsTitle = document.createElement('h2');
recordsTitle.textContent = '🏆 Топ-10 игроков';
const recordsTableContainer = document.createElement('div');
recordsTableContainer.id = 'records-table-container';
const backToSetupBtn = document.createElement('button');
backToSetupBtn.id = 'back-to-setup-btn';
backToSetupBtn.textContent = 'Назад к настройкам';
recordsScreen.appendChild(recordsTitle);
recordsScreen.appendChild(recordsTableContainer);
recordsScreen.appendChild(backToSetupBtn);
container.appendChild(recordsScreen);

const gameScreen = document.createElement('div');
gameScreen.id = 'game-screen';
gameScreen.style.display = 'none';
const gameInfo = document.createElement('div');
gameInfo.className = 'info-box';
gameInfo.id = 'game-info';
const guessGroup = document.createElement('div');
guessGroup.className = 'form-group';
const guessInput = document.createElement('input');
guessInput.type = 'text';
guessInput.id = 'guess-input';
guessInput.placeholder = 'Введите вашу догадку';
guessInput.setAttribute('autocomplete', 'off');
guessGroup.appendChild(guessInput);
const submitBtn = document.createElement('button');
submitBtn.id = 'submit-btn';
submitBtn.textContent = 'Проверить';
const restartBtn = document.createElement('button');
restartBtn.id = 'restart-btn';
restartBtn.textContent = '🔄 Новая игра';
const gameLog = document.createElement('div');
gameLog.className = 'log';
gameLog.id = 'game-log';

gameScreen.appendChild(gameInfo);
gameScreen.appendChild(guessGroup);
gameScreen.appendChild(submitBtn);
gameScreen.appendChild(restartBtn);
gameScreen.appendChild(gameLog);
container.appendChild(gameScreen);

document.body.appendChild(container);

const footer = document.createElement('footer');
const ghLink = document.createElement('a');
ghLink.href = 'https://github.com';
ghLink.target = '_blank';
ghLink.className = 'svgText';

const svgNs = 'http://www.w3.org/2000/svg';
const ghSvg = document.createElementNS(svgNs, 'svg');
ghSvg.setAttribute('class', 'svgImg');
ghSvg.setAttribute('height', '32');
ghSvg.setAttribute('width', '32');
ghSvg.setAttribute('viewBox', '0 0 24 24');

const ghPath = document.createElementNS(svgNs, 'path');
ghPath.setAttribute(
  'd',
  'M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943',
);

ghSvg.appendChild(ghPath);
ghLink.appendChild(ghSvg);

const ghSpan = document.createElement('span');
ghSpan.textContent = 'My GitHub';
ghLink.appendChild(ghSpan);

const yearText = document.createElement('p');
yearText.textContent = '2026';
const schoolLink = document.createElement('a');
schoolLink.href = 'https://rs.school/';
schoolLink.target = '_blank';
const schoolImg = document.createElement('img');
schoolImg.src = 'https://rostn.github.io/rsschool-cv/img/rs_school_js.svg';
schoolImg.alt = 'RS School';
schoolImg.height = 24;
schoolLink.appendChild(schoolImg);
footer.appendChild(ghLink);
footer.appendChild(yearText);
footer.appendChild(schoolLink);
document.body.appendChild(footer);

function updatePossibilitiesLabel() {
  const base = baseSelect.value as GameBase;
  const len = parseInt(lengthInput.value, 10);
  const totalVariants = countPossibleSecrets(len, BASE_ALPHABET_LENGTHS[base]);
  lengthLabel.textContent = `Длина загаданного числа (вариантов: ${totalVariants})`;
}

baseSelect.addEventListener('change', () => {
  if (baseSelect.value === 'bin') {
    lengthInput.value = '2';
    lengthInput.min = '2';
    lengthInput.max = '2';
  } else {
    lengthInput.min = '2';
    lengthInput.max = '6';
  }
  updatePossibilitiesLabel();
});
lengthInput.addEventListener('input', updatePossibilitiesLabel);
updatePossibilitiesLabel();

guessInput.addEventListener('input', () => {
  const validator = createDigitValidator(baseSelect.value as GameBase);
  const cleanValue = guessInput.value
    .split('')
    .filter((char) => validator(char))
    .join('');
  guessInput.value = cleanValue;
});

viewRecordsBtn.addEventListener('click', showLeaderboard);
backToSetupBtn.addEventListener('click', () => {
  recordsScreen.style.display = 'none';
  setupScreen.style.display = 'block';
});

restartBtn.addEventListener('click', () => {
  gameScreen.style.display = 'none';
  setupScreen.style.display = 'block';
});

function getLeaderboard(): LeaderboardEntry[] {
  const data = localStorage.getItem('bulls_cows_leaderboard');
  return data ? JSON.parse(data) : [];
}

function saveRecord(attempts: number, base: string, length: number, timeSec: number) {
  const leaderboard = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    attempts,
    base: base.toUpperCase(),
    length,
    date: new Date().toLocaleDateString(),
    timeSec,
  };
  const updated = [...leaderboard, newEntry].sort((a, b) => {
    if (a.attempts !== b.attempts) return a.attempts - b.attempts;
    return a.timeSec - b.timeSec;
  });
  localStorage.setItem('bulls_cows_leaderboard', JSON.stringify(updated.slice(0, 10)));
}

function showLeaderboard() {
  setupScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  recordsScreen.style.display = 'block';
  recordsTableContainer.textContent = '';

  const leaderboard = getLeaderboard();
  if (leaderboard.length === 0) {
    const noRecords = document.createElement('p');
    noRecords.style.textAlign = 'center';
    noRecords.style.color = '#a4a4a4';
    noRecords.textContent = 'Рекордов пока нет. Будьте первым!';
    recordsTableContainer.appendChild(noRecords);
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.borderBottom = '2px solid var(--border)';
  headerRow.style.color = '#a4a4a4';
  headerRow.style.fontSize = '0.9rem';

  ['Место', 'Попытки', 'Время', 'Режим'].forEach((text) => {
    const th = document.createElement('th');
    th.style.padding = '8px';
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  leaderboard.forEach((entry, index) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border)';

    const tdRank = document.createElement('td');
    tdRank.style.padding = '10px 8px';
    tdRank.style.fontWeight = 'bold';
    tdRank.style.color = 'var(--primary)';
    tdRank.textContent = String(index + 1);

    const tdAttempts = document.createElement('td');
    tdAttempts.style.padding = '10px 8px';
    tdAttempts.style.fontWeight = 'bold';
    tdAttempts.textContent = String(entry.attempts);

    const tdTime = document.createElement('td');
    tdTime.style.padding = '10px 8px';
    tdTime.textContent = `${entry.timeSec} сек`;

    const tdMode = document.createElement('td');
    tdMode.style.padding = '10px 8px';
    tdMode.style.color = '#a4a4a4';
    tdMode.textContent = `${entry.base}-${entry.length}`;

    tr.appendChild(tdRank);
    tr.appendChild(tdAttempts);
    tr.appendChild(tdTime);
    tr.appendChild(tdMode);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  recordsTableContainer.appendChild(table);
}

startBtn.addEventListener('click', () => {
  gameBase = baseSelect.value as GameBase;
  codeLength = parseInt(lengthInput.value, 10);

  secretCode = generateSecret(codeLength, gameBase);
  startTime = Date.now();
  matchHistory = [];
  gameLog.textContent = '';
  guessInput.value = '';

  gameInfo.textContent = `Угадайте код из ${codeLength} уникальных символов системы ${gameBase.toUpperCase()}.`;
  setupScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  guessInput.focus();
});

function handleGuessSubmit() {
  const guess = guessInput.value.trim();
  if (!isValidGuess(guess, codeLength, gameBase)) {
    alert(`Ошибка! Ожидается ${codeLength} уникальных символов для СС ${gameBase.toUpperCase()}.`);
    return;
  }

  const isDuplicate = matchHistory.some((item) => item.guess === guess.toLowerCase());
  if (isDuplicate) {
    alert('Вы уже предлагали этот вариант догадки!');
    return;
  }

  const { bulls, cows } = evaluateGuess(secretCode, guess);

  matchHistory = [...matchHistory, { guess: guess.toLowerCase(), bulls, cows }];

  const logItem = document.createElement('div');
  logItem.className = 'log-item';

  const guessSpan = document.createElement('span');
  guessSpan.textContent = `#${matchHistory.length} `;
  const strongGuess = document.createElement('strong');
  strongGuess.textContent = guess.toUpperCase();
  guessSpan.appendChild(strongGuess);

  const statsSpan = document.createElement('span');
  statsSpan.className = 'stats';
  statsSpan.textContent = `🐂 Быки: ${bulls} | 🐄 Коровы: ${cows}`;

  logItem.appendChild(guessSpan);
  logItem.appendChild(statsSpan);
  gameLog.insertBefore(logItem, gameLog.firstChild);

  guessInput.value = '';
  guessInput.focus();

  if (bulls === codeLength) {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    setTimeout(() => {
      alert(`🎉 Победа! Попыток: ${matchHistory.length}. Время: ${elapsedSeconds} сек.`);
      saveRecord(matchHistory.length, gameBase, codeLength, elapsedSeconds);
      gameScreen.style.display = 'none';
      showLeaderboard();
    }, 100);
  }
}

submitBtn.addEventListener('click', handleGuessSubmit);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuessSubmit();
});
