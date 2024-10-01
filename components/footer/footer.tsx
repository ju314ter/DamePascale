"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ffe7c3] py-8 w-full flex flex-col md:flex-row justify-around items-center">
      <div className="mx-auto md:w-full px-4 flex flex-col md:flex-row gap-4 justify-around items-start">
        <div className="flex flex-col gap-2">
          <span className="font-bold uppercase text-xl">Dame Pascale</span>
          {/* <CustomHoveredLink
            label="Livraison & paiements"
            url="/infoCommande"
            internalLink={true}
          /> */}
          <CustomHoveredLink
            label="Conditions de vente"
            url="/cgv"
            internalLink={true}
          />
          <CustomHoveredLink
            label="Mention légales"
            url="/legals"
            internalLink={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold uppercase text-xl">Informations</span>
          <CustomHoveredLink
            label="Contactez moi"
            url="/contact"
            internalLink={true}
          />
          <CustomHoveredLink
            label="Collections"
            url="/blog"
            internalLink={true}
          />
          <CustomHoveredLink
            label="Yvré l'évêque, Sarthe, France"
            url="https://www.google.fr/maps/place/Yvr%C3%A9-l'%C3%89v%C3%AAque/@48.0121067,0.1865311,12.25z/data=!4m15!1m8!3m7!1s0x47e28b93650142cb:0xe07e236cd6b4a084!2zWXZyw6ktbCfDiXbDqnF1ZQ!3b1!8m2!3d48.0139762!4d0.271887!16s%2Fm%2F03qj283!3m5!1s0x47e28b93650142cb:0xe07e236cd6b4a084!8m2!3d48.0139762!4d0.271887!16s%2Fm%2F03qj283?entry=ttu&g_ep=EgoyMDI0MDkxOC4xIKXMDSoASAFQAw%3D%3D"
            internalLink={false}
          />
          <CustomHoveredLink
            label="damepascale72@gmail.com"
            url="mailto:damepascale72@gmail.com"
            internalLink={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold uppercase text-xl">Paiement</span>
            <div className="flex gap-2 p-4">
              <Image src="/paypal.png" alt="paypal" width={50} height={30} />
              <Image src="/visa.png" alt="visa" width={50} height={30} />
              <Image
                src="/mastercard.png"
                alt="mastercard"
                width={50}
                height={30}
              />
            </div>
          </div>
          <div>
            <span className="font-bold uppercase text-xl">Réseaux sociaux</span>
            <div className="flex gap-2 p-4 cursor-pointer">
              <Link
                href="https://www.facebook.com/p/Mes-petites-cr%C3%A9a-ch%C3%A9ries-100057342554163/"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook
                  className="hover:text-primary"
                  width={50}
                  height={30}
                />
              </Link>
              <Link
                href="https://www.instagram.com/dame_pascale"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram
                  className="hover:text-primary"
                  width={50}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CustomHoveredLink = ({
  label,
  url,
  internalLink,
}: {
  label: string;
  url: string;
  internalLink: boolean;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="relative cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {internalLink ? (
        <Link href={url}>{label}</Link>
      ) : (
        <a href={url} target="_blank" rel="noreferrer">
          {label}
        </a>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bg-primary bottom-0 left-0 w-full h-0.5 z-10 pointer-events-none origin-left"
      />
    </span>
  );
};

export default Footer;
