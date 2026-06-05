import { Job } from '../models/Job.js';
import { memoryStore } from '../store/memoryStore.js';
import { createId, toClientId } from '../utils/ids.js';

export async function createJob(input) {
  if (memoryStore.enabled) {
    const job = { id: createId(), status: 'open', ...input, createdAt: new Date() };
    memoryStore.jobs.push(job);
    return toClientId(job);
  }
  const job = await Job.create(input);
  return toClientId(job.toObject());
}

export async function listJobs() {
  if (memoryStore.enabled) {
    return memoryStore.jobs.map(toClientId);
  }
  const jobs = await Job.find().sort({ createdAt: -1 }).lean();
  return jobs.map(toClientId);
}

export async function findJobById(id) {
  if (memoryStore.enabled) {
    const job = memoryStore.jobs.find((item) => item.id === id);
    return job ? toClientId(job) : null;
  }
  const job = await Job.findById(id).lean();
  return job ? toClientId(job) : null;
}
