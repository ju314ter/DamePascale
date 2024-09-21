"use client";

import React from "react";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BlogPost, getBlogPosts } from "@/sanity/lib/blog/calls";
import { urlFor } from "@/sanity/lib/client";
import Image from "next/image";
import Footer from "@/components/footer/footer";

interface Params {
  [key: string]: string | string[];
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchBlogPosts() {
      const data = await getBlogPosts();
      setBlogPosts(data);
    }
    fetchBlogPosts();
  }, []);

  return (
    <>
      <div className="blog-page w-full max-w-[1200px] mx-auto p-5 pt-[10vh]">
        <div className="blog-header flex flex-col md:flex-row-reverse items-center justify-center gap-4">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-5xl font-bold font-serif text-primary">
              Le blog de Dame Pascale
            </h1>
            <p className="text-lg text-accent">
              Suivez-moi sur les réseaux pour de nouveaux articles réguliers !
            </p>
          </div>
          <Image
            src="/illustrationhome-removebg-compressed.png"
            alt="Logo"
            width={300}
            height={300}
          />
        </div>
        <div className="blog-posts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-10">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="blog-post-card border border-transparent p-4 shadow-md rounded-lg hover:-translate-y-2 hover:borde-secondary transition-all"
            >
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                width={500}
                height={500}
                className="w-full h-48 object-cover mb-4"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
              />
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.category.title}</p>
              <a
                href={`/blog/${post._id}`}
                className="text-primary mt-4 inline-block"
              >
                Lire
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
