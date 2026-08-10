const fs = require('fs').promises;
const path = require('path');

// Формируем абсолютный путь к папке относительно текущего рабочего каталога (где запущен скрипт)
const folderPath = path.join(process.cwd(), '03-files-in-folder', 'secret-folder');

async function listFiles() {
  try {
    // Читаем содержимое папки
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    // Проходим по каждому элементу
    for (const entry of entries) {
      // Проверяем, является ли элемент именно файлом
      if (entry.isFile()) {
        // Получаем полную информацию о файле
        const stats = await fs.stat(path.join(folderPath, entry.name));
        
        // Формируем строку вывода: <file name>-<file extension>-<file size>
        const nameWithoutExt = path.basename(entry.name, path.extname(entry.name));
        const ext = path.extname(entry.name).replace('.', ''); // Убираем точку из расширения
        
        console.log(`${nameWithoutExt} - ${ext} - ${stats.size} Kb`);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Ошибка: Папка "${folderPath}" не найдена.`);
    } else {
      console.error('Произошла ошибка:', error.message);
    }
  }
}

listFiles();