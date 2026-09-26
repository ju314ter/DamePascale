import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { getBlogPostById } from "@/sanity/lib/blog/calls";
import { urlForImage } from "@/sanity/lib/image";
import { HotspotImage } from "@/components/blog/hotspot-image";
import {
  BranchSprig,
  PressedLeaf,
  SmallBlossom,
} from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";

export const revalidate = 60;

type Props = { params: { detail: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostById(params.detail);
  if (!post) return { title: "Article introuvable" };
  const image = post.mainImage ? urlForImage(post.mainImage, 1200) : undefined;
  return {
    title: post.title,
    description: post.introduction?.slice(0, 160),
    alternates: { canonical: `/blog/${post._id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.introduction?.slice(0, 200),
      publishedTime: post.publishedDate,
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
  };
}

/* ──────────────────────────── PortableText components ──────────────────────────── */

const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="font-editorial text-olive-800 leading-[1.85] text-[0.95rem] mb-5">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="font-serif-display text-olive-900 uppercase tracking-wide leading-tight mt-12 mb-4"
        style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-serif-display text-olive-800 uppercase tracking-wide leading-tight mt-8 mb-3"
        style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-bronze-300 pl-5 my-7 font-editorial italic text-olive-700 text-[1rem]">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: any }) => (
      <div className="my-10 rounded-xl overflow-hidden border border-olive-100/60 shadow-sm">
        <Image
          src={urlForImage(value, 1200)}
          alt=""
          width={900}
          height={600}
          className="w-full h-auto object-cover"
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>
    ),
    callToAction: ({
      value,
      isInline,
    }: {
      value: { text: string; url: string };
      isInline: boolean;
    }) =>
      isInline ? (
        <a
          href={value.url}
          className="text-bronze-600 underline underline-offset-2 hover:text-bronze-800 transition-colors"
        >
          {value.text}
        </a>
      ) : (
        <div className="my-6">
          <Link
            href={value.url}
            className="inline-flex items-center gap-2 font-editorial text-[0.68rem] tracking-[0.22em] uppercase px-5 py-2.5 border border-olive-300 text-olive-700 hover:bg-olive-50 transition-colors rounded-lg"
          >
            {value.text}
          </Link>
        </div>
      ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href: string };
    }) => {
      const rel =
        value?.href && !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
      return (
        <a
          href={value?.href}
          rel={rel}
          className="text-bronze-600 underline underline-offset-2 hover:text-bronze-800 transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-olive-800">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-olive-700">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 space-y-1.5 pl-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 space-y-1.5 pl-4 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-editorial text-olive-800 text-[0.95rem] flex gap-2.5 items-start">
        <span className="mt-[0.6rem] w-1 h-1 rounded-full bg-bronze-400 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="font-editorial text-olive-800 text-[0.95rem]">
        {children}
      </li>
    ),
  },
};

export default async function BlogPostPage({ params }: Props) {
  const blogPost = await getBlogPostById(params.detail);
  if (!blogPost) notFound();

  return (
    <div className="relative overflow-x-clip" style={warmVintage}>
      <PressedLeaf className="pointer-events-none absolute top-[10%] right-0 w-28 md:w-40 text-olive-400/10 rotate-[14deg]" />
      <BranchSprig className="pointer-events-none absolute top-[48%] left-0 w-36 md:w-52 text-sage-400/10 -rotate-[4deg]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-20 relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-editorial text-[0.68rem] tracking-[0.15em] uppercase text-olive-600 hover:text-olive-800 transition-colors mb-8 py-2"
        >
          <ChevronLeft size={12} strokeWidth={2.5} />
          Le Journal
        </Link>

        {blogPost.category?.title && (
          <span className="font-hand text-xl text-bronze-500 block mb-2">
            {blogPost.category.title}
          </span>
        )}
        <h1 className="font-serif-display text-olive-900 leading-[1.05] text-4xl sm:text-5xl mb-5">
          {blogPost.title}
        </h1>
        {blogPost.publishedDate && (
          <p className="font-editorial text-xs text-olive-500 mb-6">
            {new Date(blogPost.publishedDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {blogPost.author ? ` · ${blogPost.author}` : ""}
          </p>
        )}
        {blogPost.introduction && (
          <p className="font-editorial italic text-olive-700 leading-relaxed text-[1rem] md:text-lg mb-10">
            {blogPost.introduction}
          </p>
        )}

        {blogPost.mainImage && (
          <HotspotImage
            src={urlForImage(blogPost.mainImage, 1400)}
            alt={blogPost.title}
            hotspots={blogPost.hotspots}
          />
        )}

        {blogPost.content && (
          <article>
            <PortableText
              value={blogPost.content}
              components={portableTextComponents}
            />
          </article>
        )}

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-olive-200/50" />
          <SmallBlossom className="w-6 h-6 text-olive-300" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-olive-200/50" />
        </div>

        <div className="mt-10 rounded-2xl bg-white/80 border border-olive-100 p-6 md:p-8 text-center">
          <p className="font-hand text-2xl text-olive-700">
            Envie de porter un peu de nature ?
          </p>
          <p className="font-editorial text-sm text-olive-600 mt-1 mb-6">
            Toutes les pièces sont uniques et faites main.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/boutique-bijou" className={btnPrimary}>
              Voir la boutique
            </Link>
            <Link href="/blog" className={btnSecondary}>
              Autres articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
