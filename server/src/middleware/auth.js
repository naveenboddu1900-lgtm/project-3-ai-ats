import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserById } from '../repositories/users.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ message: 'Missing authorization token.' });

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'You do not have access to this resource.' });
    }
    return next();
  };
}
