"use server";

import { revalidatePath } from "next/cache";
import { ContactFormData } from "@/components/contact/contact-form";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function sendEmail(data: ContactFormData) {
  // Logique côté serveur ici
  const { email, name, message } = data;

  // Simulons une opération de base de données
  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
        setting service as 'gmail' is same as providing these setings:
  
        host: "smtp.gmail.com",
        port: 465,
        secure: true
        
        If you want to use a different email provider other than gmail, you need to provide these manually.
        Or you can go use these well known services and their settings at
        https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
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
