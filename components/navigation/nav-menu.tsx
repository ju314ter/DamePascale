"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { getBijouNavlinks } from "@/sanity/lib/bijoux/calls";
import { getBlogPostsCategories } from "@/sanity/lib/blog/calls";

export function NavMenu({ rightSlot }: { rightSlot?: React.ReactNode }) {
  const [bijouxNavlink, setBijouxNavlink] = useState<
    { title: string; href: string }[]
  >([]);
  const [blogNavlink, setBlogNavlink] = useState<
    { _id: string; title: string }[]
  >([]);

  useEffect(() => {
    async function fetchBijouxNavlinks() {
      const data = await getBijouNavlinks();
      setBijouxNavlink(data);
    }
    fetchBijouxNavlinks();

    async function fetchBlogNavlinks() {
      const data = await getBlogPostsCategories();
      setBlogNavlink(data);
    }
    fetchBlogNavlinks();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(254,252,247,0.92)",
        borderBottom: "1px solid rgba(139,119,75,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-hand text-2xl md:text-3xl text-olive-700 no-underline"
          >
            <Image
              src="/medaillon.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full object-cover flex-shrink-0"
            />
            Dame Pascale
          </Link>

          {/* Desktop navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1 items-baseline">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-600 hover:text-bronze-500 transition-colors px-4 py-2 cursor-pointer no-underline">
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-600 hover:text-bronze-500 bg-transparent hover:bg-olive-100/40 data-[state=open]:bg-olive-100/40">
                  Bijoux
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 min-w-[480px] w-[40vw] flex gap-4">
                    <div className="basis-5/12">
                      <Link href="/boutique-bijou" passHref>
                        <NavigationMenuLink asChild>
                          <div className="p-3 rounded-sm hover:bg-olive-100/40 transition-colors cursor-pointer h-full">
                            <Image
                              src="/fleur-nobg.png"
                              alt="Bijoux floraux"
                              width={80}
                              height={80}
                              className="mx-auto mb-3"
                            />
                            <div className="font-hand text-lg text-olive-700 mb-1">
                              Bijoux floraux
                            </div>
                            <p className="font-editorial text-xs text-olive-600/80 leading-relaxed">
                              Des bijoux artisanaux confectionnés avec des
                              fleurs naturelles.
                            </p>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </div>
                    <div className="basis-7/12 flex flex-col gap-0.5 border-l border-olive-200/30 pl-4">
                      {bijouxNavlink.map((bijouLink) => (
                        <Link
                          key={bijouLink.title}
                          href={`/${bijouLink.href}`}
                          className="block px-3 py-2 font-editorial text-sm text-olive-600 hover:text-bronze-500 hover:bg-olive-100/30 rounded-sm transition-colors no-underline"
                        >
                          {bijouLink.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className="font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-600 hover:text-bronze-500 transition-colors px-4 py-2 cursor-pointer no-underline">
                    Collections
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/marches" legacyBehavior passHref>
                  <NavigationMenuLink className="font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-600 hover:text-bronze-500 transition-colors px-4 py-2 cursor-pointer no-underline">
                    Marchés
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <span className="relative flex items-center gap-1.5 font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-400/60 px-4 py-2 cursor-default select-none">
                  Ateliers
                  <span className="text-[0.55rem] tracking-normal normal-case font-editorial text-[#c4897a]/70 border border-[#c4897a]/30 px-1 py-0.5 rounded-sm leading-none">
                    à venir
                  </span>
                </span>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="font-editorial text-[0.8rem] tracking-[0.15em] uppercase text-olive-600 hover:text-bronze-500 transition-colors px-4 py-2 cursor-pointer no-underline">
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side: optional slot (e.g. cart) + mobile burger */}
          <div className="flex items-center gap-3">
            {rightSlot}

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="bg-transparent border-none cursor-pointer p-2"
                    aria-label="Menu"
                  >
                    <div className="w-6 flex flex-col gap-1.5">
                      <span className="block h-[1.5px] w-full bg-olive-600" />
                      <span className="block h-[1.5px] w-full bg-olive-600" />
                      <span className="block h-[1.5px] w-full bg-olive-600" />
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="overflow-y-auto border-r-olive-200/30"
                  style={{ backgroundColor: "#fefcf7" }}
                >
                  <SheetHeader>
                    <SheetTitle className="font-hand text-2xl text-olive-700 text-center">
                      Dame Pascale
                    </SheetTitle>
                  </SheetHeader>

                  <div className="pt-6 flex flex-col gap-1">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="block py-3 px-4 font-editorial text-sm tracking-[0.12em] uppercase text-olive-600 hover:text-bronze-500 hover:bg-olive-100/30 transition-colors no-underline rounded-sm"
                      >
                        Accueil
                      </Link>
                    </SheetClose>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="bijoux"
                        className="border-b-olive-200/20"
                      >
                        <AccordionTrigger className="font-editorial text-sm tracking-[0.12em] uppercase text-olive-600 hover:text-bronze-500 px-4 hover:no-underline">
                          Bijoux
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                          <SheetClose asChild>
                            <Link
                              href="/boutique-bijou"
                              className="block py-2.5 px-4 font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
                            >
                              Tous les bijoux
                            </Link>
                          </SheetClose>
                          {bijouxNavlink.map((link) => (
                            <SheetClose asChild key={link.title}>
                              <Link
                                href={`/${link.href}`}
                                className="block py-2.5 px-4 font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
                              >
                                {link.title}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="collections"
                        className="border-b-olive-200/20"
                      >
                        <AccordionTrigger className="font-editorial text-sm tracking-[0.12em] uppercase text-olive-600 hover:text-bronze-500 px-4 hover:no-underline">
                          Collections
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                          <SheetClose asChild>
                            <Link
                              href="/blog"
                              className="block py-2.5 px-4 font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
                            >
                              Toutes les collections
                            </Link>
                          </SheetClose>
                          {blogNavlink.map((link) => (
                            <SheetClose asChild key={link._id}>
                              <Link
                                href="/blog"
                                className="block py-2.5 px-4 font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
                              >
                                {link.title}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <SheetClose asChild>
                      <Link
                        href="/marches"
                        className="block py-3 px-4 font-editorial text-sm tracking-[0.12em] uppercase text-olive-600 hover:text-bronze-500 hover:bg-olive-100/30 transition-colors no-underline rounded-sm"
                      >
                        Marchés
                      </Link>
                    </SheetClose>

                    <div className="flex items-center gap-2 py-3 px-4 font-editorial text-sm tracking-[0.12em] uppercase text-olive-400/60 cursor-default select-none rounded-sm">
                      Ateliers
                      <span className="text-[0.6rem] tracking-normal normal-case font-editorial text-[#c4897a]/70 border border-[#c4897a]/30 px-1 py-0.5 rounded-sm leading-none">
                        à venir
                      </span>
                    </div>

                    <SheetClose asChild>
                      <Link
                        href="/contact"
                        className="block py-3 px-4 font-editorial text-sm tracking-[0.12em] uppercase text-olive-600 hover:text-bronze-500 hover:bg-olive-100/30 transition-colors no-underline rounded-sm"
                      >
                        Contact
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
