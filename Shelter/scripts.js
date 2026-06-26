/*  */
/*  */


/* Получение данных из JSON файла */
let sliderCart = document.querySelector('.pets-content-slider-data');
let petsCartP1 = '<div class="pets-content-slider-data-cart"><img src="';
// + картинка питомца
let petsCartP2 = '" alt=""><div class="pets-cart-text">';
// + Имя петомца
let petsCartP3 = '</div><button class="pets-cart-button">Learn more</button></div>';

    fetch('pets.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        } return response.json();})
      .then(jsonData => {
        datajson = jsonData;
        console.log(datajson[0]);
        createPetsCart()
        return jsonData;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));

    function createPetsCart(){
        testcart = petsCartP1+datajson[0].img + petsCartP2 + datajson[0].name + petsCartP3;
        sliderCart.insertAdjacentHTML('beforeend', testcart);
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
        // console.log(datajson[0].img);
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
