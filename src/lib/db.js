import mysql from 'mysql2/promise';

let connection = null;

async function connectDB() {
  if (connection) return connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
      port: process.env.port
    });
    
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export default connectDB; 