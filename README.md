# Dame Pascale — site vitrine & boutique

Site Next.js 14 (App Router) + Sanity (contenus, Studio sur `/admin`) + Stripe Checkout.

## Démarrer

```bash
bun install
bun dev   # http://localhost:3000
```

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Projet Sanity |
| `SANITY_READ_TOKEN` | Jeton **lecture**, serveur uniquement (remplace `NEXT_PUBLIC_SANITY_VIEW_TOKEN`) |
| `SANITY_TOKEN` | Jeton **écriture** : stock, commandes, inscriptions aux actus |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Paiement |
| `NEXT_PUBLIC_URL` | URL publique du site (ex. `www.damepascale.fr`), utilisée pour les retours Stripe, le SEO et le sitemap |
| `MY_EMAIL`, `MY_GMAIL_APP_PASSWORD` | Envoi des e-mails (Gmail) |
| `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (optionnel) | Anti-spam des formulaires |

> ⚠️ L'ancien `NEXT_PUBLIC_SANITY_VIEW_TOKEN` était exposé dans le JavaScript public.
> Il reste lu côté serveur par compatibilité, mais il faut **le révoquer dans Sanity**,
> créer un nouveau jeton lecture et le déclarer sous le nom `SANITY_READ_TOKEN`.

### Stripe

Le webhook `/api/stripe-webhook` doit recevoir l'événement `checkout.session.completed`.
À chaque paiement, il :

1. crée la commande dans Sanity (type « Commandes », lecture seule dans le Studio) ;
2. décrémente le stock dans la même transaction (sans double décompte si Stripe renvoie l'événement) ;
3. envoie le récapitulatif au client et une notification détaillée à `MY_EMAIL`.

L'adresse de livraison, le téléphone et un message facultatif sont saisis sur la page Stripe.
Les codes promo (Sanity → « Codes Promotionnels ») sont vérifiés côté serveur et appliqués
via des coupons Stripe (type « Absolute » = montant en euros, « Percentage » = pourcentage).
Pour recevoir aussi le reçu Stripe officiel, activer « Reçus e-mail » dans le tableau de bord Stripe.

## Contenus gérés dans le Studio (`/admin`)

- **Bijoux**, catégories, fleurs, matières, liens du menu Boutique
- **Collection vedette** : les pièces mises en avant sur l'accueil
- **Marchés / Événements** : affichés sur l'accueil et `/marches`
- **Atelier (formule)** : nom, résumé, durée, prix, dates et places. Sans formule saisie,
  la page `/ateliers` affiche une formule « découverte » par défaut, avec « tarif sur demande ».
- **Articles du journal**, codes promo, configuration boutique (ouverte / fermée)
- **Commandes** et **Inscriptions (actus)** : alimentées automatiquement par le site
