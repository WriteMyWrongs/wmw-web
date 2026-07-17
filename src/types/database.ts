/**
 * Database types mirroring supabase/migrations/.
 *
 * Hand-authored in the shape `supabase gen types typescript` produces, so a
 * generated file can drop in as a replacement once the CLI is part of the
 * workflow (`npm run db:types`). Update this file whenever a migration
 * changes the schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pieces: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: Json;
          content_text: string;
          status: Database["public"]["Enums"]["piece_status"];
          published_at: string | null;
          search: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content?: Json;
          content_text?: string;
          status?: Database["public"]["Enums"]["piece_status"];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: Json;
          content_text?: string;
          status?: Database["public"]["Enums"]["piece_status"];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pieces_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      piece_tags: {
        Row: {
          piece_id: string;
          tag_id: string;
        };
        Insert: {
          piece_id: string;
          tag_id: string;
        };
        Update: {
          piece_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "piece_tags_piece_id_fkey";
            columns: ["piece_id"];
            isOneToOne: false;
            referencedRelation: "pieces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "piece_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: {
          id: string;
          piece_id: string;
          author_id: string;
          parent_id: string | null;
          body: string;
          anchor: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          piece_id: string;
          author_id: string;
          parent_id?: string | null;
          body: string;
          anchor?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          piece_id?: string;
          author_id?: string;
          parent_id?: string | null;
          body?: string;
          anchor?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_piece_id_fkey";
            columns: ["piece_id"];
            isOneToOne: false;
            referencedRelation: "pieces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "feedback";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          follower_id: string;
          followee_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          followee_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          followee_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_followee_id_fkey";
            columns: ["followee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      appreciations: {
        Row: {
          profile_id: string;
          piece_id: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          piece_id: string;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          piece_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appreciations_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appreciations_piece_id_fkey";
            columns: ["piece_id"];
            isOneToOne: false;
            referencedRelation: "pieces";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      piece_status: "draft" | "published";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
