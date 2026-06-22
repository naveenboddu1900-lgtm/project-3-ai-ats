import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { jobsRouter } from './routes/jobs.js';
import { applicationsRouter } from './routes/applications.js';
import { candidateRouter } from './routes/candidate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, '../../client/dist');

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'project-3-ats' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/jobs', jobsRouter);
  app.use('/api/applications', applicationsRouter);
  app.use('/api/candidate', candidateRouter);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(clientDistPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
