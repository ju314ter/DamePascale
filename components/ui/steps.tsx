import { Tape } from "@/components/botanical/decorations";

const TAPES = [
  "bg-sage-300/50",
  "bg-bronze-300/50",
  "bg-[#c4897a]/40",
  "bg-sage-300/50",
];
const ROT = ["-1.5deg", "1deg", "-0.8deg", "1.4deg"];

/** Étapes façon « notes épinglées ». */
export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative bg-white/90 px-6 pt-9 pb-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
          style={{ transform: `rotate(${ROT[i % 4]})`, borderRadius: 2 }}
        >
          <Tape
            color={TAPES[i % 4]}
            rotation="-3deg"
            width="w-14"
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-sm"
          />
          <span className="font-hand text-4xl text-bronze-500 leading-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif-display text-lg text-olive-800 mt-2 mb-2">
            {step.title}
          </h3>
          <p className="font-editorial text-[0.88rem] text-olive-700 leading-relaxed">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
