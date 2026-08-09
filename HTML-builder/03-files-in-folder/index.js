const fs = require('fs');
const path = require('path');

// Путь к проверяемой папке secret-folder
const folderPath = path.join(__dirname, 'secret-folder');

try {
  // Чтение содержимое папки
  const files = fs.readdirSync(folderPath);

  if (files.length === 0) {
    console.log('В папке нет файлов.');
    process.exit(0);
  }

  // Проходимся по каждому файлу
  files.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);

    // Проверяем, что это именно файл, а не папка
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return; 
    }

    // Разделяем имя и расширение
    const nameParts = fileName.split('.');
    let name = nameParts[0];
    let extension = '';

    if (nameParts.length > 1) {
      extension = nameParts.pop(); 
      name = nameParts.join('.'); 
    } else {
      extension = ''; 
    }

    const sizeBytes = stats.size;

    // Вывод по шаблону: <name> - <ext> - <size>
    console.log(`${name} - ${extension} - ${sizeBytes} kb`);
  });

} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Ошибка: Папка "${folderPath}" не найдена!`);
  } else {
    console.error('Ошибка:', err.message);
  }
  process.exit(1);
}