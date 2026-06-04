import { randomUUID } from 'crypto';

export function createId() {
  return randomUUID();
}

export function toClientId(record) {
  return {
    ...record,
    id: String(record._id || record.id)
  };
}
