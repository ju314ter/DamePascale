import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/sanity/lib/blog/calls";
import { urlForImage } from "@/sanity/lib/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedSection } from "@/components/botanical/animated-section";
import {
  BranchSprig,
  PressedLeaf,
  SmallBlossom,
} from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { btnPrimary } from "@/components/ui/cta";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Le Journal — coulisses et inspirations botaniques",
  description:
    "Coulisses de l'atelier, inspirations botaniques et conseils de création par Dame Pascale.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div style={warmVintage} className="relative overflow-x-clip">
      <PressedLeaf className="pointer-events-none absolute top-[12%] right-[3%] w-24 md:w-36 text-olive-400/10 rotate-[16deg]" />
      <BranchSprig className="pointer-events-none absolute top-[50%] left-0 w-36 md:w-52 text-sage-400/10 -rotate-6" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-20">
        <SectionHeading
          as="h1"
          eyebrow="Inspirations & savoir-faire"
          title="Le Journal"
          intro="Coulisses de l'atelier, inspirations botaniques et conseils de création."
        />

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <SmallBlossom className="w-10 h-10 text-olive-300 mx-auto mb-4" />
            <p className="font-hand text-2xl text-olive-700">
              Les premiers articles arrivent bientôt
            </p>
            <Link href="/boutique-bijou" className={`${btnPrimary} mt-6`}>
              Voir la boutique
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
            {posts.map((post, i) => (
              <AnimatedSection as="li" key={post._id} delay={(i % 3) * 0.08}>
                <Link href={`/blog/${post._id}`} className="group block">
                  <div className="relative overflow-hidden aspect-[4/3] rounded-xl bg-cream-200">
                    {post.mainImage && (
                      <Image
                        src={urlForImage(post.mainImage, 900)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    {post.category?.title && (
                      <span className="absolute top-3 left-3 font-editorial text-[0.6rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-white/90 text-olive-700">
                        {post.category.title}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif-display text-xl text-olive-900 leading-snug mt-4 group-hover:text-bronze-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.introduction && (
                    <p className="font-editorial text-[0.88rem] text-olive-700 mt-2 line-clamp-3 leading-relaxed">
                      {post.introduction}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 mt-3 font-editorial text-[0.65rem] tracking-[0.2em] uppercase text-olive-600 group-hover:text-olive-900">
                    Lire l&apos;article{" "}
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
