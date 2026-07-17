-- Initial schema for WriteMyWrongs.
-- Design rationale: docs/database-schema.md

create type public.piece_status as enum ('draft', 'published');

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text,
  bio text check (char_length(bio) <= 500),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_key on public.profiles (lower(username));

-- Auto-create a profile on signup. Username seeded from auth metadata when
-- present, otherwise derived from the user id; the user can change it later.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      'writer_' || replace(substr(new.id::text, 1, 8), '-', '')
    ),
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Shared updated_at maintenance.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pieces
-- ---------------------------------------------------------------------------

create table public.pieces (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  -- Tiptap/ProseMirror document as authored.
  content jsonb not null default '{}'::jsonb,
  -- Plain-text mirror of content, maintained by the app on save.
  content_text text not null default '',
  status public.piece_status not null default 'draft',
  published_at timestamptz,
  search tsvector generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', content_text), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status = 'draft' or published_at is not null)
);

create index pieces_author_idx on public.pieces (author_id);
create index pieces_feed_idx on public.pieces (status, published_at desc);
create index pieces_search_idx on public.pieces using gin (search);

create trigger pieces_updated_at
  before update on public.pieces
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name ~ '^[a-z0-9][a-z0-9-]{0,31}$'),
  created_at timestamptz not null default now()
);

create unique index tags_name_key on public.tags (name);

create table public.piece_tags (
  piece_id uuid not null references public.pieces (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (piece_id, tag_id)
);

create index piece_tags_tag_idx on public.piece_tags (tag_id);

-- ---------------------------------------------------------------------------
-- feedback
-- ---------------------------------------------------------------------------

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references public.pieces (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.feedback (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  -- null = piece-level comment. For line-anchored notes:
  -- { "from": int, "to": int, "quote": text } (ProseMirror positions; the
  -- quote lets the UI re-locate the range after the piece is edited).
  anchor jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index feedback_piece_idx on public.feedback (piece_id, created_at);
create index feedback_author_idx on public.feedback (author_id);
create index feedback_parent_idx on public.feedback (parent_id);

create trigger feedback_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- follows
-- ---------------------------------------------------------------------------

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create index follows_followee_idx on public.follows (followee_id);

-- ---------------------------------------------------------------------------
-- appreciations
-- ---------------------------------------------------------------------------

create table public.appreciations (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  piece_id uuid not null references public.pieces (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, piece_id)
);

create index appreciations_piece_idx on public.appreciations (piece_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.pieces enable row level security;
alter table public.tags enable row level security;
alter table public.piece_tags enable row level security;
alter table public.feedback enable row level security;
alter table public.follows enable row level security;
alter table public.appreciations enable row level security;

-- profiles: public read, owner update. Inserts happen via the signup trigger.
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "users update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- pieces: published are public, drafts are author-only.
create policy "published pieces are viewable by everyone"
  on public.pieces for select
  using (status = 'published' or author_id = (select auth.uid()));

create policy "authors insert own pieces"
  on public.pieces for insert
  with check (author_id = (select auth.uid()));

create policy "authors update own pieces"
  on public.pieces for update
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "authors delete own pieces"
  on public.pieces for delete
  using (author_id = (select auth.uid()));

-- tags: public read, any signed-in user can create (created on first use).
create policy "tags are viewable by everyone"
  on public.tags for select using (true);

create policy "signed-in users create tags"
  on public.tags for insert
  with check ((select auth.uid()) is not null);

-- piece_tags: visible with the piece; managed by the piece's author.
create policy "piece tags follow piece visibility"
  on public.piece_tags for select
  using (exists (
    select 1 from public.pieces p
    where p.id = piece_id
      and (p.status = 'published' or p.author_id = (select auth.uid()))
  ));

create policy "authors tag own pieces"
  on public.piece_tags for insert
  with check (exists (
    select 1 from public.pieces p
    where p.id = piece_id and p.author_id = (select auth.uid())
  ));

create policy "authors untag own pieces"
  on public.piece_tags for delete
  using (exists (
    select 1 from public.pieces p
    where p.id = piece_id and p.author_id = (select auth.uid())
  ));

-- feedback: visible when its piece is visible; only on published pieces.
create policy "feedback follows piece visibility"
  on public.feedback for select
  using (exists (
    select 1 from public.pieces p
    where p.id = piece_id
      and (p.status = 'published' or p.author_id = (select auth.uid()))
  ));

create policy "signed-in users give feedback on published pieces"
  on public.feedback for insert
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.pieces p
      where p.id = piece_id and p.status = 'published'
    )
  );

create policy "authors update own feedback"
  on public.feedback for update
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "authors delete own feedback"
  on public.feedback for delete
  using (author_id = (select auth.uid()));

-- follows: public read; the follower manages their own follows.
create policy "follows are viewable by everyone"
  on public.follows for select using (true);

create policy "users follow as themselves"
  on public.follows for insert
  with check (follower_id = (select auth.uid()));

create policy "users unfollow as themselves"
  on public.follows for delete
  using (follower_id = (select auth.uid()));

-- appreciations: public read; one per reader, published pieces only.
create policy "appreciations are viewable by everyone"
  on public.appreciations for select using (true);

create policy "users appreciate published pieces"
  on public.appreciations for insert
  with check (
    profile_id = (select auth.uid())
    and exists (
      select 1 from public.pieces p
      where p.id = piece_id and p.status = 'published'
    )
  );

create policy "users remove own appreciations"
  on public.appreciations for delete
  using (profile_id = (select auth.uid()));
