/**
 * Shared domain types for WriteMyWrongs, derived from the database schema.
 * See src/types/database.ts and docs/database-schema.md.
 */
import type { Enums, Tables } from "@/types/database";

export type {
  Database,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database";

export type Profile = Tables<"profiles">;
export type Piece = Tables<"pieces">;
export type Tag = Tables<"tags">;
export type Feedback = Tables<"feedback">;
export type Follow = Tables<"follows">;
export type Appreciation = Tables<"appreciations">;

export type PieceStatus = Enums<"piece_status">;

/**
 * Shape of `feedback.anchor` for line-anchored notes: ProseMirror positions
 * plus the quoted text, so the UI can re-locate the range after edits.
 * `null` anchor means a piece-level comment.
 */
export type FeedbackAnchor = {
  from: number;
  to: number;
  quote: string;
};
