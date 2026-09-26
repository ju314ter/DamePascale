/** Styles de boutons partagés (liens ou boutons). */
const base =
  "inline-flex items-center justify-center gap-2 font-editorial uppercase tracking-[0.14em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";

export const btnPrimary = `${base} bg-olive-700 text-cream-50 hover:bg-olive-800 shadow-[0_6px_18px_rgba(96,78,48,0.18)] px-7 py-3.5 text-[0.75rem] rounded-full min-h-12`;

export const btnSecondary = `${base} border border-olive-400/60 bg-white/80 text-olive-700 hover:bg-olive-700 hover:text-cream-50 hover:border-olive-700 px-7 py-3.5 text-[0.75rem] rounded-full min-h-12`;

export const btnGhost = `${base} text-olive-700 hover:text-bronze-600 underline underline-offset-4 decoration-olive-300 hover:decoration-bronze-400 text-[0.72rem] py-2`;
