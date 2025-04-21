import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import messagesRoutes from './messages.js';
import verifyToken from './verifyToken.js';
import db from './db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

// Socket.IO connection
io.use(verifyToken);

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.username);

  socket.on('chat message', (msg) => {
    const { id, username } = socket.user;
    db.query('INSERT INTO messages (user_id, content) VALUES (?, ?)', [id, msg], (err) => {
      if (err) return console.error('DB insert error:', err);
      io.emit('chat message', { user: username, content: msg });
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
