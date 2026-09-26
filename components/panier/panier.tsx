"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePanier } from "@/store/panier-store";
import { cartTotals } from "@/lib/cart";
import { CartContents } from "./cart-contents";

/** Tiroir panier global (ouvert depuis l'en-tête ou après un ajout). */
export default function CartDrawer() {
  const isOpen = usePanier((s) => s.isOpen);
  const setOpen = usePanier((s) => s.setOpen);
  const count = usePanier((s) => cartTotals(s.panier).count);
  const pathname = usePathname();

  // Le panier est stocké localement : on le recharge après le premier rendu.
  useEffect(() => {
    usePanier.persist.rehydrate();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-cream-50 gap-0"
      >
        <SheetHeader className="px-6 pt-5 pb-4 border-b border-olive-100 text-left">
          <SheetTitle className="font-hand text-3xl text-olive-700 font-normal">
            Votre panier{" "}
            {count > 0 && (
              <span className="font-editorial text-sm text-olive-500">
                ({count})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Articles sélectionnés et récapitulatif de commande
          </SheetDescription>
        </SheetHeader>
        <CartContents onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
