import { createApp } from './app.js';
import { connectDatabase } from './services/database.js';
import { seedDemoData } from './services/demoData.js';
import { config } from './config.js';

await connectDatabase();
await seedDemoData();

const app = createApp();

app.listen(config.port, () => {
  console.log(`ATS API listening on http://localhost:${config.port}`);
});
