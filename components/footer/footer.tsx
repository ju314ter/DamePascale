"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer
      className="relative py-10 md:py-14 w-full border-t border-olive-200/30"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(227,207,165,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,180,140,0.1) 0%, transparent 50%), linear-gradient(175deg, #fefcf7 0%, #fdf8ed 50%, #fefcf7 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 md:gap-4 justify-between items-start">
        <div className="flex flex-col gap-3">
          <span className="font-hand text-2xl text-olive-700">
            Dame Pascale
          </span>
          <CustomHoveredLink
            label="Conditions de vente"
            url="/cgv"
            internalLink={true}
          />
          <CustomHoveredLink
            label="Mentions légales"
            url="/legals"
            internalLink={true}
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-editorial text-sm font-medium uppercase tracking-[0.15em] text-olive-800">
            Informations
          </span>
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
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-editorial text-sm font-medium uppercase tracking-[0.15em] text-olive-800">
              Paiement
            </span>
            <div className="flex gap-3 pt-3">
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
            <span className="font-editorial text-sm font-medium uppercase tracking-[0.15em] text-olive-800">
              Réseaux sociaux
            </span>
            <div className="flex gap-3 pt-3">
              <Link
                href="https://www.facebook.com/p/Mes-petites-cr%C3%A9a-ch%C3%A9ries-100057342554163/"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook
                  className="text-olive-600 hover:text-bronze-500 transition-colors"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://www.instagram.com/dame_pascale"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram
                  className="text-olive-600 hover:text-bronze-500 transition-colors"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-olive-200/20">
        <p className="font-editorial text-xs text-olive-600/70 text-center">
          &copy; 2026 Dame Pascale — Tous droits réservés
        </p>
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
        <Link
          href={url}
          className="font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
        >
          {label}
        </Link>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-editorial text-sm text-olive-600 hover:text-bronze-500 transition-colors no-underline"
        >
          {label}
        </a>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bg-bronze-400 bottom-0 left-0 w-full h-[1px] z-10 pointer-events-none origin-left"
      />
    </span>
  );
};

export default Footer;
