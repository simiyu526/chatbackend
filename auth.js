import express from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';
import dotenv from 'dotenv';
import jwt2 from 'jwt-simple';

dotenv.config();

const router = express.Router();

// ✅ Create `users` table if it doesn't exist
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(createUsersTableQuery, (err) => {
  if (err) {
    console.error('Failed to create users table:', err);
  } else {
    console.log('Users table ready!');
  }
});

// 🚀 Register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).send('Database error');
    if (result.length > 0) return res.status(400).send('Username already taken');

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) return res.status(500).send('Error registering user');
      res.status(200).send('User registered successfully');
    });
  });
});

// 🔐 Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) return res.status(500).send('Database error');
    if (result.length === 0) return res.status(400).send('Invalid credentials');

    const user = result[0];
    const token = jwt2.encode({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

export default router;
