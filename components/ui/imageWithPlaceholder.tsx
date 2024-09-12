import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ImageWithPlaceholder({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent rounded">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setLoading(false)}
        className={`${className} transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}
