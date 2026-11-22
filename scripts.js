const container = document.querySelector('.projectsGallary');
let template = document.querySelector('#card-template'); //Шаблон карточки

// Парсинг JSON файла
function startLoad(){
        fetch('projects.json')
        .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        } return response.json();})
        .then(jsonData => {
        datajson = jsonData;
        // Защита от падения
        createCard(datajson);
        return jsonData;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));
}

// Создание карточек
function createCard(data){
    container.innerHTML = ''; //Очистка блока с картами
    
    data.forEach ((item, index) => {
        const card = template.content.cloneNode(true); //Клонивание шаблока карточки
        const cardImg = card.querySelector('#inner-card-img'); //Выбор картинки в карточке
        const cardName = card.querySelector('#inner-card-title'); //Название проекта
        const cardLink = card.querySelector('.link'); // Cсылка

        const tagsContainer = card.querySelector('.tags'); // Контейнер для тегов
        const tagTemplate = tagsContainer.querySelector('.tag'); // Шаблон одного тега
        tagsContainer.innerHTML = ''; // Очищаем контейнер перед заполнением

        // Динамическая картинка-заглушка Темный фон (#2b2b2b), светлый текст (#ffffff) и автоматическое название проекта
        const defaultImg = `https://placehold.co/300x150/2b2b2b/ffffff?text=${encodeURIComponent(item.name)}`;

        // Динамическое создание ярлыков с тегом
        item.tags.forEach(t => {
            const newTag = tagTemplate.cloneNode(true); // Клонируем пустой <span>
            const tagName = t.tag; // Получаем название тега из JSON
            
            newTag.textContent = tagName; // Записываем текст внутрь span
            newTag.classList.add(tagName.toLowerCase()); // Добавляем класс в нижнем регистре (например, "ts")
            
            tagsContainer.appendChild(newTag); // Вставляем готовый тег в карточку
        });
        
        // Заполнение шаблона
        cardImg.src = item.img ? item.img : defaultImg; //Вставка картинки в шаблон либо заглушка
        cardImg.alt = item.name; //Имя
        cardName.textContent = item.name; //Вставка имени
        cardLink.href = item.link; //Ссылка на проект
        
        let article = card.querySelector('article');
        if (article) {
            article.dataset.index = index; // привязываем индекс элемента из JSON к карточке
        }

        // Проверка активности карты
        if (item.active === "true"){
            container.appendChild(card); //Отрисовка карточек
        }
    });
};

startLoad();

/* Загрузка файла MD отключен */ 
const fileUrl = 'test.md'; // Путь к файлу .md

fetch(fileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Сетевая ошибка при попытке загрузить файл');
        }
        return response.text(); // Получаем текст файла
    })
    .then(markdownText => {
    // Превращаем все элементы Markdown в HTML
    let htmlResult = markdownText
        // Заголовки
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')   // # h1
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')  // ## h2
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>') // ### h3

        // Ссылки: [Текст](Ссылка) -> <a href="Ссылка">Текст</a>
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')

        // Жирный и курсив (обрабатываем __ и **)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')

        // Списки: строка начинается с "* " или "- "
        .replace(/^[\*|-] (.*?)$/gm, '<li>$1</li>')
        
        // Перенос строки
        .replace(/(?<!<\/h1>|<\/h2>|<\/h3>|<\/li>)\r?\n/g, '<br>\n');

        // Вставляем готовый результат на страницу
        // document.getElementById('content').innerHTML = htmlResult;
    })

    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('content').innerText = 'Не удалось загрузить текст.';
    });