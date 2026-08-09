const fs = require('fs').promises;
const path = require('path');

// Пути
const baseDir = __dirname;
const sourceDir = path.join(baseDir, 'styles');
const destDir = path.join(baseDir, 'project-dist');
const outputFile = path.join(destDir, 'style.css');

/* Модуль слияния стилей */ 

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
compileStyles(); // Запуск слияния стилей

/* Модуль копирования папок */
const sourceFolder = path.join(baseDir, 'assets');
const targetFolder = path.join(destDir, 'assets');

copyDir(sourceFolder, targetFolder)
  .catch(() => process.exit(1));

async function copyDir(sourceDir, targetDir) {
  try {
    // Проверяем, что исходная папка существует
    const srcStats = await fs.stat(sourceDir);
    if (!srcStats.isDirectory()) {
      throw new Error(`Путь "${sourceDir}" не является директорией.`);
    }

    // Создаём целевую папку (если нет)
    await fs.mkdir(targetDir, { recursive: true });

    const sourceItems = await fs.readdir(sourceDir);

    // Массив для параллельного ожидания операций копирования подпапок
    const subDirOperations = [];

    // Копируем всё содержимое (файлы и папки)
    for (const item of sourceItems) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        // Рекурсивно копируем подпапку
        subDirOperations.push(copyDir(sourcePath, targetPath));
      } else if (stats.isFile()) {
        // Копируем файл
        const data = await fs.readFile(sourcePath);
        await fs.writeFile(targetPath, data);
        console.log(`Скопировано: ${item}`);
      }
    }

    // Ждём завершения всех рекурсивных копий подпапок
    await Promise.all(subDirOperations);

    // Синхронизация: удаляем из целевой то, чего нет в исчтонике
    const targetItems = await fs.readdir(targetDir);

    for (const item of targetItems) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);

      try {
        await fs.stat(sourcePath); // Проверяем существование в исходной
      } catch (err) {
        if (err.code === 'ENOENT') {
          // Элемента нет в исходной, то удаляем из целевой
          const targetStats = await fs.stat(targetPath);
          if (targetStats.isDirectory()) {
            await fs.rm(targetPath, { recursive: true, force: true });
            console.log(`Удалена папка: ${item}`);
          } else {
            await fs.unlink(targetPath);
            console.log(`Удален файл: ${item}`);
          }
        } else {
          throw err;
        }
      }
    }

    console.log('\nСинхронизация завершена / Synchronization completed');

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Ошибка: Папка "${sourceFolder}" не найдена.`);
    } else {
      console.error('ERROR:', err.message);
    }
    throw err;
  }
}

/* Модуль сборки HTML */
const templatePath = path.join(baseDir, 'template.html');
const componentsDir = path.join(baseDir, 'components');
const outputPath = path.join(destDir, 'index.html');

async function buildSite() {
  try {
    // Создаем папку назначения, если её нет
    await fs.mkdir(destDir, { recursive: true });

    // Читаем основной шаблон
    const templateContent = await fs.readFile(templatePath, 'utf8');
    
    // Ищем в template.html строки формата {{имя модуля}}
    // \w+ означает буквы, цифры и подчеркивание. 
    // Флаг 'g' (global) ищет все совпадения в строке.
    const regex = /\{\{(\w+)\}\}/g;
    
    let finalContent = templateContent;
    let match;

    // Проходим по всем найденным тегам
    while ((match = regex.exec(finalContent)) !== null) {
      const componentName = match[1]; // Имя компонента
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        // Пытаемся прочитать файл компонента
        const componentContent = await fs.readFile(componentPath, 'utf8');
        
        // Заменяем тег на содержимое файла
        finalContent = finalContent.replace(
          new RegExp(`\\{\\{${componentName}\\}\\}`, 'g'), 
          componentContent
        );
        
        console.log(`Установлен компонент: ${componentName}`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn(`Ошибка: Компонент "${componentName}" не найден (файл ${componentPath} отсутствует). Тег оставлен как есть.`);
          // Мы не выбрасываем ошибку, а просто оставляем тег, чтобы сборка не падала
        } else {
          throw err;
        }
      }
    }

    // Сохраняем итоговый файл
    await fs.writeFile(outputPath, finalContent, 'utf8');
    console.log(`\nСборка завершена! Файл сохранен: ${outputPath}`);

  } catch (err) {
    if (err.code === 'ENOENT' && err.path === templatePath) {
      console.error(`Ошибка: Файл шаблона "${templatePath}" не найден.`);
    } else {
      console.error('Произошла критическая ошибка:', err.message);
    }
    process.exit(1);
  }
}

buildSite();