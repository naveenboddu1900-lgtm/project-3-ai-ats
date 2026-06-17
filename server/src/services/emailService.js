import nodemailer from 'nodemailer';
import { config } from '../config.js';

export async function sendStatusEmail(application) {
  if (!config.smtp.host || !config.smtp.user) {
    console.log(`Email dry-run: ${application.candidateEmail} moved to ${application.stage}.`);
    return { delivered: false, dryRun: true };
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass }
  });

  await transporter.sendMail({
    from: config.smtp.user,
    to: application.candidateEmail,
    subject: `Application update: ${application.stage}`,
    text: `Hi ${application.candidateName}, your application is currently in ${application.stage}.`
  });

  return { delivered: true, dryRun: false };
}
