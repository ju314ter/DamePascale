import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { ClearCart } from "@/components/checkout/clear-cart";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import { WildRose } from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { NewsSignup } from "@/components/forms/news-signup";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

async function getSession(id?: string) {
  if (!id || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return await stripe.checkout.sessions.retrieve(id);
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await getSession(searchParams.session_id);
  const firstName = session?.customer_details?.name?.split(" ")[0];
  const email = session?.customer_details?.email;
  const total = session?.amount_total
    ? (session.amount_total / 100).toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
    : null;

  return (
    <div style={warmVintage} className="min-h-[70vh]">
      <ClearCart />
      <div className="max-w-xl mx-auto px-4 py-16 md:py-24 text-center">
        <WildRose className="w-16 h-16 text-[#c4897a]/50 mx-auto mb-4" />
        <span className="font-hand text-2xl text-bronze-500">
          Commande confirmée
        </span>
        <h1 className="font-serif-display text-4xl md:text-5xl text-olive-800 mt-1">
          Merci{firstName ? ` ${firstName}` : ""} !
        </h1>
        <p className="font-editorial text-olive-700 mt-5 leading-relaxed">
          Votre paiement{total ? ` de ${total}` : ""} est bien reçu. Je prépare
          votre bijou à la main, avec soin.
          {email ? (
            <>
              {" "}
              Un récapitulatif vient de partir à{" "}
              <strong className="font-normal text-olive-900">{email}</strong>.
            </>
          ) : (
            <> Un e-mail récapitulatif vous a été envoyé.</>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/boutique-bijou" className={btnPrimary}>
            Continuer la visite
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
        <div className="mt-14 text-left rounded-2xl bg-white/80 border border-olive-100 p-6">
          <p className="font-hand text-2xl text-olive-700">
            Venez me voir en vrai !
          </p>
          <p className="font-editorial text-sm text-olive-600 mb-4">
            Soyez prévenu·e des prochains marchés et ateliers.
          </p>
          <NewsSignup source="commande" />
        </div>
      </div>
    </div>
  );
}
