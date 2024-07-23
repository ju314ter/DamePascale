"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Bijou, BijouFilters, getBijoux } from "@/sanity/lib/bijoux/calls";
import FiltresBijouWrapper from "@/components/filtres/filtres-bijou-wrapper";
import HerobannerBijou from "@/components/herobanner/herobannerBijou";
import CardBijou from "@/components/product-cards/card-bijou";

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

  async function fetchBijoux(filters?: BijouFilters) {
    const data = filters ? await getBijoux(filters) : await getBijoux();
    setBijoux(data);
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParams = useMemo(
    () => searchParams.get("category")?.split(",") || [],
    [searchParams]
  );
  const matiereParams = useMemo(
    () => searchParams.get("matiere")?.split(",") || [],
    [searchParams]
  );
  const fleurParams = useMemo(
    () => searchParams.get("fleur")?.split(",") || [],
    [searchParams]
  );
  const priceParams = useMemo(
    () => searchParams.get("price")?.split(",").map(Number) || [0, 100],
    [searchParams]
  );
  const sizeParams = useMemo(
    () => searchParams.get("size")?.split(",") || [],
    [searchParams]
  );
  const urlParamsArray = {
    category: categoryParams,
    matiere: matiereParams,
    fleur: fleurParams,
    size: sizeParams,
    price: priceParams,
  };

  useEffect(() => {
    // fetch paramsUrl, if no params => fetch all, if params => fetch filtered
    if (searchParams.size === 0) fetchBijoux();
    else {
      const filters: BijouFilters = {
        category: categoryParams,
        matiere: matiereParams,
        fleur: fleurParams,
        size: sizeParams as ("S" | "M" | "L")[],
        price: priceParams as [number, number],
      };
      fetchBijoux(filters);
    }
  }, [
    searchParams,
    categoryParams,
    matiereParams,
    fleurParams,
    sizeParams,
    priceParams,
  ]);

  // Filters changed, update url params and fetch filtered amigurumis
  async function handleFiltersChanged(filtres: BijouFilters): Promise<void> {
    const url = new URL(pathname, window.location.origin);
    if (filtres.category)
      url.searchParams.set("category", filtres.category.join(","));
    if (filtres.matiere)
      url.searchParams.set("matiere", filtres.matiere.join(","));
    if (filtres.fleur) url.searchParams.set("fleur", filtres.fleur.join(","));
    if (filtres.size) url.searchParams.set("size", filtres.size.join(","));
    if (filtres.price) url.searchParams.set("price", filtres.price.join(","));

    window.history.pushState({}, "", url);
    fetchBijoux(filtres);
  }

  const shopWrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: shopWrapperRef });

  return (
    <div className="shop-wrapper h-[97vh] overflow-auto" ref={shopWrapperRef}>
      <div className="hero border-b border-secondary h-[500px] w-full bg-transparent flex justify-center items-center overflow-hidden">
        <HerobannerBijou scrollPosition={scrollYProgress} />
      </div>
      <div className="shop">
        <div className="entete"></div>
        <div className="produits flex flex-col min-h-[100vh]">
          <div className="filtres flex justify-center items-center gap-8 sm:gap-16 h-12 bg-white py-14">
            <FiltresBijouWrapper
              urlParamsArray={urlParamsArray}
              handleFiltersChange={(filtres) => handleFiltersChanged(filtres)}
            />
          </div>
          <div className="liste-wrapper w-full max-w-[1200px] mx-auto p-5">
            <div className="mx-auto font-bold p-2 text-primary">
              {bijoux.length} références trouvé.e.s
            </div>
            <div className="liste grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
              {bijoux.map((bijou, i) => (
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
        </div>
      </div>
    </div>
  );
}
