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
  const { email, name, message, recaptchaToken } = data;

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
    subject: `Message de ${name} (${email})`,
    text: message,
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
