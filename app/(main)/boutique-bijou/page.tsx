"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Bijou, BijouFilters, getBijoux } from "@/sanity/lib/bijoux/calls";
import FiltresBijouWrapper from "@/components/filtres/filtres-bijou-wrapper";
import CardBijou from "@/components/product-cards/card-bijou";
import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";

const cardVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export default function BoutiqueBijouPage() {
  const [bijoux, setBijoux] = useState<Bijou[]>([]);
  const [sortByStock, setSortByStock] = useState<"none" | "desc" | "asc">(
    "none",
  );
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

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
    // fetch paramsUrl, if no params => fetch all, if params => fetch filtered
    if (searchParams.size === 0) fetchBijoux();
    else {
      const filters: BijouFilters = {
        categories: categoryParams,
        matieres: matiereParams,
        fleurs: fleurParams,
        price: priceParams as [number, number],
      };
      fetchBijoux(filters);
    }
  }, [searchParams, categoryParams, matiereParams, fleurParams, priceParams]);

  // Filters changed, update url params and fetch filtered amigurumis
  async function handleFiltersChanged(filtres: BijouFilters): Promise<void> {
    const url = new URL(pathname, window.location.origin);
    if (filtres.categories && filtres.categories.length > 0)
      url.searchParams.set("category", filtres.categories.join(","));
    if (filtres.matieres && filtres.matieres.length > 0)
      url.searchParams.set("matiere", filtres.matieres.join(","));
    if (filtres.fleurs && filtres.fleurs.length > 0)
      url.searchParams.set("fleur", filtres.fleurs.join(","));
    if (filtres.price) url.searchParams.set("price", filtres.price.join(","));

    window.history.pushState({}, "", url);
    fetchBijoux(filtres);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-10 pb-6 text-center">
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-olive-800 mb-3">
            Nos bijoux
          </h1>
          <p className="font-editorial text-sm text-olive-600/80 max-w-md mx-auto">
            Chaque pièce est unique, façonnée à la main avec des fleurs
            soigneusement sélectionnées.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 py-6">
          <FiltresBijouWrapper
            urlParamsArray={urlParamsArray}
            handleFiltersChange={(filtres) => handleFiltersChanged(filtres)}
          />
          <Button
            variant="outline"
            onClick={() =>
              setSortByStock((prev) => {
                const next =
                  prev === "desc" ? "asc" : prev === "asc" ? "none" : "desc";
                setCurrentPage(1);
                return next;
              })
            }
          >
            {sortByStock === "none"
              ? "Trier par stock"
              : sortByStock === "desc"
                ? "Stock: élevé → faible"
                : "Stock: faible → élevé"}
          </Button>
          <div className="flex flex-wrap items-center gap-3 font-editorial text-sm text-olive-600">
            <select
              id="itemsPerPage"
              className="h-9 rounded-md border border-olive-300/40 bg-transparent px-3 font-editorial text-sm text-olive-700"
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
            >
              {[20, 30, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="font-editorial text-sm text-olive-600">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
        <div className="pb-4">
          <p className="font-editorial text-sm text-olive-600/80">
            {sortedBijoux.length} références trouvées
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
          {paginatedBijoux.map((bijou, i) => (
            <motion.div
              key={bijou._id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="w-full flex p-2"
            >
              <CardBijou item={bijou} />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
