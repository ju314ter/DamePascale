import { SmallBlossom } from "@/components/botanical/decorations";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  as: Tag = "h2",
  eyebrowColor = "text-bronze-500",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  eyebrowColor?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={`${center ? "text-center mx-auto" : ""} max-w-2xl mb-10 md:mb-14`}
    >
      {eyebrow && (
        <span
          className={`font-hand text-lg md:text-xl ${eyebrowColor} block mb-2`}
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={`font-serif-display text-olive-800 leading-[1.1] ${
          Tag === "h1"
            ? "text-4xl sm:text-5xl md:text-6xl"
            : "text-3xl sm:text-4xl md:text-5xl"
        }`}
      >
        {title}
      </Tag>
      <div
        className={`flex items-center gap-3 mt-4 ${center ? "justify-center" : ""}`}
      >
        <div className="w-10 h-px bg-olive-300/50" />
        <SmallBlossom className="w-4 h-4 text-olive-400/50" />
        <div className="w-10 h-px bg-olive-300/50" />
      </div>
      {intro && (
        <p className="font-editorial text-olive-700 text-[0.95rem] md:text-base leading-relaxed mt-5">
          {intro}
        </p>
      )}
    </div>
  );
}
