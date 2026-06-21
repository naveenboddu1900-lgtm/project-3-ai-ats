import { createApp } from './app.js';
import { connectDatabase } from './services/database.js';
import { seedDemoData } from './services/demoData.js';
import { config } from './config.js';

await connectDatabase();
await seedDemoData();

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`ATS API listening on http://localhost:${config.port}`);
});

server.on('error', async (error) => {
  if (error.code !== 'EADDRINUSE') {
    throw error;
  }

  const existingService = await getExistingService();
  if (existingService === 'project-3-ats') {
    console.log(`ATS API already running on http://localhost:${config.port}. Reusing existing server.`);
    setInterval(() => {}, 60_000);
    return;
  }

  console.error(`Port ${config.port} is already in use by another service.`);
  process.exit(1);
});

async function getExistingService() {
  try {
    const response = await fetch(`http://localhost:${config.port}/api/health`);
    if (!response.ok) return '';
    const data = await response.json();
    return data.service || '';
  } catch {
    return '';
  }
}
