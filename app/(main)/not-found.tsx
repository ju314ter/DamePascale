import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import { PressedFlower } from "@/components/botanical/decorations";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <PressedFlower className="w-16 h-16 text-olive-300 mx-auto mb-4" />
      <h1 className="font-serif-display text-4xl text-olive-800">
        Cette page s&apos;est envolée
      </h1>
      <p className="font-editorial text-olive-700 mt-3 mb-8">
        Comme une fleur au vent… Mais le reste du jardin vous attend.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/boutique-bijou" className={btnPrimary}>
          Voir la boutique
        </Link>
        <Link href="/" className={btnSecondary}>
          Accueil
        </Link>
      </div>
    </div>
  );
}
