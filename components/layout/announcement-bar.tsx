import Link from "next/link";
import { SHIPPING } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-olive-800 text-cream-100">
      <p className="max-w-7xl mx-auto px-4 py-2 text-center font-editorial text-[0.68rem] sm:text-[0.72rem] tracking-[0.08em]">
        <Link
          href="/boutique-bijou"
          className="hover:underline underline-offset-2"
        >
          Livraison offerte dès {SHIPPING.freeThreshold} €
          <span className="hidden sm:inline">
            {" "}
            · Pièces uniques faites main près du Mans
          </span>
        </Link>
      </p>
    </div>
  );
}
