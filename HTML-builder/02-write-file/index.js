const fs = require('fs');
const readline = require('readline');

// Имя файла для записи
const fileName = '02-write-file/text.txt';

// Создаём поток записи, 'a' означает дописывать, чтобы не стирать старое содержимое
const writeStream = fs.createWriteStream(fileName, { flags: 'a', encoding: 'utf8' });

writeStream.on('error', (err) => {
    process.stderr.write('\nОшибка при записи в файл: ' + err.message + '\n');
});

// Флаг защиты от повторного вызова
let isShuttingDown = false;

// Интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
    terminal: true
});

// Приветственное сообщение
console.log('\nВводите строки. Чтобы завершить, напишите "exit" или нажмите Ctrl+C');
console.log('Enter the lines. To exit, type "exit" or press Ctrl+C\n');
rl.prompt();

function shutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

    process.stderr.write('\n\nРабота завершена\n');
    process.stderr.write('The work is completed\n\n');

    // Закрываем поток записи
    writeStream.end(() => {
        rl.close();
        // Принудительно завершаем процесс, чтобы он не завис
        process.exit(0);
    });
}

// Обработка ввода пользователя
rl.on('line', (input) => {
    if (!isShuttingDown && input.trim().toLowerCase() === 'exit') {
        shutdown();
        return;
    }

    if (!isShuttingDown) {
        writeStream.write(input + '\n');
        rl.prompt();
    }
});

rl.on('error', (err) => {
    process.stderr.write('\nОшибка ввода: ' + err.message + '\n');
    shutdown();
});

// Перехватываем Ctrl+C
rl.on('SIGINT', () => {
    rl.pause(); // Останавливаем ввод, чтобы избежать конфликтов
    shutdown();
});

// Перехватываем глобальный SIGINT 
process.on('SIGINT', () => {
    shutdown();
});

process.on('SIGTERM', shutdown);