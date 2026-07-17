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
let accountAva = document.querySelector('.account-page-ava');
let accountCountWin = document.querySelector('.account-page-info-wins-count');
let accountCountLose = document.querySelector('.account-page-info-lose-count');
let dialog = document.getElementById('dialog');
let exitBtn = document.querySelector('.account-page-galary-btns-exit');
let acceptBtn = document.querySelector('.account-page-galary-btns-accept');
let avas = document.querySelectorAll('.account-page-galary-ava');

// Страница настроек
let settingPage = document.querySelector('.setting-page');
let playerName = document.querySelector('.setting-page-player-name');


/* Исполняемый код */
avas.forEach(e => {
    e.addEventListener('click', function(){
        avas.forEach(el => el.classList.remove('account-page-galary-ava-selected'))
        e.classList.add('account-page-galary-ava-selected');
        console.log(e.classList);
    })
})

// Кнопка закрытия в модалке
exitBtn.addEventListener('click', function(){
    dialog.close();
})

// Клик на аватарку открытие модалки для изменения аватарки
accountAva.addEventListener('click', function(){
    dialog.showModal();
})

// Кнопка настройки
btnSetting.addEventListener('click', function(){
    accountPage.style.display = 'none'; // Сокрытие страницы аккаунт
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    pageName.textContent = 'Settings'; // Смена названия страницы
    settingPage.classList.remove('hide'); //Отображение страницы настроек
})

// Кнопка аккаунт
btnAccount.addEventListener('click', function(){
    let img = document.createElement('img'); // Создание элемента с изображением
    mainPage.classList.add('hide'); // Сокрытие основной страницы
    settingPage.classList.add('hide'); // Сокрытие страницы настроек
    pageName.textContent = 'Character'; // Смена названия страницы
    accountPage.style.display = 'flex'; // Отображение страницы аккаунт
    
    accountCountLose.append('5');
    img.src = 'img/p1.png'; // Ссылка на картинку
    accountAva.appendChild(img); // Вставка изображения в аватарку
    accountCountWin.textContent = '999';
    accountCountLose.textContent = '000';
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
    startPage.classList.toggle('hide'); // Отключить стартовую страницу
    mainPage.classList.remove('hide'); // Отображение стартовой страницы
    head.classList.toggle('hide'); // Отображение заголовка
})

// Сокрытия лишнего на старте
// head.classList.add('hide'); //Сокрытия header
// accountPage.style.display = 'none'; // Сокрытие окна аккаунта.
settingPage.classList.add('hide'); // Сокрытие страницы настроек
mainPage.classList.add('hide'); // Сокрытие основной страницы

startPage.classList.add('hide'); // Временно Сокрытие стартовой страницы