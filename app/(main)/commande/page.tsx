import type { Metadata } from "next";
import Link from "next/link";
import { CartContents } from "@/components/panier/cart-contents";
import { TrustList } from "@/components/shop/trust-list";
import { warmVintage } from "@/components/botanical/backgrounds";

export const metadata: Metadata = {
  title: "Mon panier",
  robots: { index: false },
};

export default function CommandePage() {
  return (
    <div style={warmVintage} className="min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-20">
        <Link
          href="/boutique-bijou"
          className="font-editorial text-[0.75rem] text-olive-600 hover:text-olive-900"
        >
          ← Continuer mes achats
        </Link>
        <h1 className="font-serif-display text-4xl md:text-5xl text-olive-800 mt-3 mb-8">
          Mon panier
        </h1>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
          <div className="rounded-2xl bg-white border border-olive-100 overflow-hidden flex flex-col min-h-[320px]">
            <CartContents />
          </div>
          <aside className="rounded-2xl bg-white/70 border border-olive-100 p-5">
            <p className="font-hand text-2xl text-olive-700 mb-3">
              Commandez l&apos;esprit tranquille
            </p>
            <TrustList />
          </aside>
        </div>
      </div>
    </div>
  );
}
