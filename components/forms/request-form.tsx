"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { sendRequest, type RequestKind } from "@/app/actions/requests";
import { getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha-client";
import { btnPrimary } from "@/components/ui/cta";
import { SITE } from "@/lib/site";
import type { FieldDef } from "./fields";

export type { FieldDef } from "./fields";

const CORE = new Set(["name", "email", "phone", "subject", "message"]);

const inputClass =
  "w-full rounded-xl border border-olive-200 bg-white px-4 py-3 font-editorial text-[0.95rem] text-olive-900 placeholder:text-olive-400 focus:outline-none focus:border-olive-500 focus:ring-2 focus:ring-olive-200 transition";

function Field({
  field,
  defaultValue,
}: {
  field: FieldDef;
  defaultValue?: string;
}) {
  const id = `f-${field.name}`;
  const label = (
    <label
      htmlFor={field.type === "chips" ? undefined : id}
      className="block font-editorial text-[0.72rem] tracking-[0.14em] uppercase text-olive-800 mb-2"
    >
      {field.label}
      {!field.required && (
        <span className="normal-case tracking-normal text-olive-500">
          {" "}
          (facultatif)
        </span>
      )}
    </label>
  );

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={field.rows ?? 5}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          className={`${inputClass} resize-y min-h-32`}
        />
      );
      break;
    case "select":
      control = (
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={defaultValue ?? ""}
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>
            Choisir…
          </option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "chips":
      control = (
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label={field.label}
        >
          {field.options?.map((o) => (
            <label key={o} className="cursor-pointer">
              <input
                type="radio"
                name={field.name}
                value={o}
                required={field.required}
                defaultChecked={defaultValue === o}
                className="peer sr-only"
              />
              <span className="inline-block px-4 py-2.5 rounded-full border border-olive-200 bg-white font-editorial text-[0.85rem] text-olive-700 transition-colors peer-checked:bg-olive-700 peer-checked:border-olive-700 peer-checked:text-cream-50 peer-focus-visible:ring-2 peer-focus-visible:ring-olive-300">
                {o}
              </span>
            </label>
          ))}
        </div>
      );
      break;
    default:
      control = (
        <input
          id={id}
          name={field.name}
          type={field.type}
          required={field.required}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          inputMode={
            field.type === "tel"
              ? "tel"
              : field.type === "number"
                ? "numeric"
                : undefined
          }
          min={field.type === "number" ? 1 : undefined}
          className={inputClass}
        />
      );
  }

  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      {label}
      {control}
      {field.hint && (
        <p className="mt-1.5 font-editorial text-xs text-olive-500">
          {field.hint}
        </p>
      )}
    </div>
  );
}

export function RequestForm({
  kind,
  fields,
  defaults = {},
  submitLabel = "Envoyer",
  subject,
}: {
  kind: RequestKind;
  fields: FieldDef[];
  defaults?: Record<string, string | undefined>;
  submitLabel?: string;
  /** Objet fixe (sinon lu dans le champ « subject »). */
  subject?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) =>
      (data.get(k) as string | null)?.trim() || undefined;
    const details: Record<string, string | undefined> = {};
    for (const f of fields)
      if (!CORE.has(f.name)) details[f.label] = get(f.name);

    setPending(true);
    const token = await getRecaptchaToken(kind.replace("-", "_"));
    const res = await sendRequest({
      kind,
      name: get("name") ?? "",
      email: get("email") ?? "",
      phone: get("phone"),
      subject: subject ?? get("subject"),
      message: get("message") ?? "",
      details,
      website: get("website"),
      recaptchaToken: token,
    });
    setPending(false);
    setResult(res);
    if (res.success) formRef.current?.reset();
  }

  if (result?.success) {
    return (
      <div className="text-center py-10 px-4" role="status">
        <CheckCircle2
          className="w-12 h-12 text-sage-500 mx-auto mb-4"
          strokeWidth={1.4}
        />
        <p className="font-hand text-3xl text-olive-700">C&apos;est envoyé !</p>
        <p className="font-editorial text-olive-700 mt-2">{result.message}</p>
        <p className="font-editorial text-sm text-olive-500 mt-2">
          Un e-mail de confirmation vient de vous être envoyé.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 font-editorial text-sm text-olive-600 underline underline-offset-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={() => loadRecaptcha().catch(() => {})}
      className="grid sm:grid-cols-2 gap-x-4 gap-y-5"
    >
      {fields.map((f) => (
        <Field key={f.name} field={f} defaultValue={defaults[f.name]} />
      ))}
      {/* Piège à robots, invisible pour les humains */}
      <div className="hidden" aria-hidden>
        <label>
          Site web{" "}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-3 pt-1">
        {result && !result.success && (
          <p
            className="font-editorial text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
            role="alert"
          >
            {result.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className={`${btnPrimary} w-full sm:w-auto sm:self-start`}
        >
          <Send className="w-4 h-4" />
          {pending ? "Envoi…" : submitLabel}
        </button>
        <p className="font-editorial text-[0.7rem] text-olive-500 leading-relaxed">
          Vos informations servent uniquement à vous répondre. Vous pouvez aussi
          écrire à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          . Ce formulaire est protégé par reCAPTCHA (
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            confidentialité
          </a>{" "}
          et{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            conditions
          </a>{" "}
          de Google).
        </p>
      </div>
    </form>
  );
}
