"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Apparition douce au défilement (désactivée si l'utilisateur réduit les animations). */
export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </Component>
  );
}
