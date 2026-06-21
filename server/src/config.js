import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 58421),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret',
  mongodbUri: process.env.MONGODB_URI || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  ai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || ''
  },
  storage: {
    bucket: process.env.S3_BUCKET || '',
    region: process.env.AWS_REGION || ''
  }
};
