const fs = require('fs').promises;
const path = require('path');

const currentDir = __dirname; 
const sourceFolder = path.join(currentDir, 'files');
const targetFolder = path.join(currentDir, 'files-copy');

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