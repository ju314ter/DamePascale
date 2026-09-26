import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: React.ReactNode };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-olive-100 border-y border-olive-100">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 font-serif-display text-lg text-olive-800 [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="w-5 h-5 flex-shrink-0 text-olive-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="pb-5 -mt-1 font-editorial text-[0.92rem] text-olive-700 leading-relaxed">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
