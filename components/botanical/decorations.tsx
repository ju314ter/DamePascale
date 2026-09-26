/* Décorations botaniques dessinées à la main — partagées par toutes les pages. */

export function PressedLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 10 C20 30, 10 60, 40 110 C70 60, 60 30, 40 10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
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

export function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1" />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(0 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(72 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(144 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(216 50 50)"
      />
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.8"
        transform="rotate(288 50 50)"
      />
    </svg>
  );
}

export function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(90 30 30)"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(180 30 30)"
      />
      <ellipse
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(270 30 30)"
      />
    </svg>
  );
}

export function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50 Q40 45, 60 30 Q80 15, 110 10"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M30 47 C25 38, 28 30, 35 28"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M50 36 C43 28, 46 20, 54 18"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M70 24 C64 18, 68 10, 76 9"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M90 15 C86 10, 90 4, 96 5"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <ellipse
        cx="35"
        cy="26"
        rx="4"
        ry="7"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-20 35 26)"
      />
      <ellipse
        cx="54"
        cy="16"
        rx="4"
        ry="7"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-25 54 16)"
      />
      <ellipse
        cx="76"
        cy="7"
        rx="3"
        ry="5"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-30 76 7)"
      />
    </svg>
  );
}

export function WildRose({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="40" r="2" fill="currentColor" fillOpacity="0.3" />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(72 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(144 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(216 40 40)"
      />
      <path
        d="M40 35 C35 22, 30 18, 33 14 C38 12, 42 18, 40 35Z"
        stroke="currentColor"
        strokeWidth="0.7"
        transform="rotate(288 40 40)"
      />
      <path d="M40 50 L40 75" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 60 L34 54" stroke="currentColor" strokeWidth="0.6" />
      <ellipse
        cx="32"
        cy="53"
        rx="3"
        ry="5"
        stroke="currentColor"
        strokeWidth="0.5"
        transform="rotate(30 32 53)"
      />
    </svg>
  );
}

export function HandCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 5 C48 4, 57 16, 56 30 C55 44, 44 56, 30 56 C16 57, 4 46, 4 30 C3 14, 14 5, 30 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function EnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="7"
        width="26"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 9 L16 18 L29 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PenIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 4 L28 10 L12 26 L4 28 L6 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M20 6 L26 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CraftHandIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 36 C20 40, 12 42, 8 38 C4 34, 6 26, 10 22 L18 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18 14 C18 10, 22 8, 24 11 L24 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M24 18 C24 14, 28 13, 29 16 L30 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M30 20 C30 17, 33 16, 34 19 L34 26"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M34 22 C35 20, 38 20, 38 24 L36 32"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 10 C14 6, 16 4, 18 6 L20 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M16 7 C17 4, 20 4, 20 8"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M20 6 C20 4, 23 4, 23 8"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SeedlingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 42 L24 20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M24 28 C20 24, 12 24, 10 18 C10 12, 18 10, 24 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 22 C28 16, 36 15, 38 20 C40 26, 32 30, 24 26"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 16 C24 14, 26 8, 30 6 C34 4, 36 8, 34 12 C32 16, 28 16, 24 16Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RibbonStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="22" r="9" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M24 6 L24 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 31 L24 38"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M8 22 L15 22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M33 22 L40 22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M13 11 L18 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M30 28 L35 33"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M35 11 L30 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18 28 L13 33"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="3.5" stroke="currentColor" strokeWidth="0.8" />
      <path
        d="M20 38 C20 36, 24 34, 28 38 L26 44 C25 46, 23 46, 22 44Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Tape decoration — a small rotated rectangle simulating washi tape */
export function Tape({
  color = "bg-sage-300/60",
  rotation = "-3deg",
  className = "",
  width = "w-16",
}: {
  color?: string;
  rotation?: string;
  className?: string;
  width?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${width} h-5 ${color} ${className}`}
      style={{ transform: `rotate(${rotation})` }}
    />
  );
}

export function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 3 C10 3, 5 8, 5 14 C5 22, 16 29, 16 29 C16 29, 27 22, 27 14 C27 8, 22 3, 16 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 9 L16 16 L21 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Soulignement « trait de crayon » sous un mot. */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
      className={className}
    >
      <path
        d="M2 8 C40 2, 80 10, 120 4 C150 0, 180 7, 198 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
