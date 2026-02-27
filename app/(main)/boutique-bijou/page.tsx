"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Bijou, BijouFilters, getBijoux } from "@/sanity/lib/bijoux/calls";
import FiltresBijouWrapper from "@/components/filtres/filtres-bijou-wrapper";
import CardBijou from "@/components/product-cards/card-bijou";
import Footer from "@/components/footer/footer";
import Image from "next/image";
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q40 45, 60 30 Q80 15, 110 10" stroke="currentColor" strokeWidth="1" />
      <path d="M30 47 C25 38, 28 30, 35 28" stroke="currentColor" strokeWidth="0.7" />
      <path d="M50 36 C43 28, 46 20, 54 18" stroke="currentColor" strokeWidth="0.7" />
      <path d="M70 24 C64 18, 68 10, 76 9" stroke="currentColor" strokeWidth="0.7" />
      <path d="M90 15 C86 10, 90 4, 96 5" stroke="currentColor" strokeWidth="0.7" />
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

function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(90 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(180 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(270 30 30)" />
    </svg>
  );
}

const pageBackground = {
  backgroundImage: `
    radial-gradient(ellipse at 30% 70%, rgba(226,146,59,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 25%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(170deg, #fefcf7 0%, #fdf8ed 30%, #f9eed5 70%, #fefcf7 100%)
  `,
};

/* ─────────────────────────────────────────────────────────────────────────── */

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.045,
      duration: 0.32,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function BoutiqueBijouPage() {
  const [bijoux, setBijoux] = useState<Bijou[]>([]);
  const [sortByStock, setSortByStock] = useState<"none" | "desc" | "asc">("none");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const yMed  = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -150]);

  async function fetchBijoux(filters?: BijouFilters) {
    const data = filters ? await getBijoux(filters) : await getBijoux();
    setBijoux(data);
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParams = useMemo(
    () => searchParams.get("category")?.split(",") || [],
    [searchParams],
  );
  const matiereParams = useMemo(
    () => searchParams.get("matiere")?.split(",") || [],
    [searchParams],
  );
  const fleurParams = useMemo(
    () => searchParams.get("fleur")?.split(",") || [],
    [searchParams],
  );
  const priceParams = useMemo(
    () => searchParams.get("price")?.split(",").map(Number) || [0, 100],
    [searchParams],
  );

  const urlParamsArray = {
    categories: categoryParams,
    matieres: matiereParams,
    fleurs: fleurParams,
    price: priceParams as [number, number],
  };

  const sortedBijoux = useMemo(() => {
    if (sortByStock === "none") return bijoux;
    return [...bijoux].sort((a, b) =>
      sortByStock === "desc" ? b.stock - a.stock : a.stock - b.stock,
    );
  }, [bijoux, sortByStock]);

  const totalPages = Math.max(1, Math.ceil(sortedBijoux.length / itemsPerPage));
  const paginatedBijoux = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBijoux.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBijoux, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (searchParams.size === 0) fetchBijoux();
    else {
      fetchBijoux({
        categories: categoryParams,
        matieres: matiereParams,
        fleurs: fleurParams,
        price: priceParams as [number, number],
      });
    }
  }, [searchParams, categoryParams, matiereParams, fleurParams, priceParams]);

  async function handleFiltersChanged(filtres: BijouFilters): Promise<void> {
    const url = new URL(pathname, window.location.origin);
    if (filtres.categories && filtres.categories.length > 0)
      url.searchParams.set("category", filtres.categories.join(","));
    if (filtres.matieres && filtres.matieres.length > 0)
      url.searchParams.set("matiere", filtres.matieres.join(","));
    if (filtres.fleurs && filtres.fleurs.length > 0)
      url.searchParams.set("fleur", filtres.fleurs.join(","));
    if (filtres.price)
      url.searchParams.set("price", filtres.price.join(","));
    window.history.pushState({}, "", url);
    fetchBijoux(filtres);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen relative" style={pageBackground}>
      {/* ── Botanical parallax decorations (fixed layer, no overflow needed) ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{ zIndex: 0 }}>
        <motion.div style={{ y: ySlow }} className="absolute top-[8%] right-0 w-32 md:w-48">
          <PressedLeaf className="w-full text-olive-400/[0.12] rotate-[18deg]" />
        </motion.div>
        <motion.div style={{ y: yFast }} className="absolute top-[22%] left-0 w-36 md:w-52">
          <BranchSprig className="w-full text-sage-400/[0.10] -rotate-[6deg]" />
        </motion.div>
        <motion.div style={{ y: yMed }} className="absolute top-[40%] right-[2%] w-16 md:w-22">
          <PressedFlower className="w-full text-bronze-400/[0.09] rotate-[12deg]" />
        </motion.div>
        <motion.div style={{ y: ySlow }} className="absolute top-[52%] left-[1%] w-14 md:w-20">
          <SmallBlossom className="w-full text-olive-300/[0.10] -rotate-[15deg]" />
        </motion.div>
        <motion.div style={{ y: yFast }} className="absolute top-[64%] right-0 w-28 md:w-40">
          <PressedLeaf className="w-full text-sage-300/[0.09] -rotate-[25deg]" />
        </motion.div>
        <motion.div style={{ y: yMed }} className="absolute top-[76%] left-0 w-40 md:w-56">
          <BranchSprig className="w-full text-olive-400/[0.10] rotate-[5deg]" />
        </motion.div>
        <motion.div style={{ y: ySlow }} className="absolute top-[88%] right-[5%] w-12 md:w-16">
          <SmallBlossom className="w-full text-bronze-300/[0.08] rotate-[30deg]" />
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Hero Banner                                                          */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden pt-16 md:pt-20"
        style={{
          background:
            "linear-gradient(135deg, #f0ede3 0%, #f7f3e8 45%, #f5e8d0 100%)",
        }}
      >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top Left Arabesque */}
          <svg
            className="absolute -top-10 -left-10 w-72 opacity-[0.08] text-olive-900"
            viewBox="0 0 500 500"
            fill="currentColor"
          >
            <path d="M480,60 C420,20 360,20 300,60 C260,90 240,140 220,190 C200,240 170,290 120,320 C80,345 40,350 10,340 C60,370 120,380 180,350 C240,320 280,270 300,210 C320,150 350,100 400,80 C430,70 455,70 480,60 Z" />
          </svg>

          {/* Bottom Right Arabesque */}
          <svg
            className="absolute -bottom-16 -right-16 w-96 opacity-[0.06] text-bronze-600"
            viewBox="0 0 500 500"
            fill="currentColor"
          >
            <path d="M20,440 C80,480 140,480 200,440 C240,410 260,360 280,310 C300,260 330,210 380,180 C420,155 460,150 490,160 C440,130 380,120 320,150 C260,180 220,230 200,290 C180,350 150,400 100,420 C70,430 45,430 20,440 Z" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="relative flex items-center"
            style={{ minHeight: "clamp(220px, 28vw, 310px)" }}
          >
            {/* Left — Text content */}
            <div className="relative left-12 z-10 py-10 lg:py-14 max-w-md">
              <span
                className="font-hand text-bronze-500 block mb-1"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}
              >
                Collection Artisanale
              </span>
              <h1
                className="font-serif-display text-olive-900 leading-[0.88] uppercase tracking-wide mb-4"
                style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)" }}
              >
                Bijoux
                <br />
                Floraux
              </h1>
              <p className="font-editorial italic text-olive-700 leading-relaxed"
                style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}
              >
                Chaque pièce est unique, façonnée à la main
                <br className="hidden sm:block" />
                avec des fleurs soigneusement sélectionnées.
              </p>
            </div>

            {/* Right — Botanical illustration bleeding off right edge */}
            <div
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: "clamp(180px, 32vw, 360px)",
                height: "clamp(180px, 32vw, 360px)",
              }}
              aria-hidden
            >
              <Image
                src="/collier-fleur-nobg.png"
                alt=""
                fill
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 280px, 360px"
                className="object-contain object-bottom"
                style={{ transform: "translateX(12%)" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Subtle bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-olive-200/60 to-transparent" />
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Main Content                                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-8 items-start">

          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-[320px] flex-shrink-0 self-stretch">
            <div className="sticky top-[88px]">
              <FiltresBijouWrapper
                urlParamsArray={urlParamsArray}
                handleFiltersChange={handleFiltersChanged}
                scrollTarget={mainContentRef}
                variant="card"
              />
            </div>
          </aside>

          {/* ── Main Section ─────────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">

            {/* Controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 pb-5 border-b border-olive-100/70">
              <div>
                <h2
                  className="font-serif-display text-olive-900 uppercase tracking-wide leading-tight"
                  style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}
                >
                  Nos Bijoux
                </h2>
                <p className="font-editorial text-[0.7rem] text-olive-700 mt-1 tracking-wide">
                  {sortedBijoux.length}{" "}
                  {sortedBijoux.length === 1 ? "pièce" : "pièces"} disponible
                  {sortedBijoux.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter trigger */}
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 border border-olive-200 bg-white text-olive-700 font-editorial text-[0.62rem] tracking-[0.12em] uppercase rounded-lg hover:bg-olive-50 transition-colors shadow-sm">
                      <SlidersHorizontal size={12} />
                      Filtrer
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[85vw] sm:w-[360px] p-0 flex flex-col overflow-hidden [&>button:last-child]:hidden"
                  >
                    <SheetHeader className="sr-only">
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <FiltresBijouWrapper
                      urlParamsArray={urlParamsArray}
                      handleFiltersChange={handleFiltersChanged}
                      onClose={() => setMobileFilterOpen(false)}
                      scrollTarget={mainContentRef}
                      variant="flush"
                    />
                  </SheetContent>
                </Sheet>

                {/* Sort by stock */}
                <button
                  onClick={() => {
                    setSortByStock((prev) => {
                      const next =
                        prev === "desc"
                          ? "asc"
                          : prev === "asc"
                            ? "none"
                            : "desc";
                      setCurrentPage(1);
                      return next;
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-olive-200 bg-white text-olive-700 font-editorial text-[0.62rem] tracking-[0.12em] uppercase rounded-lg hover:bg-olive-50 transition-colors shadow-sm"
                >
                  <ArrowUpDown size={12} />
                  {sortByStock === "none"
                    ? "Stock"
                    : sortByStock === "desc"
                      ? "Stock ↓"
                      : "Stock ↑"}
                </button>

                {/* Items per page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 border border-olive-200 bg-white rounded-lg font-editorial text-[0.62rem] tracking-[0.1em] text-olive-700 uppercase cursor-pointer hover:bg-olive-50 transition-colors shadow-sm"
                >
                  {[20, 30, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {paginatedBijoux.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {paginatedBijoux.map((bijou, i) => (
                  <motion.div
                    key={bijou._id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <CardBijou item={bijou} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-serif-display text-2xl text-olive-300 mb-2 uppercase tracking-wide">
                  Aucun bijou trouvé
                </p>
                <p className="font-editorial text-sm text-olive-400/60 italic">
                  Essayez d&apos;ajuster vos filtres
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-olive-100/60">
                <p className="font-editorial text-[0.7rem] text-olive-700 tracking-wide">
                  Page {currentPage} sur {totalPages}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Page précédente"
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-olive-200 bg-white text-olive-600 hover:bg-olive-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from(
                    { length: Math.min(totalPages, 7) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-editorial text-[0.7rem] transition-colors shadow-sm ${
                        currentPage === page
                          ? "bg-olive-700 text-white border border-olive-700"
                          : "border border-olive-200 bg-white text-olive-600 hover:bg-olive-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Page suivante"
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-olive-200 bg-white text-olive-600 hover:bg-olive-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
