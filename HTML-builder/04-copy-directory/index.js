const fs = require('fs').promises;
const path = require('path');

const currentDir = __dirname; 
const sourceFolder = path.join(currentDir, 'files');
const targetFolder = path.join(currentDir, 'files-copy');

copyDir(sourceFolder, targetFolder)
  .catch(() => process.exit(1));

async function copyDir(sourceDir, targetDir) {
  try {
    // Получаем список файлов из исходной папки, если папки нет, появится ошибка ENOENT, обработаем её ниже
    const sourceFiles = await fs.readdir(sourceDir);

    // Создание целевой папку, если она не существует
    await fs.mkdir(targetDir, { recursive: true });

    // Копирование (или обновление) существующих файлов
    
    for (const fileName of sourceFiles) {
      const sourcePath = path.join(sourceDir, fileName);
      const targetPath = path.join(targetDir, fileName);

      // Проверяем, что это файл 
      const stats = await fs.stat(sourcePath);
      if (!stats.isFile()) {
        console.log(`Пропущено (не файл): ${fileName}`);
        continue;
      }

      // Читаем файл и сразу пишем его в новую папку
      const data = await fs.readFile(sourcePath);
      await fs.writeFile(targetPath, data);      
      console.log(`Копирование завершено / Copying completed : ${fileName}`);
    }

    // Получаем текущий список файлов в целевой папке
    const targetFiles = await fs.readdir(targetDir);

    for (const fileName of targetFiles) {
      // Если файла нет в исходном списке sourceFiles, значит он был удален из source
      if (!sourceFiles.includes(fileName)) {
        const targetPath = path.join(targetDir, fileName);
        await fs.unlink(targetPath); // Удаляем файл
        console.log(`Удален: ${fileName}`);
      }
    }

    console.log('\nСинхронизация завершена / Synchronization completed ');

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Ошибка: Папка "${sourceDir}" не найдена / Error: Folder "${sourceDir}" not found`);
    } else {
      console.error('ERROR:', err.message);
    }
    throw err; // Пробрасываем ошибку дальше, чтобы процесс завершился с кодом ошибки
  }
}