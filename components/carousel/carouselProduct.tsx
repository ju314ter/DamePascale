import * as React from "react";
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import { Suspense, useCallback, useEffect, useState } from "react";
import { urlFor } from "@/sanity/lib/client";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { Loader } from "lucide-react";

type CarouselProductProps = {
  slides: {
    _key: string;
    _type: "image";
    asset: { _ref: string; _type: string };
  }[];
  options?: EmblaOptionsType;
};

type ThumbPropType = {
  slide: {
    _key: string;
    _type: "image";
    asset: { _ref: string; _type: string };
  };
  selected: boolean;
  index: number;
  onClick: () => void;
};

const Thumb: React.FC<ThumbPropType> = (props) => {
  const { selected, slide, index, onClick } = props;

  return (
    <div
      className={"embla-thumbs__slide".concat(
        selected ? " embla-thumbs__slide--selected" : ""
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number rounded-xl"
      >
        {slide.asset && (
          <Image
            className="embla__slide__img object-cover"
            src={urlFor(slide.asset).url()}
            priority
            alt={`Slide ${index + 1}`}
            width={500}
            height={300}
          />
        )}
      </button>
    </div>
  );
};

export function CarouselProduct({ slides, options }: CarouselProductProps) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
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
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    console.log(slides);
  }, [slides]);

  return (
    <div className="carouselProductWrapper w-full h-full">
      <div className="embla">
        <div className="embla__viewport" ref={emblaMainRef}>
          <div className="embla__container">
            {slides.map((slide, index) => (
              <div
                className="embla__slide"
                key={slide._key || `slide-${index}`}
              >
                <div className="embla__slide__inner">
                  {slide.asset && (
                    <Image
                      className="embla__slide__img rounded-xl object-cover"
                      src={urlFor(slide.asset).url()}
                      alt={`Slide ${index + 1}`}
                      width={1000}
                      height={600}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla-thumbs">
          <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
            <div className="embla-thumbs__container">
              {slides.map((slide, index) => (
                <Thumb
                  key={slide._key || `thumb-${index}`}
                  slide={slide}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
