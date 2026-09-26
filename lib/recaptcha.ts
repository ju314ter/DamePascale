/** Vérification reCAPTCHA v3 — serveur uniquement. */
export async function verifyRecaptcha(
  token: string | undefined,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY manquant : vérification ignorée");
    return true;
  }
  if (!token) return false;
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );
    const data = (await response.json()) as {
      success?: boolean;
      score?: number;
    };
    return (
      data.success === true && (data.score === undefined || data.score >= 0.3)
    );
  } catch (error) {
    console.error("reCAPTCHA indisponible :", error);
    return false;
  }
}
