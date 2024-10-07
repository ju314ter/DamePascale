"use client";

import React, { useEffect, useState } from "react";
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
import { Edit, MinusCircle } from "lucide-react";
import { usePanier, Item } from "@/store/panier-store";
import { verifyStock } from "@/sanity/lib/client";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { createCheckoutSession } from "@/app/(main)/(context)/actions";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";
import { urlForImage } from "@/sanity/lib/image";
import { useToast } from "../ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const deliverySchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  addressLine1: z.string().min(5, "Address requise"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(2, "Pays requis"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Code postal invalide"),
  message: z.string().optional(),
  codepromo: z.string().optional(),
});
export type DeliveryFormData = z.infer<typeof deliverySchema>;

const PanierWrapper = () => {
  const { panier } = usePanier();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
  });
  const { toast } = useToast();
  const [totalPanier, setTotalPanier] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [editAdress, setEditAdress] = useState(false);

  useEffect(() => {
    const totalPanier = panier
      .reduce(
        (total, item) =>
          total +
          (item.type.promotionDiscount
            ? ((100 - item.type.promotionDiscount) / 100) * item.type.price
            : item.type.price),
        0
      )
      .toFixed(2);

    setTotalPanier(Number(totalPanier));

    if (Number(totalPanier) > 50) {
      setDeliveryCost(0);
    } else {
      setDeliveryCost(5);
    }
  }, [panier]);

  const onSubmit = async (formData: DeliveryFormData) => {
    const itemsToVerify = panier.map((item) => ({
      id: item.type._id,
      quantity: item.qty,
    }));
    const { allAvailable, stockStatus } = await verifyStock(itemsToVerify);

    if (!allAvailable) {
      console.error(
        "Some items are out of stock:",
        stockStatus.filter((item: any) => !item.isAvailable)
      );
      toast({
        title: "Impossible de passer en mode de paiement",
        description: "Certains produits ne sont plus en stock",
      });
      return;
    }
    const result = await createCheckoutSession(panier, formData, deliveryCost);
    console.log(result);
    if (!result.url) {
      toast({
        title: "Impossible de passer en mode de paiement",
      });
      return;
    }
    if (result.url) {
      window.location.href = result.url;
    }
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
      <SheetContent side="right" className="overflow-x-hidden">
        <SheetHeader>
          <SheetTitle className="text-xl">Panier</SheetTitle>
          <SheetDescription>Retrouvez tout votre sélection.</SheetDescription>
        </SheetHeader>
        {panier.length <= 0 && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4"
          >
            Vous n&apos;avez aucun objet dans le panier
          </motion.div>
        )}
        {panier.length > 0 && (
          <>
            <AnimatePresence>
              {panier.map((item) => (
                <PanierCard key={item.type._id} {...item} />
              ))}
            </AnimatePresence>
            <SheetFooter className="flex flex-col justify-center items-center pt-10 gap-10">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col items-start justify-end w-full gap-3">
                  <div className="flex justify-between items-center w-full">
                    <span className="underline">Total</span>
                    <span className="text-xl">
                      {totalPanier + deliveryCost} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span>Panier</span>
                    <span>{totalPanier} €</span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span>Livraison</span>
                    <span>{deliveryCost ? `${deliveryCost}€` : "Offert"}</span>
                  </div>
                  {deliveryCost ? (
                    <div className="flex justify-between items-center w-full italic">
                      <span className="text-sm text-accent">
                        Frais de port offerts au dessus de 50€
                      </span>
                    </div>
                  ) : null}
                  {/* Adresse de livraison */}
                  <div className="flex justify-between items-center w-full">
                    <span>Adresse de livraison</span>
                    <span className="hover:text-accent">
                      <Edit onClick={() => setEditAdress(!editAdress)} />
                    </span>
                  </div>
                  <AnimatePresence>
                    {editAdress && (
                      <motion.div
                        className="flex flex-col gap-2 w-full"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        layout
                      >
                        <div>
                          <Label htmlFor="fullName">Nom complet</Label>
                          <Input {...register("fullName")} id="fullName" />
                          {errors.fullName && (
                            <span className="text-destructive">
                              {errors.fullName.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="addressLine1">Adresse ligne 1</Label>
                          <Input
                            {...register("addressLine1")}
                            id="addressLine1"
                          />
                          {errors.addressLine1 && (
                            <span className="text-destructive">
                              {errors.addressLine1.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="addressLine2">Addresse ligne 2</Label>
                          <Input
                            {...register("addressLine2")}
                            id="addressLine2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input {...register("city")} id="city" />
                          {errors.city && (
                            <span className="text-destructive">
                              {errors.city.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Code postal</Label>
                          <Input {...register("postalCode")} id="postalCode" />
                          {errors.postalCode && (
                            <span className="text-destructive">
                              {errors.postalCode.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="country">Pays</Label>
                          <Input {...register("country")} id="country" />
                          {errors.country && (
                            <span className="text-destructive">
                              {errors.country.message}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div layout className="flex flex-col gap-2 w-full">
                    <Textarea
                      {...register("message")}
                      placeholder="Un message, une précision sur la commande ?"
                      className="p-4 my-2 w-full"
                    />
                  </motion.div>
                  <motion.div layout className="flex flex-col gap-2 w-full">
                    <Input
                      {...register("codepromo")}
                      placeholder="Code promo ?"
                      className="p-4 my-2 w-full"
                    />
                  </motion.div>
                  {Object.keys(errors).length > 0 && (
                    <span className="text-destructive">
                      Merci de compléter les champs obligatoires
                    </span>
                  )}
                  <SheetClose
                    asChild
                    className="flex justify-center items-center w-[75%]"
                    onClick={(e) => {
                      if (Object.keys(errors).length > 0 || !isDirty) {
                        setEditAdress(true);
                        toast({
                          title: "Formulaire invalide",
                          description: "Merci de compléter les champs requis",
                        });
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      type="submit"
                      variant={"cta"}
                      className="w-full py-4"
                    >
                      Confirmer
                    </Button>
                  </SheetClose>
                </div>
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
    <motion.div
      key={item.type._id}
      className="w-full flex items-center justify-between gap-5 my-2"
      layout
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
    >
      <div>
        <ImageWithPlaceholder
          src={urlForImage(item.type.highlightedImg)}
          alt={item.type.name}
          width={50}
          height={50}
          className="rounded-md"
        />
      </div>
      <div>{item.type.name}</div>

      {item.type.promotionDiscount && (
        <div>
          {item.qty} x{" "}
          {(item.type.price * (1 - item.type.promotionDiscount / 100)).toFixed(
            2
          )}
          €
        </div>
      )}
      {!item.type.promotionDiscount && (
        <div className="flex flex-wrap">
          {item.qty} x {item.type.price}€
        </div>
      )}
      <Button
        variant={"destructive"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          +removeFromPanier(item.type);
        }}
      >
        <MinusCircle />
      </Button>
    </motion.div>
  );
};

export default PanierWrapper;
