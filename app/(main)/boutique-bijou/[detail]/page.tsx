"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/client";
import { Bijou, getBijouById } from "@/sanity/lib/bijoux/calls";
import { usePanier } from "@/store/panier-store";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CarouselProduct } from "@/components/carousel/carouselProduct";
import ProductDescription from "@/components/product-description/productDescription";

interface Params {
  [key: string]: string | string[];
}

const ProductDetailBijouPage = () => {
  const params: Params = useParams();
  const [bijou, setBijou] = useState<Bijou | null>(null);
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

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
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="relative w-full max-w-[1200px] min-h-[100vh] mx-auto pt-[10vh] p-5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <Image
          src="/transparentknittingtexture.png"
          alt="Transparent texture"
          style={{ opacity: 0.2 }}
          width={1024}
          height={1024}
        />
      </div>

      <div className="product-header relative z-20 flex flex-col md:flex-row gap-8">
        <div className="product-image w-full md:w-1/2">
          <CarouselProduct slides={bijou.imageGallery} />
        </div>
        <div className="product-info w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-primary">{bijou.name}</h1>
          <div className="product-tags flex gap-2">
            <div className="flex flex-wrap gap-1 justify-center">
              {bijou.categories && bijou.categories.length > 0 ? (
                bijou.categories.map((cat) => (
                  <Badge variant={"outline"} key={cat._id}>
                    {cat.title}
                  </Badge>
                ))
              ) : (
                <Badge variant="default">No category</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {bijou.matieres && bijou.matieres.length > 0 ? (
                bijou.matieres.map((mat) => (
                  <Badge variant={"default"} key={mat._id}>
                    {mat.title}
                  </Badge>
                ))
              ) : (
                <Badge variant="default">No universes</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {bijou.fleurs && bijou.fleurs.length > 0 ? (
                bijou.fleurs.map((fleur) => (
                  <Badge variant={"default"} key={fleur._id}>
                    {fleur.title}
                  </Badge>
                ))
              ) : (
                <Badge variant="default">No universes</Badge>
              )}
            </div>
            {bijou.promotionDiscount && (
              <Badge variant={"destructive"}>Promo</Badge>
            )}
          </div>
          <div>
            {bijou.description &&
              // Legacy behaviour: description used to be a text string before being an array of blocks
              (Array.isArray(bijou.description) ? (
                <ProductDescription content={bijou.description} />
              ) : (
                <p>{bijou.description}</p>
              ))}
          </div>
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
          <Button
            variant={"cta"}
            className="mt-4"
            onClick={(e) => {
              e.preventDefault();
              addToPanier(bijou);
              toast({
                title: `${bijou.name} ajouté au panier`,
                action: (
                  <ToastAction
                    altText="Retirer du panier"
                    onClick={() => {
                      removeFromPanier(bijou);
                    }}
                  >
                    Annuler
                  </ToastAction>
                ),
              });
            }}
          >
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBijouPage;
