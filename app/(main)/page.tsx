"use client";

import { CarouselLanding } from "@/components/carousel/carouselLanding";
import { Button } from "@/components/ui/button";
import { Amigurumi, getLastNAmigurumis } from "@/sanity/lib/amigurumis/calls";
import { Bijou, getLastNBijoux } from "@/sanity/lib/bijoux/calls";
import {
  SpringOptions,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [carouselAmigurumisItem, setCarouselAmigurumisItem] = useState<
    Amigurumi[]
  >([]);
  const [carouselBijouxItem, setCarouselBijouxItem] = useState<Bijou[]>([]);
  const containerRef = useRef(null);
  const refSectionAmigurumi = useRef(null);
  const refSectionBijou = useRef(null);

  const { scrollY } = useScroll({
    container: containerRef,
  });

  const { scrollYProgress: scrollProgessAmigurumiSection } = useScroll({
    container: containerRef,
    target: refSectionAmigurumi,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: scrollProgessBijouSection } = useScroll({
    container: containerRef,
    target: refSectionBijou,
    offset: ["start start", "end end"],
  });

  const scrollYAmigurumiSection = useTransform(
    scrollProgessAmigurumiSection,
    [0, 1],
    ["0vh", "100vh"],
    {
      clamp: true,
    }
  );
  const scrollYBijouSection = useTransform(
    scrollProgessBijouSection,
    [0, 1],
    ["0vh", "100vh"],
    {
      clamp: true,
    }
  );

  const scrollYAmigurumiWord = useTransform(
    scrollProgessAmigurumiSection,
    [0, 1],
    ["0vh", "-100vh"],
    {
      clamp: true,
    }
  );
  const scrollYBijouWord = useTransform(
    scrollProgessBijouSection,
    [0, 1],
    ["0vh", "-100vh"],
    {
      clamp: true,
    }
  );

  const rotateCardAmigurumi = useTransform(
    scrollProgessAmigurumiSection,
    [0, 1],
    ["0deg", "180deg"],
    {
      clamp: true,
    }
  );
  const rotateCardBijou = useTransform(
    scrollProgessBijouSection,
    [0, 1],
    ["0deg", "180deg"],
    {
      clamp: true,
    }
  );

  const scaleXBorderCreation = useTransform(scrollY, [0, 500], ["0%", "100%"], {
    clamp: false,
  });

  //Fetch carousel items
  useEffect(() => {
    const fetchCarouselAmigurumis = async () => {
      const carouselAmigurumis = await getLastNAmigurumis(10);
      setCarouselAmigurumisItem(carouselAmigurumis);
    };
    const fetchCarouselBijoux = async () => {
      const carouselBijoux = await getLastNBijoux(10);
      setCarouselBijouxItem(carouselBijoux);
    };

    fetchCarouselAmigurumis();
    fetchCarouselBijoux();
  }, [setCarouselAmigurumisItem, setCarouselBijouxItem]);

  return (
    <div
      className="relative h-[100vh] overflow-auto w-full scroll-smooth pt-[5vh]"
      ref={containerRef}
    >
      <div className="relative flex flex-col w-full h-[100vh] justify-start items-center mt-16">
        <div className="w-full h-[130px] flex justify-center items-center">
          <svg
            className="font-serif text-5xl md:text-9xl"
            width="100%"
            height="130px"
          >
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              DamePascale
            </text>
          </svg>
        </div>
        <div className="w-full h-[60vh] flex justify-center items-center">
          <Image
            src="/illustrationhome-removebg-compressed.png"
            alt="Logo"
            width={500}
            height={500}
          />
        </div>
        <motion.div className="sticky top-[60%] overflow-hidden text-primary text-5xl">
          Créations
          <motion.div
            style={{ scaleX: scaleXBorderCreation }}
            className="absolute bottom-0 left-0 bg-primary w-full h-[0.15rem] origin-left"
          ></motion.div>
        </motion.div>
        <motion.div className="absolute opacity-0 sm:opacity-100 left-[5%] bottom-0 text-5xl self-start">
          Mes{" "}
          <motion.span
            className="relative"
            initial={{ top: 0 }}
            whileInView={{ top: 50 }}
            viewport={{
              once: false,
              margin: "-10%",
              amount: "all",
            }}
          >
            dernières
          </motion.span>
        </motion.div>
        <Image
          className="absolute top-[40vh] right-0"
          src="/transparentknittingtexture.png"
          alt="Transparent texture"
          style={{ opacity: 0.2 }}
          width={1024}
          height={1024}
        />
      </div>
      <section className="relative flex flex-col items-center my-16 w-full pb-32 overflow-hidden">
        <div className="w-full pt-16 mb-2">
          <CarouselLanding
            direction="backward"
            items={carouselAmigurumisItem}
          />
        </div>
        <div className="w-full mt-2">
          <CarouselLanding direction="forward" items={carouselBijouxItem} />
        </div>
      </section>

      <section
        ref={refSectionAmigurumi}
        className="relative h-[200vh] items-start"
      >
        <motion.div
          style={{ y: scrollYAmigurumiSection }}
          className="h-[100vh] flex justify-around items-center relative"
        >
          <div className="relative basis-4/12 flex flex-col items-center justify-start">
            <motion.div
              style={{ y: scrollYAmigurumiSection }}
              className="mask pointer-events-none absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent from-[-10%] via-white to-white"
            ></motion.div>
            <Image
              src="/daruma-group-nobg.png"
              alt="Daruma"
              className="-scale-x-100 hidden sm:block"
              width={100}
              height={100}
            />
            <p className="text-lg md:text-xl lg:text-2xl leading-6 p-4 text-left">
              Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
              <b>crochetées à la main</b> avec amour. Uniques et adorables,
              elles apportent douceur et joie à tous les âges. Parfaites pour{" "}
              <b>décorer, offrir ou se faire plaisir</b>, ces créations
              artisanales deviendront vos compagnons préférés.
            </p>
            <Link href="/blog">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52"
              >
                Mes guides
              </Button>
            </Link>
          </div>
          <div className="relative flex">
            <motion.div style={{ rotateY: rotateCardAmigurumi }}>
              <Image
                src="/totoro_nature.jpg"
                alt="Totoro dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 w-[30vw]"
              />
              <motion.svg
                style={{ y: scrollYAmigurumiWord }}
                className="absolute top-0 left-5 hidden sm:block"
                height="200%"
                width="60px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="30"
                  y="5"
                  fill="transparent"
                  stroke="white"
                  className="debout text-7xl"
                >
                  AMIGURUMIS
                </text>
                Sorry, your browser does not support inline SVG.
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <section
        ref={refSectionBijou}
        className="relative h-[200vh] items-start overflow-hidden"
      >
        <motion.div
          style={{ y: scrollYBijouSection }}
          className="h-[100vh] flex justify-around items-center relative"
        >
          <div className="relative flex">
            <motion.div style={{ rotateY: rotateCardBijou }}>
              <Image
                src="/fleurmodele.jpg"
                alt="Totoro dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 w-[30vw]"
              />
              <motion.svg
                style={{ y: scrollYBijouWord }}
                className="absolute top-0 left-5 hidden sm:block"
                height="200%"
                width="60px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="30"
                  y="5"
                  fill="transparent"
                  stroke="white"
                  className="debout text-7xl"
                >
                  BIJOUX
                </text>
                Sorry, your browser does not support inline SVG.
              </motion.svg>
            </motion.div>
          </div>
          <div className="relative basis-4/12 flex flex-col items-center justify-start">
            <motion.div
              style={{ y: scrollYBijouSection }}
              className="mask pointer-events-none absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent from-[-10%] via-white to-white"
            ></motion.div>
            <Image
              src="/fleur-nobg.png"
              alt="Daruma"
              className="-scale-x-100 hidden sm:block"
              width={100}
              height={100}
            />
            <p className="text-lg md:text-xl lg:text-2xl leading-6 p-4 text-left">
              Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
              <b>crochetées à la main</b> avec amour. Uniques et adorables,
              elles apportent douceur et joie à tous les âges. Parfaites pour{" "}
              <b>décorer, offrir ou se faire plaisir</b>, ces créations
              artisanales deviendront vos compagnons préférés.
            </p>
            <Link href="/blog">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52"
              >
                Mes guides
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
      {/* <section
        ref={refSectionAmigurumi}
        className="flex flex-col-reverse sm:flex-row min-h-[80vh] items-center justify-around px-10 py-[100px] overflow-hidden"
      >
        <div className="relative basis-4/12 flex flex-col items-center justify-start">

          <Image
            src="/daruma-group-nobg.png"
            alt="Daruma"
            className="-scale-x-100 hidden sm:block"
            width={100}
            height={100}
          />
          <p className="text-lg md:text-xl lg:text-2xl leading-6 p-4 text-left">
            Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
            <b>crochetées à la main</b> avec amour. Uniques et adorables, elles
            apportent douceur et joie à tous les âges. Parfaites pour{" "}
            <b>décorer, offrir ou se faire plaisir</b>, ces créations
            artisanales deviendront vos compagnons préférés.
          </p>
          <Link href="/blog">
            <Button
              variant="ctainverse"
              className="mt-4 text-lg md:text-3xl h-21 w-52"
            >
              Mes guides
            </Button>
          </Link>
        </div>
        <div className="relative flex items-start">
          <motion.div style={{ y: moveYImgAmigurumi }}>
            <Image
              src="/totoro_nature.jpg"
              alt="Totoro dans la nature"
              width={500}
              height={500}
              className="rounded-xl shadow-2xl saturate-150 w-[30vw]"
            />
          </motion.div>
          
        </div>
      </section>
      <section
        ref={refSectionBijou}
        className="flex flex-col sm:flex-row min-h-[80vh] justify-around items-center sm:items-end px-10 pb-48 overflow-hidden"
      >
        <div className="relative flex items-end">
          <motion.div style={{ y: moveYImgBijou }}>
            <Image
              src="/fleurmodele.jpg"
              alt="Totoro dans la nature"
              width={500}
              height={500}
              className="rounded-xl shadow-2xl saturate-150 w-[30vw]"
            />
          </motion.div>
          <motion.svg
            style={{ y: moveYWordBijou }}
            className="absolute top-0 right-10 hidden sm:block"
            height="130%"
            width="60px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="30"
              y="25"
              fill="transparent"
              stroke="white"
              className="debout text-7xl"
            >
              BIJOUX
            </text>
            Sorry, your browser does not support inline SVG.
          </motion.svg>
        </div>
        <div className="relative basis-4/12 flex flex-col items-center justify-start overflow-hidden">
          <motion.div
            style={{ y: moveYmaskBijou }}
            className="mask pointer-events-none absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-white to-white"
          ></motion.div>
          <Image
            src="/fleur-nobg.png"
            alt="Fleur"
            className="-scale-x-100 hidden sm:block"
            width={100}
            height={100}
          />
          <p className="text-lg md:text-xl lg:text-2xl leading-6 p-4 text-left">
            Laissez-vous séduire par nos <b>bijoux floraux</b>, délicates
            créations inspirées de la nature. Uniques et élégants, ils ajoutent
            une touche de poésie à chaque tenue. Parfaits pour{" "}
            <b>
              sublimer votre style au quotidien ou pour des occasions spéciales
            </b>
            , ces bijoux artisanaux captureront l&apos;essence même du
            printemps.
          </p>
          <Link href="/blog">
            <Button
              variant="ctainverse"
              className="mt-4 text-lg md:text-3xl h-21 w-52"
            >
              Mes guides
            </Button>
          </Link>
        </div>
      </section> */}
    </div>
  );
}

{
  /* 
        <Drawer containerRef={containerRef} index={0}>
          <p>Carousel dernieres crea</p>
        </Drawer>
        <Drawer containerRef={containerRef} index={1}>
          <div className="flex w-full h-full justify-around items-center p-5">
            <Card className="h-full bg-secondary border-primary">
              <CardHeader>Header</CardHeader>
              <CardContent>Content</CardContent>
              <CardFooter>Footer</CardFooter>
            </Card>
            <Card className="h-full bg-secondary border-primary">
              <CardHeader>Header</CardHeader>
              <CardContent>Content</CardContent>
              <CardFooter>Footer</CardFooter>
            </Card>
            <Card className="h-full bg-secondary border-primary">
              <CardHeader>Header</CardHeader>
              <CardContent>Content</CardContent>
              <CardFooter>Footer</CardFooter>
            </Card>
          </div>
        </Drawer>
        <Drawer containerRef={containerRef} index={2}>
          <p>Parcours animé</p>
        </Drawer>
        <Drawer containerRef={containerRef} index={3}>
          <p>Formulaire contact</p>
        </Drawer> */
}

// function Drawer({ children, containerRef, index }: any) {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({
//     container: containerRef,
//     target: ref,
//     layoutEffect: false,
//     offset: ["-50px start", "end start"],
//   });

//   const scale = useTransform(scrollYProgress, [0, 0.4, 1], [1, 0.9, 0.7]);
//   const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
//   const y = useTransform(scrollYProgress, [0, 1], [0, 700]);

//   return (
//     <div
//       style={{ zIndex: index }}
//       className="h-[500px] overflow-hidden"
//       ref={ref}
//     >
//       <motion.div
//         style={{ scale, y, opacity }}
//         className="h-full w-full relative flex justify-center items-center border-l border-r border-t border-primary"
//       >
//         {children}
//       </motion.div>
//     </div>
//   );
// }
