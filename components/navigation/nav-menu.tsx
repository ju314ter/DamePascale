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
import React from "react";
import Image from "next/image";
import { Menu, Navigation } from "lucide-react";

export function NavMenu({
  amigurumisNavlink,
  bijouxNavlink,
  blogNavlink,
}: {
  amigurumisNavlink: { title: string; href: string }[];
  bijouxNavlink: { title: string; href: string }[];
  blogNavlink: { _id: string; title: string }[];
}) {
  return (
    <>
      <NavigationMenu className="z-50 hidden md:block">
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
                  {bijouxNavlink.map((bijouLink) => (
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
            <NavigationMenuTrigger className="text-xl">
              Collections
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 min-w-[500px] w-[40vw] lg:grid-cols-[.75fr_1fr]">
                {blogNavlink.map((component) => (
                  <ListItem
                    className="hover:bg-secondary"
                    key={component.title}
                    title={component.title}
                    href={`/blog`}
                  >
                    {component.title}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>
      <div className="cursor-pointer block md:hidden">
        <Menu size={36} strokeWidth={1.5} />
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
