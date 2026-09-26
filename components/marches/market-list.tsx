import { Navigation } from "lucide-react";
import type { Marche } from "@/sanity/lib/types";
import { dateParts } from "@/lib/dates";
import {
  ClockIcon,
  HandCircle,
  MapPinIcon,
  SmallBlossom,
} from "@/components/botanical/decorations";
import { AddToCalendar } from "./add-to-calendar";

export function MarketList({
  marches,
  limit,
}: {
  marches: Marche[];
  limit?: number;
}) {
  const items = limit ? marches.slice(0, limit) : marches;
  return (
    <ul className="divide-y divide-dashed divide-olive-200/60">
      {items.map((m) => {
        const d = dateParts(m.date);
        const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.lieu}, ${m.city}`)}`;
        return (
          <li key={m._id} className="flex gap-4 sm:gap-6 py-6">
            <div className="relative w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 flex-shrink-0 flex flex-col items-center justify-center">
              <HandCircle className="absolute inset-0 w-full h-full text-bronze-400/60" />
              <span className="font-hand text-3xl sm:text-4xl text-bronze-500 leading-none relative">
                {d.day}
              </span>
              <span className="font-editorial text-[0.68rem] uppercase tracking-[0.12em] text-olive-600 relative">
                {d.month}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-editorial text-[0.72rem] uppercase tracking-[0.12em] text-olive-500">
                {d.weekday}
              </p>
              <h3 className="font-hand text-2xl sm:text-3xl text-olive-700 leading-tight">
                {m.city}
              </h3>
              <p className="flex items-start gap-1.5 font-editorial text-[0.88rem] text-olive-700 mt-1">
                <MapPinIcon className="w-4 h-4 text-olive-500 flex-shrink-0 mt-0.5" />{" "}
                {m.lieu}
              </p>
              <p className="flex items-center gap-1.5 font-editorial text-[0.82rem] text-olive-600 italic mt-0.5">
                <ClockIcon className="w-4 h-4 text-olive-500 flex-shrink-0" />{" "}
                {m.heures}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-olive-200 bg-white font-editorial text-[0.72rem] text-olive-700 hover:border-olive-400"
                >
                  <Navigation className="w-3.5 h-3.5" /> Itinéraire
                </a>
                <AddToCalendar marche={m} />
              </div>
            </div>
            <SmallBlossom className="hidden md:block w-6 h-6 text-olive-200/40 self-center" />
          </li>
        );
      })}
    </ul>
  );
}
