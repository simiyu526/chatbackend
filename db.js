import mysql from 'mysql2';

const db = mysql.createConnection({
  host:"mysql-chat-db.alwaysdata.net",
  user: "chat-db",
  password: "godjesus10",
  database: "chat-db_chat",
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

export default db;
