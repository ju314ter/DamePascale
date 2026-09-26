import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Baby, Flower2, Gift } from "lucide-react";
import { REPLY_DELAY } from "@/lib/site";
import { RequestForm } from "@/components/forms/request-form";
import { SUR_MESURE_FIELDS } from "@/components/forms/fields";
import { SectionHeading } from "@/components/ui/section-heading";
import { Steps } from "@/components/ui/steps";
import { Faq, faqJsonLd } from "@/components/ui/faq";
import { btnPrimary } from "@/components/ui/cta";
import {
  PressedFlower,
  Tape,
  WildRose,
} from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";

export const metadata: Metadata = {
  title: "Bijou sur mesure avec vos fleurs (mariage, naissance, souvenir)",
  description:
    "Transformez les fleurs de votre mariage, d'une naissance ou de votre jardin en un bijou unique, fait main près du Mans. Racontez-moi votre projet.",
  alternates: { canonical: "/sur-mesure" },
};

const IDEAS = [
  {
    Icon: Heart,
    title: "Le bouquet de mariage",
    text: "Quelques fleurs de votre bouquet, gardées pour toujours au creux d'un pendentif.",
  },
  {
    Icon: Baby,
    title: "Une naissance",
    text: "Les fleurs reçues à la maternité, ou celles du jardin le jour de sa naissance.",
  },
  {
    Icon: Flower2,
    title: "Un souvenir précieux",
    text: "Les fleurs d'un être cher, d'un voyage, d'un moment que l'on ne veut pas oublier.",
  },
  {
    Icon: Gift,
    title: "Un cadeau unique",
    text: "Ses fleurs préférées, ses couleurs, son style : un bijou qui ne ressemble qu'à elle.",
  },
];

const FAQ = [
  {
    q: "Combien de temps faut-il ?",
    a: "Les fleurs doivent d'abord sécher pendant plusieurs semaines avant la mise en résine. Prévenez-moi le plus tôt possible, surtout si vous avez une date en tête.",
  },
  {
    q: "Comment vous transmettre mes fleurs ?",
    a: "Nous en parlons ensemble : je vous explique comment les préparer et me les transmettre, selon vos fleurs et l'endroit où vous êtes.",
  },
  {
    q: "Combien coûte une création sur mesure ?",
    a: "Cela dépend du bijou et des fleurs. Je vous propose un devis avant de commencer, sans engagement de votre part.",
  },
  {
    q: "Puis-je retourner une création sur mesure ?",
    a: "Une pièce réalisée selon vos demandes et avec vos fleurs est personnalisée : elle n'est pas concernée par le droit de rétractation. C'est pourquoi nous validons tout ensemble avant la réalisation.",
  },
];

export default function SurMesurePage({
  searchParams,
}: {
  searchParams: { inspiration?: string };
}) {
  const inspiration = searchParams.inspiration?.slice(0, 120);

  return (
    <div className="overflow-x-clip">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={warmVintage} className="relative">
        <WildRose className="pointer-events-none absolute top-8 right-[5%] w-20 text-[#c4897a]/25 rotate-12" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-14 md:pb-20 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <span className="font-hand text-xl md:text-2xl text-[#c4897a]">
              Création sur mesure
            </span>
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-olive-800 leading-[1.05] mt-2">
              Vos fleurs, votre histoire,{" "}
              <span className="italic text-bronze-600">votre bijou</span>
            </h1>
            <p className="font-editorial text-[0.98rem] md:text-lg text-olive-700 mt-5 leading-relaxed max-w-xl">
              Un bouquet de mariage, les fleurs d&apos;une naissance, celles
              d&apos;un jardin qui compte… Je les sèche avec patience puis les
              fige dans la résine pour en faire un bijou unique, à porter toute
              la vie.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#projet" className={btnPrimary}>
                Raconter mon projet
              </a>
            </div>
            <p className="font-editorial text-[0.72rem] tracking-[0.1em] uppercase text-olive-500 mt-4">
              Réponse personnelle sous {REPLY_DELAY} · Devis avant réalisation
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm h-[360px] sm:h-[420px]">
            <div className="absolute left-0 top-4 w-[62%] bg-white p-2.5 pb-9 shadow-[0_10px_30px_rgba(0,0,0,0.1)] -rotate-6">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/collier-fleur-nobg.png"
                  alt="Pendentif en fleur d'orchidée naturelle"
                  fill
                  priority
                  sizes="240px"
                  className="object-contain bg-cream-100"
                />
              </div>
              <p className="font-hand text-lg text-olive-600 text-center mt-2">
                une fleur, pour toujours
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[62%] bg-white p-2.5 pb-9 shadow-[0_10px_30px_rgba(0,0,0,0.12)] rotate-3">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/marches/polaroids/cueillette.jpg"
                  alt="Pascale sur son stand"
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
              <p className="font-hand text-lg text-olive-600 text-center mt-2">
                Pascale
              </p>
              <Tape
                color="bg-[#c4897a]/40"
                rotation="4deg"
                width="w-14"
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Idées ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Quelques idées"
            title="Des fleurs qui ont une histoire"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {IDEAS.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl bg-white border border-olive-100 p-6"
              >
                <Icon className="w-7 h-7 text-[#c4897a]" strokeWidth={1.4} />
                <h2 className="font-serif-display text-xl text-olive-800 mt-4">
                  {title}
                </h2>
                <p className="font-editorial text-[0.88rem] text-olive-700 mt-2 leading-relaxed">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Étapes ────────────────────────────────────────────── */}
      <section style={warmVintage} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pas à pas"
            title="De vos fleurs à votre bijou"
          />
          <Steps
            steps={[
              {
                title: "Vous me racontez",
                text: "Votre projet, vos fleurs, votre envie. Je vous réponds personnellement.",
              },
              {
                title: "Je vous propose",
                text: "Une idée de création et un devis. Rien ne commence sans votre accord.",
              },
              {
                title: "Le séchage",
                text: "Vos fleurs reposent plusieurs semaines, pressées ou dans une poudre fine.",
              },
              {
                title: "La création",
                text: "Mise en résine, composition, finitions… puis remise en main propre ou envoi.",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Formulaire ────────────────────────────────────────── */}
      <section id="projet" className="py-16 md:py-24 bg-cream-100 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Parlons de votre projet"
            title="Imaginons votre bijou"
            intro="Quelques questions pour bien comprendre votre envie. Rien n'est définitif : nous affinerons ensemble."
          />
          <div className="relative bg-white rounded-2xl border border-olive-100 p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <PressedFlower className="absolute -top-5 -right-4 w-12 h-12 text-[#c4897a]/40" />
            <RequestForm
              kind="sur-mesure"
              subject="Création sur mesure"
              fields={SUR_MESURE_FIELDS}
              defaults={{
                message: inspiration
                  ? `J'ai eu un coup de cœur pour « ${inspiration} » et j'aimerais une création dans le même esprit.`
                  : undefined,
              }}
              submitLabel="Envoyer mon projet"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={warmVintage} className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Vos questions" title="Bon à savoir" />
          <Faq items={FAQ} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />
    </div>
  );
}
