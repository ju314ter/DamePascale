const toDate = (isoDay: string) => new Date(isoDay + "T12:00:00");

/** "2026-03-15" → "15 Mars" */
export function formatMarcheDate(dateStr: string): string {
  const formatted = toDate(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
  return formatted.replace(
    /(\d+\s)(\p{L})/u,
    (_, day, first) => day + first.toUpperCase(),
  );
}

/** "2026-03-15" → { day: "15", month: "mars", weekday: "dimanche", full: "dimanche 15 mars 2026" } */
export function dateParts(dateStr: string) {
  const d = toDate(dateStr);
  return {
    day: d.toLocaleDateString("fr-FR", { day: "numeric" }),
    month: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    weekday: d.toLocaleDateString("fr-FR", { weekday: "long" }),
    full: d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}
