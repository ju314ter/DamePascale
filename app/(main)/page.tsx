import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCollectionVedette } from "@/sanity/lib/bijoux/calls";
import { getMarches } from "@/sanity/lib/marches/calls";
import { HomeHero } from "@/components/home/hero";
import CardBijou from "@/components/product-cards/card-bijou";
import { TrustStrip } from "@/components/shop/trust-list";
import { MarketList } from "@/components/marches/market-list";
import { NewsSignup } from "@/components/forms/news-signup";
import { SectionHeading } from "@/components/ui/section-heading";
import { Steps } from "@/components/ui/steps";
import { AnimatedSection } from "@/components/botanical/animated-section";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import {
  BranchSprig,
  CraftHandIcon,
  PressedFlower,
  PressedLeaf,
  RibbonStarIcon,
  SeedlingIcon,
  SmallBlossom,
  Tape,
  WildRose,
} from "@/components/botanical/decorations";
import {
  paperBg,
  ruledPaper,
  sageWash,
  warmVintage,
} from "@/components/botanical/backgrounds";
import { SITE, REPLY_DELAY } from "@/lib/site";

export const revalidate = 60;

const PROCESS = [
  {
    title: "La récolte",
    text: "Cueillette minutieuse des plus belles fleurs sauvages, de jardin ou de culture, au moment parfait de leur floraison.",
  },
  {
    title: "Le séchage",
    text: "Pressés entre les pages d'un herbier ou recouverts d'une poudre fine spéciale, les pétales reposent pendant plusieurs semaines.",
  },
  {
    title: "La cristallisation",
    text: "Encapsulation dans une résine cristalline qui fige la beauté éphémère pour l'éternité.",
  },
  {
    title: "La composition",
    text: "Chaque élément est arrangé avec soin, sans percer les fleurs, ce qui leur assure une protection optimale contre l'humidité.",
  },
];

const SERVICES = [
  {
    Icon: RibbonStarIcon,
    eyebrow: "Pièces uniques",
    title: "La boutique",
    text: "Colliers, boucles d'oreilles, bagues… Chaque bijou est unique et expédié avec soin. Livraison offerte dès 50 €.",
    cta: "Découvrir les bijoux",
    href: "/boutique-bijou",
    tone: "bg-[#c4897a]/10 border-[#c4897a]/20",
    iconColor: "text-[#c4897a]",
  },
  {
    Icon: CraftHandIcon,
    eyebrow: "Apprendre en créant",
    title: "Les ateliers",
    text: "2h30 à 3h pour créer votre propre bijou en fleurs naturelles. Tous niveaux, matériel fourni, près du Mans.",
    cta: "Réserver un atelier",
    href: "/ateliers",
    tone: "bg-sage-100/60 border-sage-200/60",
    iconColor: "text-sage-600",
  },
  {
    Icon: SeedlingIcon,
    eyebrow: "Vos fleurs, votre histoire",
    title: "Le sur-mesure",
    text: "Bouquet de mariage, naissance, souvenir d'un être cher : vos fleurs deviennent un bijou à garder toute la vie.",
    cta: "Imaginer ma création",
    href: "/sur-mesure",
    tone: "bg-bronze-100/40 border-bronze-200/50",
    iconColor: "text-bronze-500",
  },
];

export default async function HomePage() {
  const [vedette, marches] = await Promise.all([
    getCollectionVedette(),
    getMarches(),
  ]);

  return (
    <div className="overflow-x-clip">
      <HomeHero />

      {/* ── Réassurance ─────────────────────────────────────── */}
      <section className="bg-white border-y border-olive-100/70 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <TrustStrip />
        </div>
      </section>

      {/* ── Collection ──────────────────────────────────────── */}
      {vedette.length > 0 && (
        <section style={paperBg} className="relative py-16 md:py-24">
          <PressedFlower className="pointer-events-none absolute top-16 left-[4%] w-20 text-olive-200/30 rotate-[15deg]" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Nos créations"
              eyebrowColor="text-[#c4897a]"
              title="Les pièces du moment"
              intro="Chaque pièce est unique, façonnée à la main avec des fleurs soigneusement sélectionnées et préservées."
            />
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-9">
              {vedette.slice(0, 6).map((b, i) => (
                <AnimatedSection as="li" key={b._id} delay={(i % 3) * 0.08}>
                  <CardBijou item={b} sizes="(max-width: 768px) 50vw, 33vw" />
                </AnimatedSection>
              ))}
            </ul>
            <div className="text-center mt-12">
              <Link href="/boutique-bijou" className={btnSecondary}>
                Voir toute la boutique <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Services ────────────────────────────────────────── */}
      <section
        id="services"
        style={warmVintage}
        className="relative py-16 md:py-24 scroll-mt-16"
      >
        <BranchSprig className="pointer-events-none absolute bottom-10 right-[3%] w-32 text-sage-300/25 -rotate-6" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trois façons de craquer"
            title="Porter, créer, offrir"
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {SERVICES.map(({ Icon, ...s }, i) => (
              <AnimatedSection as="li" key={s.href} delay={i * 0.1}>
                <Link
                  href={s.href}
                  className={`group h-full flex flex-col rounded-2xl border ${s.tone} p-7 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(96,78,48,0.1)]`}
                >
                  <Icon className={`w-11 h-11 ${s.iconColor}`} />
                  <span className="font-hand text-lg text-olive-600 mt-4">
                    {s.eyebrow}
                  </span>
                  <h3 className="font-serif-display text-2xl text-olive-800">
                    {s.title}
                  </h3>
                  <p className="font-editorial text-[0.9rem] text-olive-700 mt-2 leading-relaxed flex-1">
                    {s.text}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-editorial text-[0.72rem] tracking-[0.14em] uppercase text-olive-800">
                    {s.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Savoir-faire ────────────────────────────────────── */}
      <section style={sageWash} className="relative py-16 md:py-24">
        <PressedLeaf className="pointer-events-none absolute top-12 right-[8%] w-16 text-olive-200/40 rotate-[25deg]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Notre savoir-faire"
            title="Comment naissent nos bijoux"
          />
          <Steps steps={PROCESS} />
        </div>
      </section>

      {/* ── Qui suis-je ─────────────────────────────────────── */}
      <section style={paperBg} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <AnimatedSection className="relative max-w-md mx-auto w-full">
            <div className="bg-white p-3 pb-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] -rotate-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/marches/stand_4.jpg"
                  alt="Pascale sur son stand Dame Pascale"
                  fill
                  sizes="(max-width: 768px) 90vw, 440px"
                  className="object-cover object-[75%_50%]"
                />
              </div>
              <p className="font-hand text-xl text-olive-600 text-center mt-3">
                Pascale, sur son stand
              </p>
            </div>
            <Tape
              color="bg-[#c4897a]/40"
              rotation="5deg"
              width="w-20"
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <span className="font-hand text-xl text-bronze-500">
              Derrière Dame Pascale
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-olive-800 mt-1">
              Bonjour, moi c&apos;est Pascale
            </h2>
            <blockquote className="font-hand text-2xl text-olive-700 mt-5 leading-snug">
              « La nature nous offre ses plus beaux{" "}
              <span className="text-bronze-600">trésors</span>, je les
              transforme en souvenirs éternels. »
            </blockquote>
            <p className="font-editorial text-[0.95rem] text-olive-700 mt-5 leading-relaxed">
              Depuis mon atelier d&apos;Yvré-l&apos;Évêque, près du Mans, je
              cueille, je sèche et je fige les fleurs dans la résine pour en
              faire des bijoux uniques. Vous me croiserez aussi sur les marchés
              de la région : venez me dire bonjour !
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/marches" className={btnPrimary}>
                Me retrouver sur un marché
              </Link>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                {SITE.instagram.handle}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Marchés ─────────────────────────────────────────── */}
      <section style={warmVintage} className="relative py-16 md:py-24">
        <WildRose className="pointer-events-none absolute top-16 left-[6%] w-16 text-[#c4897a]/20 rotate-12" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Nos prochains rendez-vous"
            title="Retrouvez-nous"
          />
          <div
            className="relative bg-white/85 shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-5 sm:px-10 py-4 sm:py-6"
            style={{ ...ruledPaper, borderRadius: 2 }}
          >
            <Tape
              color="bg-sage-300/40"
              rotation="-8deg"
              width="w-12"
              className="absolute -top-2 left-6 rounded-sm"
            />
            {marches.length > 0 ? (
              <MarketList marches={marches} limit={3} />
            ) : (
              <div className="text-center py-8">
                <SmallBlossom className="w-8 h-8 text-olive-300 mx-auto mb-3" />
                <p className="font-hand text-2xl text-olive-700">
                  Les prochaines dates arrivent bientôt
                </p>
                <p className="font-editorial text-sm text-olive-600 mt-1 mb-5">
                  Soyez prévenu·e dès qu&apos;un marché est annoncé.
                </p>
                <div className="max-w-md mx-auto text-left">
                  <NewsSignup source="accueil-marches" />
                </div>
              </div>
            )}
          </div>
          {marches.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/marches" className={btnSecondary}>
                Tous les marchés <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────── */}
      <section className="bg-olive-800 text-cream-50 py-16 md:py-20 relative overflow-hidden">
        <PressedFlower className="pointer-events-none absolute -top-4 right-[6%] w-28 text-cream-200/10 rotate-12" />
        <BranchSprig className="pointer-events-none absolute bottom-4 left-[4%] w-36 text-cream-200/10" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <span className="font-hand text-2xl text-bronze-200">
            Une question, une envie ?
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl mt-1">
            Écrivez-moi, je réponds à tout
          </h2>
          <p className="font-editorial text-cream-200/85 mt-4 leading-relaxed">
            Un bijou qui vous fait de l&apos;œil, une idée de cadeau, un projet
            avec vos fleurs… Réponse personnelle sous {REPLY_DELAY}.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cream-50 text-olive-800 px-7 py-3.5 min-h-12 font-editorial text-[0.75rem] tracking-[0.14em] uppercase hover:bg-white"
            >
              M&apos;écrire
            </Link>
            <Link
              href="/sur-mesure"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/40 px-7 py-3.5 min-h-12 font-editorial text-[0.75rem] tracking-[0.14em] uppercase hover:bg-white/10"
            >
              Projet sur mesure
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
