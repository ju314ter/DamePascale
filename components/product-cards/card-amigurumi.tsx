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
  const hasItemInCart = usePanier().panier.some(
    (item) => item.type._id === ami._id
  );
  const { toast } = useToast();

  return (
    <Card className="w-full min-h-[400px] group bg-white border-secondary rounded-md product-card flex justify-center items-center flex-col drop-shadow-sm hover:bg-secondary hover:-translate-y-1 transition-all duration-700">
      <Link
        href={`/boutique-amigurumi/${ami._id}`}
        className="w-full h-full flex justify-between flex-col"
      >
        <div className="card-tags w-full flex justify-around p-2 start flex-wrap gap-1">
          <Badge variant={"outline"}>{ami.category.title}</Badge>
          <Badge variant={"default"}>{ami.univers.title}</Badge>
        </div>
        <div className="overflow-hidden relative w-full h-[55%] flex justify-center items-center">
          {ami.promotionDiscount && (
            <Badge
              className="absolute bottom-2 left-2 z-10"
              variant={"destructive"}
            >
              Promo
            </Badge>
          )}
          {ami.size && (
            <div className="absolute bottom-2 right-2 z-10 text-lg rounded-full h-12 w-12 bg-secondary flex justify-center items-center group-hover:bg-primary group-hover:text-secondary transition-colors duration-500">
              {ami.size}
            </div>
          )}
          <Image
            priority
            src={urlFor(ami.highlightedImg).url()}
            alt={ami.name}
            width={300}
            height={300}
            className="group-hover:scale-105 transition-all duration-500 w-[60%]"
          />
        </div>
        <p className="text-2xl text-center p-2 mt-4 text-primary font-serif font-bold group-hover:text-black group-hover:translate-x-1 transition-all duration-700">
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
        <div className="card-buttons w-full flex justify-around items-center p-4">
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
