import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBijouById, getRelatedBijoux } from "@/sanity/lib/bijoux/calls";
import { urlForImage } from "@/sanity/lib/image";
import { toPlainText } from "@/lib/portable-text";
import { finalPrice } from "@/lib/pricing";
import { siteUrl, SITE } from "@/lib/site";
import ProductView from "@/components/shop/product-view";

export const revalidate = 60;

type Props = { params: { detail: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bijou = await getBijouById(params.detail);
  if (!bijou) return { title: "Bijou introuvable" };
  const description =
    toPlainText(bijou.description) ||
    `${bijou.name} — bijou unique en fleurs naturelles, fait main près du Mans.`;
  const image = bijou.highlightedImg
    ? urlForImage(bijou.highlightedImg, 1200)
    : undefined;
  return {
    title: bijou.name,
    description,
    alternates: { canonical: `/boutique-bijou/${bijou._id}` },
    openGraph: {
      type: "website",
      title: `${bijou.name} · ${SITE.name}`,
      description,
      images: image
        ? [{ url: image, width: 1200, height: 1200, alt: bijou.name }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const bijou = await getBijouById(params.detail);
  if (!bijou) notFound();
  const related = await getRelatedBijoux(
    bijou._id,
    (bijou.categories ?? []).map((c) => c._id),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bijou.name,
    description: toPlainText(bijou.description, 500) || undefined,
    image: bijou.highlightedImg
      ? [urlForImage(bijou.highlightedImg, 1200)]
      : undefined,
    brand: { "@type": "Brand", name: SITE.name },
    category: bijou.categories?.map((c) => c.title).join(", "),
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/boutique-bijou/${bijou._id}`,
      priceCurrency: "EUR",
      price: finalPrice(bijou).toFixed(2),
      availability:
        bijou.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <ProductView bijou={bijou} related={related} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
