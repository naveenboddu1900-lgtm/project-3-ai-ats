# Project 3: AI-Powered Applicant Tracking System

An intelligent HR platform for managing job openings, candidate applications, resume uploads, AI-assisted skill extraction, ranked applicant shortlists, interview pipelines, and recruiter communication.

## Tech Stack

- Frontend: React, React Query, Material UI, Vite
- Backend: Node.js, Express.js, JWT auth, Multer uploads
- Database: MongoDB with Mongoose, with an in-memory fallback for local demos
- AI and files: OpenAI/Gemini-ready service layer, PDF/DOCX text extraction hooks
- Integrations: AWS S3-ready storage adapter and Nodemailer-ready email service

## Local Setup

```bash
npm install
cp server/.env.example server/.env
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Demo Credentials

- Recruiter: `recruiter@zaalima.dev` / `Password@123`
- Candidate: `candidate@zaalima.dev` / `Password@123`

## Project Timeline

- Week 1: Auth portals, data model, job management, recruiter dashboard
- Week 2: Resume uploads, candidate submissions, Kanban application pipeline
- Week 3: Resume parsing, AI match scoring, MongoDB result mapping
- Week 4: Ranking filters, communication automations, security checks, deployment readiness

## Production Notes

Set these environment variables in production:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
