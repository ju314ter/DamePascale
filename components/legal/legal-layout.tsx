import { warmVintage } from "@/components/botanical/backgrounds";

export function LegalLayout({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
}) {
  return (
    <div style={warmVintage}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-20">
        <h1 className="font-serif-display text-4xl sm:text-5xl text-olive-800">
          {title}
        </h1>
        <p className="font-editorial text-xs text-olive-500 mt-2">
          Mise à jour : {updated}
        </p>
        <nav
          aria-label="Sommaire"
          className="mt-8 rounded-2xl bg-white/80 border border-olive-100 p-5"
        >
          <p className="font-editorial text-[0.68rem] tracking-[0.18em] uppercase text-olive-600 mb-2">
            Sommaire
          </p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-editorial text-[0.88rem]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-olive-700 hover:text-bronze-600 py-1 inline-block"
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="font-serif-display text-2xl text-olive-800 mb-3">
                {i + 1}. {s.title}
              </h2>
              <div className="font-editorial text-[0.92rem] text-olive-800 leading-relaxed space-y-3 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
