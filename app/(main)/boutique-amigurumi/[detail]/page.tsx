"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Amigurumi, getAmigurumiById } from "@/sanity/lib/amigurumis/calls";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { urlFor } from "@/sanity/lib/client";
import { usePanier } from "@/store/panier-store";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CarouselProduct } from "@/components/carousel/carouselProduct";

interface Params {
  [key: string]: string | string[];
}

const ProductDetailAmigurumiPage = () => {
  const params: Params = useParams();
  const [amigurumi, setAmigurumi] = useState<Amigurumi | null>(null);
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

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
  }, [params]);

  if (!amigurumi) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-[1200px] min-h-[100vh] mx-auto pt-[10vh] p-5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-10">
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
          <CarouselProduct slides={amigurumi.imageGallery} />
        </div>
        <div className="product-info w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-primary">{amigurumi.name}</h1>
          <div className="product-tags flex gap-2">
            <div className="flex flex-wrap gap-1 justify-center">
              {amigurumi.categories && amigurumi.categories.length > 0 ? (
                amigurumi.categories.map((cat) => (
                  <Badge variant={"outline"} key={cat._id}>
                    {cat.title}
                  </Badge>
                ))
              ) : (
                <Badge variant="default">No category</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {amigurumi.universes && amigurumi.universes.length > 0 ? (
                amigurumi.universes.map((uni) => (
                  <Badge variant={"default"} key={uni._id}>
                    {uni.title}
                  </Badge>
                ))
              ) : (
                <Badge variant="default">No universes</Badge>
              )}
            </div>
            {amigurumi.promotionDiscount && (
              <Badge variant={"destructive"}>Promo</Badge>
            )}
          </div>
          <div>
            {amigurumi.description &&
              // Legacy behaviour: description used to be a text string before being an array of blocks
              (Array.isArray(amigurumi.description) ? (
                amigurumi.description.map((block: any) => (
                  <div key={block._key}>
                    {block.children.map((child: any) => (
                      <p key={child._key}>{child.text}</p>
                    ))}
                  </div>
                ))
              ) : (
                <p>{amigurumi.description}</p>
              ))}
          </div>
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
          <Button
            variant={"cta"}
            className="mt-4"
            onClick={(e) => {
              e.preventDefault();
              addToPanier(amigurumi);
              toast({
                title: `${amigurumi.name} ajouté au panier`,
                action: (
                  <ToastAction
                    altText="Retirer du panier"
                    onClick={() => {
                      removeFromPanier(amigurumi);
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

export default ProductDetailAmigurumiPage;
