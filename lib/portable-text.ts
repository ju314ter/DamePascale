/** Extrait le texte brut d'un contenu Portable Text (pour les descriptions SEO). */
export function toPlainText(
  blocks: any[] | undefined | null,
  maxLength = 160,
): string {
  if (!Array.isArray(blocks)) return "";
  const text = blocks
    .filter((b) => b?._type === "block" && Array.isArray(b.children))
    .map((b) => b.children.map((c: any) => c.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1).trimEnd()}…`
    : text;
}
