import mysql from 'mysql2';

const db = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "god10",
  database: "chat_db",
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

export default db;
