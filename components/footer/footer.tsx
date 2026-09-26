import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";
import { NewsSignup } from "@/components/forms/news-signup";

const linkClass =
  "font-editorial text-[0.85rem] text-cream-200/85 hover:text-white transition-colors py-1 inline-block";

export default function Footer() {
  return (
    <footer className="bg-olive-900 text-cream-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-hand text-3xl text-cream-50"
            >
              <Image
                src="/medaillon.png"
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
              Dame Pascale
            </Link>
            <p className="font-editorial text-[0.85rem] text-cream-200/80 leading-relaxed mt-4 max-w-xs">
              Des fleurs cueillies, séchées puis figées dans la résine : des
              bijoux uniques, façonnés à la main près du Mans.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-cream-200/25 flex items-center justify-center hover:bg-white/10"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href={SITE.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-cream-200/25 flex items-center justify-center hover:bg-white/10"
              >
                <Facebook className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          <nav aria-label="Boutique et services">
            <p className="font-editorial text-[0.68rem] tracking-[0.2em] uppercase text-cream-300/70 mb-3">
              Découvrir
            </p>
            <ul>
              <li>
                <Link href="/boutique-bijou" className={linkClass}>
                  La boutique
                </Link>
              </li>
              <li>
                <Link href="/ateliers" className={linkClass}>
                  Ateliers DIY
                </Link>
              </li>
              <li>
                <Link href="/sur-mesure" className={linkClass}>
                  Création sur mesure
                </Link>
              </li>
              <li>
                <Link href="/marches" className={linkClass}>
                  Marchés &amp; événements
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>
                  Le journal
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informations">
            <p className="font-editorial text-[0.68rem] tracking-[0.2em] uppercase text-cream-300/70 mb-3">
              Infos pratiques
            </p>
            <ul>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cgv#livraison" className={linkClass}>
                  Livraison &amp; retours
                </Link>
              </li>
              <li>
                <Link href="/cgv" className={linkClass}>
                  Conditions de vente
                </Link>
              </li>
              <li>
                <Link href="/legals" className={linkClass}>
                  Mentions légales
                </Link>
              </li>
            </ul>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 font-editorial text-[0.8rem] text-cream-200/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-white break-all"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2 font-editorial text-[0.8rem] text-cream-200/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {SITE.location}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-hand text-2xl text-cream-50">
              Ne manquez aucun rendez-vous
            </p>
            <p className="font-editorial text-[0.82rem] text-cream-200/80 mt-1 mb-4">
              Prochains marchés, nouveaux ateliers, nouvelles pièces.
            </p>
            <NewsSignup source="footer" tone="dark" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-200/15 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="font-editorial text-xs text-cream-300/70 text-center">
            © {new Date().getFullYear()} Dame Pascale — Tous droits réservés
          </p>
          <div
            className="flex items-center gap-2"
            aria-label="Moyens de paiement acceptés"
          >
            {[
              ["/visa.png", "Visa"],
              ["/mastercard.png", "Mastercard"],
              ["/paypal.png", "PayPal"],
            ].map(([src, alt]) => (
              <span
                key={alt}
                className="bg-white rounded px-1.5 py-1 flex items-center"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={40}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
