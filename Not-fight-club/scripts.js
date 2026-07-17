// Заголовок header
let head = document.querySelector('header');
let pageName = document.querySelector('.head-page-name');
let btnHome = document.querySelector('.btnHome');
let btnAccount = document.querySelector('.btnAccount');
let btnSetting = document.querySelector('.btnSetting');

// Стартовая страница (регистрация)
let startPage = document.querySelector('.start-page');
let startBtnCreate = document.querySelector('.start-btn-create');

// Основная страница
let mainPage = document.querySelector('.main-page');
let mainPageBtnFight = document.querySelector('.main-page-btnFight');

// Страница аккаунта
let accountPage = document.querySelector('.account-page');
let accountInfo = document.querySelector('.account-page-info');

// Страница настроек
let settingPage = document.querySelector('.setting-page');
let playerName = document.querySelector('.setting-page-player-name');

/* Исполняемый код */ 
// Кнопка настройки
btnSetting.addEventListener('click', function(){
    accountPage.style.display = 'none'; // Сокрытие страницы аккаунт
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    pageName.textContent = 'Settings'; // Смена названия страницы
    settingPage.classList.remove('hide'); //Отображение страницы настроек
})

// Кнопка аккаунт
btnAccount.addEventListener('click', function(){
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    settingPage.classList.add('hide'); // Сокрытие страницы настроек
    pageName.textContent = 'Character'; // Смена названия страницы
    accountPage.style.display = 'flex'; // Отображение страницы аккаунт
    accountInfo.textContent = 'Statistic'; // Заполнение поле с информацией
})
 
// Кнопка домой
btnHome.addEventListener('click', function(){
    accountPage.style.display = 'none'; // Сокрытие страницы аккаунт
    settingPage.classList.add('hide'); // Сокрытие страницы настроек
    pageName.textContent = 'Main'; // Смена названия страницы
    mainPage.classList.remove('hide'); // Отображение страницы Main
})

// Кнопка создания персонажа
startBtnCreate.addEventListener('click', function(){
    head.classList.toggle('hide'); // Отображение заголовка
    startPage.classList.toggle('hide'); //Отключить стартовую страницу
    mainPage.classList.remove('hide');
})

// Изменение названия надписи в залоголовке
// pageName.textContent = 'Page'

// Сокрытия заголовка на старте
head.classList.add('hide'); //Сокрытия header
accountPage.style.display = 'none'; //Сокрытие окна аккаунта.
settingPage.classList.add('hide'); // Сокрытие страницы настроек
mainPage.classList.add('hide'); // Сокрытие основной страницы
// startPage.classList.add('hide'); // Временно Сокрытие стартовой страницы