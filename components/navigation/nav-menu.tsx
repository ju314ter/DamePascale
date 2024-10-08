"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { getBijouNavlinks } from "@/sanity/lib/bijoux/calls";
import { getAmigurumiNavlinks } from "@/sanity/lib/amigurumis/calls";
import { getBlogPostsCategories } from "@/sanity/lib/blog/calls";

export function NavMenu() {
  const [bijouxNavlink, setBijouxNavlink] = useState<
    { title: string; href: string }[]
  >([]);
  const [amigurumisNavlink, setAmigurumisNavlink] = useState<
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

    async function fetchAmigurumisNavlinks() {
      const data = await getAmigurumiNavlinks();
      setAmigurumisNavlink(data);
    }
    fetchAmigurumisNavlinks();

    async function fetchBlogNavlinks() {
      const data = await getBlogPostsCategories();
      setBlogNavlink(data);
    }
    fetchBlogNavlinks();
  }, []);

  return (
    <>
      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xl">
              Amigurumis
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 min-w-[500px] w-[40vw] flex">
                <div className="flex-auto basis-6/12 h-full transition-all">
                  <Link href="/boutique-amigurumi" passHref>
                    <NavigationMenuLink asChild className="hover:bg-secondary">
                      <div className="h-full p-2 rounded-sm flex flex-col items-start">
                        <Image
                          src="/daruma-group-nobg.png"
                          className="self-center"
                          alt="Amigurumis"
                          width={150}
                          height={150}
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Amigurumis
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Des magnifiques oeuvres au crochet de l&apos;artisanat
                          japonais.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </div>
                <div className="basis-6/12 hover:basis-8/12 h-full transition-all overflow-auto">
                  {amigurumisNavlink.map((amigurumiLink) => (
                    <ListItem
                      className="hover:bg-secondary"
                      key={amigurumiLink.title}
                      title={amigurumiLink.title}
                      href={`/${amigurumiLink.href}`}
                    ></ListItem>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xl">
              Bijoux
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 min-w-[500px] w-[40vw] flex bg-transparent">
                <div className="flex-auto basis-6/12 h-full transition-all">
                  <Link href="/boutique-bijou" passHref>
                    <NavigationMenuLink asChild className="hover:bg-secondary">
                      <div className="h-full p-2 rounded-sm">
                        <Image
                          src="/fleur-nobg.png"
                          alt="Amigurumis"
                          width={100}
                          height={100}
                          className="mx-auto"
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Bijoux floraux
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Des bijoux artisanaux confectionnés avec des fleurs
                          naturelles.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </div>
                <div className="basis-6/12 hover:basis-8/12 h-full transition-all overflow-auto">
                  {bijouxNavlink.map((bijouLink: any) => (
                    <ListItem
                      className="hover:bg-secondary"
                      key={bijouLink.title}
                      title={bijouLink.title}
                      href={`/${bijouLink.href}`}
                    ></ListItem>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href={`/blog`}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <p className="text-xl">Collections</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href={`/contact`}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <p className="text-xl">Contact</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>
      <div className="cursor-pointer block lg:hidden">
        <Sheet key={"left"}>
          <SheetTrigger className="relative flex justify-center items-center">
            <Menu size={36} strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-xl flex justify-center items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Pascale FEGER Logo"
                  width={24}
                  height={24}
                  priority
                />
                Navigation menu
              </SheetTitle>
              <SheetDescription>
                Explorez nos univers colorés et populaires.
              </SheetDescription>
            </SheetHeader>
            <div className="pt-4">
              <SheetClose asChild>
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex gap-2 w-full justify-center"
                  )}
                >
                  <Button>Accueil</Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/contact"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex gap-2 w-full justify-center"
                  )}
                >
                  <Button>Contact</Button>
                </Link>
              </SheetClose>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p>Amigurumis</p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="flex gap-2 justify-start w-full"
                      >
                        <Link href="/boutique-amigurumi">Tous</Link>
                      </Button>
                    </SheetClose>
                    {amigurumisNavlink.map((link) => (
                      <SheetClose asChild key={link.title}>
                        <Button asChild className="flex gap-2 justify-start">
                          <Link href={`/${link.href}`}>{link.title}</Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <p>Bijoux</p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="flex gap-2 justify-start w-full"
                      >
                        <Link href="/boutique-bijou">Tous</Link>
                      </Button>
                    </SheetClose>
                    {bijouxNavlink.map((link: any) => (
                      <SheetClose asChild key={link.title}>
                        <Button asChild className="flex gap-2 justify-start">
                          <Link href={`/${link.href}`}>{link.title}</Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <p>Collections</p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="flex gap-2 justify-start w-full"
                      >
                        <Link href="/blog">Tous</Link>
                      </Button>
                    </SheetClose>
                    {blogNavlink.map((link) => (
                      <SheetClose asChild key={link.title}>
                        <Button asChild className="flex gap-2 justify-start">
                          <Link href={`/blog`}>{link.title}</Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex flex-col justify-center items-center select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </div>
  );
});
ListItem.displayName = "ListItem";
