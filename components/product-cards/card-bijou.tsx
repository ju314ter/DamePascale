import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { ArrowRight, ShoppingCart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bijou } from "@/sanity/lib/bijoux/calls";
import { usePanier } from "@/store/panier-store";
import clsx from "clsx";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { urlForImage } from "@/sanity/lib/image";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";

interface CardBijouProps {
  item: Bijou;
}

const CardBijou = ({ item }: CardBijouProps) => {
  const { addToPanier, removeFromPanier } = usePanier();
  const hasItemInCart = usePanier().panier.some(
    (obj) => obj.type._id === item._id
  );
  return (
    <Card className="w-full min-h-[400px] group bg-white border-secondary rounded-md product-card flex justify-center items-center flex-col drop-shadow-sm hover:bg-secondary hover:-translate-y-1 transition-all duration-700">
      <Link
        href={`/boutique-bijou/${item._id}`}
        className="w-full h-full flex justify-between flex-col"
      >
        <div className="card-tags w-full flex justify-around p-2 start font-sans flex-wrap gap-1">
          <div className="flex flex-wrap gap-1 justify-center">
            {item.categories && item.categories.length > 0 ? (
              item.categories.map((cat) => (
                <Badge variant="default" key={cat._id}>
                  {cat.title}
                </Badge>
              ))
            ) : (
              <Badge variant="default">No category</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {item.fleurs && item.fleurs.length > 0 ? (
              item.fleurs.map((fleur) => (
                <Badge variant="outline" key={fleur._id}>
                  {fleur.title}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No fleur</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {item.matieres && item.matieres.length > 0 ? (
              item.matieres.map((matiere) => (
                <Badge variant="outline" key={matiere._id}>
                  {matiere.title}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No matière</Badge>
            )}
          </div>
          {/* <Badge variant={"outline"}>{item.matiere.title}</Badge>
          <Badge variant={"outline"}>{item.fleur.title}</Badge>
          <Badge variant={"default"}>{item.category.title}</Badge> */}
        </div>
        <div className="overflow-hidden relative w-full h-[40%] flex justify-center items-center">
          {item.stock === 0 && (
            <div className="absolute flex justify-center items-center bg-orange-500 top-0 left-0 right-0 z-10">
              Victime de son succès !
            </div>
          )}
          {item.promotionDiscount && (
            <Badge
              className="absolute bottom-2 left-2 z-10"
              variant={"destructive"}
            >
              Promo
            </Badge>
          )}
          <ImageWithPlaceholder
            src={urlForImage(item.highlightedImg)}
            alt={item.name}
            width={300}
            height={300}
            className="transition-all duration-500 w-[100%] rounded-sm"
          />
        </div>
        <p className="text-xl text-center p-2 mt-4 font-serif font-bold text-primary group-hover:text-black group-hover:translate-x-1 transition-all duration-700">
          {item.name}
        </p>
        <div className="flex w-full items-center justify-center text-lg font-bold pb-2 text-primary gap-2">
          {item.promotionDiscount ? (
            <div className="flex flex-col sm:flex-row items-center">
              <span className="line-through">€{item.price}</span>
              <ArrowRight strokeWidth={3} className="hidden sm:block" />
              <span className="text-black">
                €{(item.price * (1 - item.promotionDiscount / 100)).toFixed(2)}
              </span>
            </div>
          ) : (
            <span>€{item.price}</span>
          )}
        </div>
        <div className="card-buttons w-full flex flex-col md:flex-row gap-2 justify-around items-center p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"cta"}
                  className={clsx("min-w-24")}
                  disabled={item.stock <= 0}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const message = await addToPanier(item);
                      toast({
                        title: message,
                        action: (
                          <ToastAction
                            altText="Retirer du panier"
                            onClick={() => {
                              removeFromPanier(item);
                            }}
                          >
                            Annuler
                          </ToastAction>
                        ),
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        toast({
                          title: error.message,
                        });
                      }
                    }
                  }}
                >
                  <ShoppingCart size={24} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border-none">
                <p>Ajouter au panier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <p className="text-xs text-gray-500">Stock : {item.stock}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CardBijou;
