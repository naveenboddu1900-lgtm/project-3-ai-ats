import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: 'Full-time' },
    description: { type: String, required: true },
    skills: [{ type: String }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
