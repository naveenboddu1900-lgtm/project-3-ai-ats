import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    resumeName: { type: String, default: '' },
    resumeText: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    stage: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offered'], default: 'Applied' },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    matchScore: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    analysis: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
