"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { MinusCircle, ShoppingCart } from "lucide-react";
import { usePanier, Item } from "@/store/panier-store";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { Textarea } from "../ui/textarea";

const PanierWrapper = () => {
  const { panier } = usePanier();

  return (
    <Sheet key={"right"}>
      <SheetTrigger
        className="relative flex justify-center items-center h-[50px] w-[40%]"
        asChild
      >
        <div className="panier h-full flex justify-center items-center">
          <Button className="border border-transparent hover:border-black hover:border-primary hover:bg-[#ffedd1]/50 focus:bg-[#ffedd1]/50 transition-colors">
            <ShoppingCart
              size={36}
              strokeWidth={2}
              className="text-secondary-foreground transition-all"
            />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="">
        <SheetHeader>
          <SheetTitle className="text-xl">Panier</SheetTitle>
          <SheetDescription>Retrouvez tout votre sélection.</SheetDescription>
        </SheetHeader>
        {panier.length <= 0 && (
          <div>Vous n&apos;avez aucun objet dans le panier</div>
        )}
        {panier.length > 0 &&
          panier.map((item) => <PanierCard key={item.type._id} {...item} />)}
        <SheetFooter className="flex flex-col justify-center items-center pt-10 gap-10">
          <div className="flex flex-col items-start justify-end w-full gap-3">
            <span className="underline">Total</span>
            <span>Panier</span>
            <span>Livraison</span>
            <Textarea placeholder="Un message, une précision sur la commande ?" />
          </div>
          <SheetClose
            asChild
            className="flex justify-center items-center w-[75%]"
          >
            <Button type="submit" variant={"cta"}>
              Confirmer
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const PanierCard = (item: Item) => {
  const { removeFromPanier } = usePanier();

  return (
    <div
      key={item.type._id}
      className="w-full flex items-center justify-between gap-5"
    >
      <div>
        <Image
          src={urlFor(item.type.highlightedImg).url()}
          alt={item.type.name}
          width={50}
          height={50}
        />
      </div>
      <div>{item.type.name}</div>

      {item.type.promotionDiscount && (
        <div>
          {item.qty} x
          {(item.type.price * (1 - item.type.promotionDiscount / 100)).toFixed(
            2
          )}
          €
        </div>
      )}
      {!item.type.promotionDiscount && (
        <div>
          {item.qty} x {item.type.price}€
        </div>
      )}
      <Button
        variant={"destructive"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          removeFromPanier(item.type);
        }}
      >
        <MinusCircle />
      </Button>
    </div>
  );
};

export default PanierWrapper;
