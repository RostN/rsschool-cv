let container = document.querySelector('.main-content');
let mainBlock = document.querySelector('main');
/* HTML Карточка */
let cartP1 = '<div class="carts"><div class="cart-img"><img src=';
// + Ccылка на картинку
let cartP2 = ' alt="" class="cart-img"></div><div class="title">';
// + Заголовок
let cartP3 = '</div><div class="title2">';
// + имя испонителя
let cartP4 = '</div></div>';
let cartWidth = 200; // Ширина карточки
let cartMarge = 10; // Отступ карточки
let cart ='';
const apiKey = 'bbe5ada707654d74b9e00c740f19dbff';
let input = document.querySelector('input');
let search = '';
let response ='';
let btnBack = document.querySelector('.back');

// Отслеживание нажатия Enter в строке поиска
input.addEventListener('keydown', function(){
    if (event.key === 'Enter'){
        // Заменя пробелов на спецсимвол пробела
        input.value = input.value.replaceAll(' ','%20');
        search = input.value;
        console.log(search);
        input.value='';
        fetchUserData('t2');
        btnBack.style.display = 'block';
        input.style.marginLeft = '30px';
    }
})

// Кнопка назад
btnBack.addEventListener('click', function(){
    btnBack.style.display = 'none';
    input.style.marginLeft = '0px';
    
    fetchUserData('t1');
})

// script.js
// const loader = document.getElementById('loader');
// const userCard = document.getElementById('user-card');
// const errorDiv = document.getElementById('error');

// Функция для получения данных
async function fetchUserData(t) {
    container.innerHTML='';
    cart = '';
    let url ='';
    // Режим загрузки карточек
    if (t === 't1') {url = 'podcast.json'; console.log ('podcast.json');};
    if (t === 't2') {url = 'search.json'; console.log('search.json')};
    // Стартовая загрузка
    if (t === '1') {url = 'https://listen-api.listennotes.com/api/v2/best_podcasts?sort=recent_published_first&page=1'};
    // Поисковой запрос
    if (t === '2') {url = `https://listen-api.listennotes.com/api/v2/search?q=${search}&type=podcast`};

    

  // 1. Показываем загрузку, скрываем карточку и ошибки
//   loader.style.display = 'block';
//   userCard.style.display = 'none';
//   errorDiv.style.display = 'none';    
    
    // Добавление карточки в контейнер
    container.insertAdjacentHTML('beforeend', cart);
  try {
    if (t === 't1' || t === 't2'){
        console.log ('test file');
        response = await fetch(url);
    }

    if (t === '1' || t === '2'){
        console.log ('online');
        console.log (url);
        // Реальный
        response = await fetch(url,{
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-ListenAPI-Key": apiKey,
            },
        });
    }
 
    // Проверка статуса запроса
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    // Ответ пребразуем в JSON
    let data = await response.json();
    
    console.log(data);
    // console.log(data.results[0]);

    // Загрузка карточек при стартовой загрузке
    if (t === 't1' || t === '1'){
        for (i = 0; i < data.podcasts.length; i++){
            cart = cart + cartP1 + data.podcasts[i].thumbnail + cartP2 + data.podcasts[i].title + cartP3 + data.podcasts[i].publisher + cartP4 ;
        }
    }

    // Карточки для поиска
    if (t === 't2' || t === '2'){
        for (i = 0; i < data.results.length; i++){
            cart = cart + cartP1 + data.results[i].thumbnail + cartP2 + data.results[i].title_original + cartP3 + data.results[i].publisher_original + cartP4 ;
        }
    }

    // console.log (cart);
    
    
    // Добавление карточки в контейнер
    container.insertAdjacentHTML('beforeend', cart);

    // 6. Показываем карточку, скрываем загрузку
    // userCard.style.display = 'block';
    // loader.style.display = 'none';

  } catch (error) {
    // Если что-то пошло не так (нет сети, ошибка сервера)
    console.error('Произошла ошибка:', error);
    // errorDiv.textContent = 'Не удалось загрузить данные. Проверьте консоль.';
    // errorDiv.style.display = 'block';
    // loader.style.display = 'none';
  }
}

// Корректировка отступа блока с карточками, чтобы было красиво
function autoMarge(){
    container.style.marginRight = `${(mainBlock.offsetWidth % (cartMarge * 2 + cartWidth))/2 - 1}px`;
    container.style.marginLeft = `${(mainBlock.offsetWidth % (cartMarge * 2 + cartWidth))/2 - 1}px`;
}

/* Контроль изменения размера окна */
window.addEventListener('resize', () => {
    autoMarge();
});

fetchUserData('t2');
autoMarge();
// Вешаем обработчик на кнопку
// loadBtn.addEventListener('click', fetchUserData);