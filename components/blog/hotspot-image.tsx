"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { BlogPost } from "@/sanity/lib/types";

/** Image principale avec points cliquables (fonctionne au doigt comme à la souris). */
export function HotspotImage({
  src,
  alt,
  hotspots,
}: {
  src: string;
  alt: string;
  hotspots: BlogPost["hotspots"];
}) {
  return (
    <div className="relative mb-12 sm:rounded-2xl overflow-hidden -mx-4 sm:mx-0 border-y sm:border border-olive-100/60 shadow-[0_8px_40px_rgba(139,119,75,0.10)]">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        priority
        sizes="(max-width: 900px) 100vw, 900px"
        className="w-full h-auto object-cover"
      />
      {hotspots?.map((spot, i) => (
        <Popover key={spot._key ?? `${spot.x}-${spot.y}-${i}`}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center focus-visible:outline-none"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={`Voir le détail : ${spot.details}`}
            >
              <span className="absolute w-6 h-6 rounded-full bg-bronze-400/30 animate-ping" />
              <span className="relative flex w-6 h-6 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-bronze-300/70 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-bronze-500" />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3 rounded-xl border border-olive-200/60 shadow-lg bg-cream-50">
            <p className="font-editorial text-[0.82rem] text-olive-700 leading-relaxed">
              {spot.details}
            </p>
            {spot.url && (
              <Link
                href={spot.url}
                className="inline-flex mt-2 font-editorial text-[0.65rem] tracking-[0.16em] uppercase text-bronze-600 hover:text-bronze-800"
              >
                Découvrir →
              </Link>
            )}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
