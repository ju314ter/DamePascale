import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-between items-center">
      <h1 className="pt-[30vh]">
        Paiement en échec ! Veuillez réessayer ou utiliser un autre moyen de
        paiement.
      </h1>
      <Link href="/">
        <Button variant="cta" className="p-4">
          Retourner à l&apos;accueil
        </Button>
      </Link>
      <Footer />
    </div>
  );
}
