import mysql from 'mysql2/promise';

let connection = null;

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
          rejectUnauthorized: false
        }
      });
      console.log('Connected to MySQL database');
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      throw error;
    }
  }
  return connection;
}

export async function closeConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}
