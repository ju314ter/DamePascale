"use client";

import { CalendarPlus } from "lucide-react";
import type { Marche } from "@/sanity/lib/types";

function icsEscape(v: string) {
  return v.replace(/[\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

/** Télécharge un .ics (ouvert directement par l'agenda sur iPhone et Android). */
export function AddToCalendar({ marche }: { marche: Marche }) {
  function download() {
    const start = marche.date.replace(/-/g, "");
    const next = new Date(marche.date + "T12:00:00");
    next.setDate(next.getDate() + 1);
    const end = next.toISOString().slice(0, 10).replace(/-/g, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Dame Pascale//Marches//FR",
      "BEGIN:VEVENT",
      `UID:${marche._id}@damepascale`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${icsEscape(`Dame Pascale — ${marche.city}`)}`,
      `LOCATION:${icsEscape(`${marche.lieu}, ${marche.city}`)}`,
      `DESCRIPTION:${icsEscape(`Retrouvez les bijoux en fleurs naturelles de Dame Pascale. Horaires : ${marche.heures}`)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `dame-pascale-${marche.date}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-olive-200 bg-white font-editorial text-[0.72rem] text-olive-700 hover:border-olive-400"
    >
      <CalendarPlus className="w-3.5 h-3.5" /> Ajouter à l&apos;agenda
    </button>
  );
}
