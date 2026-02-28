"use server";

import { revalidatePath } from "next/cache";
import { ContactFormData } from "@/components/contact/contact-form";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

async function verifyRecaptcha(token: string) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
    throw new Error("reCAPTCHA configuration error");
  }
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(verificationUrl, { method: "POST" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.success !== "boolean") {
      console.error("Unexpected response format from reCAPTCHA verification");
      throw new Error("Invalid reCAPTCHA response");
    }

    return data.success;
  } catch (error) {
    if (error instanceof Error) {
      console.error("reCAPTCHA verification failed:", error.message);
    } else {
      console.error(
        "An unexpected error occurred during reCAPTCHA verification"
      );
    }
    throw new Error("reCAPTCHA verification failed");
  }
}

export async function sendEmailContact(data: ContactFormData) {
  const { email, name, subject, message, recaptchaToken } = data;

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { success: false, message: "Echec vérification reCAPTCHA" };
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    /*
        setting service as 'gmail' is same as providing these setings:
        host: "smtp.gmail.com",
        port: 465,
        secure: true
    */
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `[${subject}] Message de ${name} (${email})`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3d3520;">
        <div style="border-bottom: 1px solid #d4c9a8; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 4px; font-size: 1.1rem; font-weight: normal; color: #735f35;">
            Nouveau message — Dame Pascale
          </h2>
          <p style="margin: 0; font-size: 0.85rem; color: #8f7a40;">Formulaire de contact</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8f7a40; width: 100px;">Nom</td>
            <td style="padding: 8px 0; font-size: 1rem;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8f7a40;">Email</td>
            <td style="padding: 8px 0; font-size: 1rem;"><a href="mailto:${email}" style="color: #735f35;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8f7a40;">Objet</td>
            <td style="padding: 8px 0; font-size: 1rem;">
              <span style="display: inline-block; background: #f5ead8; color: #735f35; padding: 2px 10px; border-radius: 20px; font-size: 0.85rem;">${subject}</span>
            </td>
          </tr>
        </table>
        <div style="background: #fdf8ed; border-left: 2px solid #c4897a; padding: 16px 20px; border-radius: 0 2px 2px 0;">
          <p style="margin: 0 0 8px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8f7a40;">Message</p>
          <p style="margin: 0; font-size: 1rem; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email envoyé");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    revalidatePath("/");
    return { success: true, message: "Mail envoyé avec succès ! A bientôt." };
  } catch (err) {
    revalidatePath("/");
    return {
      success: false,
      message: "Erreur lors de l'envoi du mail. Veuillez réessayer plus tard.",
    };
  }
}
