const fs = require('fs');
const path = require('path');

// Пути относительно папки, где лежит этот скрипт
const baseDir = __dirname;
const sourceFolder = path.join(baseDir, 'styles');
const distFolder = path.join(baseDir, 'project-dist');
const outputFile = path.join(distFolder, 'bundle.css');

try {
  // Проверка существование папки styles
  if (!fs.existsSync(sourceFolder)) {
    console.error(`Папка "${sourceFolder}" не найдена!`);
    process.exit(1);
  }

  // Создаем папку project-dist, если её нет
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
    console.log(`Папка "${distFolder}" создана.`);
  }

  // Читаем имена файлов в папке styles
  const files = fs.readdirSync(sourceFolder);

  let cssContent = '';
  let fileCount = 0;

  files.forEach((fileName) => {
    const filePath = path.join(sourceFolder, fileName);

    // Проверяем, файл ли это
    const stats = fs.statSync(filePath);
    
    // Игнорируем подкаталоги и файлы без расширения .css
    if (!stats.isFile() || !fileName.endsWith('.css')) {
      return;
    }

    // Читаем содержимое файла
    const fileData = fs.readFileSync(filePath, 'utf8');
    
    // Слепляем файлы и добавляем перенос срок, чтобы стили не слипалист
    cssContent += fileData + '\n';
    fileCount++;
  });

   if (fileCount === 0) {
    console.warn(`В папке "${sourceFolder}" не найдено .css файлов.`);
  } else {
    // Записываем объединенный контент в bundle.css \перезаписывает файл
    fs.writeFileSync(outputFile, cssContent);
    console.log(`Объединено ${fileCount} файлов.`);
    console.log(`Создан файл: ${outputFile}`);
  }

} catch (err) {
  console.error('Ошибка:', err.message);
  process.exit(1);
}