import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PieceStatus } from "@/types";

export type FeedItem = {
  id: string;
  title: string;
  status: PieceStatus;
  updatedAt: string;
  publishedAt: string | null;
  excerpt: string;
  tags: string[];
  likes: number;
  comments: number;
  authorName: string;
};

/** Compact relative time, e.g. "just now", "5m ago", "3h ago", "2d ago". */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const chars = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return chars.toUpperCase();
}

export function FeedCard({ item }: { item: FeedItem }) {
  const published = item.status === "published";
  const stamp =
    published && item.publishedAt ? item.publishedAt : item.updatedAt;

  return (
    <article className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="bg-brand-sky text-brand-navy grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold"
        >
          {initials(item.authorName)}
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold">
            {item.authorName}
          </p>
          <p className="text-muted-foreground text-xs">
            {relativeTime(stamp)} · {published ? "Published" : "Draft"}
          </p>
        </div>
        <Badge
          variant={published ? "default" : "outline"}
          className="ml-auto shrink-0"
        >
          {published ? "Published" : "Draft"}
        </Badge>
        <MoreHorizontal
          aria-hidden
          className="text-muted-foreground size-4 shrink-0"
        />
      </header>

      <Link href={`/write/${item.id}`} className="group mt-4 block">
        <h3 className="font-display text-brand-navy dark:text-foreground text-2xl font-bold tracking-tight group-hover:underline">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
            {item.excerpt}
          </p>
        ) : null}
      </Link>

      {item.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="bg-brand-sky/40 text-brand-navy dark:bg-brand-navy/40 dark:text-brand-sky rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <footer className="border-border/60 text-muted-foreground mt-4 flex items-center gap-5 border-t pt-3 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="size-4" />
          {item.likes}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-4" />
          {item.comments}
        </span>
        <Link
          href={`/write/${item.id}`}
          className="hover:text-foreground ml-auto inline-flex items-center gap-1.5 text-xs font-medium"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
      </footer>
    </article>
  );
}
