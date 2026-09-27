/* --Модальное окно-- */

let dialog = document.querySelector('dialog'); // Модальное окно
let container = document.querySelector('#catalog') // Блок с картами (каталог)

let modalName = document.getElementById('inputName'); // Имя продукта
let modalDescription = document.getElementById('inputDescription'); // Описание продукта
let modalTotal = document.getElementById('inputTotal'); // Финальная цена
let modalCloseBtn = document.querySelector('.dialog-alert-btn'); // Кнопка закрыть внутри модального окна

let product = null; // Переменная для хранения данных продукта, который открыт в данный момент

// Защита: проверка наличия элементов на странице, чтобы на других страницах не падало
if (container && dialog) {

    let modalImg = dialog.querySelector('.dialogImg img'); // Картинка в модальном окне
    container.addEventListener('click', (event) => {
        let card = event.target.closest('article'); // Получаем родительский article по нажатию на карточку
        if (!card) return; // Если мимо карточки ты закрываем функцию
        let cardIndex = card.dataset.index; // Получаем индекс нажатой карточки из data-атрибута

        // проверяем, что данные из JSON загружены
        if (typeof datajson !== 'undefined' && datajson[cardIndex]) {
            product = datajson[cardIndex];
            
            // Переносим данные из JSON в модальное окно
            if (modalImg) modalImg.src = product.img; // Картинка
            if (modalImg) modalImg.alt = product.name; // Alt картинки
            if (modalName) modalName.textContent = product.name; // Название
            if (modalDescription) modalDescription.textContent = product.description; // Описаание
            if (modalTotal) modalTotal.textContent = "$" + Number(product.price).toFixed(2); // Цена

            // Динамическое изменение текстов кнопок размера
            let sizes = ['s', 'm', 'l'];
            sizes.forEach(sizeCode => {
                let radioInput = document.getElementById(`size-${sizeCode}`);
                if (radioInput && product.sizes && product.sizes[sizeCode]) {
                    // Находим связанный label по селектору
                    let labelVolume = dialog.querySelector(`label[for="size-${sizeCode}"] .volume`);
                    if (labelVolume) {
                        labelVolume.textContent = product.sizes[sizeCode].size; // Подставляем размер
                    }
                }
            });

            // Динамическое изменение текстов кнопок добавок
            let checkboxesAdd = dialog.querySelectorAll('input[type="checkbox"]');
            checkboxesAdd.forEach((checkbox, index) => {
                checkbox.checked = false; // Сбрасываем галочку
                
                if (product.additives && product.additives[index]) {
                    let labelVolume = dialog.querySelector(`label[for="${checkbox.id}"] .volume`);
                    if (labelVolume) {
                        labelVolume.textContent = product.additives[index].name; // Подставляем название добавки
                    }
                }
            });
            
            // Сбрасываем чекбоксы добавок при каждом новом открытии
            let checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            
            // Возвращаем радио-кнопку размера на дефолтный S
            let defaultRadio = document.getElementById('size-s');
            if (defaultRadio) defaultRadio.checked = true;

            updateTotalPrice(); // Функция подсчёта финальной цены
            dialog.showModal(); // Открываем модальное окно

            // Блокировка скрола страницы
            if (dialog) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };
     });

    // Динамический пересчёт цены
    dialog.addEventListener('change', (event) => {
        // Если изменился размер или добавка — пересчитываем цену
        if (event.target.name === 'coffee-size' || event.target.name === 'additives') {
            updateTotalPrice();
        }
    });
    
    // Функция подсчета итоговой стоимости
    function updateTotalPrice() {
        if (!product) return;

        // Базовая цена товара (превращаем в число на всякий случай)
        let basePrice = Number(product.price);
        let additionalPrice = 0;

        // Получаем надбавку за выбранный размер
        let selectedSizeInput = dialog.querySelector('input[name="coffee-size"]:checked');
        if (selectedSizeInput && product.sizes && product.sizes[selectedSizeInput.value]) {
            additionalPrice += Number(product.sizes[selectedSizeInput.value]['add-price']);
        }

        // Получаем надбавку за все выбранные добавки
        let checkedBoxes = dialog.querySelectorAll('input[name="additives"]:checked');
        checkedBoxes.forEach(checkbox => {
            // Ищем соответствующую добавку в массиве по ее имени
            let labelText = dialog.querySelector(`label[for="${checkbox.id}"] .volume`).textContent;
            let additiveData = product.additives.find(item => item.name === labelText);
            
            if (additiveData) {
                additionalPrice += Number(additiveData['add-price']);
            }
        });

        // Выводим финальную сумму округленную до 2 знаков после запятой
        let finalTotal = basePrice + additionalPrice;
        if (modalTotal) {
            console.log(finalTotal);
            modalTotal.textContent = "\$" + finalTotal.toFixed(2);
        }
    }

    // Закрытие модального окна при клике вне окна
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    // Закрытие модального окна с помощью кнопки CLOSE
    modalCloseBtn.addEventListener('click', () => {
        dialog.close()
    });
};




//  dialog.showModal();







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
        // Проверка на наличие открытого модального окна
        if (dialog){
            dialog.close();
            // Возвращение прокрутки страницы
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
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
let reloadButton = document.querySelector('.loadMore'); //Кнопка загрузки дополнительных карт

if (container && reloadButton) {

    reloadButton.addEventListener('click', function() {
        let activeButton = document.querySelector('.categories-button.active').textContent.trim().toLowerCase(); //активная кнопка
        // console.log(activeButton);
        // Фильтрация карточек при нажатии на таб        
        let allCard = document.querySelectorAll('article'); // Все карточки
    
        allCard.forEach (card => {
        if(card.classList.contains(activeButton)){
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
        // Скрываем кнопку
        reloadButton.style.display = 'none';
    });
}

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
        let countCards = container.querySelectorAll(`article.${selectedButton}`).length; // Количество карт

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
                if (countCards >= 4) {
                    reloadButton.style.display = 'none';
                } else { reloadButton.style.display = 'flex';}

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
    if (firstButton && activeButton !== firstButton) {
        activeButton.classList.remove('active'); // Снимаем класс active с текущей нажатой кнопки
        firstButton.classList.add('active'); // Возвращаем класс active на самую первую кнопку
    }
}

/* -- Первичная загрузка каталога -- */
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
        // Защита от падения
        if (container && reloadButton) {
            createCard(datajson);
        }
        return jsonData;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));
}

// Создание карточек
function createCard(data){
    container.innerHTML = ''; //Очистка блока с картами
    let visibleCount = 0; // cчётчик видимых карт
    data.forEach ((item, index) => {
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
            article.dataset.index = index; // привязываем индекс элемента из JSON к карточке

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
}

/* Контроль изменения размера окна */
window.addEventListener('resize', () => {
    console.log('Изменение экрана');
    startLoad();
    startTabPosition()
});

startLoad();