import express from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listApplications } from '../repositories/applications.js';
import { createJob, listJobs } from '../repositories/jobs.js';

export const jobsRouter = express.Router();

const jobSchema = z.object({
  title: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  type: z.string().default('Full-time'),
  description: z.string().min(20),
  skills: z.array(z.string()).default([])
});

jobsRouter.use(requireAuth);

jobsRouter.get('/', async (_req, res) => {
  const [jobs, applications] = await Promise.all([listJobs(), listApplications()]);
  const enriched = jobs.map((job) => {
    const jobApplications = applications.filter((application) => String(application.jobId) === String(job.id));
    const averageScore = jobApplications.length
      ? Math.round(jobApplications.reduce((sum, application) => sum + application.matchScore, 0) / jobApplications.length)
      : 0;

    return {
      ...job,
      applicationCount: jobApplications.length,
      averageScore
    };
  });
  res.json({ jobs: enriched });
});

jobsRouter.post('/', requireRole('recruiter'), async (req, res) => {
  const payload = jobSchema.parse(req.body);
  const job = await createJob({ ...payload, recruiterId: req.user.id, status: 'open' });
  res.status(201).json({ job });
});
