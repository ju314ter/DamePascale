"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import { Instagram, Facebook } from "lucide-react";
import { getMarches, formatMarcheDate, type Marche } from "@/sanity/lib/marches/calls";
import { getCollectionVedette, type Bijou } from "@/sanity/lib/bijoux/calls";
import { urlFor } from "@/sanity/lib/client";
import Image from "next/image";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

function PressedLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 10 C20 30, 10 60, 40 110 C70 60, 60 30, 40 10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
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
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1" />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(0 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(72 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(144 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(216 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(288 50 50)"
      />
    </svg>
  );
}

function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(90 30 30)"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(180 30 30)"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(270 30 30)"
      />
    </svg>
  );
}

function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50 Q40 45, 60 30 Q80 15, 110 10"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M30 47 C25 38, 28 30, 35 28"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M50 36 C43 28, 46 20, 54 18"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M70 24 C64 18, 68 10, 76 9"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M90 15 C86 10, 90 4, 96 5"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <ellipse
        cx="35"
        cy="26"
        rx="4"
        ry="7"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-20 35 26)"
      />
      <ellipse
        cx="54"
        cy="16"
        rx="4"
        ry="7"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-25 54 16)"
      />
      <ellipse
        cx="76"
        cy="7"
        rx="3"
        ry="5"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-30 76 7)"
      />
    </svg>
  );
}

function WildRose({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="40" r="2" fill="currentColor" fillOpacity="0.3" />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(72 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(144 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(216 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(288 40 40)"
      />
      <path d="M40 50 L40 75" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 60 L34 54" stroke="currentColor" strokeWidth="0.6" />
      <ellipse
        cx="32"
        cy="53"
        rx="3"
        ry="5"
        stroke="currentColor"
        strokeWidth="0.5"
        transform="rotate(30 32 53)"
      />
    </svg>
  );
}

function HandCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 5 C48 4, 57 16, 56 30 C55 44, 44 56, 30 56 C16 57, 4 46, 4 30 C3 14, 14 5, 30 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function EnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="7"
        width="26"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 9 L16 18 L29 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PenIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 4 L28 10 L12 26 L4 28 L6 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M20 6 L26 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}


function CraftHandIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 36 C20 40, 12 42, 8 38 C4 34, 6 26, 10 22 L18 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 14 C18 10, 22 8, 24 11 L24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 18 C24 14, 28 13, 29 16 L30 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M30 20 C30 17, 33 16, 34 19 L34 26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M34 22 C35 20, 38 20, 38 24 L36 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 10 C14 6, 16 4, 18 6 L20 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M16 7 C17 4, 20 4, 20 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M20 6 C20 4, 23 4, 23 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function SeedlingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 42 L24 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 28 C20 24, 12 24, 10 18 C10 12, 18 10, 24 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 22 C28 16, 36 15, 38 20 C40 26, 32 30, 24 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 16 C24 14, 26 8, 30 6 C34 4, 36 8, 34 12 C32 16, 28 16, 24 16Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function RibbonStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="22" r="9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 6 L24 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 31 L24 38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 22 L15 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M33 22 L40 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13 11 L18 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 28 L35 33" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M35 11 L30 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18 28 L13 33" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="22" r="3.5" stroke="currentColor" strokeWidth="0.8" />
      <path d="M20 38 C20 36, 24 34, 28 38 L26 44 C25 46, 23 46, 22 44Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
    </svg>
  );
}

/* Tape decoration — a small rotated rectangle simulating washi tape */
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

/* ──────────────────────────── Paper Background Styles ──────────────────────────── */

const paperBg: React.CSSProperties = {
  backgroundColor: "#fefcf7",
  backgroundImage: `
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 30px,
      rgba(139,119,75,0.03) 30px,
      rgba(139,119,75,0.03) 31px
    ),
    linear-gradient(135deg, #fefcf7 0%, #fdf8ed 40%, #f9eed5 100%)
  `,
};

const paperTexture: React.CSSProperties = {
  backgroundImage: `
    radial-gradient(ellipse at 20% 50%, rgba(227,207,165,0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(200,180,140,0.1) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.02) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px,
    linear-gradient(175deg, #fefcf7 0%, #fdf8ed 50%, #fefcf7 100%)
  `,
};

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

const sageWash: React.CSSProperties = {
  backgroundImage: `
    radial-gradient(ellipse at 10% 65%, rgba(157,186,154,0.14) 0%, transparent 55%),
    radial-gradient(ellipse at 88% 15%, rgba(139,119,75,0.07) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.018) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(158deg, #f5f9f2 0%, #eef3e8 30%, #ede8d5 65%, #f4f8f1 100%)
  `,
};

const formationBenefits = [
  {
    icon: <CraftHandIcon className="w-10 h-10 text-sage-600/70" />,
    eyebrow: "Savoir-faire transmis",
    title: "Apprenez en créant",
    desc: "Récolte, pressage, encapsulation en résine… chaque geste vous est enseigné pas à pas, avec patience. Vous repartez avec vos propres créations et toutes les clés pour continuer chez vous.",
    rotation: "-1.2deg",
    tapeColor: "bg-sage-300/50",
    accentColor: "#6b8f63",
  },
  {
    icon: <SeedlingIcon className="w-10 h-10 text-bronze-500/70" />,
    eyebrow: "Cadre bienveillant",
    title: "Un moment pour soi",
    desc: "Séances en petits groupes de 1 à 4 personnes pour un accompagnement attentif et personnalisé. Une atmosphère douce et inspirante, sans pression — l'atelier comme une vraie parenthèse.",
    rotation: "0.6deg",
    tapeColor: "bg-bronze-300/50",
    accentColor: "#a07850",
  },
  {
    icon: <RibbonStarIcon className="w-10 h-10 text-[#c4897a]/80" />,
    eyebrow: "Accessible à tous",
    title: "Zéro expérience requise",
    desc: "Débutant·e ou curieux·se, vous êtes les bienvenu·es. Tout le matériel est fourni. Il ne vous faut qu'une seule chose : l'envie de mettre les mains dans la nature et de créer.",
    rotation: "1.1deg",
    tapeColor: "bg-[#c4897a]/35",
    accentColor: "#c4897a",
  },
];

/* ──────────────────────────── Animated Section Wrapper ──────────────────────────── */

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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────── Data ──────────────────────────── */

const processSteps = [
  {
    num: "01",
    title: "La Récolte",
    desc: "Cueillette minutieuse des plus belles fleurs sauvages et de jardin, au moment parfait de leur floraison.",
    rotation: "-2deg",
    tapeColor: "bg-sage-300/50",
    numColor: "text-olive-600",
  },
  {
    num: "02",
    title: "Le Séchage",
    desc: "Pressage délicat entre les pages d'un herbier, où les pétales reposent pendant plusieurs semaines.",
    rotation: "1deg",
    tapeColor: "bg-bronze-300/50",
    numColor: "text-bronze-500",
  },
  {
    num: "03",
    title: "La Cristallisation",
    desc: "Encapsulation dans une résine cristalline qui fige la beauté éphémère pour l'éternité.",
    rotation: "2deg",
    tapeColor: "bg-sage-300/50",
    numColor: "text-bronze-500",
  },
  {
    num: "04",
    title: "La Composition",
    desc: "Arrangement artistique de chaque élément — pétales, feuilles et tiges — pour créer une harmonie naturelle.",
    rotation: "-1deg",
    tapeColor: "bg-[#c4897a]/40",
    numColor: "text-olive-600",
  },
];

const CARD_ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];


/* ──────────────────────────── MAIN COMPONENT ──────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const marketsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [marches, setMarches] = useState<Marche[]>([]);
  const [marchesLoaded, setMarchesLoaded] = useState(false);

  useEffect(() => {
    getMarches().then((data) => {
      setMarches(data);
      setMarchesLoaded(true);
    });
  }, []);

  const [vedette, setVedette] = useState<Bijou[]>([]);
  const [vedetteLoaded, setVedetteLoaded] = useState(false);

  useEffect(() => {
    getCollectionVedette().then((data) => {
      setVedette(data);
      setVedetteLoaded(true);
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full" style={paperBg}>
      {/* ═══════════════════ HERO BANNER ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden pt-20"
        style={warmVintage}
      >
        {/* Scattered botanical decorations */}
        <PressedLeaf className="absolute top-24 left-[4%] w-16 md:w-24 text-olive-300/40 -rotate-12" />
        <PressedFlower className="absolute top-32 right-[3%] w-20 md:w-28 text-[#c4897a]/30 rotate-12" />
        <BranchSprig className="absolute bottom-32 left-[3%] w-28 md:w-40 text-sage-400/30 rotate-6" />
        <SmallBlossom className="absolute bottom-40 right-[4%] w-12 md:w-16 text-olive-400/25 -rotate-6" />
        <WildRose className="absolute top-[65%] left-[4%] w-14 md:w-20 text-[#c4897a]/20 rotate-[20deg]" />
        <PressedLeaf className="absolute top-[40%] right-[4%] w-12 md:w-16 text-sage-400/25 rotate-[30deg]" />

        {/* Tape decorations */}
        <Tape
          color="bg-[#c4897a]/25"
          rotation="-8deg"
          width="w-14"
          className="absolute top-36 left-[30%] rounded-sm hidden md:block"
        />
        <Tape
          color="bg-sage-300/30"
          rotation="5deg"
          width="w-12"
          className="absolute bottom-48 right-[28%] rounded-sm hidden md:block"
        />
        <Tape
          color="bg-bronze-300/25"
          rotation="-4deg"
          width="w-10"
          className="absolute top-[60%] right-[30%] rounded-sm hidden md:block"
        />

        {/* Polaroid photos — flanking the central text */}

        {/* Top-left: la cueillette — tucked near the title */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -7 }}
          animate={{ opacity: 1, y: 0, rotate: -7 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-[12%] left-[1%] md:left-[12%] lg:left-[16%] z-[2]"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-7, -5.5, -7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white p-2 pb-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-20 md:w-28 lg:w-34 opacity-55 md:opacity-65"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-sage-200/60 via-cream-200 to-olive-200/40 relative overflow-hidden">
              <PressedFlower className="absolute inset-0 m-auto w-12 h-12 text-olive-500/20" />
            </div>
            <Tape
              color="bg-sage-300/50"
              rotation="-3deg"
              width="w-10"
              className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm"
            />
            <p className="font-hand text-[0.55rem] text-olive-500/70 text-center mt-1.5 leading-tight">
              la cueillette
            </p>
          </motion.div>
        </motion.div>

        {/* Top-right: la mise en résine — opposite the first */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 5 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute top-[18%] right-[1%] md:right-[12%] lg:right-[15%] z-[2]"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [5, 7, 5] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="bg-white p-2 pb-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-20 md:w-30 lg:w-36 opacity-50 md:opacity-60"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-bronze-200/50 via-cream-100 to-[#c4897a]/20 relative overflow-hidden">
              <WildRose className="absolute inset-0 m-auto w-14 h-14 text-[#c4897a]/20" />
            </div>
            <Tape
              color="bg-[#c4897a]/40"
              rotation="4deg"
              width="w-10"
              className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm"
            />
            <p className="font-hand text-[0.55rem] text-olive-500/70 text-center mt-1.5 leading-tight">
              la mise en résine
            </p>
          </motion.div>
        </motion.div>

        {/* Left middle: l'atelier — beside the subtitle area */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 4 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute top-[50%] -translate-y-1/2 left-[10%] lg:left-[14%] hidden lg:block z-[2]"
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [4, 2.5, 4] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="bg-white p-2 pb-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-28 opacity-50"
          >
            <div className="aspect-square bg-gradient-to-br from-olive-200/40 via-cream-200 to-sage-200/50 relative overflow-hidden">
              <BranchSprig className="absolute inset-0 m-auto w-16 h-8 text-olive-500/15" />
            </div>
            <Tape
              color="bg-bronze-300/35"
              rotation="-5deg"
              width="w-10"
              className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm"
            />
            <p className="font-hand text-[0.55rem] text-olive-500/70 text-center mt-1.5 leading-tight">
              {`l'atelier`}
            </p>
          </motion.div>
        </motion.div>

        {/* Right middle: le séchage — opposite l'atelier */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="absolute top-[52%] -translate-y-1/2 right-[10%] lg:right-[14%] hidden lg:block z-[2]"
        >
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [-4, -2.5, -4] }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="bg-white p-2 pb-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-26 opacity-50"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-sage-200/50 via-cream-200 to-olive-200/30 relative overflow-hidden">
              <SmallBlossom className="absolute inset-0 m-auto w-8 h-8 text-olive-400/15" />
            </div>
            <Tape
              color="bg-sage-300/40"
              rotation="3deg"
              width="w-10"
              className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm"
            />
            <p className="font-hand text-[0.55rem] text-olive-500/70 text-center mt-1.5 leading-tight">
              le séchage
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom-center-left: le bijou — near the CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-[10%] left-[1%] md:left-[18%] lg:left-[22%] z-[2]"
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-6, -4, -6] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="bg-white p-1.5 pb-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-20 md:w-24 lg:w-28 opacity-45 md:opacity-50"
          >
            <div className="aspect-square bg-gradient-to-br from-[#c4897a]/20 via-cream-100 to-bronze-200/30 relative overflow-hidden">
              <PressedLeaf className="absolute inset-0 m-auto w-8 h-12 text-olive-500/15" />
            </div>
            <Tape
              color="bg-[#c4897a]/30"
              rotation="-2deg"
              width="w-8"
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-sm"
            />
            <p className="font-hand text-[0.5rem] text-olive-500/60 text-center mt-1.5">
              le bijou
            </p>
          </motion.div>
        </motion.div>

        {/* Main content */}
        <div className="relative top-[-50px] z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Small decorative divider */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-olive-300/50" />
              <SmallBlossom className="w-6 h-6 text-olive-400/50" />
              <div className="w-12 h-[1px] bg-olive-300/50" />
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-olive-800 leading-[1.1] mb-6 tracking-wide">
              Un{" "}
              <span className="relative inline-block">
                herbier
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-sage-400/40"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 8 C40 2, 80 10, 120 4 C150 0, 180 7, 198 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="italic">
                {"devenu "}
                <span className="relative inline-block text-bronze-600">
                  bijou
                  <svg
                    className="absolute -bottom-2 left-[-8%] w-[116%] h-4 text-[#c4897a]/35"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M4 10 C30 4, 70 12, 110 5 C140 0, 170 9, 196 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-hand text-xl sm:text-2xl md:text-3xl text-olive-700 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            {"Chaque création raconte l'histoire d'une "}
            <span className="relative inline-block text-[#c4897a]">
              fleur
              <svg
                className="absolute -bottom-0.5 left-0 w-full h-2 text-[#c4897a]/25"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M2 5 C25 1, 50 7, 75 3 C88 1, 95 4, 98 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            cueillie avec amour
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo(productsRef)}
              className="relative group px-8 py-3 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.15em] uppercase cursor-pointer border-none hover:bg-olive-800 transition-colors"
            >
              Decouvrir la collection
              <Tape
                color="bg-[#c4897a]/30"
                rotation="-5deg"
                width="w-8"
                className="absolute -top-2 -right-3 rounded-sm"
              />
            </button>
            <button
              onClick={() => scrollTo(processRef)}
              className="px-8 py-3 bg-transparent border border-olive-400/50 text-olive-600 font-editorial text-sm tracking-[0.15em] uppercase cursor-pointer hover:border-olive-600 hover:text-olive-800 transition-colors"
            >
              Notre savoir-faire
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator — positioned relative to hero section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-hand text-sm text-olive-600">défiler</span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              className="text-olive-600"
            >
              <path
                d="M8 4 L8 18 M3 14 L8 20 L13 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ PROCESS SECTION ═══════════════════ */}
      <section
        ref={processRef}
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={paperTexture}
      >
        {/* Background decorations */}
        <PressedLeaf className="absolute top-12 right-[8%] w-16 text-olive-200/30 rotate-[25deg]" />
        <WildRose className="absolute bottom-20 left-[5%] w-20 text-[#c4897a]/15 -rotate-12" />

        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <span className="font-hand text-lg md:text-xl text-bronze-400 block mb-3">
              Notre savoir-faire
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-olive-800 mb-4">
              Comment naissent nos{" "}
              <span className="relative inline-block text-bronze-600">
                bijoux
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-[#c4897a]/30"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M3 8 C50 2, 100 10, 150 4 C175 1, 190 7, 197 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-16 h-[1px] bg-olive-300/40" />
              <BranchSprig className="w-16 h-8 text-olive-400/40" />
              <div className="w-16 h-[1px] bg-olive-300/40" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.15}>
                <motion.div
                  whileHover={{
                    rotate: 0,
                    y: -8,
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-white/90 p-6 pb-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-default"
                  style={{
                    transform: `rotate(${step.rotation})`,
                    borderRadius: "2px",
                  }}
                >
                  {/* Tape at top */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                    <Tape
                      color={step.tapeColor}
                      rotation={`${parseInt(step.rotation) * -1.5}deg`}
                      width="w-14"
                      className="rounded-sm"
                    />
                  </div>

                  {/* Step number */}
                  <span
                    className={`font-hand text-5xl md:text-6xl ${step.numColor} block mb-3 mt-2`}
                  >
                    {step.num}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif-display text-lg md:text-xl text-olive-800 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-editorial text-sm text-olive-700/90 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Small flower decoration */}
                  <SmallBlossom className="absolute bottom-3 right-3 w-6 h-6 text-olive-200/30" />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRODUCT SHOWCASE ═══════════════════ */}
      <section
        ref={productsRef}
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={warmVintage}
      >
        <PressedFlower className="absolute top-16 left-[6%] w-20 text-olive-200/20 rotate-[15deg]" />
        <BranchSprig className="absolute bottom-24 right-[4%] w-32 text-sage-300/20 -rotate-6" />

        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <span className="font-hand text-lg md:text-xl text-[#c4897a] block mb-3">
              Nos créations
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-olive-800 mb-4">
              Notre{" "}
              <span className="relative inline-block text-bronze-600">
                Collection
                <svg
                  className="absolute -bottom-1 left-[-4%] w-[108%] h-3 text-[#c4897a]/30"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M4 9 C45 2, 90 11, 130 5 C160 1, 185 8, 196 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="font-editorial text-olive-700/90 text-sm md:text-base max-w-xl mx-auto">
              Chaque pièce est{" "}
              <span className="italic text-olive-800 font-medium">unique</span>,
              façonnée à la main avec des{" "}
              <span className="relative inline-block text-[#c4897a]">
                fleurs
                <svg
                  className="absolute -bottom-0.5 left-0 w-full h-2 text-[#c4897a]/20"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 5 C25 1, 50 7, 75 3 C88 1, 95 4, 98 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {` soigneusement sélectionnées et préservées.`}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {!vedetteLoaded
              ? [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-3 pb-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] animate-pulse"
                    style={{ transform: `rotate(${CARD_ROTATIONS[i]})` }}
                  >
                    <div className="aspect-square bg-cream-200/60" />
                    <div className="mt-4 px-1 space-y-2">
                      <div className="h-5 bg-cream-200/60 rounded w-3/4" />
                      <div className="h-4 bg-cream-200/40 rounded w-1/4" />
                    </div>
                  </div>
                ))
              : vedette.map((bijou, i) => (
                  <AnimatedSection key={bijou._id} delay={i * 0.1}>
                    <Link href={`/boutique-bijou/${bijou._id}`}>
                      <motion.div
                        whileHover={{
                          rotate: 0,
                          y: -12,
                          scale: 1.02,
                          boxShadow:
                            "0 25px 50px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="cursor-pointer"
                        style={{ transform: `rotate(${CARD_ROTATIONS[i % 6]})` }}
                      >
                        {/* Polaroid card */}
                        <div className="bg-white p-3 pb-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                          {/* Product image */}
                          <div className="aspect-square relative overflow-hidden bg-cream-100">
                            {bijou.highlightedImg ? (
                              <Image
                                src={urlFor(bijou.highlightedImg).width(400).url()}
                                alt={bijou.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PressedFlower className="w-24 h-24 text-olive-500/15" />
                              </div>
                            )}
                          </div>

                          {/* Product name + price */}
                          <div className="mt-4 px-1">
                            <h3 className="font-hand text-xl md:text-2xl text-olive-700 leading-tight">
                              {bijou.name}
                            </h3>
                            <p className="font-editorial text-sm text-bronze-500 mt-1">
                              {bijou.promotionDiscount
                                ? (bijou.price * (1 - bijou.promotionDiscount / 100)).toFixed(2)
                                : bijou.price}{" "}
                              &euro;
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </AnimatedSection>
                ))}
          </div>

          {/* View all CTA */}
          <AnimatedSection className="text-center mt-14" delay={0.3}>
            <Link href="/boutique-bijou">
              <button className="px-10 py-3.5 border border-olive-400/50 bg-white text-olive-600 font-editorial text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-olive-700 hover:text-cream-50 hover:border-olive-700 transition-all duration-300">
                Voir toute la collection
              </button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════ MARKETS SECTION ═══════════════════ */}
      <section
        ref={marketsRef}
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={paperTexture}
      >
        <PressedLeaf className="absolute top-20 right-[10%] w-14 text-sage-300/25 -rotate-[20deg]" />

        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="font-hand text-lg md:text-xl text-bronze-400 block mb-3">
              Nos prochains rendez-vous
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-olive-800 mb-4">
              Retrouvez-nous
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 h-[1px] bg-olive-300/40" />
              <SmallBlossom className="w-5 h-5 text-olive-400/40" />
              <div className="w-12 h-[1px] bg-olive-300/40" />
            </div>
          </AnimatedSection>

          {/* Journal page */}
          <AnimatedSection>
            <div
              className="relative bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-6 sm:px-10 md:px-14 py-10 md:py-14"
              style={{
                ...ruledPaper,
                borderRadius: "2px",
              }}
            >
              {/* Tape decorations at corners */}
              <Tape
                color="bg-sage-300/40"
                rotation="-8deg"
                width="w-12"
                className="absolute -top-2 left-6 rounded-sm"
              />
              <Tape
                color="bg-bronze-300/30"
                rotation="6deg"
                width="w-10"
                className="absolute -top-2 right-8 rounded-sm"
              />

              {/* Red margin line */}
              <div
                className="absolute top-0 bottom-0 left-16 sm:left-20 w-[1px] hidden md:block"
                style={{ backgroundColor: "rgba(196,137,122,0.2)" }}
              />

              <div className="space-y-0">
                {!marchesLoaded ? (
                  /* Skeleton */
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-8 py-6 animate-pulse" style={{ borderBottom: "1px dashed rgba(139,119,75,0.1)" }}>
                      <div className="w-24 h-12 bg-olive-100/50 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 bg-olive-100/50 rounded-full w-1/3" />
                        <div className="h-3 bg-olive-100/40 rounded-full w-1/2" />
                      </div>
                    </div>
                  ))
                ) : marches.length === 0 ? (
                  <div className="text-center py-10">
                    <SmallBlossom className="w-8 h-8 text-olive-200 mx-auto mb-3" />
                    <p className="font-editorial text-[0.7rem] tracking-[0.2em] uppercase text-olive-500">
                      Aucun événement à venir pour le moment
                    </p>
                  </div>
                ) : (
                  marches.map((marche, i) => (
                    <AnimatedSection key={marche._id} delay={i * 0.12}>
                      <div
                        className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8 py-6"
                        style={{
                          borderBottom:
                            i < marches.length - 1
                              ? "1px dashed rgba(139,119,75,0.15)"
                              : "none",
                        }}
                      >
                        {/* Date with hand-drawn circle */}
                        <div className="relative flex-shrink-0 w-24 md:w-28 flex items-center justify-center">
                          <HandCircle className="absolute inset-0 w-full h-full text-bronze-400/50" />
                          <span className="font-hand text-lg md:text-xl text-bronze-500 relative z-10 text-center leading-tight">
                            {formatMarcheDate(marche.date)}
                          </span>
                        </div>

                        {/* Market details */}
                        <div className="flex-1 md:pl-4">
                          <h3 className="font-hand text-xl md:text-2xl text-olive-700 mb-1">
                            {marche.city}
                          </h3>
                          <p className="font-editorial text-sm text-olive-700/85 mb-0.5">
                            {marche.lieu}
                          </p>
                          <p className="font-editorial text-xs text-olive-600/80 italic">
                            {marche.heures}
                          </p>
                        </div>

                        {/* Small decoration */}
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
      </section>

      {/* ═══════════════════ FORMATIONS SECTION ═══════════════════ */}
      <section
        className="relative py-24 md:py-36 px-4 overflow-hidden"
        style={sageWash}
      >
        {/* Botanical decorations */}
        <BranchSprig
          aria-hidden
          className="pointer-events-none select-none absolute top-14 right-[6%] w-44 text-sage-500/[0.09] rotate-[14deg]"
        />
        <PressedLeaf
          aria-hidden
          className="pointer-events-none select-none absolute bottom-20 left-[4%] w-24 text-olive-500/[0.08] -rotate-[10deg]"
        />
        <SmallBlossom
          aria-hidden
          className="pointer-events-none select-none absolute top-[40%] left-[2%] w-12 text-sage-400/[0.10] rotate-[20deg]"
        />

        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <span
              className="font-hand block mb-4"
              style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#7a9e72" }}
            >
              Apprenez, créez, vous épanouissez
            </span>
            <h2
              className="font-serif-display text-olive-800 uppercase tracking-wide leading-[0.88]"
              style={{ fontSize: "clamp(2.6rem, 6.5vw, 4.2rem)" }}
            >
              Ateliers
            </h2>
            <p
              className="font-hand italic text-bronze-600 block"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
            >
              &amp; Formations DIY
            </p>
            <p
              className="font-editorial text-olive-700 max-w-lg mx-auto leading-relaxed mt-6"
              style={{ fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)" }}
            >
              Venez découvrir les secrets de la bijouterie botanique dans un cadre
              intime et inspirant. Aucune expérience requise — juste l&apos;envie
              de créer quelque chose de beau de vos propres mains.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-10 h-px bg-olive-300/40" />
              <WildRose className="w-5 h-5 text-olive-400/35" />
              <div className="w-10 h-px bg-olive-300/40" />
            </div>
          </AnimatedSection>

          {/* ── Benefit cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-9 mb-14 md:mb-20">
            {formationBenefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.12}>
                <div
                  className="relative bg-white/82 shadow-[0_4px_24px_rgba(0,0,0,0.07)] px-7 pt-10 pb-7"
                  style={{
                    borderRadius: "2px",
                    transform: `rotate(${benefit.rotation})`,
                    ...ruledPaper,
                  }}
                >
                  <Tape
                    color={benefit.tapeColor}
                    rotation="-3deg"
                    width="w-11"
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-sm"
                  />
                  <div className="mb-5">{benefit.icon}</div>
                  <p
                    className="font-editorial text-[0.62rem] tracking-[0.22em] uppercase font-medium mb-2"
                    style={{ color: benefit.accentColor }}
                  >
                    {benefit.eyebrow}
                  </p>
                  <h3 className="font-serif-display text-olive-800 leading-tight mb-3" style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}>
                    {benefit.title}
                  </h3>
                  <p className="font-editorial text-olive-700 leading-relaxed" style={{ fontSize: "0.84rem" }}>
                    {benefit.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* ── Practical info strip ── */}
          <AnimatedSection>
            <div
              className="flex flex-wrap justify-center gap-10 md:gap-16 py-8 mb-14"
              style={{ borderTop: "1px solid rgba(139,119,75,0.15)", borderBottom: "1px solid rgba(139,119,75,0.15)" }}
            >
              {[
                { label: "Durée", value: "2h30 – 3h" },
                { label: "Groupe", value: "1 à 4 personnes" },
                { label: "Niveau", value: "Tous niveaux" },
                { label: "Matériel", value: "Entièrement fourni" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-editorial text-[0.62rem] tracking-[0.2em] uppercase text-olive-500 mb-1.5">
                    {item.label}
                  </p>
                  <p className="font-hand text-olive-800" style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ── CTA ── */}
          <AnimatedSection className="text-center">
            <p className="font-hand text-olive-700 mb-6" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
              Prête à créer votre premier bijou botanique ?
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-4 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.18em] uppercase hover:bg-olive-800 transition-colors"
              >
                Faire une demande
                <span className="text-base leading-none">→</span>
              </motion.button>
            </Link>
            <p className="font-editorial text-[0.7rem] tracking-[0.15em] text-olive-500/80 uppercase mt-5">
              Réponse sous 48h · Séances sur Le Mans et alentours.
            </p>
          </AnimatedSection>

        </div>
      </section>

      {/* ═══════════════════ CONTACT SECTION ═══════════════════ */}
      <section
        ref={contactRef}
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={warmVintage}
      >
        <PressedFlower className="absolute top-16 right-[8%] w-16 text-olive-200/20 rotate-12" />
        <BranchSprig className="absolute bottom-16 left-[4%] w-28 text-sage-300/15 rotate-3" />

        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="font-hand text-lg md:text-xl text-[#c4897a] block mb-3">
              Une question, une envie ?
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-olive-800 mb-4">
              Écrivez-nous
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            {/* Letter-style container */}
            <div
              className="relative bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
              style={{ borderRadius: "2px" }}
            >
              {/* Torn paper top edge */}
              <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
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
                {/* Left: Contact info */}
                <div className="p-8 md:p-12 md:border-r border-olive-200/30">
                  {/* Quote */}
                  <blockquote className="font-hand text-xl md:text-2xl text-olive-800/80 leading-relaxed mb-10 relative">
                    <span
                      className="absolute -top-3 -left-2 text-4xl text-[#c4897a]/30 font-serif-display"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    La nature nous offre ses plus beaux{" "}
                    <span className="italic text-bronze-600">trésors</span>, je
                    les transforme en souvenirs{" "}
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
                    <span
                      className="text-4xl text-[#c4897a]/30 font-serif-display ml-1"
                      aria-hidden="true"
                    >
                      &rdquo;
                    </span>
                  </blockquote>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <EnvelopeIcon className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium">
                          Email
                        </p>
                        <p className="font-hand text-lg text-olive-700">
                          damepascale72@gmail.com
                        </p>
                      </div>
                    </div>

                    <Link
                      href="https://www.instagram.com/dame_pascale"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group no-underline"
                    >
                      <Instagram className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5 group-hover:text-bronze-500 transition-colors" />
                      <div>
                        <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium group-hover:text-bronze-500 transition-colors">
                          Instagram
                        </p>
                        <p className="font-hand text-lg text-olive-700 group-hover:text-bronze-500 transition-colors">
                          @dame_pascale
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="https://www.facebook.com/p/Mes-petites-cr%C3%A9a-ch%C3%A9ries-100057342554163/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group no-underline"
                    >
                      <Facebook className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5 group-hover:text-bronze-500 transition-colors" />
                      <div>
                        <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium group-hover:text-bronze-500 transition-colors">
                          Facebook
                        </p>
                        <p className="font-hand text-lg text-olive-700 group-hover:text-bronze-500 transition-colors">
                          Mes petites créa chéries
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-start gap-4">
                      <PenIcon className="w-6 h-6 text-olive-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-editorial text-sm text-olive-700 uppercase tracking-wider mb-1 font-medium">
                          Atelier
                        </p>
                        <p className="font-hand text-lg text-olive-700">
                          Le Mans, France
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Small decoration */}
                  <div className="mt-10 flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-olive-300/30" />
                    <WildRose className="w-8 h-8 text-[#c4897a]/25" />
                    <div className="w-8 h-[1px] bg-olive-300/30" />
                  </div>
                </div>

                {/* Right: Contact form */}
                <div className="p-8 md:p-12" style={ruledPaper}>
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div>
                      <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
                        Votre nom
                      </label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50"
                        placeholder="Marie Dupont"
                      />
                    </div>

                    <div>
                      <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
                        Votre email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50"
                        placeholder="marie@exemple.fr"
                      />
                    </div>

                    <div>
                      <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
                        Sujet
                      </label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50"
                        placeholder="Commande personnalisée..."
                      />
                    </div>

                    <div>
                      <label className="font-editorial text-sm text-olive-700 uppercase tracking-wider block mb-2 font-medium">
                        Votre message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-lg text-olive-700 focus:outline-none focus:border-olive-500 transition-colors resize-none placeholder:text-olive-300/50"
                        placeholder="Bonjour, j'aimerais..."
                      />
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end pt-4">
                      <motion.button
                        type="submit"
                        whileHover={{
                          y: -2,
                          boxShadow: "0 8px 24px rgba(75,85,50,0.2)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-8 py-3.5 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.15em] uppercase cursor-pointer border-none hover:bg-olive-800 transition-colors"
                      >
                        <span>Envoyer</span>
                        <EnvelopeIcon className="w-5 h-5 text-cream-50/90" />
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <Footer />
    </div>
  );
}

// export function LandingPageOld() {
//   // const [carouselAmigurumisItem, setCarouselAmigurumisItem] = useState<
//   //   Amigurumi[]
//   // >([]);
//   const [carouselBijouxItem, setCarouselBijouxItem] = useState<Bijou[]>([]);
//   const containerRef = useRef(null);
//   // const refSectionAmigurumi = useRef(null);
//   // const textRefAmigurumiSection = useRef(null);
//   const refSectionBijou = useRef(null);
//   const textRefBijouSection = useRef(null);

//   const { scrollY } = useScroll({
//     container: containerRef,
//   });

//   // const { scrollYProgress: scrollImageAmigurumiSection } = useScroll({
//   //   container: containerRef,
//   //   target: refSectionAmigurumi,
//   //   offset: ["start start", "end end"],
//   // });
//   const { scrollYProgress: scrollImageBijouSection } = useScroll({
//     container: containerRef,
//     target: refSectionBijou,
//     offset: ["start start", "end end"],
//   });

//   // const { scrollYProgress: scrollTextAmigurumiSection } = useScroll({
//   //   container: containerRef,
//   //   target: textRefAmigurumiSection,
//   //   offset: ["start end", "end start"],
//   // });

//   const { scrollYProgress: scrollTextBijouSection } = useScroll({
//     container: containerRef,
//     target: textRefBijouSection,
//     offset: ["start end", "end start"],
//   });

//   const scaleXBorderCreation = useTransform(scrollY, [0, 500], ["0%", "100%"], {
//     clamp: false,
//   });

//   //Fetch carousel items
//   useEffect(() => {
//     // const fetchCarouselAmigurumis = async () => {
//     //   const carouselAmigurumis = await getLastNAmigurumis(10);
//     //   setCarouselAmigurumisItem(carouselAmigurumis);
//     // };
//     const fetchCarouselBijoux = async () => {
//       const carouselBijoux = await getLastNBijoux(10);
//       setCarouselBijouxItem(carouselBijoux);
//     };

//     // fetchCarouselAmigurumis();
//     fetchCarouselBijoux();
//   }, [setCarouselBijouxItem]);

//   return (
//     <div
//       className="relative h-[100vh] overflow-auto w-full scroll-smooth"
//       ref={containerRef}
//     >
//       {/* Home section */}
//       <div className="relative flex flex-col w-full h-[100vh] justify-start items-center mt-28">
//         <div className="w-full h-[130px] flex justify-center items-center">
//           <svg
//             className="font-serif text-6xl md:text-9xl"
//             width="100%"
//             height="130px"
//           >
//             <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
//               Dame Pascale
//             </text>
//           </svg>
//         </div>
//         <div className="w-full h-[60vh] flex justify-center items-center">
//           <Image src="/medaillon.png" alt="Logo" width={500} height={500} />
//         </div>
//         <motion.div className="sticky top-[60%] overflow-hidden text-primary text-7xl">
//           Créations
//           <motion.div
//             style={{ scaleX: scaleXBorderCreation }}
//             className="absolute bottom-0 left-0 bg-primary w-full h-[0.15rem] origin-left"
//           ></motion.div>
//         </motion.div>
//         <motion.div className="absolute opacity-0 sm:opacity-100 left-[5%] bottom-0 text-5xl self-start">
//           Mes{" "}
//           <motion.span
//             className="relative"
//             initial={{ top: 0 }}
//             whileInView={{ top: 50 }}
//             viewport={{
//               once: false,
//               margin: "-10%",
//               amount: "all",
//             }}
//           >
//             dernières
//           </motion.span>
//         </motion.div>
//         <Image
//           className="absolute top-[40vh] right-0"
//           src="/transparentknittingtexture.png"
//           alt="Transparent texture"
//           style={{ opacity: 0.2 }}
//           width={1024}
//           height={1024}
//         />
//       </div>
//       {/* Carousel section */}
//       <section className="relative flex flex-col items-center my-20 w-full pb-20 overflow-hidden">
//         {/* <div className="w-full pt-16 mb-2">
//           <CarouselLanding
//             boutiqueUrl="boutique-amigurumi"
//             direction="backward"
//             items={carouselAmigurumisItem}
//           />
//         </div> */}
//         <div className="w-full mt-2">
//           <CarouselLanding
//             boutiqueUrl="boutique-bijou"
//             direction="forward"
//             items={carouselBijouxItem}
//           />
//         </div>
//       </section>
//       {/* Message section */}
//       <section className="w-full flex justify-center items-center relative pb-40 md:pb-20">
//         <motion.div
//           initial={{ y: 200, opacity: 0, scale: 0.8 }}
//           whileInView={{ y: 0, opacity: 1, scale: 1 }}
//           viewport={{ margin: "-300px", once: true }}
//           className="relative z-10 w-[100%] md:w-[75%] lg:w-[50%] p-10 flex flex-col justify-center items-center gap-2 text-lg lg:text-xl "
//         >
//           {/* Top Left Corner */}
//           <div className="absolute top-0 left-0 w-10 h-10 bg-primary z-[-1] rounded-br-full" />

//           {/* Bottom Right Corner */}
//           <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary z-[-1] rounded-tl-full" />

//           <motion.span
//           // initial={{ x: "-100px", opacity: 0, scale: 0.3 }}
//           // whileInView={{ x: 0, opacity: 1, scale: 1 }}
//           // transition={{ duration: 0.3, ease: "easeIn" }}
//           >
//             <b>Bonjour</b> ! Je suis Dame Pascale, créatrice passionnée de
//             bijoux uniques.
//           </motion.span>
//           <motion.span>
//             Je réalise des bijoux raffinés réalisés avec des fleurs naturelles
//             séchées, encapsulées dans de la résine pour préserver leur beauté
//             délicate.
//           </motion.span>
//           <motion.span className="font-bold">
//             Pour des créations personnalisées, n&apos;hésitez pas à me contacter
//             pour étudier ensemble vos attentes.
//           </motion.span>
//           <Link href="/contact">
//             <Button
//               variant="ctainverse"
//               className="mt-4 text-lg md:text-3xl h-21 w-52 "
//             >
//               Me contacter
//             </Button>
//           </Link>
//         </motion.div>
//       </section>

//       {/* Amigurumi section */}
//       {/* <section className="relative">
//         <div className="h-[90vh] flex flex-col-reverse md:flex-row justify-around items-center relative">
//           <motion.div
//             ref={textRefAmigurumiSection}
//             style={{
//               y: useTransform(
//                 scrollTextAmigurumiSection,
//                 [0, 1],
//                 ["0vh", "-10vh"]
//               ),
//               opacity: useTransform(
//                 scrollTextAmigurumiSection,
//                 [0.2, 0.4, 0.6, 0.7],
//                 [0, 1, 1, 0]
//               ),
//             }}
//             className="relative basis-1/2 flex flex-col items-center justify-start"
//           >
//             <div>
//               <Image
//                 src="/daruma-group-nobg.png"
//                 alt="Daruma"
//                 className="-scale-x-100 hidden md:flex "
//                 width={100}
//                 height={100}
//               />
//             </div>
//             <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px] ">
//               Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
//               <b>crochetées à la main</b> avec amour. Uniques et adorables,
//               elles apportent douceur et joie à tous les âges. Parfaites pour{" "}
//               <b>décorer, offrir ou se faire plaisir</b>, ces créations
//               artisanales deviendront vos compagnons préférés.
//             </p>
//             <Link href="/boutique-amigurumi">
//               <Button
//                 variant="ctainverse"
//                 className="mt-4 text-lg md:text-3xl h-21 w-52 "
//               >
//                 Amigurumis
//               </Button>
//             </Link>
//           </motion.div>
//           <div className="relative basis-1/2 flex justify-center perspective-top ">
//             <motion.div
//               ref={refSectionAmigurumi}
//               className="relative"
//               style={{
//                 y: useTransform(
//                   scrollImageAmigurumiSection,
//                   [1, 0],
//                   ["0vh", "-10vh"]
//                 ),
//                 opacity: useTransform(
//                   scrollTextAmigurumiSection,
//                   [0.2, 0.4, 0.6, 0.7],
//                   [0, 1, 1, 0]
//                 ),
//               }}
//             >
//               <Image
//                 src="/totoro_nature.jpg"
//                 alt="Totoro dans la nature"
//                 width={500}
//                 height={500}
//                 className="rounded-xl shadow-2xl saturate-150 max-w-[60vw] w-[60vw] md:w-[35vw] lg:w-[30vw] relative"
//               />
//               <motion.svg
//                 // style={{ y: scrollYAmigurumiWord }}
//                 className="absolute top-0 left-5 hidden sm:block "
//                 height="200%"
//                 width="60px"
//                 xmlns="http://www.w3.org/2000/svg"
//                 style={{
//                   y: useTransform(
//                     scrollImageAmigurumiSection,
//                     [1, 0],
//                     ["0vh", "-50vh"]
//                   ),
//                 }}
//               >
//                 <text
//                   x="30"
//                   y="5"
//                   fill="transparent"
//                   stroke="white"
//                   className="debout text-7xl"
//                 >
//                   AMIGURUMIS
//                 </text>
//                 Sorry, your browser does not support inline SVG.
//               </motion.svg>
//             </motion.div>
//           </div>
//         </div>
//       </section> */}
//       {/* Bijou section */}
//       <section className="relative">
//         <div className="flex flex-col h-[90vh] md:flex-row-reverse justify-around items-center relative">
//           <div className="relative basis-1/2 flex justify-center perspective-top">
//             <motion.div
//               className="relative"
//               ref={refSectionBijou}
//               style={{
//                 y: useTransform(
//                   scrollImageBijouSection,
//                   [1, 0],
//                   ["0vh", "-10vh"],
//                 ),
//                 opacity: useTransform(
//                   scrollTextBijouSection,
//                   [0.2, 0.4, 0.6, 0.7],
//                   [0, 1, 1, 0],
//                 ),
//               }}
//             >
//               <Image
//                 src="/fleurmodele.jpg"
//                 alt="Fleur dans la nature"
//                 width={500}
//                 height={500}
//                 className="rounded-xl shadow-2xl saturate-150 max-w-[60vw] w-[80vw] md:w-[35vw] lg:w-[30vw] relative"
//               />
//               <motion.svg
//                 // style={{ y: scrollYBijouWord }}
//                 className="absolute top-0 left-5 hidden sm:block "
//                 height="200%"
//                 width="60px"
//                 xmlns="http://www.w3.org/2000/svg"
//                 style={{
//                   y: useTransform(
//                     scrollImageBijouSection,
//                     [1, 0],
//                     ["0vh", "-50vh"],
//                   ),
//                 }}
//               >
//                 <text
//                   x="30"
//                   y="5"
//                   fill="transparent"
//                   stroke="white"
//                   className="debout text-7xl"
//                 >
//                   BIJOUX
//                 </text>
//                 Sorry, your browser does not support inline SVG.
//               </motion.svg>
//             </motion.div>
//           </div>
//           <motion.div
//             className="relative basis-1/2 flex flex-col items-center justify-start blurOutScreen"
//             ref={textRefBijouSection}
//             style={{
//               y: useTransform(scrollTextBijouSection, [0, 1], ["0vh", "-10vh"]),
//               opacity: useTransform(
//                 scrollTextBijouSection,
//                 [0.2, 0.4, 0.6, 0.7],
//                 [0, 1, 1, 0],
//               ),
//             }}
//             viewport={{ amount: "all", once: true }}
//             transition={{ duration: 0.3, ease: "easeIn" }}
//           >
//             <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px] ">
//               Entrez dans notre écrin où <b>les fleurs deviennent bijoux</b>.
//               Nos <b>créations uniques</b> allient la délicatesse naturelle à
//               l&apos;art de la bijouterie. Découvrez des pièces exquises faites
//               de <b>véritables fleurs préservées</b>, capturant la beauté
//               éphémère de la nature dans des parures intemporelles.
//             </p>
//             <Link href="/boutique-bijou">
//               <Button
//                 variant="ctainverse"
//                 className="mt-4 text-lg md:text-3xl h-21 w-52 "
//               >
//                 Bijoux
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>
//       {/* Contact Section */}
//       <section className="h-[70vh] flex flex-col items-center justify-between overflow-hidden">
//         <motion.div
//           initial={{ y: "100%", opacity: 0 }}
//           whileInView={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           viewport={{ once: true }}
//         >
//           <h1 className="pb-16 text-5xl font-bold text-primary">
//             Contactez moi !
//           </h1>
//           <ContactForm />
//         </motion.div>
//       </section>
//       <Footer />
//     </div>
//   );
// }
