import mongoose from 'mongoose';
import { config } from '../config.js';
import { memoryStore } from '../store/memoryStore.js';

export async function connectDatabase() {
  if (!config.mongodbUri) {
    memoryStore.enabled = true;
    console.log('MongoDB URI not set. Using in-memory demo store.');
    return;
  }

  await mongoose.connect(config.mongodbUri);
  memoryStore.enabled = false;
  console.log('Connected to MongoDB.');
}
