import { Amigurumi } from "@/sanity/lib/amigurumis/calls";
import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, ShoppingCart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePanier } from "@/store/panier-store";
import clsx from "clsx";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";
import { urlForImage } from "@/sanity/lib/image";

interface CardAmigurumiProps {
  item: Amigurumi;
}

const CardAmigurumi = ({ item }: CardAmigurumiProps) => {
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

  if (!item) return null;

  return (
    <Card className="w-full group bg-white border-secondary rounded-md product-card flex justify-center items-center flex-col drop-shadow-sm hover:bg-secondary hover:-translate-y-1 transition-all duration-700">
      <Link
        href={`/boutique-amigurumi/${item._id}`}
        className="w-full h-full flex justify-around flex-col"
      >
        <div className="card-tags w-full flex justify-around p-2 flex-wrap gap-1">
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
            {item.universes && item.universes.length > 0 ? (
              item.universes.map((uni) => (
                <Badge variant="outline" key={uni._id}>
                  {uni.title}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No univers</Badge>
            )}
          </div>
        </div>
        <div className="overflow-hidden relative w-full h-[40%] flex justify-center items-center">
          {item.stock === 0 && (
            <div className="absolute flex justify-center items-center bg-orange-500 top-0 left-0 right-0 z-10">
              Victime de son succès !
            </div>
          )}
          {item.promotionDiscount === 0 && (
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
        <p className="text-2xl text-center p-2 text-primary font-serif font-bold group-hover:text-black group-hover:translate-x-1 transition-all duration-700">
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

export default CardAmigurumi;
