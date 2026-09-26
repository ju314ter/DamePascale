/** Types partagés (utilisables côté client comme serveur). */

export interface ContentChild {
  _type: string;
  _key: string;
  text: string;
  marks: string[];
}

export interface ContentBlock {
  _type: string;
  style?: string;
  _key: string;
  markDefs?: any[];
  children?: ContentChild[];
  level?: number;
  listItem?: string;
}

export interface Taxon {
  _id: string;
  title: string;
}

export interface Bijou {
  _id: string;
  _createdAt?: string;
  name: string;
  description?: ContentBlock[];
  price: number;
  matieres?: Taxon[];
  categories?: Taxon[];
  fleurs?: Taxon[];
  stock: number;
  highlightedImg: any;
  imageGallery?: any[];
  promotionDiscount?: number;
}

export interface Taxonomies {
  categories: Taxon[];
  matieres: Taxon[];
  fleurs: Taxon[];
}

export interface NavLink {
  title: string;
  href: string;
}

export interface Marche {
  _id: string;
  city: string;
  lieu: string;
  date: string; // "YYYY-MM-DD"
  heures: string;
}

export interface Atelier {
  _id: string;
  title: string;
  summary?: string;
  duration?: string;
  participants?: string;
  price?: number;
  priceNote?: string;
  image?: any;
  highlights?: string[];
  dates?: { _key: string; date: string; places?: number; lieu?: string }[];
}

export interface BlogPost {
  _id: string;
  title: string;
  content?: any[];
  introduction?: string;
  publishedDate?: string;
  author?: string;
  category?: Taxon;
  mainImage: any;
  hotspots?: {
    _key?: string;
    x: number;
    y: number;
    details: string;
    url?: string;
  }[];
  tags?: string[];
}
