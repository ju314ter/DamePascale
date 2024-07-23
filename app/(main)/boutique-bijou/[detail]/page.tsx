"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/client";
import { Bijou, getBijouById } from "@/sanity/lib/bijoux/calls";

interface Params {
  [key: string]: string | string[];
}

const ProductDetailBijouPage = () => {
  const params: Params = useParams();
  const [bijou, setBijou] = useState<Bijou | null>(null);

  useEffect(() => {
    async function fetchBijou() {
      if (typeof params.detail === "string") {
        const data = await getBijouById(params.detail);
        setBijou(data);
      } else {
        console.error("Invalid ID format");
      }
    }
    fetchBijou();
  }, [params]);

  if (!bijou) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page w-full max-w-[1200px] mx-auto p-5">
      <div className="product-header flex flex-col md:flex-row gap-8">
        <div className="product-image w-full md:w-1/2">
          <Image
            priority
            src={urlFor(bijou.highlightedImg).url()}
            alt={bijou.name}
            width={1000}
            height={1000}
            className="hover:scale-105 transition-all duration-300"
          />
        </div>
        <div className="product-info w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-primary">{bijou.name}</h1>
          <div className="product-tags flex gap-2">
            <Badge variant={"outline"}>{bijou.category.title}</Badge>
            <Badge variant={"default"}>{bijou.matiere.title}</Badge>
            <Badge variant={"default"}>{bijou.fleur.title}</Badge>
            {bijou.promotionDiscount && (
              <Badge variant={"destructive"}>Promo</Badge>
            )}
          </div>
          <p className="text-lg text-accent">{bijou.description}</p>
          <div className="product-price flex items-center gap-2 text-lg font-bold text-primary">
            {bijou.promotionDiscount ? (
              <>
                <span className="line-through">€{bijou.price}</span>
                <ArrowRight strokeWidth={4} />
                <span className="text-black">
                  €{bijou.price * (1 - bijou.promotionDiscount / 100)}
                </span>
              </>
            ) : (
              <span>€{bijou.price}</span>
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

export default ProductDetailBijouPage;
