import { Application } from '../models/Application.js';
import { memoryStore } from '../store/memoryStore.js';
import { createId, toClientId } from '../utils/ids.js';

export async function createApplication(input) {
  if (memoryStore.enabled) {
    const application = { id: createId(), stage: 'Applied', ...input, createdAt: new Date() };
    memoryStore.applications.push(application);
    return toClientId(application);
  }
  const application = await Application.create(input);
  return toClientId(application.toObject());
}

export async function listApplications() {
  if (memoryStore.enabled) {
    return memoryStore.applications.map(toClientId);
  }
  const applications = await Application.find().sort({ matchScore: -1 }).lean();
  return applications.map(toClientId);
}

export async function listApplicationsByCandidate(candidateId) {
  const applications = await listApplications();
  return applications.filter((item) => String(item.candidateId) === String(candidateId));
}

export async function updateApplicationStage(id, stage) {
  if (memoryStore.enabled) {
    const application = memoryStore.applications.find((item) => item.id === id);
    if (!application) return null;
    application.stage = stage;
    application.updatedAt = new Date();
    return toClientId(application);
  }
  const application = await Application.findByIdAndUpdate(id, { stage }, { new: true }).lean();
  return application ? toClientId(application) : null;
}

export async function findApplicationById(id) {
  if (memoryStore.enabled) {
    const application = memoryStore.applications.find((item) => item.id === id);
    return application ? toClientId(application) : null;
  }
  const application = await Application.findById(id).lean();
  return application ? toClientId(application) : null;
}
