"use server";

import { sendEmailToShop } from "@/lib/email";

export type SendContactMessageResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<SendContactMessageResult> {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();
  const message = payload.message.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }

  const text = [
    `New contact form message`,
    ``,
    `From: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  return sendEmailToShop({
    subject: `[Contact] ${name} — ${email}`,
    text,
  });
}
