"use client";

import React from "react";
import { ContactForm } from "@/components/contact/contact-form";
import Footer from "@/components/footer/footer";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

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

function EnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9 L16 18 L29 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4 C6 4, 10 4, 12 8 L10 12 C10 12, 14 18, 20 22 L24 20 C28 22, 28 26, 28 26 C28 28, 26 30, 22 28 C14 24, 8 18, 4 10 C2 6, 4 4, 6 4Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  );
}

function PenIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4 L28 10 L12 26 L4 28 L6 20 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 6 L26 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
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

/* ─────────────────────────────────────────────────────────────────────────── */

const ContactPage = () => {
  return (
    <div className="min-h-screen relative" style={warmVintage}>

      {/* ── Botanical decorations ──────────────────────────────────────────── */}
      <PressedFlower aria-hidden className="pointer-events-none select-none absolute top-[12%] right-[6%] w-20 md:w-28 text-olive-200/25 rotate-12" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute bottom-[20%] left-[3%] w-28 md:w-40 text-sage-300/20 rotate-3" />
      <WildRose aria-hidden className="pointer-events-none select-none absolute top-[58%] left-[5%] w-16 md:w-20 text-[#c4897a]/15 -rotate-12" />
      <WildRose aria-hidden className="pointer-events-none select-none absolute bottom-[8%] right-[8%] w-14 text-[#c4897a]/12 rotate-[25deg]" />

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-hand text-lg md:text-xl text-[#c4897a] block mb-3">
            Une question, une envie ?
          </span>
          <h1
            className="font-serif-display text-olive-800 uppercase tracking-wide"
            style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)" }}
          >
            Écrivez-nous
          </h1>
          <div className="mt-4 mx-auto w-12 h-px bg-olive-200/80" />
        </div>

        {/* Letter-style container */}
        <div
          className="relative bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
          style={{ borderRadius: "2px" }}
        >
          {/* Torn paper top edge */}
          <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden" aria-hidden>
            <svg
              viewBox="0 0 1200 16"
              preserveAspectRatio="none"
              className="w-full h-full text-white/80"
            >
              <path
                d="M0 16 L0 8 C20 4, 40 10, 60 6 C80 2, 100 9, 120 5 C140 1, 160 8, 180 4 C200 0, 220 7, 240 3 C260 -1, 280 6, 300 4 C320 2, 340 9, 360 5 C380 1, 400 7, 420 3 C440 0, 460 8, 480 4 C500 1, 520 6, 540 3 C560 0, 580 7, 600 5 C620 2, 640 8, 660 4 C680 1, 700 6, 720 3 C740 0, 760 7, 780 5 C800 2, 820 8, 840 4 C860 0, 880 6, 900 3 C920 1, 940 7, 960 5 C980 2, 1000 8, 1020 4 C1040 1, 1060 6, 1080 3 C1100 0, 1120 7, 1140 4 C1160 2, 1180 6, 1200 4 L1200 16 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* ── Left: contact info ─────────────────────────────────────── */}
            <div className="p-8 md:p-12 md:border-r border-olive-200/30">

              {/* Quote */}
              <blockquote className="font-hand text-xl md:text-2xl text-olive-800/80 leading-relaxed mb-10 relative">
                <span
                  className="absolute -top-3 -left-2 text-4xl text-[#c4897a]/30 font-serif-display"
                  aria-hidden
                >
                  &ldquo;
                </span>
                La nature nous offre ses plus beaux{" "}
                <span className="italic text-bronze-600">trésors</span>, je les
                transforme en souvenirs{" "}
                <span className="relative inline-block italic text-olive-800">
                  éternels
                  <svg
                    className="absolute -bottom-0.5 left-0 w-full h-2 text-sage-400/30"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M2 5 C30 1, 55 7, 80 3 C90 1, 96 4, 98 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-4xl text-[#c4897a]/30 font-serif-display ml-1" aria-hidden>
                  &rdquo;
                </span>
              </blockquote>

              {/* Contact details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <EnvelopeIcon className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium">
                      Email
                    </p>
                    <p className="font-hand text-lg text-olive-700">
                      contact@damepascale.fr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneIcon className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium">
                      Téléphone
                    </p>
                    <p className="font-hand text-lg text-olive-700">
                      06 12 34 56 78
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PenIcon className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium">
                      Atelier
                    </p>
                    <p className="font-hand text-lg text-olive-700">
                      Paris, France
                    </p>
                  </div>
                </div>
              </div>

              {/* Ornament */}
              <div className="mt-10 flex items-center gap-3">
                <div className="w-8 h-px bg-olive-300/30" />
                <WildRose className="w-8 h-8 text-[#c4897a]/25" />
                <div className="w-8 h-px bg-olive-300/30" />
              </div>
            </div>

            {/* ── Right: form ────────────────────────────────────────────── */}
            <div className="p-8 md:p-12" style={ruledPaper}>
              <ContactForm />
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
