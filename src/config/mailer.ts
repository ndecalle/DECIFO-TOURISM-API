import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !port || !user || !pass) {
  console.warn('SMTP environment variables are not fully set. Email sending will fail until configured.');
}

const transporter = nodemailer.createTransport({
  host,
  port: port ? Number(port) : undefined,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user,
    pass
  }
});

export default transporter;
