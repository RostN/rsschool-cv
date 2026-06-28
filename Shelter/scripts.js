/*  */

/* Пагинатор */
let indexSliderPrev = document.getElementById('indexSliderPrev');
let indexSliderNext = document.getElementById('indexSliderNext');
let indexSliderPosition = 0;

    // Слушатель кнопки назад
    indexSliderPrev.addEventListener('click', function(){
        updateCarts(100);
    })

    // Слушатель кнопки вперёд
    indexSliderNext.addEventListener('click', function(){
        updateCarts(-100);
    })

    // Обновление слайдера
    function updateCarts(a){
        indexSliderPosition += a;
        sliderCartInd.style.transform =
        `translate(${indexSliderPosition}px, 0px)`;
    }

/* Получение данных из JSON файла */
let sliderCartInd = document.querySelector('.slider-container');
let petsCartP1 = '<div class="pets-content-slider-data-cart index-page"><img src="';
// + картинка питомца
let petsCartP2 = '" alt=""><div class="pets-cart-text">';
// + Имя петомца
let petsCartP3 = '</div><button class="pets-cart-button">Learn more</button></div>';
let slidesInd = Array.from(sliderCartInd.children);
let slidesGap = 0;

    fetch('pets.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        } return response.json();})
      .then(jsonData => {
        datajson = jsonData;
        // console.log(datajson[0]);
        createPetsCart()
        return jsonData;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));

    // Функция создания карточекы
    let testcart = '';

    
    function createPetsCart(){
        // testcart = petsCartP1+datajson[0].img + petsCartP2 + datajson[0].name + petsCartP3;
        for ( i = 0; i < 8; i++){
            testcart = testcart + 
            petsCartP1+
            datajson[i].img +
            petsCartP2 +
            datajson[i].name +
            petsCartP3;
            // console.log(i);
        }
        sliderCartInd.insertAdjacentHTML('beforeend', testcart);
        slidesInd = Array.from(sliderCartInd.children); //Массив созданных элементов
        // slidesGap = slidesInd[0].clientWidth + 22.5;
        sliderCartInd.style.gap = 40;
        console.log(slidesInd[0].clientWidth);
    }
    
/* Контроль изменения размера окна */
    window.addEventListener('resize', () => {
        console.log('Изменение экрана');
        hideNavMenu(); //Проверка размера экрана
    });

/* Бургер */
let burger = document.querySelector ('.burger');
let navMenu = document.querySelector('.header-nav');

    // Функция смены рисунка бургера (cлушатель) и отображение боковой панели
    burger.addEventListener('click', function() {
        burger.classList.toggle('change'); 
        navMenu.classList.toggle('navOn');
    });

    // Функция сокрытия панели меню при малом размере экрана
    function hideNavMenu(){
        console.log('Расширение экрана: ', window.innerWidth)
        if (window.innerWidth < 768){
            navMenu.classList.toggle('.hide');
        }
    }

    // Сокрытие панели меню при малом размере экрана
    hideNavMenu();
