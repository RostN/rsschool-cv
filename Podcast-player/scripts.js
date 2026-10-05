let container = document.querySelector('.main-content');
let mainBlock = document.querySelector('main');

/* HTML Карточка */
let cartP1 = `<div class="carts"><div class="cart-img"><img src=`;
    // + Ccылка на картинку
let cartP2 = ' alt="" class="cart-img"></div><div class="title">';
    // + Заголовок
let cartP3 = '</div><div class="title2">';
    // + имя испонителя
let cartP4 = '</div><div class="hide">';
let cartP5 = '</div></div>';
let cartWidth = 200; // Ширина карточки
let cartMarge = 10; // Отступ карточки
let cart ='';
const apiKey = 'bbe5ada707654d74b9e00c740f19dbff';
let loading = document.querySelector('.loading');

/* Поле поиска */ 
let input = document.querySelector('input');
let search = '';
let response ='';
let btnBack = document.querySelector('.back');
let cartID = '';

/* Модальное окно */
let dialog = document.getElementById('dialog');
let modalImg = document.querySelector('.modalImg');
let modatTextAuthor = document.querySelector('.modatTextAuthor');
let modalTextName = document.querySelector('.modalTextName');
let modatTextDescription = document.querySelector('.modatTextDescription');
let btnCloseModal = document.querySelector('.btnCloseModal');
let modalContent = document.querySelector('.modalContent');
let loadingMod = document.querySelector('.loadingMod');

/* Эпизоды */
let episodes = document.querySelector('.episodes');
let episodesImg = document.querySelector('.episodes-img');
let episodesTitle = document.querySelector('.episodes-title');
let episodesDescription = document.querySelector('.episodes-description');

/* Аудио */ 
let audio = document.getElementById('audio');
let audioPlayer = document.querySelector('.audioPlayer');

// Включение подкаста
dialog.addEventListener('click', (e) => {
    audio.src = e.target.closest('.episodes').querySelector('.hide').innerText;
    console.log('audio link:', e.target.closest('.episodes').querySelector('.hide').innerText);
    audio.load();
    audioPlayer.style.display = 'block';
    audio.play();
})

// Закрытие модального окна
btnCloseModal.addEventListener('click', function(){
    dialog.close();
})

// Клик на каждую карточку
container.addEventListener('click', (e) => {
    cartID = e.target.closest('.carts').querySelector('.hide').innerText;
    console.log(e.target.closest('.carts').querySelector('.hide').innerText);
    // fetchUserData('t3');
    fetchUserData('3');
    dialog.showModal();
})

// Отслеживание нажатия Enter в строке поиска
input.addEventListener('keydown', function(){
    // Поиск через клавишу Enter
    if (event.key === 'Enter'){
        startSearch();        
    }
    
    // Поиск через 3 сек
    setTimeout(()=>{
        startSearch();
    },3000);
})

// Функция поиска
function startSearch(){
    // Замена пробелов на спецсимвол пробела
    input.value = input.value.replaceAll(' ','%20');
    search = input.value;
    console.log(search);
    input.value='';
    // fetchUserData('t2');
    fetchUserData('2');
    btnBack.style.display = 'block';
    input.style.marginLeft = '30px';
}

// Кнопка назад
btnBack.addEventListener('click', function(){
    btnBack.style.display = 'none';
    input.style.marginLeft = '0px';
    
    // fetchUserData('t1');
    fetchUserData('1');
})

// Функция для получения данных
async function fetchUserData(t) {
    let url ='';
    cart = '';

    // Загрузчик
    loading.style.display = 'block';
    loadingMod.style.display = 'block';
    container.style.display = 'none';

    // НЕ чистить поле, если открывается модальное окно
    if (t !== 't3' && t !== '3'){
        container.innerHTML = '';
        console.log('Чистка', t);
    }
    
    // Режим загрузки карточек
    if (t === 't1') {url = 'podcast.json'; console.log ('podcast.json');};
    if (t === 't2') {url = 'search.json'; console.log('search.json')};
    if (t === 't3') {url = 'idans.json'; console.log('idans.json')};

    // Стартовая загрузка
    if (t === '1') {url = 'https://listen-api.listennotes.com/api/v2/best_podcasts?sort=recent_published_first&page=1'};
    // Поисковой запрос
    if (t === '2') {url = `https://listen-api.listennotes.com/api/v2/search?q=${search}&type=podcast`};
    // Поиск по ID
    if (t === '3') {url = `https://listen-api.listennotes.com/api/v2//podcasts/${cartID}`};
    
    // Добавление карточки в контейнер
    container.insertAdjacentHTML('beforeend', cart);
  try {
    if (t === 't1' || t === 't2' || t === 't3'){
        console.log ('test file');
        response = await fetch(url);
    }

    if (t === '1' || t === '2' || t === '3'){
        console.log ('online');
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

    // Загрузка карточек при стартовой загрузке
    if (t === 't1' || t === '1'){
        for (i = 0; i < data.podcasts.length; i++){
            cart = cart + cartP1 + data.podcasts[i].thumbnail + cartP2 + data.podcasts[i].title + cartP3 + data.podcasts[i].publisher + cartP4 + data.podcasts[i].id + cartP5;
        }
    }
    
    // Карточки для поиска
    if (t === 't2' || t === '2'){
        for (i = 0; i < data.results.length; i++){
            cart = cart + cartP1 + data.results[i].thumbnail + cartP2 + data.results[i].title_original + cartP3 + data.results[i].publisher_original + cartP4 ;
        }
    }

    // Модальное окно
    if (t === 't3' || t === '3') {
        modalImg.innerHTML = `<img src = "${data.thumbnail}" alt="">`;
        modatTextAuthor.innerHTML = data.publisher;
        modalTextName.innerHTML = data.title;
        modatTextDescription.innerHTML = data.description;
    
        // Очистка от старых элементов
        document.querySelectorAll('.episodes').forEach(el => {
            el.remove();
        });

        // Эпизоды в модальном окне
        for (i = 0; i < data.episodes.length ; i++){
            let ms = data.episodes[i].pub_date_ms;
            let date = new Date(ms);
            let duration = timeFormat(data.episodes[i].audio_length_sec) 
            let epDate = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2, '0')+'-'+String(date.getDate()).padStart(2, '0') + ' (' + duration + ')';

            let episodesHTML = `<div class="episodes"><div class="hide episodesAudio">${data.episodes[i].audio}</div><div class="episodes-img"><img src="${data.episodes[i].thumbnail}" class="episodes-img"><img src="img/play_32x32.svg" class="episodesPlay"></div><div class="episodes-text"><div class="episodes-text-title-date"><div class="episodes-title">${data.episodes[i].title}</div><div class="episodes-title-date">${epDate}</div></div><div class="episodes-description">${data.episodes[i].description}</div></div></div>`;
            dialog.insertAdjacentHTML('beforeend', episodesHTML);
        }  
    }
    
    // Добавление карточки в контейнер
    container.insertAdjacentHTML('beforeend', cart);

    // Загрузчик выключаем и включаем контент
    loading.style.display = 'none';
    loadingMod.style.display = 'none';
    container.style.display = 'flex';

  } catch (error) {
    // Если что-то пошло не так (нет сети, ошибка сервера)
    console.error('Произошла ошибка:', error);
    loading.textContent = 'Error. Please try reload page';
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

// Перевод секунд в ч:м:с
function timeFormat(sec) {
  let h = String(Math.floor(sec / 3600)).padStart(2, '0');
  let m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  let s = String(sec % 60).padStart(2, '0');

  return `${h}:${m}:${s}`;
}

/* Стартовые функции */
// fetchUserData('t1');
fetchUserData('1');
autoMarge();