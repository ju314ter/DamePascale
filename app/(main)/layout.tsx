import type { Metadata } from "next";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NavMenu } from "@/components/navigation/nav-menu";
import {
  Caveat,
  Cormorant_Garamond,
  Dancing_Script,
  EB_Garamond,
  Josefin_Sans,
  Lato,
  Libre_Baskerville,
  Outfit,
  Playfair_Display,
} from "next/font/google";
import PanierWrapper from "@/components/panier/panier";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import RecaptchaProvider from "@/components/contact/recaptcha";
import { Analytics } from "@vercel/analytics/react";

const caveatFont = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});
const libreBaskervilleFont = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});
const playfairDisplayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});
const dancingScriptFont = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});
const cormorantGaramondFont = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});
const josefinSansFont = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
});
const latoFont = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});
const outfitFont = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});
const ebGaramondFont = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Pascale FEGER - Bijoux floraux",
  description:
    "Retrouvez les productions de Dame Pascale, de magnifiques bijoux réalisés de manière artisanales et originales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={cn(
          "bg-white font-sans",
          caveatFont.variable,
          libreBaskervilleFont.variable,
          playfairDisplayFont.variable,
          dancingScriptFont.variable,
          cormorantGaramondFont.variable,
          josefinSansFont.variable,
          latoFont.variable,
          outfitFont.variable,
          ebGaramondFont.variable,
        )}
      >
        <RecaptchaProvider>
          <NavMenu rightSlot={<PanierWrapper />} />
          <Suspense
            fallback={
              <div className="w-full h-full flex justify-center items-center">
                <Loader className="animate-spin" />
              </div>
            }
          >
            <main>{children}</main>
          </Suspense>
          <Analytics />
          <Toaster />
        </RecaptchaProvider>
      </body>
    </html>
  );
}
