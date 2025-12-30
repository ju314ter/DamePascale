"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { sendEmailContact } from "@/app/(main)/contact/action";
import { useState } from "react";
import Recaptcha from "./recaptcha";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: ContactFormData) => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("form_submit");
      const result = await sendEmailContact({ ...data, recaptchaToken });
      if (result.success) {
        setSubmissionStatus(result.message);
      } else {
        setSubmissionStatus(result.message || "Echec de l'envoi du mail");
      }
    } catch (error) {
      setSubmissionStatus("Une erreur est survenue");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:max-w-[500px] xl:max-w-[700px]"
    >
      <div className="mb-5">
        <Label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-black"
        >
          Votre nom
        </Label>
        <Input
          type="text"
          id="name"
          placeholder="Votre nom"
          className="w-full mb-4 rounded-md border border-secondary bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:shadow-md"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="text-primary">{errors.name.message}</span>
        )}
      </div>
      <div className="mb-5">
        <Label
          htmlFor="email"
          className="mb-3 block text-base font-medium text-black"
        >
          Adresse mail
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="example@domain.com"
          className="w-full mb-4 rounded-md border border-secondary bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:shadow-md"
          {...register("email", {
            required: "Email requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse mail invalide",
            },
          })}
        />
        {errors.email && (
          <span className="text-primary">{errors.email.message}</span>
        )}
      </div>
      <div className="mb-5">
        <Label
          htmlFor="message"
          className="mb-3 block text-base font-medium text-black"
        >
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Votre message"
          className="w-full mb-4 rounded-md border border-secondary bg-white py-3 px-6 text-base font-medium text-gray-700 focus:shadow-md"
          {...register("message", {
            required: true,
            minLength: {
              value: 50,
              message: "Message trop court, 50 caractères minimum",
            },
          })}
        />
        {errors.message && (
          <span className="text-primary">{errors.message.message}</span>
        )}
      </div>
      <div>
        <Button type="submit" variant={"cta"}>
          Envoyer
        </Button>
      </div>

      {submissionStatus && (
        <p className="text-primary mt-8">{submissionStatus}</p>
      )}
    </form>
  );
}
