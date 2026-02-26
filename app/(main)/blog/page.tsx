"use client";

import React, { useEffect, useState } from "react";
import { BlogPost, getBlogPosts } from "@/sanity/lib/blog/calls";
import { urlFor } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import { motion } from "framer-motion";

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
    radial-gradient(ellipse at 25% 75%, rgba(226,146,59,0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 78% 18%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(168deg, #fefcf7 0%, #fdf8ed 35%, #f9eed5 70%, #fefcf7 100%)
  `,
  backgroundColor: "#fefcf7",
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ─────────────────────────────────────────────────────────────────────────── */

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchBlogPosts() {
      const data = await getBlogPosts();
      setBlogPosts(data);
      setLoaded(true);
    }
    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen relative" style={pageBackground}>

      {/* ── Botanical decorations ──────────────────────────────────────────── */}
      <PressedLeaf aria-hidden className="pointer-events-none select-none absolute top-[28%] right-0 w-28 md:w-40 text-olive-400/[0.10] rotate-[16deg]" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute top-[55%] left-0 w-36 md:w-52 text-sage-400/[0.09] -rotate-[5deg]" />
      <SmallBlossom aria-hidden className="pointer-events-none select-none absolute bottom-[12%] right-[5%] w-14 text-bronze-400/[0.08] rotate-[22deg]" />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden pt-16 md:pt-20"
        style={{ background: "linear-gradient(135deg, #f0ede3 0%, #f7f3e8 45%, #f5e8d0 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative py-14 md:py-20 max-w-xl">
            <span
              className="font-hand text-bronze-500 block mb-2"
              style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
            >
              Inspirations & Savoir-faire
            </span>
            <h1
              className="font-serif-display text-olive-900 uppercase tracking-wide leading-[0.88]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
            >
              Le Journal
            </h1>
            <p
              className="font-editorial italic text-olive-600/70 mt-5 leading-relaxed"
              style={{ fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)" }}
            >
              Coulisses de l&apos;atelier, inspirations botaniques<br className="hidden sm:block" />
              et conseils de création.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-olive-200/60 to-transparent" />
      </div>

      {/* ── Posts grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {!loaded ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-olive-100/40 aspect-[4/3]" />
                <div className="pt-4 space-y-2.5">
                  <div className="h-2.5 bg-olive-100/50 rounded-full w-1/4" />
                  <div className="h-4 bg-olive-100/50 rounded-full w-3/4" />
                  <div className="h-4 bg-olive-100/30 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-24">
            <SmallBlossom className="w-10 h-10 text-olive-200 mx-auto mb-4" />
            <p className="font-editorial text-[0.7rem] tracking-[0.2em] uppercase text-olive-400">
              Aucun article pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post._id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Link href={`/blog/${post._id}`} className="group block">

                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]" style={{ backgroundColor: "#fdf8ed" }}>
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    />
                    {/* Subtle vignette on hover */}
                    <div className="absolute inset-0 bg-olive-900/0 group-hover:bg-olive-900/8 transition-colors duration-500" />
                    {/* Category chip */}
                    {post.category?.title && (
                      <div className="absolute top-3 left-3">
                        <span className="font-editorial text-[0.56rem] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-white/88 backdrop-blur-sm text-olive-700 border border-olive-100/60">
                          {post.category.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thin rule */}
                  <div className="h-px bg-olive-100/80 w-full" />

                  {/* Text */}
                  <div className="pt-4 pb-1">
                    <h2
                      className="font-serif-display text-olive-900 leading-[1.15] transition-colors duration-300 group-hover:text-olive-700"
                      style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)" }}
                    >
                      {post.title}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 mt-4 font-editorial text-[0.58rem] tracking-[0.22em] uppercase text-olive-400 group-hover:text-olive-600 transition-colors duration-300">
                      Lire l&apos;article
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>

                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
