"use client";

import { useForm, Controller } from "react-hook-form";
import { sendEmailContact } from "@/app/(main)/contact/action";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ContactFormData = {
  name: string;
  email: string;
  subject: "Informations" | "Formations" | "Demande customisée" | "Autres";
  message: string;
  recaptchaToken: string;
};

const SUBJECT_OPTIONS: ContactFormData["subject"][] = [
  "Informations",
  "Formations",
  "Demande customisée",
  "Autres",
];

function EnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9 L16 18 L29 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ContactForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: ContactFormData) => {
    if (!executeRecaptcha) return;
    try {
      const recaptchaToken = await executeRecaptcha("form_submit");
      const result = await sendEmailContact({ ...data, recaptchaToken });
      setSubmissionStatus(result.message);
      if (result.success) reset();
    } catch {
      setSubmissionStatus("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

      {/* Nom */}
      <div>
        <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
          Votre nom
        </label>
        <input
          type="text"
          placeholder="Marie Dupont"
          className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50"
          {...register("name", { required: "Nom requis" })}
        />
        {errors.name && (
          <p className="font-editorial text-[0.65rem] tracking-[0.1em] text-red-500/80 mt-1.5">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
          Votre email
        </label>
        <input
          type="email"
          placeholder="marie@exemple.fr"
          className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50"
          {...register("email", {
            required: "Email requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse mail invalide",
            },
          })}
        />
        {errors.email && (
          <p className="font-editorial text-[0.65rem] tracking-[0.1em] text-red-500/80 mt-1.5">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Objet */}
      <div>
        <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
          Objet
        </label>
        <Controller
          name="subject"
          control={control}
          rules={{ required: "Objet requis" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger className="border-b border-olive-300/40 font-editorial tracking-wide text-olive-900 focus:border-olive-500 transition-colors data-[placeholder]:text-olive-400">
                <SelectValue placeholder="Choisir un objet…" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subject && (
          <p className="font-editorial text-[0.65rem] tracking-[0.1em] text-red-500/80 mt-1.5">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
          Votre message
        </label>
        <textarea
          rows={4}
          placeholder="Bonjour, j'aimerais…"
          className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors resize-none placeholder:text-olive-300/50"
          {...register("message", {
            required: "Message requis",
            minLength: {
              value: 50,
              message: "Message trop court (50 caractères minimum)",
            },
          })}
        />
        {errors.message && (
          <p className="font-editorial text-[0.65rem] tracking-[0.1em] text-red-500/80 mt-1.5">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-3 px-8 py-3.5 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.15em] uppercase hover:bg-olive-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Envoi…" : "Envoyer"}</span>
          <EnvelopeIcon className="w-5 h-5 text-cream-50/90" />
        </button>
      </div>

      {/* Status */}
      {submissionStatus && (
        <p className="font-hand text-olive-700 text-base mt-2">{submissionStatus}</p>
      )}
    </form>
  );
}
