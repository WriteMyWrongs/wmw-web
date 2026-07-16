/**
 * Shared domain types for WriteMyWrongs.
 * Database row types will be generated from Supabase once the schema lands
 * (see issue #11 "Design database schema").
 */

export type Piece = {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
};
