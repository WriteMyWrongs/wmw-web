import { cn } from "@/lib/utils";

/**
 * WriteMyWrongs typewriter mark. Stroke and keys use `currentColor`, so set
 * the colour via a text utility on the parent (e.g. `text-brand-navy`).
 */
export function TypewriterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-8", className)}
    >
      {/* paper */}
      <rect x="14" y="2" width="20" height="22" rx="2" />
      <path d="M18 9h12" />
      <path d="M18 14h9" />
      {/* carriage left foot */}
      <path d="M14 19H9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5" />
      {/* carriage right lever + platen knob */}
      <path d="M34 21h5" />
      <path d="M39 18v6" />
      <path d="M42 20v2" />
      <path d="M39 21h3" />
      {/* body */}
      <path d="M11.5 24h25l4.5 15H7z" />
      {/* paper guide handle */}
      <path d="M20 24a4 4 0 0 1 8 0" />
      {/* keys */}
      <g fill="currentColor" stroke="none">
        <circle cx="14" cy="34" r="1.3" />
        <circle cx="18" cy="34" r="1.3" />
        <circle cx="22" cy="34" r="1.3" />
        <circle cx="26" cy="34" r="1.3" />
        <circle cx="30" cy="34" r="1.3" />
        <circle cx="34" cy="34" r="1.3" />
      </g>
    </svg>
  );
}
