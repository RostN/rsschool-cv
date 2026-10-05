const fs = require('fs');

const readStream = fs.createReadStream('01-read-file/text.txt', { encoding: 'utf8' });

readStream.on('data', (chunk) => {
  // Вывод строки
  process.stdout.write(chunk);
  // Отступ в конце
  console.log('\n'); 
});

readStream.on('error', (err) => {
  console.error('Ошибка при чтении файла:', err);
});