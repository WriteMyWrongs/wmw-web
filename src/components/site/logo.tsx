import { TypewriterIcon } from "@/components/site/typewriter-icon";
import { cn } from "@/lib/utils";

/**
 * WriteMyWrongs wordmark: a typewriter mark next to the name. The mark uses the
 * brand navy ink so it reads on any light surface (and flips to the foreground
 * colour in dark mode).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "group/logo inline-flex items-center gap-2 font-semibold",
        className,
      )}
    >
      <TypewriterIcon className="text-brand-navy dark:text-brand-steel size-8 -rotate-3 transition-transform group-hover/logo:rotate-0" />
      <span className="font-display text-brand-navy dark:text-foreground text-lg font-bold tracking-tight">
        WriteMy<span className="redline">Wrongs</span>
      </span>
    </span>
  );
}
