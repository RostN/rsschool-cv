// Заголовок header
let head = document.querySelector('header');
let pageName = document.querySelector('.head-page-name');
let btnHome = document.querySelector('.btnHome');
let btnAccount = document.querySelector('.btnAccount');
let btnSetting = document.querySelector('.btnSetting');
let headerBtns = document.querySelectorAll('svg');

// Стартовая страница (регистрация)
let startPage = document.querySelector('.start-page');
let startBtnCreate = document.querySelector('.start-btn-create');
let startInput = document.querySelector('.start-input');
let modalOverlay = document.querySelector('.modal-overlay-start')
let modalCloseBtn = document.querySelector('.btn-close-modalStart');
let locSt = ''; //Локальное хранилище в переменной

// Основная страница
let mainPage = document.querySelector('.main-page');
let mainPageBtnFight = document.querySelector('.main-page-btnFight');

// Страница сражений
let fightPage = document.querySelector('.fight-page');
let fightPlayerName = document.querySelector('.fight-page-account-name');
let fightPicPlayer = document.querySelector('.fight-page-account-ava');
let fightHpPlayer = document.querySelector('.fight-page-account-hp');
let fightHpPlayerLine = document.createElement('div'); // Создание полоски жизнь
let fightHpPlayerLineText = document.createElement('div'); // Создание полоски жизнь
fightHpPlayerLine.classList.add('fightHpLine');
fightHpPlayerLineText.classList.add('fightHpLineText');
let fightPicEnemy = document.querySelector('.fight-page-enemy-ava');
let fightEnemyName = document.querySelector('.fight-page-enemy-name');
let fightHpEnemy = document.querySelector('.fight-page-enemy-hp');
let fightHpEnemyLine = document.createElement('div'); // Создание полоски жизнь
let fightHpEnemyLineText = document.createElement('div'); // Создание полоски жизнь
fightHpEnemyLine.classList.add('fightHpLine');
fightHpEnemyLineText.classList.add('fightHpLineText');

// Страница аккаунта
let accountPage = document.querySelector('.account-page');
let accountName = document.querySelector('.account-page-info-name');
let accountAva = document.querySelector('.account-page-ava');
let accountCountWin = document.querySelector('.account-page-info-wins-count');
let accountCountLose = document.querySelector('.account-page-info-lose-count');
let dialog = document.getElementById('dialog');
let exitBtn = document.querySelector('.account-page-galary-btns-exit');
let acceptBtn = document.querySelector('.account-page-galary-btns-accept');
let avas = document.querySelectorAll('.account-page-galary-ava');
let img = document.createElement('img'); // Создание элемента с изображением аватарка
let tmp = ''; // Временные данные

// Страница настроек
let settingPage = document.querySelector('.setting-page');
let playerName = document.querySelector('.setting-page-player-name');
let changeName = document.querySelector('.setting-page-player-name-input');
let settingBtn = document.querySelector('.setting-page-btn');
let changeBtns = document.querySelector('.setting-page-change-btns');
let changeCancelBtn = document.querySelector('.setting-page-btn-exit');
let changeAcceptBtn = document.querySelector('.setting-page-btn-accept');
let lastName = '';

// Загруженные данные
let namePlayer = ''; // Имя игрока
let picPlayer = ''; // Аватарка игрока
let winPlayer = 0; // Количество побед игрока
let losePlayer = 0; // Количество поражений игрока
let hpPlayer = 0; // Здоровье игрока 

/* Исполняемый код */
// Кнопка начала боя
mainPageBtnFight.addEventListener('click', function(){
    let enemyHP = 100;
    // hpPlayer = 30;
    fightPicPlayer.appendChild(img); // Вставка изображения
    fightPlayerName.textContent = namePlayer; // Вписание имени персонажа
    mainPage.classList.toggle('hide'); // Скрываем основное окно
    
    fightHpPlayer.appendChild(fightHpPlayerLine); // Добавление полосы здоровья
    fightHpPlayer.appendChild(fightHpPlayerLineText); // Добавление полосы здоровья
    fightHpPlayerLine.style.width = `${hpPlayer}%`; // Здоровье игрока
    fightHpPlayerLineText.textContent = `${hpPlayer}%`; // Здоровье игрока
    
    fightHpEnemy.appendChild(fightHpEnemyLine); // Добавление полосы здоровья
    fightHpEnemy.appendChild(fightHpEnemyLineText); // Добавление полосы здоровья
    fightHpEnemyLine.style.width = `${enemyHP}%`; // Здоровье врага
    fightHpEnemyLineText.textContent = `${enemyHP}%`; // Здоровье врага
    
    fightPage.style.display = 'flex'; // Включение окна поединков
})

// Кнопка подтверждения изменения имени
changeAcceptBtn.addEventListener('click', function(){
    namePlayer = changeName.value; // Сохранение нового имени
    changeBtns.style.display = 'none'; // Скрываем кнопки подтверждения изменений
    changeName.classList.toggle('hide'); // Скрытие поля ввода для нового имени
    settingBtn.classList.toggle('hide'); // Отображение кнопки изменение измени
    playerName.textContent = namePlayer; // Вписываем новое имя
    saveData(); // Сохранение данных
})

// Кнопка Cancel в изменении имени
changeCancelBtn.addEventListener('click', function(){
    playerName.textContent = lastName; // Возвращаем имя
    changeName.classList.toggle('hide'); // Скрытие поля ввода для нового имени
    changeBtns.style.display = 'none'; // Скрываем кнопки подтверждения изменений
    settingBtn.classList.toggle('hide'); // Отображение кнопки изменение измени
})

// Кнопка Edit name для изменение имени
settingBtn.addEventListener('click', function(){
    lastName = playerName.textContent; // Сохранение последнего имени
    changeName.value = playerName.textContent; // Ввод содержимого прошлого имени в поле ввода
    settingBtn.classList.toggle('hide'); // Сокрытие кнопки изменение измени
    changeName.classList.toggle('hide'); // Отображение поля ввода для нового имени
    changeBtns.style.display = 'flex'; // Отображения кнопок подтверждения
    playerName.textContent = ''; // Выбираем имя
})

// Контроль выбранной кнопки в header
headerBtns.forEach(e => {
    e.addEventListener('click', function(){
        headerBtns.forEach(el => el.classList.remove('svg-selected')); // Снять выделение со всехлы
        e.classList.add('svg-selected'); // Выделеие нажатой аватарки
    })
})

// Выделение картинки в модальном окне выбора аватарки
avas.forEach(e => {
    e.addEventListener('click', function(){
        avas.forEach(el => el.classList.remove('account-page-galary-ava-selected')); // Снимаем выделение со всех
        e.classList.add('account-page-galary-ava-selected'); // Выделяем нажатую
        tmp = e.src; // Адрес картинки
    })
})

// Кнопка подтверждение выбранной картинки
acceptBtn.addEventListener('click', function(){
    picPlayer = tmp.substring(tmp.lastIndexOf('/') - 3);
    accountWindow();
    dialog.close(); // Закрытие модального окна
    saveData(); // Сохранение данных
})

// Кнопка закрытия в модалке
exitBtn.addEventListener('click', function(){
    dialog.close();
})

// Клик на аватарку открытие модалки для изменения аватарки
accountAva.addEventListener('click', function(){
    dialog.showModal(); // Показать модальное окно
})

// Кнопка настройки
btnSetting.addEventListener('click', function(){
    accountPage.style.display = 'none'; // Сокрытие страницы аккаунт
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    pageName.textContent = 'Settings'; // Смена названия страницы
    settingPage.classList.remove('hide'); //Отображение страницы настроек
    playerName.textContent = namePlayer; // Выбираем имя
})

// Кнопка аккаунт
btnAccount.addEventListener('click', function(){
    accountWindow();
})

// Функция окна аккаунта
function accountWindow(){
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    settingPage.classList.add('hide'); // Сокрытие страницы настроек
    pageName.textContent = 'Character'; // Смена названия страницы
    accountPage.style.display = 'flex'; // Отображение страницы аккаунт
    img.src = picPlayer; // Ссылка на картинку
    accountAva.appendChild(img); // Вставка изображения в аватарку
    accountCountWin.textContent = winPlayer; // Количество побед
    accountCountLose.textContent = losePlayer; // Количество поражений
    accountName.textContent = namePlayer; // Имя аккаунта
}
 
// Кнопка домой
btnHome.addEventListener('click', function(){
    accountPage.style.display = 'none'; // Сокрытие страницы аккаунт
    settingPage.classList.add('hide'); // Сокрытие страницы настроек
    pageName.textContent = 'Main'; // Смена названия страницы
    mainPage.classList.remove('hide'); // Отображение страницы Main
})

// Кнопка создания персонажа
startBtnCreate.addEventListener('click', function(){
    if (!startInput.value.trim()) {
        modalOverlay.style.display = 'flex'; // Окно с ошибкой, если пустое поле ввода

        // Кнопка закрыть окно с ошибкой
        modalCloseBtn.addEventListener('click', function(){
            modalOverlay.style.display = 'none';
        })
        
        // Закрыть по клику вне окна
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        })
    } else {
        startGame(); // Запуск старта игры
    }
})

// Функция начала игры
function startGame(){
    startPage.classList.toggle('hide'); // Отключить стартовую страницу
    mainPage.classList.remove('hide'); // Отображение стартовой страницы
    head.classList.toggle('hide'); // Отображение заголовка
    btnHome.classList.add('svg-selected'); // Выделение кнопки в заголовке
    
    namePlayer = startInput.value;
    getLocSt(); // Взятие данных из локального хранилища
    saveData(); // Сохранение
}

function saveData(){
    //Создание JSON и заполнение данными
    let jsonTMP = new Map ([
        ['Pic', picPlayer],
        ['win', winPlayer],
        ['lose', losePlayer],
        ['hp', hpPlayer]
    ]);
    let SD = Object.fromEntries(jsonTMP);

    //Добавления имени в JSON
    let finData = new Map ([
        [namePlayer, SD]
    ]);
    finData = Object.fromEntries(finData);


    // finData = {...locSt,...finData}; // Старые данные и плюс новые сделать контроль изменения имени

    //Сохранение в localStorage
    localStorage.setItem('notfightclub', JSON.stringify(finData)); 
    console.log('saved');

    //Парсинг из localStorage
    getLocSt(); 
}

/* Взятие из localStorage */
function getLocSt(){
    locSt = JSON.parse(localStorage.getItem('notfightclub'));
    console.log(locSt);
    if (locSt){
        console.log('Have')
        picPlayer = locSt[namePlayer].Pic;
        winPlayer = locSt[namePlayer].win;
        losePlayer = locSt[namePlayer].lose;
        hpPlayer = locSt[namePlayer].hp;
        img.src = picPlayer;
    } else { 
        console.log ('first');
        picPlayer = 'img/p1.png';
        winPlayer = 0;
        losePlayer = 0;
        hpPlayer = 100;
    }
}

// Сокрытия лишнего на старте
head.classList.add('hide'); //Сокрытия header

changeBtns.style.display = 'none'; // Сокрытие кнопок изменения имени
changeName.classList.add('hide'); // Сокрытие строки изменения имени

settingPage.classList.add('hide'); // Сокрытие страницы настроек
accountPage.style.display = 'none'; // Сокрытие окна аккаунта.

mainPage.classList.add('hide'); // Сокрытие основной страницы

fightPage.style.display = 'none'; // Сокрытие страницы сражений 

// startPage.classList.add('hide'); // Временно Сокрытие стартовой страницы
// startGame(); // Временно