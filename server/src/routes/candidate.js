import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listApplicationsByCandidate } from '../repositories/applications.js';
import { listJobs } from '../repositories/jobs.js';

export const candidateRouter = express.Router();

candidateRouter.use(requireAuth, requireRole('candidate'));

candidateRouter.get('/portal', async (req, res) => {
  const [jobs, applications] = await Promise.all([
    listJobs(),
    listApplicationsByCandidate(req.user.id)
  ]);

  const enriched = applications.map((application) => {
    const job = jobs.find((item) => String(item.id) === String(application.jobId));
    return {
      ...application,
      jobTitle: job?.title || 'Archived job'
    };
  });

  res.json({
    jobs: jobs.filter((job) => job.status === 'open'),
    applications: enriched
  });
});
