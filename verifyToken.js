import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error('Authentication error: Token missing'));

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
};

export default verifyToken;
