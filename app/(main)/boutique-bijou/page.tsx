"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf8" }}>

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
        <div className="max-w-7xl mx-auto px-2 sm:px-3">
          <div
            className="relative flex items-center"
            style={{ minHeight: "clamp(220px, 28vw, 310px)" }}
          >
            {/* Left — Text content */}
            <div className="relative z-10 py-10 lg:py-14 max-w-md">
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
              <p className="font-editorial italic text-olive-600/70 leading-relaxed"
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
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-10">
        <div className="flex gap-8 items-start">

          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="sticky top-[88px]">
              <FiltresBijouWrapper
                urlParamsArray={urlParamsArray}
                handleFiltersChange={handleFiltersChanged}
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
                <p className="font-editorial text-[0.7rem] text-olive-500/80 mt-1 tracking-wide">
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
                    className="w-[85vw] sm:w-[360px] p-4 overflow-y-auto [&>button:last-child]:hidden"
                  >
                    <SheetHeader className="sr-only">
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <FiltresBijouWrapper
                      urlParamsArray={urlParamsArray}
                      handleFiltersChange={handleFiltersChanged}
                      onClose={() => setMobileFilterOpen(false)}
                      variant="card"
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
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
                <p className="font-editorial text-[0.7rem] text-olive-500 tracking-wide">
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
