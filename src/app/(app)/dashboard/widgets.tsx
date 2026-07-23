import Link from "next/link";
import { Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function DashboardWidgets({ tags }: { tags: string[] }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-5 py-6 xl:flex">
      <section className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm">
        <h2 className="text-brand-navy dark:text-foreground flex items-center gap-2 font-semibold">
          <Trophy className="text-brand-steel size-5" />
          Writing Challenge
        </h2>
        <p className="font-display text-brand-navy dark:text-foreground mt-3 text-lg font-bold text-balance">
          Weekly prompt: “A letter to your future self.”
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Share your story and inspire others.
        </p>
        <Link
          href="/challenges"
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          Join challenge
        </Link>
      </section>

      {tags.length > 0 ? (
        <section className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm">
          <h2 className="text-brand-navy dark:text-foreground font-semibold">
            Popular tags
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-brand-sky/40 text-brand-navy dark:bg-brand-navy/40 dark:text-brand-sky rounded-full px-2.5 py-1 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
