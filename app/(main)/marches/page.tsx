"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Footer from "@/components/footer/footer";
import {
  getMarches,
  formatMarcheDate,
  type Marche,
} from "@/sanity/lib/marches/calls";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

function PressedLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 C20 30, 10 60, 40 110 C70 60, 60 30, 40 10Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M40 10 L40 110" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 35 L25 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L22 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L24 60" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 35 L55 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L58 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L56 60" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(288 50 50)" />
    </svg>
  );
}

function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q40 45, 60 30 Q80 15, 110 10" stroke="currentColor" strokeWidth="1" />
      <path d="M30 47 C25 38, 28 30, 35 28" stroke="currentColor" strokeWidth="0.7" />
      <path d="M50 36 C43 28, 46 20, 54 18" stroke="currentColor" strokeWidth="0.7" />
      <path d="M70 24 C64 18, 68 10, 76 9" stroke="currentColor" strokeWidth="0.7" />
      <path d="M90 15 C86 10, 90 4, 96 5" stroke="currentColor" strokeWidth="0.7" />
      <ellipse cx="35" cy="26" rx="4" ry="7" stroke="currentColor" strokeWidth="0.6" transform="rotate(-20 35 26)" />
      <ellipse cx="54" cy="16" rx="4" ry="7" stroke="currentColor" strokeWidth="0.6" transform="rotate(-25 54 16)" />
      <ellipse cx="76" cy="7" rx="3" ry="5" stroke="currentColor" strokeWidth="0.6" transform="rotate(-30 76 7)" />
    </svg>
  );
}

function WildRose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="40" r="2" fill="currentColor" fillOpacity="0.3" />
      <path d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z" stroke="currentColor" strokeWidth="0.7" />
      <path d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z" stroke="currentColor" strokeWidth="0.7" transform="rotate(72 40 40)" />
      <path d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z" stroke="currentColor" strokeWidth="0.7" transform="rotate(144 40 40)" />
      <path d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z" stroke="currentColor" strokeWidth="0.7" transform="rotate(216 40 40)" />
      <path d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z" stroke="currentColor" strokeWidth="0.7" transform="rotate(288 40 40)" />
      <path d="M40 50 L40 75" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 60 L34 54" stroke="currentColor" strokeWidth="0.6" />
      <ellipse cx="32" cy="53" rx="3" ry="5" stroke="currentColor" strokeWidth="0.5" transform="rotate(30 32 53)" />
    </svg>
  );
}

function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="0.8" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(0 20 20)" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(60 20 20)" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(120 20 20)" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(180 20 20)" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(240 20 20)" />
      <ellipse cx="20" cy="11" rx="4" ry="7" stroke="currentColor" strokeWidth="0.7" transform="rotate(300 20 20)" />
    </svg>
  );
}

function HandCircle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 8 C58 6, 73 18, 74 36 C76 54, 63 70, 45 73 C27 76, 10 64, 8 46 C6 28, 18 10, 36 8"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3 C10 3, 5 8, 5 14 C5 22, 16 29, 16 29 C16 29, 27 22, 27 14 C27 8, 22 3, 16 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9 L16 16 L21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Tape decoration */
function Tape({
  color = "bg-sage-300/60",
  rotation = "-3deg",
  className = "",
  width = "w-16",
}: {
  color?: string;
  rotation?: string;
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={`${width} h-5 ${color} ${className}`}
      style={{ transform: `rotate(${rotation})` }}
    />
  );
}

/* ──────────────────────────── Background styles ──────────────────────────── */

const warmVintage: React.CSSProperties = {
  backgroundImage: `
    radial-gradient(ellipse at 30% 70%, rgba(226,146,59,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(170deg, #fefcf7 0%, #fdf8ed 30%, #f9eed5 70%, #fefcf7 100%)
  `,
};

const ruledPaper: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 31px,
      rgba(139,119,75,0.08) 31px,
      rgba(139,119,75,0.08) 32px
    )
  `,
  backgroundSize: "100% 32px",
};

/* ──────────────────────────── AnimatedSection ──────────────────────────── */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────── MAIN COMPONENT ──────────────────────────── */

export default function MarchesPage() {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [marchesLoaded, setMarchesLoaded] = useState(false);

  useEffect(() => {
    getMarches().then((data) => {
      setMarches(data);
      setMarchesLoaded(true);
    });
  }, []);

  return (
    <div className="min-h-screen relative" style={warmVintage}>

      {/* ── Botanical decorations ─────────────────────────────────────── */}
      <PressedFlower aria-hidden className="pointer-events-none select-none absolute top-[10%] right-[5%] w-24 md:w-32 text-olive-200/20 rotate-[15deg]" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute bottom-[22%] left-[2%] w-32 md:w-44 text-sage-300/20 rotate-3" />
      <PressedLeaf aria-hidden className="pointer-events-none select-none absolute top-[55%] right-[4%] w-14 md:w-20 text-olive-300/15 -rotate-[18deg]" />
      <WildRose aria-hidden className="pointer-events-none select-none absolute bottom-[10%] left-[6%] w-16 text-[#c4897a]/12 rotate-[22deg]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="font-hand text-lg md:text-xl text-[#c4897a] block mb-3">
            Nos prochains rendez-vous
          </span>
          <h1
            className="font-serif-display text-olive-800 uppercase tracking-wide"
            style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)" }}
          >
            Marchés
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-[1px] bg-olive-300/40" />
            <SmallBlossom className="w-5 h-5 text-olive-400/40" />
            <div className="w-12 h-[1px] bg-olive-300/40" />
          </div>
          <p className="font-editorial text-olive-700/80 text-sm md:text-base max-w-md mx-auto mt-5 leading-relaxed">
            Retrouvez Dame Pascale en personne lors de ces marchés artisanaux —
            l&apos;occasion idéale de{" "}
            <span className="italic text-olive-800">découvrir les créations</span>{" "}
            et d&apos;échanger autour de la nature.
          </p>
        </div>

        {/* ── Journal card ─────────────────────────────────────────────── */}
        <AnimatedSection>
          <div
            className="relative bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-6 sm:px-10 md:px-14 py-10 md:py-14"
            style={{ ...ruledPaper, borderRadius: "2px" }}
          >
            {/* Tape corners */}
            <Tape color="bg-sage-300/40" rotation="-8deg" width="w-12" className="absolute -top-2 left-6 rounded-sm" />
            <Tape color="bg-bronze-300/30" rotation="6deg" width="w-10" className="absolute -top-2 right-8 rounded-sm" />

            {/* Red margin line */}
            <div
              className="absolute top-0 bottom-0 left-16 sm:left-20 w-[1px] hidden md:block"
              style={{ backgroundColor: "rgba(196,137,122,0.2)" }}
            />

            <div className="space-y-0">
              {!marchesLoaded ? (
                /* Skeleton */
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-8 py-6 animate-pulse"
                    style={{ borderBottom: "1px dashed rgba(139,119,75,0.1)" }}
                  >
                    <div className="w-24 h-12 bg-olive-100/50 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-olive-100/50 rounded-full w-1/3" />
                      <div className="h-3 bg-olive-100/40 rounded-full w-1/2" />
                      <div className="h-3 bg-olive-100/30 rounded-full w-1/4" />
                    </div>
                  </div>
                ))
              ) : marches.length === 0 ? (
                <div className="text-center py-16">
                  <SmallBlossom className="w-10 h-10 text-olive-200 mx-auto mb-4" />
                  <p className="font-hand text-xl text-olive-600/70 mb-2">
                    Aucun marché à venir pour le moment
                  </p>
                  <p className="font-editorial text-xs tracking-[0.15em] uppercase text-olive-400/60">
                    Revenez bientôt !
                  </p>
                </div>
              ) : (
                marches.map((marche, i) => (
                  <AnimatedSection key={marche._id} delay={i * 0.1}>
                    <div
                      className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 py-7"
                      style={{
                        borderBottom:
                          i < marches.length - 1
                            ? "1px dashed rgba(139,119,75,0.15)"
                            : "none",
                      }}
                    >
                      {/* Date circle */}
                      <div className="relative flex-shrink-0 w-24 md:w-28 flex items-center justify-center">
                        <HandCircle className="absolute inset-0 w-full h-full text-bronze-400/50" />
                        <span className="font-hand text-lg md:text-xl text-bronze-500 relative z-10 text-center leading-tight">
                          {formatMarcheDate(marche.date)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 md:pl-4">
                        <h2 className="font-hand text-2xl md:text-3xl text-olive-700 mb-2">
                          {marche.city}
                        </h2>
                        <div className="flex items-start gap-2 mb-1">
                          <MapPinIcon className="w-4 h-4 text-olive-500/70 flex-shrink-0 mt-0.5" />
                          <p className="font-editorial text-sm text-olive-700/85">
                            {marche.lieu}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <ClockIcon className="w-4 h-4 text-olive-500/70 flex-shrink-0 mt-0.5" />
                          <p className="font-editorial text-xs text-olive-600/75 italic">
                            {marche.heures}
                          </p>
                        </div>
                      </div>

                      {/* Decoration */}
                      <SmallBlossom className="hidden md:block w-6 h-6 text-olive-200/30 flex-shrink-0 self-center" />
                    </div>
                  </AnimatedSection>
                ))
              )}
            </div>

            {/* Corner flower */}
            <WildRose className="absolute bottom-4 right-4 w-14 h-14 text-[#c4897a]/15" />
          </div>
        </AnimatedSection>

      </div>

      <Footer />
    </div>
  );
}
