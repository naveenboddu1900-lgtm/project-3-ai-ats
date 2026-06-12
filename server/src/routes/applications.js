import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  createApplication,
  findApplicationById,
  listApplications,
  updateApplicationStage
} from '../repositories/applications.js';
import { findJobById, listJobs } from '../repositories/jobs.js';
import { analyzeCandidate } from '../services/aiMatcher.js';
import { sendStatusEmail } from '../services/emailService.js';
import { extractResumeText } from '../services/resumeParser.js';
import { persistResume } from '../services/storageService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const applicationsRouter = express.Router();

applicationsRouter.use(requireAuth);

applicationsRouter.post('/', upload.single('resume'), async (req, res) => {
  const schema = z.object({
    jobId: z.string().min(1),
    coverLetter: z.string().optional().default('')
  });
  const payload = schema.parse(req.body);
  const job = await findJobById(payload.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found.' });

  const [resumeText, storedResume] = await Promise.all([extractResumeText(req.file), persistResume(req.file)]);
  const analysis = await analyzeCandidate({ job, resumeText, coverLetter: payload.coverLetter });
  const application = await createApplication({
    jobId: job.id,
    candidateId: req.user.id,
    candidateName: req.user.name,
    candidateEmail: req.user.email,
    resumeName: storedResume.name,
    resumeText,
    coverLetter: payload.coverLetter,
    ...analysis
  });

  res.status(201).json({ application });
});

applicationsRouter.get('/pipeline', requireRole('recruiter'), async (_req, res) => {
  const [applications, jobs] = await Promise.all([listApplications(), listJobs()]);
  const stages = { Applied: [], Screening: [], Interview: [], Offered: [] };

  for (const application of applications) {
    const job = jobs.find((item) => String(item.id) === String(application.jobId));
    stages[application.stage] ||= [];
    stages[application.stage].push({ ...application, jobTitle: job?.title || 'Archived job' });
  }

  res.json({ stages });
});

applicationsRouter.get('/ranking', requireRole('recruiter'), async (_req, res) => {
  const [applications, jobs] = await Promise.all([listApplications(), listJobs()]);
  const enriched = applications
    .map((application) => {
      const job = jobs.find((item) => String(item.id) === String(application.jobId));
      return { ...application, jobTitle: job?.title || 'Archived job' };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const skills = [...new Set(enriched.flatMap((application) => application.skills))].sort();
  res.json({ applications: enriched, skills });
});

applicationsRouter.patch('/:id/stage', requireRole('recruiter'), async (req, res) => {
  const schema = z.object({ stage: z.enum(['Applied', 'Screening', 'Interview', 'Offered']) });
  const { stage } = schema.parse(req.body);
  const application = await updateApplicationStage(req.params.id, stage);
  if (!application) return res.status(404).json({ message: 'Application not found.' });
  res.json({ application });
});

applicationsRouter.post('/:id/notify', requireRole('recruiter'), async (req, res) => {
  const application = await findApplicationById(req.params.id);
  if (!application) return res.status(404).json({ message: 'Application not found.' });
  const result = await sendStatusEmail(application);
  res.json({ result });
});
