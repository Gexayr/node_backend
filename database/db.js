const mysql = require('mysql2');

// Создание подключения к базе данных
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'rabbit_game'
});

// Проверка подключения к базе данных
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Успешное подключение к базе данных');
});

// Экспорт подключения к базе данных для использования в других модулях
module.exports = connection;
