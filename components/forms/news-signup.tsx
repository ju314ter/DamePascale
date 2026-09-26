"use client";

import { useState } from "react";
import { subscribeNews } from "@/app/actions/requests";
import { getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha-client";

/** « Me prévenir des prochains marchés et ateliers » */
export function NewsSignup({
  source,
  tone = "light",
}: {
  source: string;
  tone?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [pending, setPending] = useState(false);
  const dark = tone === "dark";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const token = await getRecaptchaToken("newsletter");
    const result = await subscribeNews(email, source, token);
    setStatus({ ok: result.success, message: result.message });
    if (result.success) setEmail("");
    setPending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full"
      onFocus={() => loadRecaptcha().catch(() => {})}
    >
      <label htmlFor={`news-${source}`} className="sr-only">
        Votre adresse e-mail
      </label>
      <div
        className={`flex items-stretch rounded-full border overflow-hidden ${
          dark ? "border-cream-300/40 bg-white/10" : "border-olive-200 bg-white"
        }`}
      >
        <input
          id={`news-${source}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          className={`flex-1 min-w-0 bg-transparent px-4 py-3 font-editorial text-[0.9rem] focus:outline-none ${
            dark
              ? "text-cream-50 placeholder:text-cream-300/60"
              : "text-olive-900 placeholder:text-olive-400"
          }`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`px-4 sm:px-5 font-editorial text-[0.68rem] tracking-[0.14em] uppercase transition-colors disabled:opacity-60 ${
            dark
              ? "bg-cream-100 text-olive-800 hover:bg-white"
              : "bg-olive-700 text-cream-50 hover:bg-olive-800"
          }`}
        >
          {pending ? "…" : "M'avertir"}
        </button>
      </div>
      <p
        role="status"
        className={`mt-2 font-editorial text-xs ${
          status
            ? status.ok
              ? dark
                ? "text-sage-200"
                : "text-sage-600"
              : "text-red-500"
            : dark
              ? "text-cream-300/70"
              : "text-olive-500"
        }`}
      >
        {status?.message ??
          "Un e-mail avant les marchés et nouveaux ateliers, rien de plus."}
      </p>
    </form>
  );
}
