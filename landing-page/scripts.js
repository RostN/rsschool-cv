/* --Карусель -- */
let nextBtn = document.querySelector('.btn-next');
let prevBtn = document.querySelector('.btn-prev');
let slides = document.querySelectorAll('.favorite-coffee-card');
let indicators = document.querySelectorAll('.slider-indicator');
let currentIndex = 0; // Активный слайд 0-2

// Проверка наличия кнопок на странице, чтобы не падало
if (prevBtn && nextBtn && slides.length > 0) {
    // Движение слайда и смена индикатора
    function changeSlide() {
        // Сдвижение карточки
        slides.forEach((slide) => {
            slide.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    
        // Обновление индикатора
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Кнопка вправо с бесконечным циклом
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // При достижении конца возвращаем 1й слайд
        }
        changeSlide();
    });
    
    // Кнопка влево с бесконечным циклом
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // При минусе возвращаем последний слайд
        }
        changeSlide();
    });
    
    // Переключение по индикатору
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            changeSlide();
        });
    });
}


/* -- Бургер -- */
let burger = document.querySelector ('.burger');
let nav = document.querySelector('nav');

// Функция смены рисунка бургера (cлушатель) и отображение боковой панели
burger.addEventListener('click', function() {
    burger.classList.toggle('change');
    nav.classList.toggle('On');

    // Блокировка скрола страницы
    if (nav.classList.contains('On')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Закрытие бургера по нажатию клавиши esc
window.addEventListener('keydown', (event) => {
    
    if (event.key === 'Escape') {
        // Проверка на открытие меню бургера
        if (nav.classList.contains('On')) {
            // Закрытие меню бургера
            nav.classList.remove('On');
            burger.classList.remove('change');
            
            // Возвращение прокрутки страницы
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }
});


/* -- Переключение темы -- */
let toggleCheckbox = document.querySelector('#theme-toggle'); //Переключатель темы
let rootElement = document.documentElement; //Контроль веб страницы
let currentTheme = localStorage.getItem('theme'); //Состояние темы

// Проверка сохраненной темы в памяти
if (currentTheme) {
    rootElement.setAttribute('data-theme', currentTheme);

    // Если сохраненная тема темная — ставим галочку в чекбокс
    if (currentTheme === 'dark') {
        toggleCheckbox.checked = true;
        document.getElementById('logo').src = 'img/logo-dark.svg';
    }
}

// Слешатель сменщика темы и её смена
toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        rootElement.setAttribute('data-theme', 'dark'); // включение темной темы
        document.getElementById('logo').src = 'img/logo-dark.svg';
        localStorage.setItem('theme', 'dark'); // Запоминаем
    } else {
        rootElement.setAttribute('data-theme', ''); //Включение светлой темы
        document.getElementById('logo').src = 'img/logo.svg';
        localStorage.setItem('theme', 'light'); // Запоминаем
    }
});

/* -- Контроль нажатой кнокпи табуляции и её переключение -- */
let tabButtons = document.querySelectorAll('.categories-button'); //Все кнопки таба
let reloadButton = document.querySelector('.loadMore').style.display; //Кнопка загрузки дополнительных карт

tabButtons.forEach(button => {
    button.addEventListener('click', () => {        
        let activeButton = document.querySelector('.categories-button.active'); // Находим активную кнопку        
        activeButton.classList.remove('active'); // Удаление маркера активной кнопки        
        button.classList.add('active'); // Установка нового маркера активной кнопки
        let selectedButton = button.textContent.trim().toLowerCase(); // Название нажатой кнопки

        // Фильтрация карточек при нажатии на таб        
        let allCard = document.querySelectorAll('article'); // Все карточки
        let visibleCount = 0; // cчётчик видимых карт
        let isMobileOrTablet = window.innerWidth < 1440; //Проверка ширины экрана
        
        allCard.forEach (card => {
            if(card.classList.contains(selectedButton)){
                card.classList.remove('hide');
                
                // Если больше 4х карточек скрываем
                if (isMobileOrTablet && visibleCount >= 4) {
                    card.classList.add('hide'); // Скрываем лишние на маленьких экранах
                } else {
                    card.classList.remove('hide'); // Показываем (на больших экранах или первые 4)
                    visibleCount++; 
                }

                // Сокрытие кнопки при малом количестве элементов
                let countCards = container.querySelectorAll(`article.${selectedButton}`).length; // Количество карт
                // console.log(countCards);
                if (countCards <= 4) {
                    reloadButton = 'none';
                } else { reloadButton = 'flex';}

            } else {
                card.classList.add('hide');
            }            
        });
    });
});

// Стартовое положение таба
function startTabPosition(){
    let activeButton = document.querySelector('.categories-button.active'); // Текущий активный таб
    let firstButton = document.querySelector('.categories-button'); // Первый таб

    // Проверка активной кнопки
    if (activeButton && firstButton && activeButton !== firstButton) {
        activeButton.classList.remove('active'); // Снимаем класс active с текущей нажатой кнопки
        firstButton.classList.add('active'); // Возвращаем класс active на самую первую кнопку
    }
}

/* -- Первичная загрузка каталога -- */
let container = document.querySelector('#catalog'); //Блок каталога
let template = document.querySelector('#card-template'); //Шаблон карточки

// Парсинг JSON файла
function startLoad(){
        fetch('products.json')
        .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        } return response.json();})
        .then(jsonData => {
        datajson = jsonData;
        createCard(datajson);
        return jsonData;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));
}

// Создание карточек
function createCard(data){
    container.innerHTML = ''; //Очистка блока с картами
    let visibleCount = 0; // cчётчик видимых карт
    data.forEach (item => {
        let card = template.content.cloneNode(true); //Клонивание шаблока карточки
        let cardImg = card.querySelector('#inner-card-img'); //Выбор картинки в карточке
        let cardName = card.querySelector('#inner-card-title'); //Название блюда
        let cardPrice = card.querySelector('#inner-card-price'); //Цена
        let cardDescription = card.querySelector('#inner-card-description'); // Описание
        let cardCategory = ''; //Категория карточки
        
        // Заполнение шаблона
        cardImg.src = item.img; //Вставка картинки в шаблон
        cardImg.alt = item.name; //Имя
        cardName.textContent = item.name; //Вставка имени
        cardPrice.textContent = "$"+item.price; //Вставка цены
        cardDescription.textContent = item.description; //Вставка цены
        cardCategory = item.category; //Категория карточки
        
        let article = card.querySelector('article');
        if (article) {
            article.classList.add(cardCategory); //Добавляем категорю в качестве класса

            let isMobileOrTablet = window.innerWidth < 1440; //Проверка ширины экрана            

            // Стартовый фильтр на кофе
            if (cardCategory != 'coffee') {
                article.classList.add('hide');
            } else {
                visibleCount++;
                if (isMobileOrTablet && visibleCount >= 5) {
                    article.classList.add('hide'); // Скрываем лишние на маленьких экранах
                }
            }
        }

        container.appendChild(card); //Отрисовка карточек
    });

    // console.log(datajson[0].name);
    // console.log(datajson[0].description);
    // console.log(datajson[0].price);
    // console.log(datajson[0].category);
    // console.log(datajson[0].img);
}

/* Контроль изменения размера окна */
window.addEventListener('resize', () => {
    console.log('Изменение экрана');
    startLoad();
    startTabPosition()
});

startLoad();