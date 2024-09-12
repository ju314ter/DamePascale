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
import { MinusCircle } from "lucide-react";
import { usePanier, Item } from "@/store/panier-store";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { createCheckoutSession } from "@/app/(main)/(context)/actions";

const PanierWrapper = () => {
  const { panier } = usePanier();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData: any) => {
    const result = await createCheckoutSession(panier);
    console.log("result", result);

    // TODO : If result.url = success, descrease panier items sanity stock
    // if (result.url) {
    //   window.location.href = result.url;
    // }
  };

  return (
    <Sheet key={"right"}>
      <SheetTrigger
        className="relative flex justify-center items-center h-[50px] w-[40%]"
        asChild
      >
        <div className="panier h-full flex justify-center items-center">
          <Button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="hover:fill-secondary"
            >
              <path d="M16 6v-2c0-2.209-1.791-4-4-4s-4 1.791-4 4v2h-5v18h18v-18h-5zm-7-2c0-1.654 1.346-3 3-3s3 1.346 3 3v2h-6v-2zm10 18h-14v-14h3v1.5c0 .276.224.5.5.5s.5-.224.5-.5v-1.5h6v1.5c0 .276.224.5.5.5s.5-.224.5-.5v-1.5h3v14z" />
            </svg>
            {panier && panier.length > 0 && (
              <div className="absolute rounded-full bg-secondary w-4 h-4 right-[50%] bottom-0 flex justify-center items-end animate-scale origin-center">
                <span className="text-xs">{panier.length}</span>
              </div>
            )}
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
        {panier.length > 0 && (
          <>
            {panier.map((item) => (
              <PanierCard key={item.type._id} {...item} />
            ))}
            <SheetFooter className="flex flex-col justify-center items-center pt-10 gap-10">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col items-start justify-end w-full gap-3">
                  <span className="underline">Total</span>
                  <span>Panier</span>
                  <span>Livraison</span>
                  <Textarea
                    {...register("message")}
                    placeholder="Un message, une précision sur la commande ?"
                  />
                </div>
                <SheetClose
                  asChild
                  className="flex justify-center items-center w-[75%]"
                >
                  <Button type="submit" variant={"cta"}>
                    Confirmer
                  </Button>
                </SheetClose>
              </form>
            </SheetFooter>
          </>
        )}
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
          className="p-2"
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
