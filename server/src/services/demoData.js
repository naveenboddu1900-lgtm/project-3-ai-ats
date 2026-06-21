import { createApplication, listApplicationsByCandidate } from '../repositories/applications.js';
import { createJob, listJobs } from '../repositories/jobs.js';
import { createUser, findUserByEmail } from '../repositories/users.js';
import { memoryStore } from '../store/memoryStore.js';

export async function seedDemoData() {
  const recruiter = await findUserByEmail('recruiter@asswap.dev') || await createUser({
    name: 'AS SWAP Recruiter',
    email: 'recruiter@asswap.dev',
    password: 'Password@123',
    role: 'recruiter'
  });

  const candidate = await findUserByEmail('candidate@asswap.dev') || await createUser({
    name: 'Naveen Candidate',
    email: 'candidate@asswap.dev',
    password: 'Password@123',
    role: 'candidate'
  });

  const demoJobs = [
    {
      title: 'Frontend React Engineer',
      department: 'Product Engineering',
      location: 'Hyderabad',
      type: 'Full-time',
      description: 'Build recruiter and candidate experiences with React, API integrations, accessibility, and production-ready UI systems.',
      skills: ['React', 'JavaScript', 'REST APIs', 'Material UI']
    },
    {
      title: 'Node.js Backend Engineer',
      department: 'Platform',
      location: 'Bengaluru',
      type: 'Full-time',
      description: 'Own Express APIs, MongoDB models, authentication, document workflows, and AI service integrations for the hiring platform.',
      skills: ['Node.js', 'Express', 'MongoDB', 'JWT']
    },
    {
      title: 'AI Resume Parsing Specialist',
      department: 'Machine Intelligence',
      location: 'Remote India',
      type: 'Contract',
      description: 'Improve resume extraction, skill normalization, scoring prompts, and structured candidate summaries for recruiter review.',
      skills: ['Python', 'OpenAI', 'Gemini', 'MongoDB']
    },
    {
      title: 'Talent Operations Manager',
      department: 'People Operations',
      location: 'Pune',
      type: 'Full-time',
      description: 'Manage applicant pipelines, interview coordination, candidate communication, and hiring process reporting across teams.',
      skills: ['Recruiting', 'Analytics', 'Communication', 'Process Design']
    },
    {
      title: 'Cloud Storage Engineer',
      department: 'Infrastructure',
      location: 'Chennai',
      type: 'Full-time',
      description: 'Build secure resume storage, signed upload workflows, access policies, and audit-friendly document retention practices.',
      skills: ['AWS', 'S3', 'Node.js', 'Security']
    },
    {
      title: 'QA Automation Engineer',
      department: 'Quality Engineering',
      location: 'Noida',
      type: 'Full-time',
      description: 'Create automated test coverage for authentication, job posting, application submission, ranking filters, and pipeline movement.',
      skills: ['JavaScript', 'API Testing', 'Playwright', 'CI']
    }
  ];

  const existingJobs = await listJobs();
  for (const job of demoJobs) {
    const alreadyExists = existingJobs.some((existingJob) => existingJob.title === job.title);
    if (!alreadyExists) {
      await createJob({
        ...job,
        status: 'open',
        recruiterId: recruiter.id
      });
    }
  }

  const applications = await listApplicationsByCandidate(candidate.id);
  if (!applications.length) {
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
  }

  if (memoryStore.enabled) {
    console.log('Demo users, jobs, and applications seeded.');
  }
}
