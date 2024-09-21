"use client";

import FiltresAmigurumiWrapper from "@/components/filtres/filtres-amigurumi-wrapper";
import {
  Amigurumi,
  AmigurumiFilters,
  getAmigurumis,
} from "@/sanity/lib/amigurumis/calls";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import HerobannerAmigurumi from "@/components/herobanner/herobannerAmigurumi";
import CardAmigurumi from "@/components/product-cards/card-amigurumi";
import Footer from "@/components/footer/footer";

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

export default function BoutiquePage() {
  const [amigurumis, setAmigurumis] = useState<Amigurumi[]>([]);

  async function fetchAmigurumis(filters?: AmigurumiFilters) {
    const data = filters ? await getAmigurumis(filters) : await getAmigurumis();
    setAmigurumis(data);
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParams = useMemo(
    () => searchParams.get("category")?.split(",") || [],
    [searchParams]
  );
  const universParams = useMemo(
    () => searchParams.get("univers")?.split(",") || [],
    [searchParams]
  );
  const priceParams: [number, number] = useMemo(() => {
    const prices = searchParams.get("price")?.split(",").map(Number) || [];
    return [prices[0] || 0, prices[1] || 100]; // Ensure it returns a tuple
  }, [searchParams]);

  const urlParamsArray = {
    categories: categoryParams,
    universes: universParams,
    price: priceParams as [number, number],
  };

  useEffect(() => {
    // fetch paramsUrl, if no params => fetch all, if params => fetch filtered
    if (searchParams.size === 0) fetchAmigurumis();
    else {
      const filters: AmigurumiFilters = {
        categories: categoryParams,
        universes: universParams,
        price: priceParams as [number, number],
      };
      fetchAmigurumis(filters);
    }
  }, [searchParams, categoryParams, universParams, priceParams]);

  // Filters changed, update url params and fetch filtered amigurumis
  async function handleFiltersChanged(
    filtres: AmigurumiFilters
  ): Promise<void> {
    const url = new URL(pathname, window.location.origin);

    if (filtres.categories && filtres.categories.length > 0)
      url.searchParams.set("category", filtres.categories.join(","));
    if (filtres.universes && filtres.universes.length > 0)
      url.searchParams.set("univers", filtres.universes.join(","));
    if (filtres.price) url.searchParams.set("price", filtres.price.join(","));

    window.history.pushState({}, "", url);
    fetchAmigurumis(filtres);
  }

  const shopWrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: shopWrapperRef });

  return (
    <div className="shop-wrapper h-[100vh] overflow-auto" ref={shopWrapperRef}>
      <div className="hero border-b border-secondary h-[500px] w-full bg-transparent flex justify-center items-center overflow-hidden">
        <HerobannerAmigurumi scrollPosition={scrollYProgress} />
      </div>
      <div className="shop">
        <div className="entete"></div>
        <div className="produits flex flex-col min-h-[100vh]">
          <div className="filtres flex justify-center items-center gap-8 sm:gap-16 h-12 bg-white py-14">
            <FiltresAmigurumiWrapper
              urlParamsArray={urlParamsArray}
              handleFiltersChange={(filtres) => handleFiltersChanged(filtres)}
            />
          </div>
          <div className="liste-wrapper w-full max-w-[1200px] mx-auto p-5">
            <div className="mx-auto font-bold p-2 text-primary">
              {amigurumis.length} références trouvé.e.s
            </div>
            <div className="liste grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
              {amigurumis.map((ami, i) => (
                <motion.div
                  key={ami._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="w-full flex p-2"
                >
                  <CardAmigurumi item={ami} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
