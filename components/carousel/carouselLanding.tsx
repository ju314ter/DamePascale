import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePanier } from "@/store/panier-store";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

type CarouselLandingProps = {
  direction: "forward" | "backward";
  boutiqueUrl: "boutique-amigurumi" | "boutique-bijou";
  items: any[];
};
export function CarouselLanding({
  direction,
  items,
  boutiqueUrl,
}: CarouselLandingProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

  const handleMouseEnter = () => {
    const autoscroll = api?.plugins().autoScroll;
    if (autoscroll) autoscroll.stop();
  };

  const handleMouseLeave = () => {
    const autoscroll = api?.plugins().autoScroll;
    if (autoscroll) autoscroll.play(0);
  };

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[AutoScroll({ direction, speed: 1 })]}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      className="w-full bg-transparent"
    >
      <CarouselContent className="">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-1/3 lg:basis-1/4 xl:basis-1/6 bg-transparent pl-8 sm:pl-12 md:pl-16 lg:pl-24"
          >
            <div className="overflow-hidden group bg-transparent border-none relative w-full h-full flex justify-center items-center">
              <div className="w-full z-10 absolute bottom-4 flex justify-center items-center">
                <Button
                  variant="cta"
                  className="relative uppercase font-serif top-5 opacity-0 group-hover:top-0 group-hover:opacity-100 hover:bg-secondary transition-all"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const message = await addToPanier(item);
                      toast({
                        title: message,
                        action: (
                          <ToastAction
                            altText="Retirer du panier"
                            onClick={() => {
                              removeFromPanier(item);
                            }}
                          >
                            Annuler
                          </ToastAction>
                        ),
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        toast({
                          title: error.message,
                        });
                      }
                    }
                  }}
                >
                  <span className="tracking-widest">Ajouter</span>
                </Button>
              </div>
              <Link href={`/${boutiqueUrl}/${item._id}`}>
                <Image
                  priority
                  src={urlFor(item.highlightedImg).url()}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-sm h-full saturate-150"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
