"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { pieceInputSchema } from "@/lib/validation/piece";
import type { Json } from "@/types";

export type SaveResult = { id?: string; error?: string };

/**
 * Create or update a piece. RLS guarantees a user can only touch their own
 * rows, and requireUser() is the auth backstop. Publishing sets
 * `published_at` once and preserves it on later edits.
 */
export async function savePiece(raw: unknown): Promise<SaveResult> {
  const parsed = pieceInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { id, title, content, contentText, publish } = parsed.data;

  const user = await requireUser();
  const supabase = await createClient();

  const base = {
    title,
    content: content as Json,
    content_text: contentText,
    status: publish ? ("published" as const) : ("draft" as const),
  };

  if (id) {
    // Preserve the original publish date across edits; only stamp it the
    // first time a piece is published.
    let published_at: string | undefined;
    if (publish) {
      const { data: existing } = await supabase
        .from("pieces")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      published_at = existing?.published_at ?? new Date().toISOString();
    }

    const { error } = await supabase
      .from("pieces")
      .update(publish ? { ...base, published_at } : base)
      .eq("id", id);
    if (error) return { error: "Could not save your piece." };

    revalidatePath("/dashboard");
    return { id };
  }

  const { data, error } = await supabase
    .from("pieces")
    .insert({
      ...base,
      author_id: user.id,
      ...(publish ? { published_at: new Date().toISOString() } : {}),
    })
    .select("id")
    .single();
  if (error || !data) return { error: "Could not save your piece." };

  revalidatePath("/dashboard");
  return { id: data.id };
}
