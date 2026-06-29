import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

// ---------------------------------------------------------------------------
// Transporter
// ---------------------------------------------------------------------------
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Email not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface BulkEmailOptions {
  to: string[];
  subject: string;
  htmlBody: string;
  batchSize?: number;
  delayMs?: number;
}

export interface BulkEmailResult {
  total: number;
  sent: number;
  failed: number;
  failedAddresses: string[];
}

// ---------------------------------------------------------------------------
// Helper — sleep between batches
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export const sendBulkEmails = async (
  options: BulkEmailOptions
): Promise<BulkEmailResult> => {
  const {
    to,
    subject,
    htmlBody,
    batchSize = 50,
    delayMs = 1000,
  } = options;

  const fromAddress =
    process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@example.com";

  const transporter = createTransporter();

  const result: BulkEmailResult = {
    total: to.length,
    sent: 0,
    failed: 0,
    failedAddresses: [],
  };

  // Split into batches
  for (let i = 0; i < to.length; i += batchSize) {
    const batch = to.slice(i, i + batchSize);

    // Send all emails in this batch concurrently
    await Promise.all(
      batch.map(async (address) => {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to: address,
            subject,
            html: htmlBody,
          });
          result.sent++;
        } catch (err: any) {
          result.failed++;
          result.failedAddresses.push(address);
          console.error(`[emailService] Failed to send to ${address}:`, err.message);
        }
      })
    );

    // Delay between batches (skip after last batch)
    if (i + batchSize < to.length) {
      await sleep(delayMs);
    }
  }

  return result;
};

// ---------------------------------------------------------------------------
// Verify transporter connection (useful at startup / health check)
// ---------------------------------------------------------------------------
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
};
