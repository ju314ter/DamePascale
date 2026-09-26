import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, Clock } from "lucide-react";
import { RequestForm } from "@/components/forms/request-form";
import { CONTACT_FIELDS } from "@/components/forms/fields";
import {
  PressedFlower,
  WildRose,
  BranchSprig,
} from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { REPLY_DELAY, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur un bijou, une commande, un atelier ou une création sur mesure ? Écrivez à Pascale, réponse sous 48 h.",
  alternates: { canonical: "/contact" },
};

const SUBJECTS =
  CONTACT_FIELDS.find((f) => f.name === "subject")?.options ?? [];

export default function ContactPage({
  searchParams,
}: {
  searchParams: { objet?: string; bijou?: string };
}) {
  const objet = SUBJECTS.find(
    (s) => s.toLowerCase() === searchParams.objet?.toLowerCase(),
  );
  const bijou = searchParams.bijou?.slice(0, 120);

  return (
    <div style={warmVintage} className="relative overflow-x-clip">
      <PressedFlower className="pointer-events-none absolute top-[8%] right-[5%] w-20 md:w-28 text-olive-200/30 rotate-12" />
      <BranchSprig className="pointer-events-none absolute bottom-[15%] left-[2%] w-28 md:w-40 text-sage-300/20 rotate-3" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-20">
        <div className="text-center mb-10 md:mb-14">
          <span className="font-hand text-xl text-[#c4897a]">
            Une question, une envie ?
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-olive-800 mt-1">
            Écrivez-moi
          </h1>
          <p className="font-editorial text-olive-700 mt-3">
            Je vous réponds personnellement sous {REPLY_DELAY}.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr] items-start">
          <aside className="space-y-6 md:sticky md:top-24">
            <div className="flex items-center gap-4">
              <Image
                src="/medaillon.png"
                alt=""
                width={64}
                height={64}
                className="rounded-full"
              />
              <blockquote className="font-hand text-xl text-olive-800/90 leading-snug">
                « La nature nous offre ses plus beaux trésors, je les transforme
                en souvenirs éternels. »
              </blockquote>
            </div>
            <ul className="space-y-4 font-editorial text-[0.9rem] text-olive-800">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-olive-500 mt-0.5" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-bronze-600 break-all"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-olive-500 mt-0.5" />
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze-600"
                >
                  {SITE.instagram.handle}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Facebook className="w-5 h-5 text-olive-500 mt-0.5" />
                <a
                  href={SITE.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze-600"
                >
                  {SITE.facebook.name}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-olive-500 mt-0.5" />
                <span>{SITE.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-olive-500 mt-0.5" />
                <span>Réponse sous {REPLY_DELAY}</span>
              </li>
            </ul>
            <div className="rounded-2xl bg-white/80 border border-olive-100 p-5 space-y-2 font-editorial text-[0.85rem] text-olive-700">
              <p className="font-hand text-xl text-olive-700">
                Vous cherchez peut-être…
              </p>
              <Link
                href="/sur-mesure"
                className="block underline underline-offset-4 decoration-olive-300 hover:text-bronze-600"
              >
                Une création avec vos fleurs →
              </Link>
              <Link
                href="/ateliers"
                className="block underline underline-offset-4 decoration-olive-300 hover:text-bronze-600"
              >
                Réserver un atelier →
              </Link>
              <Link
                href="/marches"
                className="block underline underline-offset-4 decoration-olive-300 hover:text-bronze-600"
              >
                Les prochains marchés →
              </Link>
            </div>
          </aside>

          <div className="relative bg-white rounded-2xl border border-olive-100 p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <WildRose className="absolute -top-5 -right-4 w-12 h-12 text-[#c4897a]/30" />
            <RequestForm
              kind="contact"
              fields={CONTACT_FIELDS}
              defaults={{
                subject: objet,
                message: bijou
                  ? `Bonjour Pascale, j'ai une question au sujet du bijou « ${bijou} » : `
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
