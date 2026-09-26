"use server";

import { writeClient } from "@/sanity/lib/client";
import { mailLayout, mailRows, sendMail, escapeHtml } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { REPLY_DELAY } from "@/lib/site";

export type RequestKind = "contact" | "sur-mesure" | "atelier";

export type RequestPayload = {
  kind: RequestKind;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Champs spécifiques (type de bijou, date souhaitée, participants…). */
  details?: Record<string, string | undefined>;
  recaptchaToken?: string;
  /** Champ piège anti-robots, doit rester vide. */
  website?: string;
};

const KIND_LABEL: Record<RequestKind, string> = {
  contact: "Message",
  "sur-mesure": "Demande de création sur mesure",
  atelier: "Demande d'atelier",
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function sendRequest(
  payload: RequestPayload,
): Promise<{ success: boolean; message: string }> {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (payload.website) return { success: true, message: "Merci !" };
  if (!name || !email || !isEmail(email) || !message) {
    return {
      success: false,
      message: "Merci de compléter votre nom, votre e-mail et votre message.",
    };
  }
  if (message.length > 5000) {
    return {
      success: false,
      message: "Votre message est un peu long : 5000 caractères maximum.",
    };
  }
  if (!(await verifyRecaptcha(payload.recaptchaToken))) {
    return {
      success: false,
      message: "Vérification anti-spam échouée, merci de réessayer.",
    };
  }

  const label = KIND_LABEL[payload.kind] ?? KIND_LABEL.contact;
  const detailRows = Object.entries(payload.details ?? {}) as [
    string,
    string | undefined,
  ][];

  const sent = await sendMail({
    to: process.env.MY_EMAIL,
    replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
    subject: `[${payload.subject || label}] ${name}`,
    html: mailLayout(
      escapeHtml(label),
      mailRows([
        ["Nom", name],
        ["E-mail", email],
        ["Téléphone", payload.phone],
        ["Objet", payload.subject],
        ...detailRows,
        ["Message", message],
      ]) +
        `<p style="font-size:0.8rem; color:#8f7a40;">Répondez directement à cet e-mail pour écrire à ${escapeHtml(name)}.</p>`,
    ),
  });

  if (!sent) {
    return {
      success: false,
      message:
        "L'envoi n'a pas fonctionné. Vous pouvez m'écrire directement à damepascale72@gmail.com.",
    };
  }

  // Accusé de réception : rassure et évite les relances.
  await sendMail({
    to: email,
    replyTo: process.env.MY_EMAIL,
    subject: "Dame Pascale — J'ai bien reçu votre message",
    html: mailLayout(
      `Merci ${escapeHtml(name.split(" ")[0])} !`,
      `<p style="line-height:1.6;">J'ai bien reçu votre ${payload.kind === "contact" ? "message" : "demande"} et je vous réponds personnellement sous ${REPLY_DELAY} environ.</p>
       <p style="line-height:1.6;">Pour rappel, voici ce que vous m'avez écrit :</p>
       <blockquote style="margin:0; padding:12px 16px; border-left:3px solid #c9be88; background:#f7f6f0; white-space:pre-wrap;">${escapeHtml(message)}</blockquote>
       <p style="line-height:1.6;">À très vite,<br/>Pascale</p>`,
    ),
  });

  return {
    success: true,
    message: `Merci ${name.split(" ")[0]} ! Votre message est bien parti, je vous réponds sous ${REPLY_DELAY}.`,
  };
}

export async function subscribeNews(
  email: string,
  source: string,
  recaptchaToken?: string,
): Promise<{ success: boolean; message: string }> {
  const clean = email?.trim().toLowerCase();
  if (!clean || !isEmail(clean))
    return { success: false, message: "Adresse e-mail invalide." };
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return {
      success: false,
      message: "Vérification anti-spam échouée, merci de réessayer.",
    };
  }
  try {
    const id = `inscription.${clean.replace(/[^a-z0-9]+/g, "-")}`;
    await writeClient.createIfNotExists({
      _id: id,
      _type: "inscription",
      email: clean,
      createdAt: new Date().toISOString(),
      source,
    });
    return {
      success: true,
      message:
        "C'est noté ! Vous serez prévenu·e des prochains marchés et ateliers.",
    };
  } catch (error) {
    console.error("subscribeNews", error);
    return {
      success: false,
      message: "Inscription impossible pour le moment, réessayez plus tard.",
    };
  }
}
