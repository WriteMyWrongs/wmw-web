import { MessageSquareText, PenLine, Sparkles, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: PenLine,
    title: "A clean place to write",
    description:
      "A distraction-free editor built for drafting, polishing, and publishing your work.",
    note: "no more Google Docs",
    tilt: "-rotate-2",
  },
  {
    icon: MessageSquareText,
    title: "Feedback that helps",
    description:
      "Line-by-line notes from a community that wants you to get better, not just likes.",
    note: "the good kind of critique",
    tilt: "rotate-1",
  },
  {
    icon: Users,
    title: "Find your readers",
    description:
      "Share pieces, follow writers you admire, and build an audience for your voice.",
    note: "hi, new fans",
    tilt: "rotate-2",
  },
  {
    icon: Sparkles,
    title: "Grow with every draft",
    description:
      "Track your progress, join challenges, and turn practice into real improvement.",
    note: "glow-up, literally",
    tilt: "-rotate-1",
  },
];

export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="hand text-brand-steel mb-1 text-2xl">
          here&apos;s the good stuff
        </p>
        <h2 className="font-display text-brand-navy dark:text-foreground text-4xl font-black tracking-tight sm:text-5xl">
          Everything you need to keep writing
        </h2>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description, note, tilt }) => (
          <div
            key={title}
            className={cn(
              "group border-border/70 bg-card relative rounded-xl border p-6 shadow-sm transition-transform duration-200 hover:rotate-0 hover:shadow-md",
              tilt,
            )}
          >
            {/* Tape on the top edge */}
            <span
              aria-hidden
              className="tape top-[-0.6rem] left-1/2 -translate-x-1/2 -rotate-3 rounded-[2px]"
            />

            <div className="bg-brand-sky/50 text-brand-navy dark:bg-brand-navy/40 dark:text-foreground mb-4 grid size-11 place-items-center rounded-lg">
              <Icon className="size-5" />
            </div>
            <h3 className="font-display text-brand-navy dark:text-foreground text-xl font-bold">
              {title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">{description}</p>
            <p className="hand text-brand-steel mt-3 text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
