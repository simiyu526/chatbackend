import express from 'express';
import db from './db.js';

const router = express.Router();

// Get all messages
router.get('/', (req, res) => {
  db.query('SELECT messages.content, users.username FROM messages JOIN users ON messages.user_id = users.id', (err, result) => {
    if (err) return res.status(500).send('Database error');
    res.json(result);
  });
});

export default router;
