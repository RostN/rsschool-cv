let container = document.querySelector('.main-content');
let mainBlock = document.querySelector('main');
/* HTML Карточка */
let cartP1 = '<div class="carts"><div class="cart-img"><img src=';
// + Ccылка на картинку
let cartP2 = ' alt="" class="cart-img"></div><div class="title">';
// + Заголовок
let cartP3 = '</div></div>';
let cartWidth = 200; // Ширина карточки
let cartMarge = 10; // Отступ карточки
let cart ='';
const apiKey = 'bbe5ada707654d74b9e00c740f19dbff';

// script.js
// const loader = document.getElementById('loader');
// const userCard = document.getElementById('user-card');
// const errorDiv = document.getElementById('error');

// Функция для получения данных
async function fetchUserData() {
  // 1. Показываем загрузку, скрываем карточку и ошибки
//   loader.style.display = 'block';
//   userCard.style.display = 'none';
//   errorDiv.style.display = 'none';    
    
    // Добавление карточки в контейнер
    container.insertAdjacentHTML('beforeend', cart);
  try {
    // Тестовый
    // let url = 'https://jsonplaceholder.typicode.com/users/';
    // let response = await fetch(url);
    let response = await fetch('podcast.json');
    
    // Реальный
    // let url = 'https://listen-api.listennotes.com/api/v2/best_podcasts?sort=recent_published_first&page=1';
    // let response = await fetch(url,{
    //     method: "GET",
    //     headers: {
    //         Accept: "application/json",
    //         "X-ListenAPI-Key": apiKey,
    //     },
    // });
 
    // Проверка статуса запроса
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    // Ответ в JSON
    let data = await response.json();
    console.log(data.podcasts[0].thumbnail);

    // data.podcasts.length - 1

    for (i = 0; i < data.podcasts.length - 1; i++){
        cart = cart + cartP1 + data.podcasts[i].thumbnail + cartP2 + data.podcasts[i].title + cartP3;
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

fetchUserData();
autoMarge();
// Вешаем обработчик на кнопку
// loadBtn.addEventListener('click', fetchUserData);
