"use client";

/**
 * reCAPTCHA v3 chargé à la demande (au premier focus d'un formulaire),
 * pour ne pas alourdir toutes les pages avec le script de Google.
 */
const SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LcmPz0qAAAAAFqVunh9V41GqMgfrChbEmoeh5jg";

let loader: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loader = null;
        reject(new Error("reCAPTCHA indisponible"));
      };
      document.head.appendChild(script);
    });
  }
  return loader;
}

export async function getRecaptchaToken(
  action: string,
): Promise<string | undefined> {
  try {
    await loadRecaptcha();
    const grecaptcha = (window as any).grecaptcha;
    await new Promise<void>((resolve) => grecaptcha.ready(resolve));
    return await grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return undefined;
  }
}
