import { Amigurumi } from "@/sanity/lib/amigurumis/calls";
import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
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

interface CardAmigurumiProps {
  ami: Amigurumi;
}

const CardAmigurumi = ({ ami }: CardAmigurumiProps) => {
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

  if (!ami) return null;

  return (
    <Card className="w-full min-h-[400px] group bg-white border-secondary rounded-md product-card flex justify-center items-center flex-col drop-shadow-sm hover:bg-secondary hover:-translate-y-1 transition-all duration-700">
      <Link
        href={`/boutique-amigurumi/${ami._id}`}
        className="w-full h-full flex justify-start flex-col"
      >
        <div className="card-tags w-full flex justify-around p-2 start flex-wrap gap-1">
          <div className="flex flex-wrap gap-1 justify-center">
            {ami.categories && ami.categories.length > 0 ? (
              ami.categories.map((cat) => (
                <Badge variant="default" key={cat._id}>
                  {cat.title}
                </Badge>
              ))
            ) : (
              <Badge variant="default">No category</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {ami.universes && ami.universes.length > 0 ? (
              ami.universes.map((uni) => (
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
          {ami.promotionDiscount && (
            <Badge
              className="absolute bottom-2 left-2 z-10"
              variant={"destructive"}
            >
              Promo
            </Badge>
          )}
          <Image
            priority
            src={urlFor(ami.highlightedImg).url()}
            alt={ami.name}
            width={300}
            height={300}
            className="w-[100%]"
          />
        </div>
        <p className="text-2xl text-center p-2 text-primary font-serif font-bold group-hover:text-black group-hover:translate-x-1 transition-all duration-700">
          {ami.name}
        </p>
        <div className="flex w-full items-center justify-center text-lg font-bold pb-2 text-primary gap-2">
          {ami.promotionDiscount ? (
            <div className="flex flex-col sm:flex-row items-center">
              <span className="line-through">€{ami.price}</span>
              <ArrowRight strokeWidth={3} className="hidden sm:block" />
              <span className="text-black">
                €{(ami.price * (1 - ami.promotionDiscount / 100)).toFixed(2)}
              </span>
            </div>
          ) : (
            <span>€{ami.price}</span>
          )}
        </div>
        <div className="card-buttons w-full flex justify-around items-center p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"cta"}
                  className={clsx("min-w-24")}
                  onClick={(e) => {
                    e.preventDefault();
                    addToPanier(ami);
                    toast({
                      title: `${ami.name} ajouté au panier`,
                      action: (
                        <ToastAction
                          altText="Retirer du panier"
                          onClick={() => {
                            removeFromPanier(ami);
                          }}
                        >
                          Annuler
                        </ToastAction>
                      ),
                    });
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
        </div>
      </Link>
    </Card>
  );
};

export default CardAmigurumi;
