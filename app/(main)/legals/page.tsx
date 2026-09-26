import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description:
    "Éditeur, hébergeur, propriété intellectuelle et protection des données personnelles du site Dame Pascale.",
  alternates: { canonical: "/legals" },
};

const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

export default function LegalsPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      updated="septembre 2026"
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          content: (
            <ul>
              <li>Dame Pascale — Pascale Féger, entreprise individuelle</li>
              <li>SIRET : 929 224 152 00017</li>
              <li>
                Adresse : 6 rue de Villemusard, 72530 Yvré-l&apos;Évêque, France
              </li>
              <li>Contact : {mail}</li>
              <li>Directrice de la publication : Pascale Féger</li>
            </ul>
          ),
        },
        {
          id: "hebergeur",
          title: "Hébergement",
          content: (
            <ul>
              <li>
                Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
                États-Unis — vercel.com
              </li>
              <li>Contenus et images : Sanity AS, Oslo, Norvège — sanity.io</li>
              <li>
                Paiements : Stripe Payments Europe Ltd, Dublin, Irlande —
                stripe.com
              </li>
            </ul>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          content: (
            <p>
              L&apos;ensemble des éléments du site (textes, photographies,
              illustrations, logo, créations) est la propriété exclusive de
              Pascale Féger, sauf mention contraire. Toute reproduction,
              représentation ou diffusion, totale ou partielle, sans
              autorisation écrite préalable est interdite et peut engager la
              responsabilité civile et pénale de son auteur.
            </p>
          ),
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          content: (
            <p>
              Les informations du site sont fournies à titre indicatif et
              peuvent évoluer. Pascale Féger ne saurait être tenue responsable
              d&apos;une erreur, d&apos;une indisponibilité du site ou du
              contenu des sites tiers vers lesquels il renvoie. Les bijoux
              proposés ne conviennent pas aux enfants de moins de 3 ans.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          content: (
            <>
              <p>
                Pascale Féger est responsable des traitements de données
                réalisés sur ce site, conformément au Règlement général sur la
                protection des données (RGPD) et à la loi Informatique et
                Libertés.
              </p>
              <p>
                <strong>Données collectées et finalités :</strong>
              </p>
              <ul>
                <li>
                  Commandes : nom, e-mail, téléphone, adresse de livraison —
                  pour traiter et livrer votre commande (exécution du contrat).
                  Le paiement est géré par Stripe ; aucune donnée bancaire
                  n&apos;est conservée par Dame Pascale.
                </li>
                <li>
                  Formulaires de contact, d&apos;atelier et de sur-mesure : nom,
                  e-mail, téléphone facultatif et contenu du message — pour vous
                  répondre.
                </li>
                <li>
                  Inscription aux actualités : e-mail — pour vous prévenir des
                  marchés et ateliers (consentement). Vous pouvez vous
                  désinscrire à tout moment par simple e-mail.
                </li>
              </ul>
              <p>
                Ces données ne sont ni vendues ni cédées. Elles sont conservées
                3 ans après le dernier contact, ou plus longtemps lorsque la loi
                l&apos;impose (par exemple, les pièces comptables).
              </p>
              <p>
                Vous disposez d&apos;un droit d&apos;accès, de rectification,
                d&apos;effacement, d&apos;opposition, de limitation et de
                portabilité de vos données : écrivez à {mail}. Vous pouvez
                également introduire une réclamation auprès de la CNIL
                (cnil.fr).
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies et stockage local",
          content: (
            <>
              <p>
                Le site n&apos;utilise pas de cookies publicitaires. Votre
                panier est enregistré dans le stockage local de votre
                navigateur, uniquement pour le conserver entre deux visites. La
                mesure d&apos;audience (Vercel Analytics) est anonyme et
                n&apos;utilise pas de cookies.
              </p>
              <p>
                Les formulaires sont protégés contre le spam par Google
                reCAPTCHA, chargé uniquement lorsque vous utilisez un formulaire
                et soumis aux{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  règles de confidentialité
                </a>{" "}
                et{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  conditions d&apos;utilisation
                </a>{" "}
                de Google.
              </p>
            </>
          ),
        },
        {
          id: "droit",
          title: "Droit applicable",
          content: (
            <p>
              Le présent site et ses mentions légales sont soumis au droit
              français.
            </p>
          ),
        },
      ]}
    />
  );
}
