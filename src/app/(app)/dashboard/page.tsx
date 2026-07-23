import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";

import { FeedCard, type FeedItem } from "@/app/(app)/dashboard/feed-card";
import { DashboardSidebar } from "@/app/(app)/dashboard/sidebar";
import { DashboardTopbar } from "@/app/(app)/dashboard/topbar";
import { DashboardWidgets } from "@/app/(app)/dashboard/widgets";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { PieceStatus } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Shape of the pieces query with embedded tags and engagement counts. Cast
// through unknown because PostgREST aggregate embeds aren't inferred by the
// generated types.
type PieceRow = {
  id: string;
  title: string;
  content_text: string;
  status: PieceStatus;
  updated_at: string;
  published_at: string | null;
  appreciations: { count: number }[];
  feedback: { count: number }[];
  piece_tags: { tags: { name: string } | null }[];
};

const TABS = [
  { key: undefined, label: "All", href: "/dashboard" },
  { key: "drafts", label: "Drafts", href: "/dashboard?tab=drafts" },
  { key: "published", label: "Published", href: "/dashboard?tab=published" },
] as const;

const SUGGESTED_TAGS = [
  "fiction",
  "poetry",
  "shortstory",
  "essay",
  "fantasy",
  "memoir",
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const { tab } = await searchParams;
  const filter =
    tab === "drafts" ? "draft" : tab === "published" ? "published" : null;

  const supabase = await createClient();

  let piecesQuery = supabase
    .from("pieces")
    .select(
      "id, title, content_text, status, updated_at, published_at, appreciations(count), feedback(count), piece_tags(tags(name))",
    )
    .eq("author_id", user.id);
  if (filter) piecesQuery = piecesQuery.eq("status", filter);
  piecesQuery = piecesQuery.order("updated_at", { ascending: false });

  const [{ data: profile }, { data: pieces }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .maybeSingle(),
    piecesQuery,
  ]);

  const name =
    profile?.display_name || profile?.username || user.email || "you";
  const rows = (pieces ?? []) as unknown as PieceRow[];

  const items: FeedItem[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    excerpt: row.content_text?.slice(0, 220) ?? "",
    tags: row.piece_tags
      .map((pt) => pt.tags?.name)
      .filter((t): t is string => Boolean(t)),
    likes: row.appreciations[0]?.count ?? 0,
    comments: row.feedback[0]?.count ?? 0,
    authorName: name,
  }));

  const usedTags = [...new Set(items.flatMap((i) => i.tags))];
  const popularTags =
    usedTags.length > 0 ? usedTags.slice(0, 8) : SUGGESTED_TAGS;

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar name={name} />

        <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-6 sm:px-6">
          <main className="min-w-0 flex-1">
            <div className="border-border/60 flex gap-6 border-b">
              {TABS.map((t) => {
                const active = (tab ?? undefined) === t.key;
                return (
                  <Link
                    key={t.label}
                    href={t.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "-mb-px border-b-2 pb-3 text-sm transition-colors",
                      active
                        ? "border-brand-navy text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground border-transparent",
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>

            {items.length === 0 ? (
              <div className="border-border/70 mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
                <p className="hand text-brand-steel text-2xl">
                  a blank page, full of potential
                </p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  {filter
                    ? `You have no ${filter} pieces yet.`
                    : "You haven't written anything yet. Start your first draft and share it when you're ready."}
                </p>
                <Link
                  href="/write"
                  className={buttonVariants({ className: "mt-2 gap-2" })}
                >
                  <PenLine />
                  Start writing
                </Link>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-5">
                {items.map((item) => (
                  <FeedCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </main>

          <DashboardWidgets tags={popularTags} />
        </div>
      </div>
    </div>
  );
}
