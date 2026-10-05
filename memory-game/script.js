// Создание разметки страницы
function createGameLayout() {
    const body = document.body;

    // Header
    const header = document.createElement('header');
    const btnStart = document.createElement('button');
    btnStart.id = 'start';
    btnStart.textContent = 'Новая игра';

    const btnModal = document.createElement('button');
    btnModal.id = 'modal';
    btnModal.textContent = 'Таблица лидеров';

    header.appendChild(btnStart);
    header.appendChild(btnModal);

    // Main
    const main = document.createElement('main');

    // Блок wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Контейнер статистики
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';

    const movesCountDiv = document.createElement('div');
    movesCountDiv.id = 'moves-count';

    const pairCountDiv = document.createElement('div');
    pairCountDiv.id = 'pair-count';

    statsContainer.appendChild(movesCountDiv);
    statsContainer.appendChild(pairCountDiv);

    // Игровой контейнер
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    // Собираем wrapper
    wrapper.appendChild(statsContainer);
    wrapper.appendChild(gameContainer);
    main.appendChild(wrapper);

    // Модальное окно с таблицей лидеров
    const leaderboardModal = document.createElement('dialog');
    leaderboardModal.id = 'leaderboardModal';

    // Таблица результатов
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = '#';
    const td2 = document.createElement('td');
    td2.textContent = 'Шагов';
    const td3 = document.createElement('td');
    td3.textContent = 'Дата';

    trHead.appendChild(td1);
    trHead.appendChild(td2);
    trHead.appendChild(td3);
    thead.appendChild(trHead);

    const tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);
    leaderboardModal.appendChild(table);

    // Кнопки управления в таблице лидеров
    const controlsLeaderboard = document.createElement('div');
    controlsLeaderboard.className = 'dialog-control';

    const btnCloseLeaderboard = document.createElement('button');
    btnCloseLeaderboard.id = 'close-modal';
    btnCloseLeaderboard.textContent = 'Закрыть';

    const btnStartLeaderboard = document.createElement('button');
    btnStartLeaderboard.id = 'start';
    btnStartLeaderboard.textContent = 'Новая игра';

    controlsLeaderboard.appendChild(btnCloseLeaderboard);
    controlsLeaderboard.appendChild(btnStartLeaderboard);
    leaderboardModal.appendChild(controlsLeaderboard);

    main.appendChild(leaderboardModal);

    // МОдальное окно с победой
    const victoryModal = document.createElement('dialog');
    victoryModal.id = 'victoryModal';

    const victoryTitle = document.createElement('h1');
    victoryTitle.id = 'victory-title';

    // Кнопки управления
    const controlsVictory = document.createElement('div');
    controlsVictory.className = 'dialog-control';

    const btnCloseVictory = document.createElement('button');
    btnCloseVictory.id = 'close-modal';
    btnCloseVictory.textContent = 'Закрыть';

    const btnStartVictory = document.createElement('button');
    btnStartVictory.id = 'start';
    btnStartVictory.textContent = 'Новая игра';

    controlsVictory.appendChild(btnCloseVictory);
    controlsVictory.appendChild(btnStartVictory);

    victoryModal.appendChild(victoryTitle);
    victoryModal.appendChild(controlsVictory);

    main.appendChild(victoryModal);

    // Сборка всего
    body.appendChild(header);
    body.appendChild(main);
}

// Запуск генерации интерфейса
createGameLayout();

const startButton = document.querySelectorAll('#start'); // Кнопка старт
const gameContainer = document.querySelector(".game-container"); // Контейнер для карт
const moves = document.getElementById("moves-count"); // Показатель ходов
const pairs = document.getElementById("pair-count"); // Показатель пар
const dialog = document.getElementById('leaderboardModal'); // Модальное окно таблицы лидеров
const dialogWin = document.getElementById('victoryModal'); // Модальное окно победы
const openModalButton = document.getElementById('modal'); // Открыть модальное окно
const closeModalButton = document.querySelectorAll('#close-modal'); // Кнопка закрытия модального окна

const movesSpan = document.createElement('span'); // Блок с ходами
movesSpan.textContent = 'Ходов:';
const pairsSpan = document.createElement('span');
pairsSpan.textContent = 'Пар:';
const victoryTitle = document.getElementById('victory-title'); // Заголовок для победы

// Перемменные
let movesCount = 0; // количество движений
let pairsCount = 0; // Количество пар
let cards; // Карточки
let firstCard = false; //Первая перевернутая карточка
let secondCard = false; //вторая перевернутая карточка

//Массив карточек
const items = [
  { name: "beaver", image: "img/beaver.png" },
  { name: "bird", image: "img/bird.png" },
  { name: "crocodile", image: "img/crocodile.png" },
  { name: "deer", image: "img/deer.png" },
  { name: "hippo", image: "img/hippo.png" },
  { name: "lemur", image: "img/lemur.png" },
  { name: "monkey", image: "img/monkey.png" },
  { name: "tiger", image: "img/tiger.png" },
];

// Закрыть модальное окно
closeModalButton.forEach(btn =>
    btn.addEventListener("click", () => {
        dialog.close(); // Закрыть диалоговое окно
        dialogWin.close();
        // Возвращение прокрутки страницы
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    })
)

// Открыть модальное окно - таблица лидеров
openModalButton.addEventListener("click", () => {
    renderLeaderboardTable(); // Отрисовка таблицы лидеров
    dialog.showModal(); // Открыть модальное окно
    document.body.style.overflow = 'hidden';
})

// Запуск игры
function startGame(){
    dialog.close(); // Закрыть диалоговое окно
    dialogWin.close();
    movesCount = 0;
    pairsCount = 0;
    // Очистка
    pairs.replaceChildren();
    moves.replaceChildren();

    pairs.appendChild(pairsSpan);
    moves.appendChild(movesSpan); 

    // Стартовое текстовое значение
    pairs.appendChild(document.createTextNode(` ${pairsCount} из 8`));
    moves.appendChild(document.createTextNode(` ${movesCount}`));

    matrixGenerator(items); // Генерация карточек
};

// кнопки запуска игры
startButton.forEach(btn =>
    btn.addEventListener("click", () => {
        startGame();
    })
)

function matrixGenerator (cardValues, size = 4) {
    gameContainer.replaceChildren(); // Очистка
    cardValues = [...cardValues, ...cardValues]; //Наполняем поле картами
    cardValues.sort(() => Math.random() - 0.5); // Перемешиваем карты

    for (let i = 0; i < size * size; i++) {
        const cardContainer = document.createElement('div'); // Основной контейнер карточки
        cardContainer.className = 'card-container';
        cardContainer.setAttribute('data-card-value', cardValues[i].name);

        // Создание рубашки карточки
        const cardBefore = document.createElement('div');
        cardBefore.className = 'card-before';
        cardBefore.textContent = '?';

        // Создаие внутренней стороны карточки 
        const cardAfter = document.createElement('div');
        cardAfter.className = 'card-after';
        
        // Создаем элемент картинки
        const img = document.createElement('img');
        img.src = cardValues[i].image;
        img.className = 'image';

        // СБорка
        cardAfter.appendChild(img); // Кладем картинку внутрь лицевой стороны
        cardContainer.appendChild(cardBefore); // Добавляем рубашку в карту
        cardContainer.appendChild(cardAfter);  // Добавляем лицевую сторону в карту

        // Добавление карты в игровой контейнер
        gameContainer.appendChild(cardContainer);
    }

    // Заполнение игрового контейнера
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Карточки
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {

        card.addEventListener("click", () => {
        if (!card.classList.contains("matched")) {
            card.classList.add("flipped"); //Переворот нажатой карты
            // Проверка на открытую карту
            if (!firstCard) {
            firstCard = card;
            firstCardValue = card.getAttribute("data-card-value");
            } else {
            movesCount += 1;
            secondCard = card;
            let secondCardValue = card.getAttribute("data-card-value");

            // Сравнение 2х открытых карт, если вопадают отмечаем, либо переворачиваем назад
            if (firstCardValue == secondCardValue) {
                // Пометка найденных карт
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");               
                firstCard = false;            

                pairsCount += 1;
                updateText();
                
                // Проверка на завершение игры и сохранение
                if (pairsCount === 8){
                    saveGameResult(movesCount);
                    finalModal();
                }
            } else {
                updateText();
                let [tempFirst, tempSecond] = [firstCard, secondCard];
                firstCard = false;
                secondCard = false;
                let delay = setTimeout(() => {
                tempFirst.classList.remove("flipped");
                tempSecond.classList.remove("flipped");
                }, 900);
            }
        }
    }});
    }
);};

// Обновление текста
function updateText() {
    moves.lastChild.textContent = ` ${movesCount}`;
    pairs.lastChild.textContent = ` ${pairsCount} из 8`;
};

// Функция сохранения игры
function saveGameResult(movesCount) {
    // Загрузка прошлых результатов, если имеются
    const rawData = localStorage.getItem('memoryGame');
    let leaderboard = rawData ? JSON.parse(rawData) : [];

    // Формирования текущей даты
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    // Для корректной сортировки сохраняем timestamp
    const newResult = {
        moves: movesCount,
        date: formattedDate,
        timestamp: now.getTime() 
    };

    // ДОбавление нового результата в массив с реззультатами
    leaderboard.push(newResult);

    // Сортировка: приоритет на ходы, либо время
    leaderboard.sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        }
        return a.timestamp - b.timestamp;
    });

    leaderboard = leaderboard.slice(0, 10); // Сокращение массива до 10 результатов
    localStorage.setItem('memoryGame', JSON.stringify(leaderboard)); // СОхранение в LS
}

// Функция формировнаия таблицы лидеров
function renderLeaderboardTable() {
    const tbody = document.querySelector('table tbody'); // Тело таблицы
    const table = document.querySelector('#leaderboardModal table'); // Сама таблица
    if (!tbody) return;

    // Проверка на старое сообщение, чтобы не было дублирования
    const oldMessage = dialog.querySelector('.no-results-msg');
    if (oldMessage) {
        oldMessage.remove();
    }

    tbody.replaceChildren(); //Очистка таблицы

    // Загрузка данных из LS
    const rawData = localStorage.getItem('memoryGame');
    const leaderboard = rawData ? JSON.parse(rawData) : [];

    // проверка на наличие результата
    if (leaderboard.length === 0) {
        table.style.display = 'none'; // Скрываем таблицу

        // Создаем параграф для сообщения
        const msg = document.createElement('p');
        msg.className = 'no-results-msg';
        msg.textContent = 'Пока нет результатов';
        const dialogControl = dialog.querySelector('.dialog-control');
        
        dialog.insertBefore(msg, dialogControl);  // Добавляем сообщение в модалку перед кнопками
        return; // Выходим из функции
    }

    // Если результаты есть — возвращаем видимость таблице
    table.style.display = 'table';

    // Создание строк и столцов таблицы
    leaderboard.forEach((result, index) => {
        const tr = document.createElement('tr');
        const tdIndex = document.createElement('td'); // Порядковый номер
        tdIndex.textContent = index + 1;
        const tdMoves = document.createElement('td'); // Количество шагов
        tdMoves.textContent = result.moves;
        const tdDate = document.createElement('td'); // Дата
        tdDate.textContent = result.date;
        
        // Сборка
        tr.appendChild(tdIndex);
        tr.appendChild(tdMoves);
        tr.appendChild(tdDate);
        
        tbody.appendChild(tr); // Добавление в таблицу
    });
}

// Финальное сообщение
function finalModal(){
    victoryTitle.textContent = `Ты победил за ${movesCount} шагов`;
    // Показать модальное окно с задержкой
    setTimeout(() => {
        dialogWin.showModal();
        document.body.style.overflow = 'hidden';
    }, 900);
};

// Закрытие модального окна при клике вне окна
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
        // Возвращение прокрутки страницы
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
});
dialogWin.addEventListener('click', (event) => {
    if (event.target === dialogWin) {
        dialogWin.close();
        // Возвращение прокрутки страницы
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
});

// Закрытие модального по ESC
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Проверка на наличие открытого модального окна
        if (dialog){
            dialog.close();   
        }
        
        if (dialogWin){
            dialogWin.close();
        }

        // Возвращение прокрутки страницы
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
});

// Запуск игры
startGame();