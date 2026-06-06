import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';
import { findUserByEmail } from '../repositories/users.js';

export const authRouter = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post('/login', async (req, res) => {
  const credentials = loginSchema.parse(req.body);
  const user = await findUserByEmail(credentials.email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

  const valid = await bcrypt.compare(credentials.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

  const token = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
