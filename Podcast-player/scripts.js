/*

// Данные из форм проектов 
let prjTable = document.getElementById('prjTable'); //Таблица проектов
let rStPrj = 2; //Стартовая строка для таблицы проектов
let prjName = document.getElementById('prjName'); // Название проекта
let prjCompName = document.getElementById('prjCompName'); //Название компании
let prjBud = document.getElementById('prjBud'); //Бюджет
let prjEmpCap = document.getElementById('prjEmpCap'); //Производственная мощность 
let addBtnPrj = document.getElementById('addBtnPrj');
let prjData = [];

// Данные из форм сотрудников 
let empTable = document.getElementById('empTable'); //Таблица сотрудников
let rStEmp = 2; //Стартовая строка для таблицы сотрудников
let empName = document.getElementById('empName'); //Имя
let empSurname = document.getElementById('empSurname'); //Фамилия
let empDB = document.getElementById('empDB'); //Дата рождения
let empPosition = document.getElementById('empPosition'); //Должность
let empSalary = document.getElementById('empSalary'); //ЗП
let addBtnEmp = document.getElementById('addBtnEmp'); 
let empData = [];

// Остальные хранилища 
let yearSelect = document.getElementById('year-select'); //Выбор года
let monthSelect = document.getElementById('month-select'); //Выбор месяца
let locSt = ''; //Локальное хранилище в переменной

// HTML код кнопки удаления для таблиц 
let btnDelEmp = '<button class="redBtn" onclick="deleteBtn()">Delete</button>';

// Парсинг LocalStorage 
getLocSt();

// Слушатель селекторов 
const selectors = [yearSelect, monthSelect];
selectors.forEach( element => {
    element.addEventListener('change', () => {
        clearTable();
    });
});

// Функция контроля включения текущего месяца 
function chooseMonth (){
    //Текущая дата, берём год и месяц
    let data = new Date();

    //Установлние в селекторы текущий год и месяц
    monthSelect.value = data.getMonth();
    yearSelect.value = data.getFullYear();
};

// Функция очистки таблиц 
function clearTable() {
    while(rStPrj > 2){
        prjTable.deleteRow(-1); // Удаление строки
        rStPrj--;
    };

    while(rStEmp > 2){
        empTable.deleteRow(-1); // Удаление строки
        rStEmp--;
    };

    getLocSt();
};

// Взятие из localStorage 
function getLocSt(){
    let data = yearSelect.value + '-' + monthSelect.value; //Дата селектор

    //Автоматический выбор селектора текущего года и месяца
    chooseMonth ();

    locSt = JSON.parse(localStorage.getItem('monthlyData'));
    empData = locSt[data].Employee; //Загрузка данных в массив сотрудников
    prjData = locSt[data].Project; //Загрузка данных в массив проектов
    
    //Загрузка проектов из LocalStorage в таблицу
    if (locSt[data].Project.length > 0){
        while (rStPrj - 2 != prjData.length / 5) {
            addRow(prjTable);
        }
    };
    
    //Загрузка сотрудников из LocalStorage в таблицу
    if (locSt[data].Employee.length > 0){
        while (rStEmp - 2 != empData.length / 6) {
            addRow(empTable);
        }
    };
};

// Функция сохранения данных в LocalStorage и очистка полей  
function saveData(){
    //Проекты
    prjName.value = '';
    prjCompName.value = '';
    prjBud.value = '';
    prjEmpCap.value = '';

    //Сотрудники
    empName.value = ''; 
    empSurname.value = '';
    empDB.value = '';
    empPosition.value = '';
    empSalary.value = '';

    //Текущая дата, берём год и месяц
    let data = new Date();
    data = data.getFullYear()+'-'+data.getMonth();
    
    //Создание JSON и заполнение данными
    let jsonTMP = new Map ([
        ['Employee', empData],
        ['Project', prjData]
    ]);
    let SD = Object.fromEntries(jsonTMP);
    
    //Добавления даты в JSON
    let finData = new Map ([
        [data, SD]
    ]);
    
    finData = Object.fromEntries(finData);

    //Сохранение в localStorage
    localStorage.setItem('monthlyData', JSON.stringify(finData)); 

    //Парсинг из localStorage
    getLocSt(); 

    //Сохранение в файл
    const localFile = 'base.txt';
    //saveAsFile(JSON.stringify(finData), localFile, 'application/json');
    
    //Скрытие панели, как сохранится
    rightPanel.style.display = 'none';
    addProjectPanel.style.display = 'none';
    addEmployeesPanel.style.display = 'none';
};

// Слушатель кнопки добавления проекта 
addBtnPrj.addEventListener('click', function(){
    prjData.push(
        'prjId-'+Date.now(),
        prjName.value,
        prjCompName.value,
        prjBud.value,
        prjEmpCap.value,
    );
    saveData();
});

// Слушатель кнопки добавления сотрудника 
addBtnEmp.addEventListener('click', function() {
    empData.push(
        'empId-'+ Date.now(),
        empName.value,
        empSurname.value,
        empDB.value,
        empPosition.value,
        empSalary.value,
    );
    saveData();
});

// Слушатель для кнопки удалить персонала и проекта 
function deleteBtn(){
    let rowIdx = '';

    //Слушатель кнопки удаления в таблице сотрудников
    empTable.addEventListener('click', function(e){
        rowIdx = e.target.closest('tr').rowIndex; //Получение индекса нажатой строки
        empData.splice(empData.indexOf(empTable.rows[rowIdx].cells[9].innerHTML), 6); //Поиск индекса в массиве ID сотрудника из таблицы и удаление из массива
        empTable.deleteRow(rowIdx); // Удаление строки
        rStEmp --;
        saveData();
    });

    //Слушатель кнопки удаления в таблице проектов
    prjTable.addEventListener('click', function(e){
        rowIdx = e.target.closest('tr').rowIndex;
        prjData.splice(prjData.indexOf(prjTable.rows[rowIdx].cells[7].innerHTML), 5);
        prjTable.deleteRow(rowIdx);
        rStPrj --;
        saveData();
    });
}

// Функция добавления строк 
function addRow(x) {
    let lengthTable = x.getElementsByTagName ('th').length; //Количество ячеек в таблице
    let data = yearSelect.value + '-' + monthSelect.value; //Дата селектор
    let rows = x.getElementsByTagName('tr'); // Строчки
    
    //Добавление новой строки в конец
    let newRow = x.insertRow(-1); // Строка внизу
    for (i = 0; i < lengthTable; i++){
        newCell = newRow.insertCell(i); //Вставляем ячейки
    };
    
    //Заполнение таблицы проектов
    if ( lengthTable == '8'){
        rows[rStPrj].cells[0].append(locSt[data].Project[(rStPrj - 2) * 5 + 2]); //Company name
        rows[rStPrj].cells[1].append(locSt[data].Project[(rStPrj - 2) * 5 + 1]); //Project name
        rows[rStPrj].cells[2].append("$" + locSt[data].Project[(rStPrj - 2) * 5 + 3]); //Budjet
        rows[rStPrj].cells[3].append("0.0 / " + locSt[data].Project[(rStPrj - 2) * 5 + 4]); //Employee capacity
        rows[rStPrj].cells[4].append(); //Employees
        rows[rStPrj].cells[5].append(); //Estimated income
        rows[rStPrj].cells[6].insertAdjacentHTML('beforeend',btnDelEmp); //Action
        rows[rStPrj].cells[7].append(locSt[data].Project[(rStPrj - 2) * 5 + 0]); //ID
        rows[rStPrj].cells[7].classList.add('hide'); // Скрытие столбца ID
        rStPrj ++;
    };

    //Заполнение таблицы работнико
    if (lengthTable == '10'){
        rows[rStEmp].cells[0].append(locSt[data].Employee[(rStEmp - 2) * 6 + 1]); //Name
        rows[rStEmp].cells[1].append(locSt[data].Employee[(rStEmp - 2) * 6 + 2]); //Surname
        rows[rStEmp].cells[2].append(ageCalc(locSt[data].Employee[(rStEmp - 2) * 6 + 3])); //Age
        rows[rStEmp].cells[3].append(locSt[data].Employee[(rStEmp - 2) * 6 + 4]); //Position
        rows[rStEmp].cells[4].append("$" + locSt[data].Employee[(rStEmp - 2) * 6 + 5]); //Salary
        rows[rStEmp].cells[5].append("$" + (locSt[data].Employee[(rStEmp - 2) * 6 + 5]) * 0.5); //Estimated payment
        rows[rStEmp].cells[6].append(); //Project
        rows[rStEmp].cells[7].append(); //Projected Income
        rows[rStEmp].cells[8].insertAdjacentHTML('beforeend',btnDelEmp); //Actions
        rows[rStEmp].cells[9].append((locSt[data].Employee[(rStEmp - 2) * 6 + 0])); //ID
        rows[rStEmp].cells[9].classList.add('hide'); // Скрытие столбца ID
        rStEmp ++;
    }
};

// Функция сохранения в файл (Сохранить как) 
function saveAsFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url); // Освобождаем URL, чтобы избежать утечек памяти
}

// Бургер 
let brgMenu = document.querySelector('.burgerIco');
let leftSide = document.querySelector('.leftSide');
let navItem = document.querySelector('.nav-item');

    // Слушатель бургера 
    brgMenu.addEventListener('click', function(e){
        if (brgMenu.classList.contains('active')){
            //Отобразить левую панель
            brgMenu.classList.remove('active');
            leftSide.classList.remove('hide');
//            navItem.classList.remove('hide');
            setTimeout(() => leftSide.style.width = '150px', 10);
            setTimeout(() => selectors.forEach( el => {el.style.visibility = 'visible'}), 100);
        } 
        else {
            //Скрыть левую панель
            brgMenu.classList.toggle('active');
            leftSide.style.width = '0px';        
            setTimeout(() => selectors.forEach( el => {el.style.visibility = 'hidden'}), 100);
            setTimeout(() => {leftSide.classList.add('hide');}, 300);
            }
        });

// Активное смещение бургера по размеру левой панели 
let realBurgPosition = (leftSide.offsetWidth / 2) - 8 + "px";
    brgMenu.style.marginLeft = realBurgPosition;

// Панель добавления проекта и сотрудника 
let rightPanel = document.querySelector('.rightPanel');
let addProjectPanel = document.querySelector('.addProjectPanel');
let addEmployeesPanel = document.querySelector('.addEmployeesPanel');
let addEmployeesBtn = document.getElementById('addEmployeesBtn');
let addProjectBtn = document.getElementById('addProjectBtn');
let panelCancelBtn  = document.querySelectorAll("[id='panelCancelBtn']");

    //Кнопка закрытия панелей добавления сотрудников и проектов
    for (let i = 0; i < panelCancelBtn.length; i++){
        panelCancelBtn[i].onclick = function () {
            rightPanel.style.display = 'none';
            addProjectPanel.style.display = 'none';
            addEmployeesPanel.style.display = 'none';
        }
    };

    //Кнопка открытия панели по добавлению проекта
    addProjectBtn.addEventListener('click', function() {
        rightPanel.style.display = 'block';
        addProjectPanel.style.display = 'block';
    });

    //Кнопка открытия панели по добавлению сотрудника
    addEmployeesBtn.addEventListener('click', function() {
        rightPanel.style.display = 'block';
        addEmployeesPanel.style.display = 'block';
    });

// Переключатель выделения в навигаторе 
let nav = document.querySelectorAll('.nav-item');
let projectContent = document.querySelector('.projectContent');
let employeesContent = document.querySelector('.employeesContent');

    //Контроль нажатия на кнопки навигатора проекта и сотрудников
    for (let i = 0; i < nav.length; i++){
    nav[i].onclick = function() {
        [...nav].forEach(el => el.classList.remove('active')); //Убрать все классы
        this.classList.add('active'); //Присвоить класс
        
        // Включение экрана проектов
        if (this.textContent == 'Projects'){
            projectContent.style.display = 'block';
            employeesContent.style.display = 'none';  
        };

        // Включения экрана сотрудников 
        if (this.textContent == 'Employees') {
            projectContent.style.display = 'none';
            employeesContent.style.display = 'block';
        };
    }};

    // Калькулятор количества лет 
    function ageCalc(dob){
        let db = new Date(dob); //Преобразование ДР в мс
        let td = new Date(); //Текущая дата
        let ageInMs = td - db; //Разница с текущей датой
        let ageinYears = Math.floor(ageInMs / (365 * 24 * 60 * 60 * 1000));
        return ageinYears;
    };
*/