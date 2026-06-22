import axios from 'axios';

const staticDemo = import.meta.env.VITE_STATIC_DEMO === 'true';

export const api = axios.create({
  baseURL: staticDemo ? '/' : import.meta.env.VITE_API_URL || '/api',
  adapter: staticDemo ? demoAdapter : undefined
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atsToken');
      localStorage.removeItem('atsUser');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

const demoUsers = [
  {
    id: 'candidate-demo',
    name: 'Naveen Candidate',
    email: 'candidate@asswap.dev',
    password: 'Password@123',
    role: 'candidate'
  },
  {
    id: 'recruiter-demo',
    name: 'AS SWAP Recruiter',
    email: 'recruiter@asswap.dev',
    password: 'Password@123',
    role: 'recruiter'
  }
];

const demoJobs = [
  {
    id: 'frontend-react-engineer',
    title: 'Frontend React Engineer',
    department: 'Product Engineering',
    location: 'Hyderabad',
    type: 'Full-time',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Build recruiter and candidate experiences with React, API integrations, accessibility, and production-ready UI systems.',
    skills: ['React', 'JavaScript', 'REST APIs', 'Material UI']
  },
  {
    id: 'node-backend-engineer',
    title: 'Node.js Backend Engineer',
    department: 'Platform',
    location: 'Bengaluru',
    type: 'Full-time',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Own Express APIs, MongoDB models, authentication, document workflows, and AI service integrations for the hiring platform.',
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT']
  },
  {
    id: 'ai-resume-parser',
    title: 'AI Resume Parsing Specialist',
    department: 'Machine Intelligence',
    location: 'Remote India',
    type: 'Contract',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Improve resume extraction, skill normalization, scoring prompts, and structured candidate summaries for recruiter review.',
    skills: ['Python', 'OpenAI', 'Gemini', 'MongoDB']
  },
  {
    id: 'talent-operations-manager',
    title: 'Talent Operations Manager',
    department: 'People Operations',
    location: 'Pune',
    type: 'Full-time',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Manage applicant pipelines, interview coordination, candidate communication, and hiring process reporting across teams.',
    skills: ['Recruiting', 'Analytics', 'Communication', 'Process Design']
  },
  {
    id: 'cloud-storage-engineer',
    title: 'Cloud Storage Engineer',
    department: 'Infrastructure',
    location: 'Chennai',
    type: 'Full-time',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Build secure resume storage, signed upload workflows, access policies, and audit-friendly document retention practices.',
    skills: ['AWS', 'S3', 'Node.js', 'Security']
  },
  {
    id: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    department: 'Quality Engineering',
    location: 'Noida',
    type: 'Full-time',
    status: 'open',
    recruiterId: 'recruiter-demo',
    description: 'Create automated test coverage for authentication, job posting, application submission, ranking filters, and pipeline movement.',
    skills: ['JavaScript', 'API Testing', 'Playwright', 'CI']
  }
];

const demoSeedApplications = [
  {
    id: 'application-demo-frontend',
    stage: 'Applied',
    jobId: 'frontend-react-engineer',
    candidateId: 'candidate-demo',
    candidateName: 'Naveen Candidate',
    candidateEmail: 'candidate@asswap.dev',
    resumeName: 'naveen-resume.pdf',
    resumeText: 'React JavaScript Material UI REST APIs accessibility dashboards 4 years',
    coverLetter: 'I enjoy building useful recruiting software.',
    skills: ['React', 'JavaScript', 'REST APIs', 'Material UI'],
    experienceYears: 4,
    matchScore: 92,
    summary: 'Strong frontend match with dashboard, API, and component-system experience.',
    createdAt: new Date().toISOString()
  }
];

function getDemoState() {
  const stored = localStorage.getItem('atsStaticDemoState');
  if (stored) return JSON.parse(stored);
  const state = { jobs: demoJobs, applications: demoSeedApplications };
  localStorage.setItem('atsStaticDemoState', JSON.stringify(state));
  return state;
}

function saveDemoState(state) {
  localStorage.setItem('atsStaticDemoState', JSON.stringify(state));
}

function currentDemoUser(config) {
  const token = String(config.headers?.Authorization || '').replace('Bearer ', '');
  const userId = token.replace('demo-token-', '');
  return demoUsers.find((user) => user.id === userId);
}

function publicJob(job, applications) {
  const related = applications.filter((application) => application.jobId === job.id);
  const averageScore = related.length
    ? Math.round(related.reduce((total, application) => total + application.matchScore, 0) / related.length)
    : 0;
  return {
    ...job,
    applicationCount: related.length,
    averageScore
  };
}

function enrichedApplication(application, jobs) {
  const job = jobs.find((item) => item.id === application.jobId);
  return { ...application, jobTitle: job?.title || 'Archived job' };
}

function analyzeDemoApplication(job, coverLetter) {
  const text = coverLetter.toLowerCase();
  const matchedRequired = job.skills.filter((skill) => text.includes(skill.toLowerCase()));
  const skills = matchedRequired.length ? matchedRequired : job.skills.slice(0, 2);
  const matchScore = Math.min(96, Math.max(64, 55 + matchedRequired.length * 10 + (coverLetter ? 5 : 0)));
  return {
    skills,
    experienceYears: Math.max(1, matchedRequired.length),
    matchScore,
    summary: `${matchScore}% demo match for ${job.title}, with evidence of ${skills.join(', ')}.`,
    analysis: {
      provider: 'static-demo',
      matchedRequired,
      requiredSkills: job.skills
    }
  };
}

function ok(config, data, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: {},
    config
  });
}

function fail(config, status, message) {
  return Promise.reject({
    response: {
      data: { message },
      status,
      statusText: 'Error',
      headers: {},
      config
    },
    config
  });
}

async function demoAdapter(config) {
  const method = String(config.method || 'get').toLowerCase();
  const url = new URL(config.url, window.location.origin);
  const path = url.pathname.replace(/^\/api/, '');
  const state = getDemoState();

  if (method === 'post' && path === '/auth/login') {
    const credentials = JSON.parse(config.data || '{}');
    const user = demoUsers.find((item) => item.email === credentials.email && item.password === credentials.password);
    if (!user) return fail(config, 401, 'Invalid email or password.');
    return ok(config, {
      token: `demo-token-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }

  const user = currentDemoUser(config);
  if (!user) return fail(config, 401, 'Missing authorization token.');

  if (method === 'get' && path === '/candidate/portal') {
    return ok(config, {
      jobs: state.jobs.filter((job) => job.status === 'open').map((job) => publicJob(job, state.applications)),
      applications: state.applications
        .filter((application) => application.candidateId === user.id)
        .map((application) => enrichedApplication(application, state.jobs))
    });
  }

  if (method === 'get' && path === '/jobs') {
    return ok(config, { jobs: state.jobs.map((job) => publicJob(job, state.applications)) });
  }

  if (method === 'post' && path === '/jobs') {
    const payload = JSON.parse(config.data || '{}');
    const job = {
      id: `${payload.title || 'job'}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      status: 'open',
      recruiterId: user.id,
      createdAt: new Date().toISOString(),
      ...payload
    };
    state.jobs.unshift(job);
    saveDemoState(state);
    return ok(config, { job: publicJob(job, state.applications) }, 201);
  }

  if (method === 'post' && path === '/applications') {
    const form = config.data;
    const jobId = form?.get?.('jobId') || '';
    const coverLetter = form?.get?.('coverLetter') || '';
    const resume = form?.get?.('resume');
    const job = state.jobs.find((item) => item.id === jobId);
    if (!job) return fail(config, 404, 'Job not found.');

    const application = {
      id: `application-${Date.now()}`,
      stage: 'Applied',
      jobId,
      candidateId: user.id,
      candidateName: user.name,
      candidateEmail: user.email,
      resumeName: resume?.name || '',
      resumeText: '',
      coverLetter,
      createdAt: new Date().toISOString(),
      ...analyzeDemoApplication(job, coverLetter)
    };
    state.applications.push(application);
    saveDemoState(state);
    return ok(config, { application }, 201);
  }

  if (method === 'get' && path === '/applications/pipeline') {
    const stages = { Applied: [], Screening: [], Interview: [], Offered: [] };
    for (const application of state.applications) {
      const enriched = enrichedApplication(application, state.jobs);
      stages[enriched.stage] ||= [];
      stages[enriched.stage].push(enriched);
    }
    return ok(config, { stages });
  }

  const stageMatch = path.match(/^\/applications\/([^/]+)\/stage$/);
  if (method === 'patch' && stageMatch) {
    const payload = JSON.parse(config.data || '{}');
    const application = state.applications.find((item) => item.id === stageMatch[1]);
    if (!application) return fail(config, 404, 'Application not found.');
    application.stage = payload.stage;
    saveDemoState(state);
    return ok(config, { application });
  }

  const notifyMatch = path.match(/^\/applications\/([^/]+)\/notify$/);
  if (method === 'post' && notifyMatch) {
    return ok(config, { result: { sent: true, provider: 'static-demo' } });
  }

  if (method === 'get' && path === '/applications/ranking') {
    const applications = state.applications
      .map((application) => enrichedApplication(application, state.jobs))
      .sort((a, b) => b.matchScore - a.matchScore);
    const skills = [...new Set(applications.flatMap((application) => application.skills))].sort();
    return ok(config, { applications, skills });
  }

  return fail(config, 404, 'Demo endpoint not found.');
}
