"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Instagram,
  Facebook,
  Menu,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePanier } from "@/store/panier-store";
import { cartTotals } from "@/lib/cart";
import { SITE } from "@/lib/site";
import type { NavLink } from "@/sanity/lib/types";
import { NAV_ITEMS } from "./nav-items";

function normalizeHref(href: string) {
  return href.startsWith("/") ? href : `/${href}`;
}

function CartButton() {
  const count = usePanier((s) => cartTotals(s.panier).count);
  const openCart = usePanier((s) => s.openCart);
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex items-center justify-center w-11 h-11 rounded-full text-olive-700 hover:text-bronze-600 hover:bg-olive-100/50 transition-colors"
      aria-label={
        count > 0
          ? `Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`
          : "Ouvrir le panier"
      }
    >
      <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-bronze-500 text-cream-50 text-[0.62rem] font-medium flex items-center justify-center animate-scale">
          {count}
        </span>
      )}
    </button>
  );
}

export function Header({ categories }: { categories: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setShopOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_20px_rgba(96,78,48,0.08)]" : ""
      }`}
      style={{
        backgroundColor: "rgba(254,254,254,0.94)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 md:h-16">
          {/* Mobile : menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-11 h-11 rounded-full text-olive-700 hover:bg-olive-100/50"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[88vw] max-w-sm p-0 flex flex-col bg-cream-50"
              >
                <div className="px-6 pt-6 pb-4 border-b border-olive-100">
                  <SheetTitle className="font-hand text-3xl text-olive-700 font-normal">
                    Dame Pascale
                  </SheetTitle>
                  <p className="font-editorial text-xs text-olive-600 mt-1">
                    {SITE.tagline}
                  </p>
                </div>
                <nav
                  className="flex-1 overflow-y-auto px-3 py-4"
                  aria-label="Menu principal"
                >
                  <ul className="flex flex-col">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-3.5 rounded-lg font-serif-display text-xl ${
                              isActive(item.href)
                                ? "text-bronze-600 bg-olive-50"
                                : "text-olive-800"
                            }`}
                          >
                            {item.label}
                            <ArrowRight className="w-4 h-4 text-olive-300" />
                          </Link>
                        </SheetClose>
                        {item.href === "/boutique-bijou" &&
                          categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-3 pb-3">
                              {categories.map((cat) => (
                                <SheetClose asChild key={cat.href}>
                                  <Link
                                    href={normalizeHref(cat.href)}
                                    className="px-3 py-1.5 rounded-full border border-olive-200 bg-white font-editorial text-xs text-olive-700"
                                  >
                                    {cat.title}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="px-6 py-5 border-t border-olive-100 space-y-3">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="block font-editorial text-sm text-olive-700"
                  >
                    {SITE.email}
                  </a>
                  <div className="flex gap-4">
                    <a
                      href={SITE.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-olive-600"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href={SITE.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-olive-600"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo (centré sur mobile) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-2 font-hand text-2xl md:text-[1.7rem] text-olive-700 hover:text-bronze-600 transition-colors"
          >
            <Image
              src="/medaillon.png"
              alt=""
              width={34}
              height={34}
              className="rounded-full"
              priority
            />
            Dame Pascale
          </Link>

          {/* Desktop : navigation */}
          <nav className="hidden lg:block" aria-label="Menu principal">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.href === "/boutique-bijou" && categories.length > 0 ? (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`pl-3.5 pr-1 py-2 font-editorial text-[0.74rem] tracking-[0.15em] uppercase transition-colors ${
                          isActive(item.href)
                            ? "text-bronze-600"
                            : "text-olive-700 hover:text-bronze-600"
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={shopOpen}
                        aria-label="Catégories de la boutique"
                        onClick={() => setShopOpen((o) => !o)}
                        className="p-1 pr-3 text-olive-500"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {shopOpen && (
                      <div className="absolute left-0 top-full pt-2 z-50">
                        <div className="w-64 rounded-xl border border-olive-100 bg-white shadow-[0_12px_40px_rgba(96,78,48,0.12)] p-2">
                          <Link
                            href="/boutique-bijou"
                            className="block px-3 py-2.5 rounded-lg font-editorial text-sm text-olive-900 hover:bg-olive-50"
                          >
                            Toutes les pièces
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={normalizeHref(cat.href)}
                              className="block px-3 py-2 rounded-lg font-editorial text-sm text-olive-700 hover:bg-olive-50 hover:text-bronze-600"
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`px-3.5 py-2 font-editorial text-[0.74rem] tracking-[0.15em] uppercase transition-colors ${
                        isActive(item.href)
                          ? "text-bronze-600"
                          : "text-olive-700 hover:text-bronze-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <CartButton />
        </div>
      </div>
    </header>
  );
}
