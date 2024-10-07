"use client";

import { CarouselLanding } from "@/components/carousel/carouselLanding";
import { ContactForm } from "@/components/contact/contact-form";
import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Amigurumi, getLastNAmigurumis } from "@/sanity/lib/amigurumis/calls";
import { Bijou, getLastNBijoux } from "@/sanity/lib/bijoux/calls";
import { motion, useScroll, useTransform } from "framer-motion";
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
              Dame Pascale
            </text>
          </svg>
        </div>
        <div className="w-full h-[60vh] flex justify-center items-center">
          <Image src="/medaillon.png" alt="Logo" width={500} height={500} />
        </div>
        <motion.div className="sticky top-[60%] overflow-hidden text-primary text-7xl font-bold">
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
      <section className="relative flex flex-col items-center my-20 w-full pb-20 overflow-hidden">
        <div className="w-full pt-16 mb-2">
          <CarouselLanding
            boutiqueUrl="boutique-amigurumi"
            direction="backward"
            items={carouselAmigurumisItem}
          />
        </div>
        <div className="w-full mt-2">
          <CarouselLanding
            boutiqueUrl="boutique-bijou"
            direction="forward"
            items={carouselBijouxItem}
          />
        </div>
      </section>
      <section className="w-full flex justify-center items-center relative">
        <motion.div
          initial={{ x: "-50px", opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="relative z-10 w-[100%] md:w-[75%] lg:w-[50%] p-10 flex flex-col justify-center items-center gap-2 text-xl lg:text-2xl "
        >
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-10 h-10 bg-primary z-[-1] rounded-br-full" />

          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary z-[-1] rounded-tl-full" />

          <span>
            <b>Bonjour</b> ! Je suis Dame Pascale, créatrice passionnée
            d&apos;amigurumi et de bijoux uniques.
          </span>
          <span>
            Mon univers créatif se déploie à travers deux spécialités :
            <ul className="list-disc ml-5">
              <li className="m-2">
                d&apos;une part, des amigurumi faits main, ces petites créations
                en crochet qui apportent douceur et charme ;
              </li>
              <li className="m-2">
                d&apos;autre part, des bijoux raffinés réalisés avec des fleurs
                naturelles séchées, encapsulées dans de la résine pour préserver
                leur beauté délicate.
              </li>
            </ul>
          </span>
        </motion.div>
      </section>
      <section ref={refSectionAmigurumi} className="relative">
        <div className="h-[100vh] flex flex-col-reverse md:flex-row justify-around items-center relative">
          <div className="relative basis-2/3 flex flex-col items-center justify-start">
            <motion.div
              initial={{ x: "-100px", opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              viewport={{ once: true }}
            >
              <Image
                src="/daruma-group-nobg.png"
                alt="Daruma"
                className="-scale-x-100 hidden sm:block"
                width={200}
                height={200}
              />
            </motion.div>
            <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px]">
              Découvrez nos <b>amigurumis</b>, de charmantes peluches{" "}
              <b>crochetées à la main</b> avec amour. Uniques et adorables,
              elles apportent douceur et joie à tous les âges. Parfaites pour{" "}
              <b>décorer, offrir ou se faire plaisir</b>, ces créations
              artisanales deviendront vos compagnons préférés.
            </p>
            <Link href="/boutique-amigurumi">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52"
              >
                Amigurumis
              </Button>
            </Link>
          </div>
          <div className="relative basis-1/3 flex justify-center perspective-top">
            <motion.div style={{ rotateY: rotateCardAmigurumi }}>
              <Image
                src="/totoro_nature.jpg"
                alt="Totoro dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 w-[30vw] md:w-[25vw] lg:w-[20vw]"
              />
              <motion.svg
                style={{ y: scrollYAmigurumiWord }}
                className="absolute top-0 left-5 hidden sm:block"
                height="400%"
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
        </div>
      </section>
      <section ref={refSectionBijou} className="relative overflow-hidden">
        <div className="flex flex-col h-[100vh] md:flex-row-reverse justify-around items-center relative">
          <div className="relative basis-1/3 flex justify-center perspective-top">
            <motion.div style={{ rotateY: rotateCardBijou }}>
              <Image
                src="/fleurmodele.jpg"
                alt="Fleur dans la nature"
                width={500}
                height={500}
                className="rounded-xl shadow-2xl saturate-150 w-[30vw] md:w-[25vw] lg:w-[20vw]"
              />
              <motion.svg
                style={{ y: scrollYBijouWord }}
                className="absolute top-0 left-5 hidden sm:block"
                height="400%"
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
          <div className="relative basis-2/3 flex flex-col items-center justify-start">
            <p className="text-md md:text-lg lg:text-xl leading-6 p-4 text-left max-w-[500px]">
              Entrez dans notre écrin où <b>les fleurs deviennent bijoux</b>.
              Nos <b>créations uniques</b> allient la délicatesse naturelle à
              l&apos;art de la bijouterie. Découvrez des pièces exquises faites
              de <b>véritables fleurs préservées</b>, capturant la beauté
              éphémère de la nature dans des parures intemporelles. Offrez-vous
              <b>un morceau de poésie florale à porter</b>. Bien souvent les
              modèles proposés sont des modèles uniques. Les bijoux peuvent
              présenter quelques variations minimes par rapport aux photos, car
              les fleurs ne sont pas naturellement strictement identiques entre
              elles.
            </p>
            <Link href="/boutique-bijou">
              <Button
                variant="ctainverse"
                className="mt-4 text-lg md:text-3xl h-21 w-52"
              >
                Bijoux
              </Button>
            </Link>
          </div>
        </div>
      </section>
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
