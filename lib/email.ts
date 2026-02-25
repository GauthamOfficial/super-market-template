import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

/** Shop inbox — contact form and order notifications are sent here */
export function getShopEmail(): string {
  return siteConfig.contact.email;
}

/**
 * Send a plain text email to the shop using Gmail SMTP.
 * Requires GMAIL_APP_PASSWORD in env (create an App Password in your Google account).
 * Uses site config contact.email as the Gmail user (from/to).
 */
export async function sendEmailToShop(options: {
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const appPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!appPassword) {
    return { ok: false, error: "Email is not configured (GMAIL_APP_PASSWORD missing)" };
  }

  const user = getShopEmail();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: appPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `${siteConfig.name} <${user}>`,
      to: user,
      subject: options.subject,
      text: options.text,
    });
    return { ok: true };
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes("535") || raw.includes("Username and Password not accepted") || raw.includes("BadCredentials")) {
      return {
        ok: false,
        error:
          "Gmail login failed. Use an App Password, not your normal Gmail password. Turn on 2-Step Verification, then create one at https://myaccount.google.com/apppasswords and set GMAIL_APP_PASSWORD in .env",
      };
    }
    return { ok: false, error: raw || "Failed to send email" };
  }
}
