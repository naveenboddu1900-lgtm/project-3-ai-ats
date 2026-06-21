import { createApplication } from '../repositories/applications.js';
import { createJob, listJobs } from '../repositories/jobs.js';
import { createUser, findUserByEmail } from '../repositories/users.js';
import { memoryStore } from '../store/memoryStore.js';

export async function seedDemoData() {
  const existingRecruiter = await findUserByEmail('recruiter@asswap.dev');
  if (existingRecruiter) return;

  const recruiter = await createUser({
    name: 'AS SWAP Recruiter',
    email: 'recruiter@asswap.dev',
    password: 'Password@123',
    role: 'recruiter'
  });

  const candidate = await createUser({
    name: 'Naveen Candidate',
    email: 'candidate@asswap.dev',
    password: 'Password@123',
    role: 'candidate'
  });

  await createJob({
    title: 'Frontend React Engineer',
    department: 'Product Engineering',
    location: 'Hyderabad',
    type: 'Full-time',
    description: 'Build recruiter and candidate experiences with React, API integrations, accessibility, and production-ready UI systems.',
    skills: ['React', 'JavaScript', 'REST APIs', 'Material UI'],
    status: 'open',
    recruiterId: recruiter.id
  });

  await createJob({
    title: 'Node.js Backend Engineer',
    department: 'Platform',
    location: 'Bengaluru',
    type: 'Full-time',
    description: 'Own Express APIs, MongoDB models, authentication, document workflows, and AI service integrations for the hiring platform.',
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    status: 'open',
    recruiterId: recruiter.id
  });

  const [job] = await listJobs();
  await createApplication({
    jobId: job.id,
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    resumeName: 'naveen-resume.pdf',
    resumeText: 'React JavaScript Material UI REST APIs accessibility dashboards 4 years',
    coverLetter: 'I enjoy building useful recruiting software.',
    skills: ['React', 'JavaScript', 'REST APIs', 'Material UI'],
    experienceYears: 4,
    matchScore: 92,
    summary: 'Strong frontend match with dashboard, API, and component-system experience.',
    analysis: { source: 'demo-seed' }
  });

  if (memoryStore.enabled) {
    console.log('Demo users, jobs, and applications seeded.');
  }
}
