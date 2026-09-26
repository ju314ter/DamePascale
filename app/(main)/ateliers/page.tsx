import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Gift,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import { getAteliers } from "@/sanity/lib/ateliers/calls";
import type { Atelier } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/pricing";
import { REPLY_DELAY } from "@/lib/site";
import { RequestForm } from "@/components/forms/request-form";
import { atelierFields } from "@/components/forms/fields";
import { SectionHeading } from "@/components/ui/section-heading";
import { Steps } from "@/components/ui/steps";
import { Faq, faqJsonLd } from "@/components/ui/faq";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import {
  BranchSprig,
  CraftHandIcon,
  PressedLeaf,
  RibbonStarIcon,
  SeedlingIcon,
  SmallBlossom,
  Tape,
} from "@/components/botanical/decorations";
import {
  ruledPaper,
  sageWash,
  warmVintage,
} from "@/components/botanical/backgrounds";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ateliers DIY bijoux en fleurs séchées près du Mans",
  description:
    "Créez votre bijou en fleurs naturelles et résine avec Pascale, près du Mans : 2h30 à 3h, tous niveaux, matériel fourni. Vous repartez avec vos créations.",
  alternates: { canonical: "/ateliers" },
};

/** Formule affichée tant qu'aucune n'est saisie dans Sanity (reprend les infos existantes du site). */
const DEFAULT_ATELIER: Atelier = {
  _id: "default",
  title: "Atelier découverte — bijou en fleurs naturelles",
  summary:
    "Récolte, pressage, encapsulation en résine : chaque geste vous est enseigné pas à pas. Vous repartez avec vos propres créations et toutes les clés pour continuer chez vous.",
  duration: "2h30 – 3h",
  participants: "Séance individuelle",
  highlights: [
    "Tous niveaux",
    "Matériel entièrement fourni",
    "Vos fleurs ou les miennes",
  ],
};

const BENEFITS = [
  {
    Icon: CraftHandIcon,
    eyebrow: "Savoir-faire transmis",
    title: "Apprenez en créant",
    desc: "Venez avec vos fleurs préférées quelques semaines avant l'atelier ou choisissez parmi mes nombreuses fleurs déjà traitées.",
    color: "text-sage-600/70",
  },
  {
    Icon: SeedlingIcon,
    eyebrow: "Cadre bienveillant",
    title: "Un moment pour soi",
    desc: "Séances individuelles pour un accompagnement attentif et personnalisé. Une atmosphère douce, sans pression : une vraie parenthèse.",
    color: "text-bronze-500/70",
  },
  {
    Icon: RibbonStarIcon,
    eyebrow: "Accessible à tous",
    title: "Zéro expérience requise",
    desc: "Débutant·e ou curieux·se, vous êtes les bienvenu·es. Il ne vous faut qu'une chose : l'envie de mettre les mains dans la nature.",
    color: "text-[#c4897a]/80",
  },
];

const FAQ = [
  {
    q: "Faut-il savoir bricoler ?",
    a: "Pas du tout. L'atelier est pensé pour les débutant·es : je vous guide à chaque étape, à votre rythme.",
  },
  {
    q: "Que dois-je apporter ?",
    a: "Rien, tout le matériel est fourni. Si vous souhaitez utiliser vos propres fleurs, apportez-les quelques semaines avant l'atelier : elles doivent sécher.",
  },
  {
    q: "Combien de temps dure un atelier ?",
    a: "Comptez entre 2h30 et 3h, le temps de créer sans se presser.",
  },
  {
    q: "Où se déroulent les ateliers ?",
    a: "Au Mans et alentours. Le lieu exact vous est confirmé lors de la réservation.",
  },
  {
    q: "Puis-je offrir un atelier ?",
    a: "Bien sûr : indiquez-le dans votre demande et nous verrons ensemble comment l'organiser.",
  },
];

function formatSession(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function AtelierCard({
  atelier,
  featured,
}: {
  atelier: Atelier;
  featured: boolean;
}) {
  const href = `?formule=${encodeURIComponent(atelier.title)}#reserver`;
  return (
    <article
      className={`relative bg-white rounded-2xl border border-olive-100 overflow-hidden flex flex-col ${featured ? "md:flex-row" : ""}`}
    >
      <div
        className={`relative bg-cream-200 ${featured ? "aspect-[4/3] md:aspect-auto md:w-2/5" : "aspect-[4/3]"}`}
      >
        <Image
          src={
            atelier.image
              ? urlForImage(atelier.image, 900)
              : "/marches/polaroids/atelier.jpg"
          }
          alt={atelier.title}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <h3 className="font-serif-display text-2xl text-olive-800 leading-tight">
          {atelier.title}
        </h3>
        {atelier.summary && (
          <p className="font-editorial text-[0.92rem] text-olive-700 mt-3 leading-relaxed">
            {atelier.summary}
          </p>
        )}
        <ul className="mt-5 grid gap-2 font-editorial text-[0.85rem] text-olive-800">
          {atelier.duration && (
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sage-500" /> {atelier.duration}
            </li>
          )}
          {atelier.participants && (
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-500" /> {atelier.participants}
            </li>
          )}
          {atelier.highlights?.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage-500" /> {h}
            </li>
          ))}
        </ul>

        {atelier.dates && atelier.dates.length > 0 && (
          <div className="mt-5">
            <p className="font-editorial text-[0.68rem] tracking-[0.16em] uppercase text-olive-600 mb-2">
              Prochaines dates
            </p>
            <ul className="space-y-1.5">
              {atelier.dates.slice(0, 4).map((d) => (
                <li
                  key={d._key}
                  className="flex items-center gap-2 font-editorial text-[0.85rem] text-olive-800"
                >
                  <CalendarDays className="w-4 h-4 text-bronze-500 flex-shrink-0" />
                  <span className="capitalize">{formatSession(d.date)}</span>
                  {typeof d.places === "number" && (
                    <span
                      className={`ml-auto text-xs ${d.places > 0 ? "text-sage-600" : "text-olive-400"}`}
                    >
                      {d.places > 0
                        ? `${d.places} place${d.places > 1 ? "s" : ""}`
                        : "Complet"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="font-editorial">
            {typeof atelier.price === "number" ? (
              <>
                <span className="text-2xl text-olive-900">
                  {formatPrice(atelier.price)}
                </span>
                <span className="text-sm text-olive-600"> / personne</span>
              </>
            ) : (
              <span className="text-base text-olive-800">
                Tarif sur demande
              </span>
            )}
            {atelier.priceNote && (
              <span className="block text-xs text-olive-500">
                {atelier.priceNote}
              </span>
            )}
          </p>
          <Link href={href} scroll={false} className={btnPrimary}>
            {atelier.dates && atelier.dates.length > 0
              ? "Réserver"
              : "Demander une date"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function AteliersPage({
  searchParams,
}: {
  searchParams: { formule?: string };
}) {
  const fromCms = await getAteliers();
  const ateliers = fromCms.length > 0 ? fromCms : [DEFAULT_ATELIER];
  const formules = ateliers.map((a) => a.title);
  const selected = formules.includes(searchParams.formule ?? "")
    ? searchParams.formule
    : formules.length === 1
      ? formules[0]
      : undefined;

  return (
    <div className="overflow-x-clip">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={sageWash} className="relative">
        <BranchSprig className="pointer-events-none absolute top-10 right-[4%] w-28 md:w-44 text-sage-400/30 rotate-6" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-14 md:pb-20 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <span className="font-hand text-xl md:text-2xl text-sage-600">
              Apprenez, créez, vous épanouissez
            </span>
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-olive-800 leading-[1.05] mt-2">
              Ateliers bijoux <span className="italic">en fleurs séchées</span>
            </h1>
            <p className="font-editorial text-[0.98rem] md:text-lg text-olive-700 mt-5 leading-relaxed max-w-xl">
              Venez découvrir les secrets de la bijouterie botanique dans un
              cadre intime et inspirant. Aucune expérience requise : juste
              l&apos;envie de créer quelque chose de beau de vos propres mains.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                [Clock, "2h30 – 3h"],
                [Users, "Séances individuelles"],
                [Package, "Matériel fourni"],
                [Gift, "Vous repartez avec vos créations"],
              ].map(([Icon, label]: any) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-sage-200 font-editorial text-[0.78rem] text-olive-800"
                >
                  <Icon className="w-3.5 h-3.5 text-sage-600" /> {label}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#reserver" className={btnPrimary}>
                Demander une date
              </a>
              <a href="#formules" className={btnSecondary}>
                Voir les formules
              </a>
            </div>
            <p className="font-editorial text-[0.72rem] tracking-[0.1em] uppercase text-olive-500 mt-4">
              Réponse sous {REPLY_DELAY} · Le Mans et alentours
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="bg-white p-3 pb-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rotate-2">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/marches/polaroids/atelier.jpg"
                  alt="Pascale à son stand, entourée de ses créations"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 380px"
                  className="object-cover"
                />
              </div>
              <p className="font-hand text-xl text-olive-600 text-center mt-3">
                Pascale, votre guide
              </p>
            </div>
            <Tape
              color="bg-sage-300/60"
              rotation="-6deg"
              width="w-20"
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Bénéfices ─────────────────────────────────────────── */}
      <section style={warmVintage} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-6 md:grid-cols-3">
            {BENEFITS.map(({ Icon, eyebrow, title, desc, color }) => (
              <li
                key={title}
                className="bg-white/90 p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
                style={{ ...ruledPaper, borderRadius: 2 }}
              >
                <Icon className={`w-10 h-10 ${color}`} />
                <p className="font-hand text-lg text-bronze-500 mt-3">
                  {eyebrow}
                </p>
                <h2 className="font-serif-display text-xl text-olive-800">
                  {title}
                </h2>
                <p className="font-editorial text-[0.88rem] text-olive-700 mt-2 leading-relaxed">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Formules ──────────────────────────────────────────── */}
      <section
        id="formules"
        className="py-16 md:py-24 bg-cream-100 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Choisissez votre moment"
            title="Les formules"
          />
          <div
            className={`grid gap-6 ${ateliers.length > 1 ? "md:grid-cols-2" : ""}`}
          >
            {ateliers.map((a) => (
              <AtelierCard
                key={a._id}
                atelier={a}
                featured={ateliers.length === 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Déroulé ───────────────────────────────────────────── */}
      <section style={warmVintage} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple comme bonjour"
            title="Comment ça se passe ?"
          />
          <Steps
            steps={[
              {
                title: "Vous faites votre demande",
                text: `Via le formulaire ci-dessous. Je vous réponds sous ${REPLY_DELAY}.`,
              },
              {
                title: "On fixe la date",
                text: "Ensemble, selon vos disponibilités. Le lieu vous est confirmé à ce moment-là.",
              },
              {
                title: "Vos fleurs… ou les miennes",
                text: "Apportez vos fleurs quelques semaines avant pour qu'elles sèchent, ou choisissez parmi les miennes.",
              },
              {
                title: "Vous repartez avec votre bijou",
                text: "Et toutes les clés pour continuer chez vous.",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Formulaire ────────────────────────────────────────── */}
      <section
        id="reserver"
        className="py-16 md:py-24 bg-cream-100 scroll-mt-20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Prête à créer votre premier bijou botanique ?"
            title="Demander un atelier"
            intro={`Dites-moi quand vous êtes disponible : je reviens vers vous sous ${REPLY_DELAY} pour convenir d'une date.`}
          />
          <div className="relative bg-white rounded-2xl border border-olive-100 p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <SmallBlossom className="absolute -top-4 -right-3 w-10 h-10 text-olive-300/50" />
            <RequestForm
              kind="atelier"
              subject="Atelier"
              fields={atelierFields(formules)}
              defaults={{ formule: selected }}
              submitLabel="Envoyer ma demande"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={warmVintage} className="py-16 md:py-24 relative">
        <PressedLeaf className="pointer-events-none absolute top-10 left-[4%] w-16 text-olive-300/25 -rotate-12" />
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
