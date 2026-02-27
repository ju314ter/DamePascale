"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BlogPost, getBlogPostById } from "@/sanity/lib/blog/calls";
import { urlFor } from "@/sanity/lib/client";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import Footer from "@/components/footer/footer";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

function PressedLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 C20 30, 10 60, 40 110 C70 60, 60 30, 40 10Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M40 10 L40 110" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 35 L25 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L22 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L24 60" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 35 L55 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L58 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L56 60" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q40 45, 60 30 Q80 15, 110 10" stroke="currentColor" strokeWidth="1" />
      <path d="M30 47 C25 38, 28 30, 35 28" stroke="currentColor" strokeWidth="0.7" />
      <path d="M50 36 C43 28, 46 20, 54 18" stroke="currentColor" strokeWidth="0.7" />
      <path d="M70 24 C64 18, 68 10, 76 9" stroke="currentColor" strokeWidth="0.7" />
      <path d="M90 15 C86 10, 90 4, 96 5" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}

function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(90 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(180 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(270 30 30)" />
    </svg>
  );
}

const pageBackground = {
  backgroundImage: `
    radial-gradient(ellipse at 15% 70%, rgba(226,146,59,0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 15%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(162deg, #fefcf7 0%, #fdf8ed 38%, #f9eed5 72%, #fefcf7 100%)
  `,
  backgroundColor: "#fefcf7",
};

/* ──────────────────────────── PortableText components ──────────────────────────── */

const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="font-editorial text-olive-800 leading-[1.85] text-[0.95rem] mb-5">{children}</p>
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
          src={urlFor(value).url()}
          alt=""
          width={900}
          height={600}
          className="w-full h-auto object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
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
        value?.href && !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
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
    bullet: ({ children }) => <ul className="my-4 space-y-1.5 pl-1">{children}</ul>,
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
      <li className="font-editorial text-olive-800 text-[0.95rem]">{children}</li>
    ),
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */

const BlogDetailCollectionPage = () => {
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchBlogpost() {
      if (typeof params.detail === "string") {
        const data = await getBlogPostById(params.detail);
        setBlogPost(data);
      }
    }
    fetchBlogpost();
  }, [params]);

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={pageBackground}>
        <div className="text-center">
          <SmallBlossom className="w-10 h-10 text-olive-300 mx-auto mb-4 animate-pulse" />
          <p className="font-editorial text-[0.65rem] tracking-[0.22em] uppercase text-olive-600">
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={pageBackground}>

      {/* ── Botanical decorations ──────────────────────────────────────────── */}
      <PressedLeaf aria-hidden className="pointer-events-none select-none absolute top-[10%] right-0 w-28 md:w-40 text-olive-400/[0.09] rotate-[14deg]" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute top-[48%] left-0 w-36 md:w-52 text-sage-400/[0.08] -rotate-[4deg]" />
      <SmallBlossom aria-hidden className="pointer-events-none select-none absolute bottom-[15%] right-[6%] w-14 text-bronze-400/[0.07] rotate-[25deg]" />

      {/* ── Article content ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-20 relative z-10">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-editorial text-[0.62rem] tracking-[0.15em] uppercase text-olive-600 hover:text-olive-800 transition-colors mb-12"
        >
          <ChevronLeft size={12} strokeWidth={2.5} />
          Le Journal
        </Link>

        {/* Category */}
        {blogPost.category?.title && (
          <span
            className="font-hand text-bronze-500 block mb-3"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          >
            {blogPost.category.title}
          </span>
        )}

        {/* Title */}
        <h1
          className="font-serif-display text-olive-900 uppercase tracking-wide leading-[0.9] mb-6"
          style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)" }}
        >
          {blogPost.title}
        </h1>

        {/* Introduction */}
        {blogPost.introduction && (
          <p
            className="font-editorial italic text-olive-700 leading-relaxed mb-10"
            style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)" }}
          >
            {blogPost.introduction}
          </p>
        )}

        {/* Hairline divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-olive-200/70 to-transparent mb-10" />

        {/* Hero image with hotspots */}
        {blogPost.mainImage && (
          <div className="relative mb-12 rounded-2xl overflow-hidden border border-olive-100/60 shadow-[0_8px_40px_rgba(139,119,75,0.10)]">
            <Image
              src={urlFor(blogPost.mainImage).url()}
              alt={blogPost.title}
              width={900}
              height={600}
              className="w-full h-auto object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
            />

            {/* Hotspot markers */}
            {blogPost.hotspots?.map((spot) => (
              <HoverCard key={`${spot.x}-${spot.y}`} openDelay={80} closeDelay={120}>
                <HoverCardTrigger asChild>
                  <button
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/spot focus-visible:outline-none"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    aria-label={spot.details}
                  >
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full bg-bronze-400/30 animate-ping" />
                    {/* Core dot */}
                    <span className="relative flex w-5 h-5 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm border border-bronze-300/70 shadow-sm group-hover/spot:bg-bronze-50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-52 p-3 rounded-xl border border-olive-200/60 shadow-lg"
                  style={{ backgroundColor: "#fefcf7" }}
                >
                  <p className="font-editorial text-[0.78rem] text-olive-700 leading-relaxed mb-2">
                    {spot.details}
                  </p>
                  {spot.url && (
                    <Link
                      href={spot.url}
                      className="inline-flex items-center gap-1 font-editorial text-[0.58rem] tracking-[0.18em] uppercase text-bronze-600 hover:text-bronze-800 transition-colors"
                    >
                      Découvrir →
                    </Link>
                  )}
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}

        {/* Body content */}
        {blogPost.content && (
          <article>
            <PortableText value={blogPost.content} components={portableTextComponents} />
          </article>
        )}

        {/* Bottom ornament */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-olive-200/50" />
          <SmallBlossom className="w-6 h-6 text-olive-300" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-olive-200/50" />
        </div>

        {/* Back to journal */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-editorial text-[0.62rem] tracking-[0.18em] uppercase text-olive-600 hover:text-olive-800 transition-colors"
          >
            <ChevronLeft size={11} strokeWidth={2.5} />
            Retour au Journal
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default BlogDetailCollectionPage;
