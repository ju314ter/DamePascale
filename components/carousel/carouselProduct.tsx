"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";
import { urlForImage } from "@/sanity/lib/image";
import "./embla.css";

type Slide = {
  _key: string;
  _type: "image";
  asset: { _ref: string; _type: string };
};

type CarouselProductProps = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

function ChevronLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M8.5 2L4 6.5L8.5 11" stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M4.5 2L9 6.5L4.5 11" stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CarouselProduct({ slides, options }: CarouselProductProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ ...options, loop: true });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = useCallback(() => emblaMainApi?.scrollPrev(), [emblaMainApi]);
  const scrollNext = useCallback(() => emblaMainApi?.scrollNext(), [emblaMainApi]);

  const counter = slides.length > 1
    ? `${String(selectedIndex + 1).padStart(2, "0")} — ${String(slides.length).padStart(2, "0")}`
    : null;

  return (
    <div className="w-full select-none">

      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div className="relative group/carousel">
        <div className="ep__viewport" ref={emblaMainRef}>
          <div className="ep__container">
            {slides.map((slide, i) => (
              <div className="ep__slide" key={slide._key || `slide-${i}`}>
                <div
                  className="relative w-full flex items-center justify-center"
                  style={{ aspectRatio: "1 / 1", backgroundColor: "#fdf8ed" }}
                >
                  {slide.asset && (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <ImageWithPlaceholder
                        src={urlForImage(slide.asset)}
                        alt={`Vue ${i + 1}`}
                        width={700}
                        height={700}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next — appear on hover */}
        {slides.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Image précédente"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 flex items-center justify-center
                rounded-full bg-white/75 backdrop-blur-sm
                border border-olive-200/60 text-olive-600
                opacity-0 group-hover/carousel:opacity-100
                transition-all duration-300
                hover:bg-white hover:border-olive-400/60 hover:text-olive-800
                active:scale-95
              "
            >
              <ChevronLeft />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Image suivante"
              className="
                absolute right-3 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 flex items-center justify-center
                rounded-full bg-white/75 backdrop-blur-sm
                border border-olive-200/60 text-olive-600
                opacity-0 group-hover/carousel:opacity-100
                transition-all duration-300
                hover:bg-white hover:border-olive-400/60 hover:text-olive-800
                active:scale-95
              "
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Slide counter — bottom-right, always visible */}
        {counter && (
          <div
            className="absolute bottom-3.5 right-4 pointer-events-none"
            aria-label={`Image ${selectedIndex + 1} sur ${slides.length}`}
          >
            <span
              className="font-hand text-olive-400/60 leading-none"
              style={{ fontSize: "1.05rem", letterSpacing: "0.04em" }}
            >
              {counter}
            </span>
          </div>
        )}
      </div>

      {/* ── Thumbnail filmstrip ─────────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <div className="ep-thumbs__viewport px-3 pb-3" ref={emblaThumbsRef}>
            <div className="ep-thumbs__container">
              {slides.map((slide, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <button
                    key={slide._key || `thumb-${i}`}
                    type="button"
                    onClick={() => onThumbClick(i)}
                    aria-label={`Vue ${i + 1}`}
                    aria-current={isSelected}
                    className="ep-thumbs__slide relative flex-shrink-0 focus-visible:outline-none group/thumb"
                  >
                    {/* Selection tab — thin line at top */}
                    <div
                      className="absolute top-0 inset-x-0 h-[2px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(101,90,56,0.7)"
                          : "rgba(139,119,75,0.12)",
                      }}
                    />

                    {/* Thumb image */}
                    <div
                      className="relative mt-1 overflow-hidden transition-all duration-300"
                      style={{
                        aspectRatio: "1 / 1",
                        backgroundColor: "#fdf8ed",
                        opacity: isSelected ? 1 : 0.38,
                        filter: isSelected ? "none" : "grayscale(25%)",
                      }}
                    >
                      {slide.asset && (
                        <div className="absolute inset-0 flex items-center justify-center p-1.5">
                          <ImageWithPlaceholder
                            src={urlForImage(slide.asset)}
                            alt={`Miniature ${i + 1}`}
                            width={150}
                            height={150}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
