import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";
import { SHIPPING, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Commande, paiement, livraison, rétractation et garanties sur la boutique Dame Pascale.",
  alternates: { canonical: "/cgv" },
};

const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      updated="septembre 2026"
      sections={[
        {
          id: "vendeur",
          title: "Le vendeur",
          content: (
            <p>
              Les présentes conditions s&apos;appliquent aux ventes conclues sur
              le site Dame Pascale, édité par Pascale Féger, entreprise
              individuelle (SIRET 929 224 152 00017), 6 rue de Villemusard,
              72530 Yvré-l&apos;Évêque, France. Contact : {mail}. Les conditions
              applicables sont celles en vigueur au jour de la commande.
            </p>
          ),
        },
        {
          id: "produits",
          title: "Les produits",
          content: (
            <>
              <p>
                Les bijoux sont fabriqués à la main avec des fleurs naturelles :
                chaque pièce est unique et peut légèrement différer des photos
                (couleurs selon l&apos;écran, nuances naturelles des fleurs).
                Les produits sont proposés dans la limite des stocks
                disponibles.
              </p>
              <p>
                Ces bijoux ne sont pas des jouets et ne conviennent pas aux
                enfants de moins de 3 ans (petites pièces).
              </p>
            </>
          ),
        },
        {
          id: "commande",
          title: "Commande et prix",
          content: (
            <>
              <p>
                Les prix sont indiqués en euros, toutes taxes comprises, hors
                frais de livraison. Les frais de livraison sont affichés dans le
                panier avant le paiement. La commande est ferme après validation
                du paiement ; une confirmation est alors envoyée par e-mail.
              </p>
              <p>
                Les codes promotionnels ne sont pas cumulables et
                s&apos;appliquent au montant des articles, hors frais de
                livraison.
              </p>
            </>
          ),
        },
        {
          id: "paiement",
          title: "Paiement",
          content: (
            <p>
              Le paiement s&apos;effectue en ligne, de façon sécurisée, via la
              plateforme Stripe : carte bancaire (CB, Visa, Mastercard…), PayPal
              ou Link. Dame Pascale n&apos;a jamais accès à vos coordonnées
              bancaires. Le montant est débité à la validation de la commande.
              Les produits restent la propriété de Dame Pascale jusqu&apos;au
              paiement complet.
            </p>
          ),
        },
        {
          id: "livraison",
          title: "Livraison",
          content: (
            <>
              <p>
                Livraison en France et dans les pays de la zone euro, à
                l&apos;adresse indiquée lors du paiement. Frais de livraison :{" "}
                {SHIPPING.cost.toLocaleString("fr-FR")} €, offerts à partir de{" "}
                {SHIPPING.freeThreshold} € d&apos;achat (montant des articles
                après promotions).
              </p>
              <p>
                Les commandes sont expédiées sous 15 jours maximum après
                validation du paiement. Le délai d&apos;acheminement en France
                métropolitaine est habituellement de 2 à 3 jours ouvrés.
              </p>
              <p>
                En cas de retard important ou de colis endommagé, contactez-moi
                à {mail} : je m&apos;occupe des démarches auprès du
                transporteur. Si la livraison n&apos;intervient pas dans un
                délai supplémentaire raisonnable, vous pouvez annuler la
                commande et être remboursé·e sous 14 jours.
              </p>
            </>
          ),
        },
        {
          id: "retractation",
          title: "Droit de rétractation et retours",
          content: (
            <>
              <p>
                Vous disposez de 14 jours à compter de la réception de votre
                commande pour exercer votre droit de rétractation, sans avoir à
                vous justifier. Il suffit de m&apos;en informer par e-mail à{" "}
                {mail}.
              </p>
              <p>
                Le bijou doit être renvoyé dans les 14 jours suivant votre
                demande, dans un état permettant sa remise en vente (non porté,
                bien protégé). Les frais de retour sont à votre charge. Vous
                restez responsable d&apos;une éventuelle dépréciation résultant
                d&apos;une manipulation autre que celle nécessaire pour
                l&apos;examiner.
              </p>
              <p>
                Je vous rembourse la totalité des sommes versées, y compris les
                frais de livraison initiaux (sur la base du tarif standard),
                dans les 14 jours suivant votre demande, par le même moyen de
                paiement. Le remboursement peut être différé jusqu&apos;à
                réception du bijou.
              </p>
              <p>
                <strong>Exception :</strong> conformément à l&apos;article
                L221-28 du Code de la consommation, le droit de rétractation ne
                s&apos;applique pas aux créations sur mesure réalisées selon vos
                spécifications ou avec vos propres fleurs.
              </p>
            </>
          ),
        },
        {
          id: "sur-mesure",
          title: "Créations sur mesure",
          content: (
            <p>
              Toute création sur mesure fait l&apos;objet d&apos;un échange
              préalable et d&apos;un devis accepté par e-mail. Les délais sont
              donnés à titre indicatif : le séchage des fleurs demande plusieurs
              semaines. Les fleurs naturelles étant vivantes, leur teinte peut
              évoluer lors du séchage. Voir la page{" "}
              <Link href="/sur-mesure">Sur mesure</Link>.
            </p>
          ),
        },
        {
          id: "ateliers",
          title: "Ateliers",
          content: (
            <p>
              Les ateliers sont réservés sur demande via la page{" "}
              <Link href="/ateliers">Ateliers</Link>. La date, le lieu, le prix
              ainsi que les conditions de paiement, de report et
              d&apos;annulation sont confirmés par écrit (e-mail) au moment de
              la réservation.
            </p>
          ),
        },
        {
          id: "garanties",
          title: "Garanties",
          content: (
            <p>
              Les produits bénéficient de la garantie légale de conformité
              (articles L217-3 et suivants du Code de la consommation) et de la
              garantie contre les vices cachés (articles 1641 et suivants du
              Code civil). Pour la mettre en œuvre, contactez-moi à {mail}.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          content: (
            <p>
              Les données transmises lors d&apos;une commande servent uniquement
              à la traiter et à vous livrer. Pour en savoir plus et exercer vos
              droits, consultez les{" "}
              <Link href="/legals#donnees">mentions légales</Link>.
            </p>
          ),
        },
        {
          id: "litiges",
          title: "Droit applicable et litiges",
          content: (
            <>
              <p>
                Les présentes conditions sont soumises au droit français. En cas
                de difficulté, contactez-moi d&apos;abord à {mail} : nous
                trouverons ensemble une solution amiable.
              </p>
              <p>
                À défaut de résolution amiable, le litige relèvera des tribunaux
                compétents.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
