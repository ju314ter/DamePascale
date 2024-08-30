"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Amigurumi, getAmigurumiById } from "@/sanity/lib/amigurumis/calls";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/client";

interface Params {
  [key: string]: string | string[];
}

const ProductDetailAmigurumiPage = () => {
  const params: Params = useParams();
  const [amigurumi, setAmigurumi] = useState<Amigurumi | null>(null);

  useEffect(() => {
    async function fetchAmigurumi() {
      if (typeof params.detail === "string") {
        const data = await getAmigurumiById(params.detail);
        setAmigurumi(data);
      } else {
        console.error("Invalid ID format");
      }
    }
    fetchAmigurumi();
    console.log(params);
  }, [params]);

  if (!amigurumi) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page w-full max-w-[1200px] mx-auto pt-[10vh] p-5">
      <div className="product-header flex flex-col md:flex-row gap-8">
        <div className="product-image w-full md:w-1/2">
          <Image
            priority
            src={urlFor(amigurumi.highlightedImg).url()}
            alt={amigurumi.name}
            width={1000}
            height={1000}
            className="hover:scale-105 transition-all duration-300"
          />
        </div>
        <div className="product-info w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-primary">{amigurumi.name}</h1>
          <div className="product-tags flex gap-2">
            {/* <Badge variant={"outline"}>{amigurumi.categories.title}</Badge>
            <Badge variant={"default"}>{amigurumi.universes.title}</Badge> */}
            {amigurumi.promotionDiscount && (
              <Badge variant={"destructive"}>Promo</Badge>
            )}
          </div>
          <p className="text-lg text-accent">{amigurumi.description}</p>
          <div className="product-price flex items-center gap-2 text-lg font-bold text-primary">
            {amigurumi.promotionDiscount ? (
              <>
                <span className="line-through">€{amigurumi.price}</span>
                <ArrowRight strokeWidth={4} />
                <span className="text-black">
                  €{amigurumi.price * (1 - amigurumi.promotionDiscount / 100)}
                </span>
              </>
            ) : (
              <span>€{amigurumi.price}</span>
            )}
          </div>
          <Button variant={"cta"} className="mt-4">
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAmigurumiPage;
