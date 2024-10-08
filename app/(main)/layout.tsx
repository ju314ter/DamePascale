import type { Metadata } from "next";
import "../globals.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { NavMenu } from "@/components/navigation/nav-menu";
import Link from "next/link";
import { Jacques_Francois, Italiana } from "next/font/google";
import PanierWrapper from "@/components/panier/panier";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import RecaptchaProvider from "@/components/contact/recaptcha";
import { Analytics } from "@vercel/analytics/react";

const jaquesFrancoisFont = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});
const italianaFont = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Pascale FEGER - Amigurumi & Bijoux",
  description:
    "Retrouvez les productions de Dame Pascale, de magnifiques bijoux et amigurumis réalisés de manière artisanales et originales.",
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
          jaquesFrancoisFont.variable,
          italianaFont.variable
        )}
      >
        <RecaptchaProvider>
          <div className="fixed z-50 header flex w-full h-[50px] justify-center items-center bg-opacity-20 bg-white backdrop-blur-xl shadow-sm">
            <div className="logo ml-2 absolute left-0">
              <Link href="/" className="flex gap-2">
                <Image
                  src="/logo.png"
                  alt="Pascale FEGER Logo"
                  width={40}
                  height={40}
                  priority
                />
                <Button
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-xl hidden md:block"
                  )}
                >
                  Accueil
                </Button>
              </Link>
            </div>
            <NavMenu />
            <div className="options mr-2 flex justify-center items-center absolute right-0">
              <PanierWrapper />
            </div>
          </div>
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
