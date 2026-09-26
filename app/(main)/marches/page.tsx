import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMarches } from "@/sanity/lib/marches/calls";
import { MarketList } from "@/components/marches/market-list";
import { NewsSignup } from "@/components/forms/news-signup";
import { SectionHeading } from "@/components/ui/section-heading";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import {
  BranchSprig,
  PressedFlower,
  SmallBlossom,
  Tape,
  WildRose,
} from "@/components/botanical/decorations";
import { ruledPaper, warmVintage } from "@/components/botanical/backgrounds";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Marchés et événements — où trouver Dame Pascale",
  description:
    "Les prochains marchés artisanaux et marchés de créateurs où découvrir les bijoux en fleurs naturelles de Dame Pascale, en Sarthe et alentours.",
  alternates: { canonical: "/marches" },
};

const PHOTOS = [
  ["/marches/stand_4.jpg", "Pascale sur son stand au marché"],
  ["/marches/stand_1.jpg", "Le stand Dame Pascale"],
  ["/marches/stand_2.jpg", "Bijoux exposés au marché"],
  ["/marches/stand_3.jpg", "Détail des créations sur le stand"],
  ["/marches/stand_5.jpg", "Le stand lors d'un marché de créateurs"],
  ["/marches/stand_6.jpg", "Présentoirs de bijoux en fleurs"],
];

export default async function MarchesPage() {
  const marches = await getMarches();

  const eventsJsonLd = marches.slice(0, 10).map((m) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Dame Pascale au marché — ${m.city}`,
    startDate: m.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: m.lieu, address: m.city },
    organizer: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.instagram.url,
    },
  }));

  return (
    <div style={warmVintage} className="relative overflow-x-clip">
      <PressedFlower className="pointer-events-none absolute top-[6%] right-[5%] w-24 md:w-32 text-olive-200/30 rotate-[15deg]" />
      <BranchSprig className="pointer-events-none absolute top-[40%] left-[2%] w-32 md:w-44 text-sage-300/25 rotate-3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-16">
        <SectionHeading
          as="h1"
          eyebrow="Nos prochains rendez-vous"
          eyebrowColor="text-[#c4897a]"
          title="Les marchés"
          intro={
            <>
              Retrouvez Dame Pascale en personne lors de marchés artisanaux :
              l&apos;occasion idéale de{" "}
              <span className="italic text-olive-800">
                découvrir les créations
              </span>
              , de les essayer et d&apos;échanger autour de la nature.
            </>
          }
        />

        <div
          className="relative bg-white/85 shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-5 sm:px-10 md:px-14 py-6 md:py-10"
          style={{ ...ruledPaper, borderRadius: 2 }}
        >
          <Tape
            color="bg-sage-300/40"
            rotation="-8deg"
            width="w-12"
            className="absolute -top-2 left-6 rounded-sm"
          />
          <Tape
            color="bg-bronze-300/30"
            rotation="6deg"
            width="w-10"
            className="absolute -top-2 right-8 rounded-sm"
          />
          {marches.length > 0 ? (
            <MarketList marches={marches} />
          ) : (
            <div className="text-center py-10">
              <SmallBlossom className="w-10 h-10 text-olive-300 mx-auto mb-3" />
              <p className="font-hand text-2xl text-olive-700">
                Les prochaines dates arrivent bientôt
              </p>
              <p className="font-editorial text-sm text-olive-600 mt-2 mb-6 max-w-md mx-auto">
                Laissez votre e-mail pour être prévenu·e dès qu&apos;un marché
                est annoncé, ou suivez-moi sur Instagram.
              </p>
              <div className="max-w-md mx-auto text-left">
                <NewsSignup source="marches-vide" />
              </div>
            </div>
          )}
          <WildRose className="absolute bottom-4 right-4 w-14 h-14 text-[#c4897a]/15" />
        </div>

        {marches.length > 0 && (
          <div className="mt-10 rounded-2xl bg-white/80 border border-olive-100 p-6 md:p-8 grid md:grid-cols-[1fr_1.2fr] gap-6 items-center">
            <div>
              <p className="font-hand text-2xl text-olive-700">
                Ne ratez pas le prochain
              </p>
              <p className="font-editorial text-sm text-olive-600 mt-1">
                Un petit e-mail avant chaque marché, rien de plus.
              </p>
            </div>
            <NewsSignup source="marches" />
          </div>
        )}
      </div>

      {/* Photos du stand */}
      <section className="bg-cream-100 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="En vrai, c'est encore plus joli"
            title="Sur le stand"
          />
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {PHOTOS.map(([src, alt], i) => (
              <li
                key={src}
                className={`relative overflow-hidden rounded-xl bg-cream-200 ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
          <div className="text-center mt-12">
            <p className="font-editorial text-olive-700 mb-5">
              Pas de marché près de chez vous ? Toute la collection est en
              ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/boutique-bijou" className={btnPrimary}>
                Voir la boutique
              </Link>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                Suivre {SITE.instagram.handle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
      )}
    </div>
  );
}
