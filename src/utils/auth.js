// utils/auth.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  );
}

export function getUserFromToken(token) {
  try {
    if (token) {
      return jwt.verify(token, SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
}


