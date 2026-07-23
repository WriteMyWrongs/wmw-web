import { z } from "zod";

/**
 * Input for creating/updating a piece from the editor. `content` is the
 * Tiptap/ProseMirror JSON document (opaque object here — the editor owns its
 * shape); `contentText` is the plain-text extraction used for search.
 */
export const pieceInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Give your piece a title.").max(200),
  content: z.record(z.string(), z.unknown()),
  contentText: z.string().max(500_000),
  publish: z.boolean(),
});

export type PieceInput = z.infer<typeof pieceInputSchema>;
