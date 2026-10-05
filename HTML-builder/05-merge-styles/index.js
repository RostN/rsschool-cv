const fs = require('fs').promises;
const path = require('path');

// Пути
const baseDir = __dirname;
const sourceDir = path.join(baseDir, 'styles');
const destDir = path.join(baseDir, 'project-dist');
const outputFile = path.join(destDir, 'bundle.css');

async function compileStyles() {
  try {
    // Проверяем, существует ли папка styles
    const srcStats = await fs.stat(sourceDir);
    if (!srcStats.isDirectory()) {
      throw new Error(`Папка "${sourceDir}" не найдена.`);
    }

    // Создаем папку project-dist, если её нет
    await fs.mkdir(destDir, { recursive: true });

    // Получаем список файлов из styles
    const files = await fs.readdir(sourceDir);

    const cssFiles = [];

    // Фильтруем только .css файлы 
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const stats = await fs.stat(filePath);

      // Пропускаем, если это не файл
      if (!stats.isFile()) continue;

      const ext = path.extname(file).toLowerCase();
      if (ext === '.css') {
        cssFiles.push(filePath);
      }
    }

    if (cssFiles.length === 0) {
      console.log('CSS файлы не найдены в папке styles. Создан пустой bundle.css.');
      await fs.writeFile(outputFile, '');
      return;
    }

    // Читаем содержимое всех CSS файлов параллельно
    const contents = await Promise.all(
      cssFiles.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf8');
        // Добавляем разделитель, чтобы стили из разных файлов не слипались
        return content + '\n'; 
      })
    );

    // Объединяем все стили в одну строку
    const bundleContent = contents.join('');

    // Записываем итоговый файл (перезаписывает, если уже существует)
    await fs.writeFile(outputFile, bundleContent, 'utf8');

    console.log(`Успешно скомпилировано ${cssFiles.length} файлов в ${outputFile}`);

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Ошибка: Папка "styles" не найдена.');
    } else {
      console.error('Произошла ошибка:', err.message);
    }
    throw err;
  }
}

compileStyles();