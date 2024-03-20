const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'rabbit_game',
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0 // Unlimited queueing
});

// Export the pool for use in other modules
module.exports = pool;
