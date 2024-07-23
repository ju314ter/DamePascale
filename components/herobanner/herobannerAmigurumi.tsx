import {
  AmigurumiHerobanner,
  getAmigurumisHeroBanner,
} from "@/sanity/lib/amigurumis/calls";
import { urlFor } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MotionValue, motion, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

const fetchHeroBannerData = async () => {
  const herobanner: AmigurumiHerobanner[] = await getAmigurumisHeroBanner();
  return herobanner || [];
};

export default function HeroBannerAmigurumi({
  scrollPosition,
}: {
  scrollPosition: MotionValue<number>;
}) {
  const [herobanner, setHerobanner] = useState<AmigurumiHerobanner[]>([]);

  useEffect(() => {
    fetchHeroBannerData().then((data) => setHerobanner(data));
  }, []);

  const yImg = useTransform(scrollPosition, [0, 1], [0, 150]);
  const yText = useTransform(scrollPosition, [0, 1], [0, 500]);
  const scale = useTransform(scrollPosition, [0, 1], [1.1, 1.4]);

  if (herobanner.length === 0) return null;
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <motion.div
        style={{ y: yImg, scale }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <Image
          priority
          src={urlFor(herobanner[0].heroImg).url()}
          alt={herobanner[0].title}
          width={1600}
          height={600}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ y: yText }}
        className="relative z-2 max-w-[100vw] flex flex-col justify-center items-center border border-secondary bg-white bg-opacity-60 text-white p-4 px-10"
      >
        <h1 className="text-6xl font-bold text-primary">
          {herobanner[0].title}
        </h1>
        <h2 className="text-2xl font-bold p-2 text-black">
          {herobanner[0].subtitle}
        </h2>
        <Link href={herobanner[0].buttonLink}>
          <Button
            variant="destructive"
            size="lg"
            className="my-4 uppercase hover:scale-105 transition-all duration-300"
          >
            {herobanner[0].buttonText}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
