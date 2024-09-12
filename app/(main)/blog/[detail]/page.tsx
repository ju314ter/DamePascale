"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BlogPost, getBlogPostById } from "@/sanity/lib/blog/calls";
import { urlFor } from "@/sanity/lib/client";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: any }) => (
      <Image
        src={urlFor(value).url()}
        alt={""}
        width={500}
        height={500}
        className="mx-auto rounded-md"
      />
    ),
    callToAction: ({
      value,
      isInline,
    }: {
      value: { text: string; url: string };
      isInline: boolean;
    }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
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
        <a href={value?.href} rel={rel}>
          {children}
        </a>
      );
    },
  },
  listItem: ({ children }: { children?: React.ReactNode }) => (
    <li className="list-disc mt-2 ml-5">{children}</li>
  ),
};

interface Params {
  [key: string]: string | string[];
}

const BlogDetailCollectionPage = () => {
  const params: Params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchBlogpost() {
      if (typeof params.detail === "string") {
        const data = await getBlogPostById(params.detail);
        setBlogPost(data);
      } else {
        console.error("Invalid ID format");
      }
    }
    fetchBlogpost();
  }, [params]);

  if (!blogPost) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        Trying to load collection post...
      </div>
    );
  }
  return (
    <div className="relative w-full max-w-[1200px] min-h-[100vh] mx-auto pt-[10vh] p-5 overflow-hidden mb-[5vh]">
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <Image
          src="/transparentknittingtexture.png"
          alt="Transparent texture"
          style={{ opacity: 0.2 }}
          width={1024}
          height={1024}
        />
      </div>

      <div className="relative z-20 flex flex-col gap-8 w-full text-lg md:text-xl">
        {blogPost.title && (
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            {blogPost.title}
          </h1>
        )}
        {blogPost.introduction && (
          <h3 className="text-xl md:text-2xl">{blogPost.introduction}</h3>
        )}
        <div className="mainImage_wrapper relative w-full">
          <Image
            src={urlFor(blogPost.mainImage).url()}
            alt={blogPost.title}
            width={1200}
            height={800}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            className="w-full mb-4"
          />
          {blogPost.hotspots &&
            blogPost.hotspots.map(
              (spot: {
                x: number;
                y: number;
                details: string;
                url?: string;
              }) => (
                <HoverCard key={spot.y + spot.x + spot.details} openDelay={100}>
                  <HoverCardTrigger asChild>
                    <div
                      className="absolute cursor-pointer w-6 h-6 md:w-10 md:h-10 lg:w-16 lg:h-16 bg-white/50 border border-primary b-4 rounded-full z-30"
                      style={{
                        left: spot.x * 0.95 + "%",
                        top: spot.y * 0.95 + "%",
                      }}
                    ></div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-40 md:w-80 flex flex-col md:flex-row justify-around items-center gap-4">
                    <p className="text-secondary">{spot.details}</p>
                    {spot.url && (
                      <Link href={spot.url}>
                        <Button variant="hotspot">Détails</Button>
                      </Link>
                    )}
                  </HoverCardContent>
                </HoverCard>
              )
            )}
        </div>
        {blogPost.content && (
          <PortableText
            value={blogPost.content}
            components={portableTextComponents}
          />
        )}
      </div>
    </div>
  );
};

export default BlogDetailCollectionPage;
