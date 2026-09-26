import Link from "next/link";
import { btnPrimary } from "@/components/ui/cta";
import { PressedFlower } from "@/components/botanical/decorations";

export default function ProductNotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <PressedFlower className="w-16 h-16 text-olive-300 mx-auto mb-4" />
      <h1 className="font-serif-display text-3xl text-olive-800">
        Ce bijou a pris son envol
      </h1>
      <p className="font-editorial text-olive-700 mt-3 mb-8">
        Il n&apos;est plus en ligne, mais bien d&apos;autres pièces uniques vous
        attendent.
      </p>
      <Link href="/boutique-bijou" className={btnPrimary}>
        Voir la boutique
      </Link>
    </div>
  );
}
