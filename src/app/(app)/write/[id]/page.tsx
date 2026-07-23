import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Editor } from "@/app/(app)/write/editor";
import { SiteShell } from "@/components/site/site-shell";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit piece",
};

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const supabase = await createClient();
  // Scope to the author so only the owner can open the editor — a non-owner
  // (who could still SELECT a published piece via RLS) gets a 404 instead.
  const { data: piece } = await supabase
    .from("pieces")
    .select("id, title, content, status")
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();

  if (!piece) notFound();

  return (
    <SiteShell>
      <Editor piece={piece} />
    </SiteShell>
  );
}
