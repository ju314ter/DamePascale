"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BranchSprig,
  PressedFlower,
  PressedLeaf,
  Scribble,
  SmallBlossom,
  Tape,
  WildRose,
} from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";

const POLAROIDS = [
  {
    src: "/fleurmodele.jpg",
    label: "le coquelicot, porté",
    alt: "Broche en coquelicot naturel portée sur un t-shirt",
    pos: "top-[10%] left-[3%] lg:left-[9%]",
    rot: -7,
    tape: "bg-sage-300/50",
  },
  {
    src: "/marches/polaroids/sechage.jpg",
    label: "les créations",
    alt: "Les bijoux exposés sur le stand",
    pos: "bottom-[14%] left-[5%] lg:left-[12%]",
    rot: 4,
    tape: "bg-bronze-300/40",
  },
  {
    src: "/marches/polaroids/resine.jpg",
    label: "au marché de Noël",
    alt: "Le stand Dame Pascale au marché de Noël",
    pos: "top-[14%] right-[3%] lg:right-[9%]",
    rot: 5,
    tape: "bg-[#c4897a]/40",
  },
  {
    src: "/marches/polaroids/bijou.jpg",
    label: "les rencontres",
    alt: "Visiteurs rassemblés autour du stand",
    pos: "bottom-[10%] right-[5%] lg:right-[12%]",
    rot: -4,
    tape: "bg-sage-300/40",
  },
];

function Polaroid({
  src,
  label,
  alt,
  rot,
  tape,
  className = "",
}: {
  src: string;
  label: string;
  alt: string;
  rot: number;
  tape: string;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-white p-2 pb-7 shadow-[0_6px_24px_rgba(0,0,0,0.09)] ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 30vw, 180px"
          className="object-cover"
        />
      </div>
      <Tape
        color={tape}
        rotation="-3deg"
        width="w-10"
        className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm"
      />
      <p className="font-hand text-[0.8rem] md:text-sm text-olive-500 text-center mt-1.5 leading-tight">
        {label}
      </p>
    </div>
  );
}

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden" style={warmVintage}>
      <PressedLeaf className="pointer-events-none absolute top-16 left-[2%] w-14 md:w-20 text-olive-300/40 -rotate-12" />
      <PressedFlower className="pointer-events-none absolute top-6 right-[2%] w-16 md:w-24 text-[#c4897a]/30 rotate-12 lg:hidden" />
      <BranchSprig className="pointer-events-none absolute bottom-10 left-[30%] w-28 md:w-40 text-sage-400/25 rotate-6 hidden md:block" />
      <WildRose className="pointer-events-none absolute bottom-6 right-[30%] w-14 md:w-20 text-[#c4897a]/20 rotate-[20deg] hidden md:block" />

      {/* Polaroïds flottants (grand écran) */}
      <div className="hidden lg:block" aria-hidden={false}>
        {POLAROIDS.map((p, i) => (
          <motion.div
            key={p.src}
            className={`absolute ${p.pos} w-40 xl:w-44 z-[1]`}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.15 }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Polaroid {...p} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-[2] max-w-3xl mx-auto px-5 pt-12 pb-10 md:pt-20 md:pb-16 lg:py-28 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-10 h-px bg-olive-300/60" />
          <SmallBlossom className="w-5 h-5 text-olive-400/60" />
          <div className="w-10 h-px bg-olive-300/60" />
        </div>
        <h1 className="font-serif-display text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl text-olive-800 tracking-wide">
          Un{" "}
          <span className="relative inline-block">
            herbier
            <Scribble className="absolute -bottom-1 left-0 w-full h-3 text-sage-400/60" />
          </span>
          <br />
          <span className="italic">
            devenu{" "}
            <span className="relative inline-block text-bronze-600">
              bijou
              <Scribble className="absolute -bottom-1 left-0 w-full h-3 text-bronze-300/70" />
            </span>
          </span>
        </h1>
        <p className="font-editorial text-[1rem] md:text-lg text-olive-700 mt-6 max-w-xl mx-auto leading-relaxed">
          Des fleurs cueillies avec amour, séchées puis figées dans la résine :
          des bijoux uniques, façonnés à la main près du Mans.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/boutique-bijou" className={btnPrimary}>
            Découvrir la boutique
          </Link>
          <Link href="#services" className={btnSecondary}>
            Ateliers &amp; sur mesure
          </Link>
        </div>
      </div>

      {/* Polaroïds en frise (mobile / tablette) */}
      <div className="lg:hidden relative z-[2] pb-10 -mt-2">
        <div className="flex justify-center gap-3 px-4 max-w-lg mx-auto">
          {POLAROIDS.slice(0, 3).map((p, i) => (
            <Polaroid
              key={p.src}
              {...p}
              rot={[-5, 2, 6][i]}
              className={`w-1/3 ${i === 1 ? "mt-4" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
