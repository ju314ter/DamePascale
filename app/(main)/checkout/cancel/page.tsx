import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <h1>Paiement annulé</h1>
      <Link href="/">
        <Button variant="cta">Retourner à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
