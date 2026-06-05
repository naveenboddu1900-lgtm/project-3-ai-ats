import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { memoryStore } from '../store/memoryStore.js';
import { createId, toClientId } from '../utils/ids.js';

export async function createUser(input) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  if (memoryStore.enabled) {
    const user = { id: createId(), name: input.name, email: input.email, role: input.role, passwordHash };
    memoryStore.users.push(user);
    return toClientId(user);
  }
  const user = await User.create({ ...input, passwordHash, password: undefined });
  return toClientId(user.toObject());
}

export async function findUserByEmail(email) {
  if (memoryStore.enabled) {
    const user = memoryStore.users.find((item) => item.email === email);
    return user ? toClientId(user) : null;
  }
  const user = await User.findOne({ email }).lean();
  return user ? toClientId(user) : null;
}

export async function findUserById(id) {
  if (memoryStore.enabled) {
    const user = memoryStore.users.find((item) => item.id === id);
    return user ? toClientId(user) : null;
  }
  const user = await User.findById(id).lean();
  return user ? toClientId(user) : null;
}
