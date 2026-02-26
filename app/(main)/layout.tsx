import type { Metadata } from "next";
import "../globals.css";
import "@fontsource-variable/caveat";
import "@fontsource-variable/playfair-display";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/libre-baskerville/400-italic.css";
import { cn } from "@/lib/utils";
import { NavMenu } from "@/components/navigation/nav-menu";
import PanierWrapper from "@/components/panier/panier";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Loader, ShoppingBag } from "lucide-react";
import RecaptchaProvider from "@/components/contact/recaptcha";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="bg-white font-sans">
        <RecaptchaProvider>
          <NavMenu rightSlot={
            <>
              <div>
                <ShoppingBag             className="w-6 h-6 text-olive-600 group-hover:text-bronze-500 transition-colors"
            strokeWidth={1.5}/>
              </div>
              <PanierWrapper />
            </>
          }
          />
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
