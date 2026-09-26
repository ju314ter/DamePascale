/** Définitions de champs des formulaires (partagées serveur/client). */

export type FieldDef = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "select"
    | "chips"
    | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  half?: boolean;
  autoComplete?: string;
  rows?: number;
};

export const CONTACT_FIELDS: FieldDef[] = [
  {
    name: "name",
    label: "Votre nom",
    type: "text",
    required: true,
    half: true,
    autoComplete: "name",
    placeholder: "Marie Dupont",
  },
  {
    name: "email",
    label: "Votre e-mail",
    type: "email",
    required: true,
    half: true,
    autoComplete: "email",
    placeholder: "marie@exemple.fr",
  },
  {
    name: "subject",
    label: "Objet",
    type: "select",
    required: true,
    options: [
      "Informations",
      "Ma commande",
      "Atelier",
      "Création sur mesure",
      "Marchés / événements",
      "Autre",
    ],
  },
  {
    name: "message",
    label: "Votre message",
    type: "textarea",
    required: true,
    placeholder: "Bonjour Pascale, j'aimerais…",
  },
];

export const SUR_MESURE_FIELDS: FieldDef[] = [
  {
    name: "type",
    label: "Quel bijou imaginez-vous ?",
    type: "chips",
    required: true,
    options: [
      "Collier / pendentif",
      "Boucles d'oreilles",
      "Bague",
      "Bracelet",
      "Je ne sais pas encore",
    ],
  },
  {
    name: "occasion",
    label: "Pour quelle occasion ?",
    type: "select",
    options: [
      "Mariage",
      "Naissance / baptême",
      "Souvenir d'un être cher",
      "Cadeau",
      "Pour moi, tout simplement",
      "Autre",
    ],
    half: true,
  },
  {
    name: "fleurs",
    label: "Les fleurs",
    type: "select",
    options: [
      "J'ai mes propres fleurs",
      "Je choisis parmi les vôtres",
      "Je ne sais pas encore",
    ],
    half: true,
  },
  {
    name: "date",
    label: "Pour quand ?",
    type: "date",
    half: true,
    hint: "Comptez plusieurs semaines : les fleurs doivent sécher avant la mise en résine.",
  },
  {
    name: "budget",
    label: "Budget indicatif",
    type: "select",
    options: [
      "Moins de 40 €",
      "40 à 80 €",
      "80 à 150 €",
      "Plus de 150 €",
      "Je ne sais pas",
    ],
    half: true,
  },
  {
    name: "message",
    label: "Racontez-moi votre projet",
    type: "textarea",
    required: true,
    rows: 5,
    placeholder:
      "Les fleurs, les couleurs, l'histoire derrière ce bijou… Vous pourrez m'envoyer des photos en réponse à mon e-mail.",
  },
  {
    name: "name",
    label: "Votre nom",
    type: "text",
    required: true,
    half: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Votre e-mail",
    type: "email",
    required: true,
    half: true,
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Téléphone",
    type: "tel",
    autoComplete: "tel",
    half: true,
  },
];

export function atelierFields(formules: string[]): FieldDef[] {
  return [
    ...(formules.length > 1
      ? [
          {
            name: "formule",
            label: "Formule",
            type: "chips" as const,
            required: true,
            options: formules,
          },
        ]
      : []),
    {
      name: "dates",
      label: "Vos disponibilités",
      type: "text",
      required: true,
      half: true,
      placeholder: "Ex : samedis de mai, en semaine après 17h…",
    },
    {
      name: "occasion",
      label: "L'atelier est…",
      type: "select",
      half: true,
      options: ["Pour moi", "Pour l'offrir", "Autre"],
    },
    {
      name: "name",
      label: "Votre nom",
      type: "text",
      required: true,
      half: true,
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Votre e-mail",
      type: "email",
      required: true,
      half: true,
      autoComplete: "email",
    },
    {
      name: "phone",
      label: "Téléphone",
      type: "tel",
      autoComplete: "tel",
      half: true,
    },
    {
      name: "message",
      label: "Un mot pour Pascale",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder:
        "Vos envies, vos questions, des fleurs que vous aimeriez utiliser…",
    },
  ];
}
