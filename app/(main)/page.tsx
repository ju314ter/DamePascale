"use client";

import { CarouselLanding } from "@/components/carousel/carouselLanding";
import { ContactForm } from "@/components/contact/contact-form";
import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Bijou, getLastNBijoux } from "@/sanity/lib/bijoux/calls";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  // const [carouselAmigurumisItem, setCarouselAmigurumisItem] = useState<
  //   Amigurumi[]
  // >([]);
  const [carouselBijouxItem, setCarouselBijouxItem] = useState<Bijou[]>([]);
  const containerRef = useRef(null);
  // const refSectionAmigurumi = useRef(null);
  // const textRefAmigurumiSection = useRef(null);
  const refSectionBijou = useRef(null);
  const textRefBijouSection = useRef(null);

  const { scrollY } = useScroll({
    container: containerRef,
  });

  // const { scrollYProgress: scrollImageAmigurumiSection } = useScroll({
  //   container: containerRef,
  //   target: refSectionAmigurumi,
  //   offset: ["start start", "end end"],
  // });
  const { scrollYProgress: scrollImageBijouSection } = useScroll({
    container: containerRef,
    target: refSectionBijou,
    offset: ["start start", "end end"],
  });

  // const { scrollYProgress: scrollTextAmigurumiSection } = useScroll({
  //   container: containerRef,
  //   target: textRefAmigurumiSection,
  //   offset: ["start end", "end start"],
  // });

  const { scrollYProgress: scrollTextBijouSection } = useScroll({
    container: containerRef,
    target: textRefBijouSection,
    offset: ["start end", "end start"],
  });

  const scaleXBorderCreation = useTransform(scrollY, [0, 500], ["0%", "100%"], {
    clamp: false,
  });

  //Fetch carousel items
  useEffect(() => {
    // const fetchCarouselAmigurumis = async () => {
    //   const carouselAmigurumis = await getLastNAmigurumis(10);
    //   setCarouselAmigurumisItem(carouselAmigurumis);
    // };
    const fetchCarouselBijoux = async () => {
      const carouselBijoux = await getLastNBijoux(10);
      setCarouselBijouxItem(carouselBijoux);
    };

    // fetchCarouselAmigurumis();
    fetchCarouselBijoux();
  }, [setCarouselBijouxItem]);

  return (
    <div
      className="relative h-[100vh] overflow-auto w-full scroll-smooth"
      ref={containerRef}
    >
      {/* Home section */}
      <div className="relative flex flex-col w-full h-[100vh] justify-start items-center mt-28">
        <div className="w-full h-[130px] flex justify-center items-center">
          <svg
            className="font-serif text-6xl md:text-9xl"
            width="100%"
            height="130px"
          >
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              Dame Pascale
            </text>
          </svg>
        </div>
        <div className="w-full h-[60vh] flex justify-center items-center">
          <Image src="/medaillon.png" alt="Logo" width={500} height={500} />
        </div>
        <motion.div className="sticky top-[60%] overflow-hidden text-primary text-7xl">
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
      {/* Carousel section */}
      <section className="relative flex flex-col items-center my-20 w-full pb-20 overflow-hidden">
        {/* <div className="w-full pt-16 mb-2">
          <CarouselLanding
            boutiqueUrl="boutique-amigurumi"
            direction="backward"
            items={carouselAmigurumisItem}
          />
        </div> */}
        <div className="w-full mt-2">
          <CarouselLanding
            boutiqueUrl="boutique-bijou"
            direction="forward"
            items={carouselBijouxItem}
          />
        </div>
      </section>
      {/* Message section */}
      <section className="w-full flex justify-center items-center relative pb-40 md:pb-20">
        <motion.div
          initial={{ y: 200, opacity: 0, scale: 0.8 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ margin: "-300px", once: true }}
          className="relative z-10 w-[100%] md:w-[75%] lg:w-[50%] p-10 flex flex-col justify-center items-center gap-2 text-lg lg:text-xl "
        >
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-10 h-10 bg-primary z-[-1] rounded-br-full" />

          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary z-[-1] rounded-tl-full" />

          <motion.span
          // initial={{ x: "-100px", opacity: 0, scale: 0.3 }}
          // whileInView={{ x: 0, opacity: 1, scale: 1 }}
          // transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <b>Bonjour</b> ! Je suis Dame Pascale, créatrice passionnée de
            bijoux uniques.
          </motion.span>
          <motion.span>
            Je réalise des bijoux raffinés réalisés avec des fleurs naturelles
            séchées, encapsulées dans de la résine pour préserver leur beauté
            délicate.
          </motion.span>
          <motion.span className="font-bold">
            Pour des créations personnalisées, n&apos;hésitez pas à me contacter
            pour étudier ensemble vos attentes.
          </motion.span>
          <Link href="/contact">
            <Button
              variant="ctainverse"
              className="mt-4 text-lg md:text-3xl h-21 w-52 "
            >
              Me contacter
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Amigurumi section */}
      {/* <section className="relative">
        <div className="h-[90vh] flex flex-col-reverse md:flex-row justify-around items-center relative">
          <motion.div
            ref={textRefAmigurumiSection}
            style={{
              y: useTransform(
                scrollTextAmigurumiSection,
                [0, 1],
                ["0vh", "-10vh"]
              ),
              opacity: useTransform(
                scrollTextAmigurumiSection,
                [0.2, 0.4, 0.6, 0.7],
                [0, 1, 1, 0]
              ),
            }}
            className="relative basis-1/2 flex flex-col items-center justify-start"
          >
            <div>
              <Image
                src="/daruma-group-nobg.png"
                alt="Daruma"
                className="-scale-x-100 hidden md:flex "
                width={100}
                height={100}
              />
            </div>
            <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px] ">
              Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
              <b>crochetées à la main</b> avec amour. Uniques et adorables,
              elles apportent douceur et joie à tous les âges. Parfaites pour{" "}
              <b>décorer, offrir ou se faire plaisir</b>, ces créations
              artisanales deviendront vos compagnons préférés.
            </p>
            <Link href="/boutique-amigurumi">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52 "
              >
                Amigurumis
              </Button>
            </Link>
          </motion.div>
          <div className="relative basis-1/2 flex justify-center perspective-top ">
            <motion.div
              ref={refSectionAmigurumi}
              className="relative"
              style={{
                y: useTransform(
                  scrollImageAmigurumiSection,
                  [1, 0],
                  ["0vh", "-10vh"]
                ),
                opacity: useTransform(
                  scrollTextAmigurumiSection,
                  [0.2, 0.4, 0.6, 0.7],
                  [0, 1, 1, 0]
                ),
              }}
            >
              <Image
                src="/totoro_nature.jpg"
                alt="Totoro dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 max-w-[60vw] w-[60vw] md:w-[35vw] lg:w-[30vw] relative"
              />
              <motion.svg
                // style={{ y: scrollYAmigurumiWord }}
                className="absolute top-0 left-5 hidden sm:block "
                height="200%"
                width="60px"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  y: useTransform(
                    scrollImageAmigurumiSection,
                    [1, 0],
                    ["0vh", "-50vh"]
                  ),
                }}
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
        </div>
      </section> */}
      {/* Bijou section */}
      <section className="relative">
        <div className="flex flex-col h-[90vh] md:flex-row-reverse justify-around items-center relative">
          <div className="relative basis-1/2 flex justify-center perspective-top">
            <motion.div
              className="relative"
              ref={refSectionBijou}
              style={{
                y: useTransform(
                  scrollImageBijouSection,
                  [1, 0],
                  ["0vh", "-10vh"]
                ),
                opacity: useTransform(
                  scrollTextBijouSection,
                  [0.2, 0.4, 0.6, 0.7],
                  [0, 1, 1, 0]
                ),
              }}
            >
              <Image
                src="/fleurmodele.jpg"
                alt="Fleur dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 max-w-[60vw] w-[80vw] md:w-[35vw] lg:w-[30vw] relative"
              />
              <motion.svg
                // style={{ y: scrollYBijouWord }}
                className="absolute top-0 left-5 hidden sm:block "
                height="200%"
                width="60px"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  y: useTransform(
                    scrollImageBijouSection,
                    [1, 0],
                    ["0vh", "-50vh"]
                  ),
                }}
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
          <motion.div
            className="relative basis-1/2 flex flex-col items-center justify-start blurOutScreen"
            ref={textRefBijouSection}
            style={{
              y: useTransform(scrollTextBijouSection, [0, 1], ["0vh", "-10vh"]),
              opacity: useTransform(
                scrollTextBijouSection,
                [0.2, 0.4, 0.6, 0.7],
                [0, 1, 1, 0]
              ),
            }}
            viewport={{ amount: "all", once: true }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px] ">
              Entrez dans notre écrin où <b>les fleurs deviennent bijoux</b>.
              Nos <b>créations uniques</b> allient la délicatesse naturelle à
              l&apos;art de la bijouterie. Découvrez des pièces exquises faites
              de <b>véritables fleurs préservées</b>, capturant la beauté
              éphémère de la nature dans des parures intemporelles.
            </p>
            <Link href="/boutique-bijou">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52 "
              >
                Bijoux
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="h-[70vh] flex flex-col items-center justify-between overflow-hidden">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="pb-16 text-5xl font-bold text-primary">
            Contactez moi !
          </h1>
          <ContactForm />
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
