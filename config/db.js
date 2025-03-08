const mysql = require('mysql2');




const pool = mysql.createPool({
   host: process.env.MYSQL_HOST || 'localhost',
   user: process.env.MYSQL_USER || 'root',
   password: process.env.MYSQL_PASSWORD || '',
   database: process.env.MYSQL_DATABASE || 'reddit_clone',
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
 });

 function handleDisconnect(pool) {
    pool.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost. Attempting to reconnect...');
            setTimeout(() => {
                handleDisconnect(pool);
            }, 2000);
        } else {
            throw err;
        }
    });
}
 

 handleDisconnect(pool);
 

 module.exports = pool;