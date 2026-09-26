import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

/** Serveur uniquement. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let transport: nodemailer.Transporter | null = null;
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 15_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_GMAIL_APP_PASSWORD,
      },
    });
  }
  return transport;
}

export async function sendMail(options: Mail.Options): Promise<boolean> {
  try {
    await getTransport().sendMail({
      from: `"Dame Pascale" <${process.env.MY_EMAIL}>`,
      ...options,
    });
    return true;
  } catch (error) {
    console.error("[mail] envoi impossible :", error);
    return false;
  }
}

/** Gabarit HTML sobre, aux couleurs du site. */
export function mailLayout(title: string, body: string): string {
  return `
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3d3520; background:#fdfcfa; padding: 28px;">
    <p style="margin:0 0 4px; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color:#8f7a40;">Dame Pascale</p>
    <h1 style="margin: 0 0 20px; font-size: 1.35rem; font-weight: normal; color: #604e30;">${title}</h1>
    ${body}
    <p style="margin-top: 32px; font-size: 0.8rem; color: #8f7a40; border-top: 1px solid #ddd6b4; padding-top: 14px;">
      Dame Pascale · Bijoux en fleurs naturelles faits main près du Mans<br/>
      damepascale72@gmail.com · instagram.com/dame_pascale
    </p>
  </div>`;
}

export function mailRows(rows: [string, string | undefined | null][]): string {
  return `<table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">${rows
    .filter(([, v]) => v && String(v).trim() !== "")
    .map(
      ([k, v]) => `<tr>
        <td style="padding:6px 12px 6px 0; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.12em; color:#8f7a40; vertical-align:top; width:140px;">${escapeHtml(k)}</td>
        <td style="padding:6px 0; font-size:0.95rem; white-space:pre-wrap;">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join("")}</table>`;
}
