"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Edit, MinusCircle, ShoppingBag } from "lucide-react";
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
import { getCodePromo } from "@/sanity/lib/general/calls";

const deliverySchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  addressLine1: z.string().min(5, "Addresse requise"),
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
    getValues,
    setError,
    clearErrors,
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
  });
  const { toast } = useToast();
  const [totalPanier, setTotalPanier] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [editAdress, setEditAdress] = useState(false);
  const [existingCodePromo, setExistingCodePromo] = useState<
    {
      title: string;
      code: string;
      type: "absolute" | "percent";
      reductionPercent: number;
    }[]
  >();
  const [promotionMessage, setPromotionMessage] = useState<string | null>("");

  useEffect(() => {
    const totalPanier = panier
      .reduce((total, item) => {
        return (
          total +
          (item.type.promotionDiscount
            ? ((100 - item.type.promotionDiscount) / 100) * item.type.price
            : item.type.price * item.qty)
        );
      }, 0)
      .toFixed(2);

    setTotalPanier(Number(totalPanier));

    if (Number(totalPanier) > 50) {
      setDeliveryCost(0);
    } else {
      setDeliveryCost(4.99);
    }
  }, [panier]);

  // Get current code promo at init
  useEffect(() => {
    const fetchCodePromo = async () => {
      const codes = await getCodePromo();
      if (codes.length > 0) {
        setExistingCodePromo(codes);
      }
    };

    fetchCodePromo();
  }, []);

  const checkCodePromo = async () => {
    const codePromo = getValues("codepromo");

    if (!codePromo || codePromo.length === 0 || codePromo === "") {
      setPromotionMessage(null);
      clearErrors("codepromo");
      return;
    }

    const isCodeValid = existingCodePromo?.some(
      (code) => code.code.toLowerCase() === codePromo?.toLowerCase()
    );

    if (isCodeValid) {
      const validCode = existingCodePromo?.find(
        (code) => code.code.toLowerCase() === codePromo?.toLowerCase()
      );
      setPromotionMessage(
        `Code promo "${validCode?.code}" appliqué (${validCode?.reductionPercent}${validCode?.type === "absolute" ? "€" : "%"} de réduction)`
      );
      clearErrors("codepromo");
    } else {
      setPromotionMessage("Code promo invalide");
      setError("codepromo", { type: "custom", message: "Code promo invalide" });
    }
  };

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
    const itemsForCheckout = panier.map((item) => ({
      id: item.type._id,
      qty: item.qty,
    }));
    const result = await createCheckoutSession(itemsForCheckout, formData);
    if (!result.url) {
      toast({
        title: "Impossible de passer en mode de paiement",
      });
      return;
    }
    if (result.error) {
      toast({
        title: "Impossible de passer en mode de paiement",
        description: result.error,
      });
      return;
    }
    if (result.url) {
      window.location.href = result.url;
    }
  };

  const itemCount = panier.reduce((total, item) => total + item.qty, 0);

  return (
    <Sheet key={"right"}>
      <SheetTrigger asChild>
        <button
          className="relative bg-transparent border-none cursor-pointer p-2 group"
          aria-label="Panier"
        >
          <ShoppingBag
            className="w-6 h-6 text-olive-600 group-hover:text-bronze-500 transition-colors"
            strokeWidth={1.5}
          />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-bronze-500 text-cream-50 text-[0.65rem] font-medium flex items-center justify-center animate-scale origin-center">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="overflow-y-auto overflow-x-hidden border-l-olive-200/30"
        style={{ backgroundColor: "#fefcf7" }}
      >
        <SheetHeader>
          <SheetTitle className="font-hand text-2xl text-olive-700">
            Votre panier
          </SheetTitle>
          <p className="font-editorial text-sm text-olive-600/70">
            Retrouvez toute votre sélection.
          </p>
        </SheetHeader>

        {panier.length <= 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 text-center"
          >
            <ShoppingBag
              className="w-12 h-12 text-olive-300/50 mx-auto mb-4"
              strokeWidth={1}
            />
            <p className="font-editorial text-sm text-olive-600/70">
              Votre panier est vide
            </p>
          </motion.div>
        )}

        {panier.length > 0 && (
          <>
            <div className="px-2 py-4 space-y-3">
              <AnimatePresence>
                {panier.map((item) => (
                  <PanierCard key={item.type._id} {...item} />
                ))}
              </AnimatePresence>
            </div>

            <SheetFooter className="flex flex-col justify-center items-center pt-6 gap-6 border-t border-olive-200/30">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col items-start justify-end w-full gap-3">
                  {/* Totals */}
                  <div className="flex justify-between items-center w-full">
                    <span className="font-editorial text-sm font-medium uppercase tracking-wider text-olive-800">
                      Total
                    </span>
                    <span className="font-hand text-xl text-olive-800">
                      {(totalPanier + deliveryCost).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-editorial text-sm text-olive-600">
                      Panier
                    </span>
                    <span className="font-editorial text-sm text-olive-700">
                      {totalPanier} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-editorial text-sm text-olive-600">
                      Livraison
                    </span>
                    <span className="font-editorial text-sm text-olive-700">
                      {deliveryCost ? `${deliveryCost}€` : "Offert"}
                    </span>
                  </div>
                  {deliveryCost ? (
                    <p className="font-editorial text-xs text-bronze-500 italic w-full">
                      Frais de port offerts au dessus de 50€
                    </p>
                  ) : null}

                  {/* Delivery address */}
                  <div className="flex justify-between items-center w-full pt-4 border-t border-olive-200/20">
                    <span className="font-editorial text-sm font-medium uppercase tracking-wider text-olive-800">
                      Adresse de livraison
                    </span>
                    <button
                      type="button"
                      className="bg-transparent border-none cursor-pointer p-1"
                      onClick={() => setEditAdress(!editAdress)}
                    >
                      <Edit className="w-4 h-4 text-olive-600 hover:text-bronze-500 transition-colors" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {editAdress && (
                      <motion.div
                        className="flex flex-col gap-3 w-full"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        layout
                      >
                        <div>
                          <Label
                            htmlFor="fullName"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Nom complet
                          </Label>
                          <Input
                            {...register("fullName")}
                            id="fullName"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                          {errors.fullName && (
                            <span className="font-editorial text-xs text-red-600">
                              {errors.fullName.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="addressLine1"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Adresse ligne 1
                          </Label>
                          <Input
                            {...register("addressLine1")}
                            id="addressLine1"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                          {errors.addressLine1 && (
                            <span className="font-editorial text-xs text-red-600">
                              {errors.addressLine1.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="addressLine2"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Adresse ligne 2
                          </Label>
                          <Input
                            {...register("addressLine2")}
                            id="addressLine2"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="city"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Ville
                          </Label>
                          <Input
                            {...register("city")}
                            id="city"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                          {errors.city && (
                            <span className="font-editorial text-xs text-red-600">
                              {errors.city.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="postalCode"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Code postal
                          </Label>
                          <Input
                            {...register("postalCode")}
                            id="postalCode"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                          {errors.postalCode && (
                            <span className="font-editorial text-xs text-red-600">
                              {errors.postalCode.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="country"
                            className="font-editorial text-xs uppercase tracking-wider text-olive-700"
                          >
                            Pays
                          </Label>
                          <Input
                            {...register("country")}
                            id="country"
                            className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500"
                          />
                          {errors.country && (
                            <span className="font-editorial text-xs text-red-600">
                              {errors.country.message}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div layout className="flex flex-col gap-2 w-full pt-2">
                    <Textarea
                      {...register("message")}
                      placeholder="Un message, une précision sur la commande ?"
                      className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500 placeholder:text-olive-300/60 resize-none"
                    />
                  </motion.div>

                  <motion.div layout className="flex flex-col gap-2 w-full">
                    <Input
                      {...register("codepromo")}
                      placeholder="Code promo ?"
                      className="bg-transparent border-olive-300/40 font-editorial text-sm text-olive-700 focus:border-olive-500 placeholder:text-olive-300/60"
                      onBlur={checkCodePromo}
                    />
                  </motion.div>

                  {promotionMessage && (
                    <span className="font-editorial text-xs text-bronze-500">
                      {promotionMessage}
                    </span>
                  )}

                  {Object.keys(errors).length > 0 && (
                    <span className="font-editorial text-xs text-red-600">
                      Merci de compléter les champs obligatoires
                    </span>
                  )}

                  <SheetClose
                    asChild
                    className="w-full pt-2"
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
                    <button
                      type="submit"
                      className="w-full py-3 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.15em] uppercase cursor-pointer border-none hover:bg-olive-800 transition-colors"
                    >
                      Confirmer la commande
                    </button>
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
      className="w-full flex items-center gap-4 p-3 rounded-sm bg-white/60 border border-olive-200/20"
      layout
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
    >
      <div className="flex-shrink-0">
        <ImageWithPlaceholder
          src={urlForImage(item.type.highlightedImg)}
          alt={item.type.name}
          width={50}
          height={50}
          className="rounded-sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-hand text-base text-olive-700 truncate">
          {item.type.name}
        </p>
        <p className="font-editorial text-xs text-olive-600/70">
          {item.qty} x{" "}
          {item.type.promotionDiscount
            ? (
                item.type.price *
                (1 - item.type.promotionDiscount / 100)
              ).toFixed(2)
            : item.type.price}
          €
        </p>
      </div>
      <button
        className="bg-transparent border-none cursor-pointer p-1 flex-shrink-0"
        onClick={(e) => {
          e.preventDefault();
          removeFromPanier(item.type);
        }}
      >
        <MinusCircle className="w-5 h-5 text-olive-400 hover:text-red-500 transition-colors" />
      </button>
    </motion.div>
  );
};

export default PanierWrapper;
