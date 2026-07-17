-- Grant table privileges to the Supabase API roles.
--
-- Newer Supabase images no longer grant DML on migration-created tables to
-- anon/authenticated/service_role by default (verified locally: default ACLs
-- give them only TRUNCATE/REFERENCES/TRIGGER/MAINTAIN). Without these grants
-- every PostgREST request fails with "permission denied" before RLS is even
-- consulted. Grants are the ceiling; the RLS policies in the initial schema
-- migration still decide which rows each request can touch.
--
-- anon gets read-only. authenticated gets the DML each table's policies
-- allow. service_role gets everything (it bypasses RLS by design).
-- profiles has no INSERT grant: rows are created by the security-definer
-- signup trigger, never by the API roles.

grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;

grant select on public.pieces to anon, authenticated;
grant insert, update, delete on public.pieces to authenticated;

grant select on public.tags to anon, authenticated;
grant insert on public.tags to authenticated;

grant select on public.piece_tags to anon, authenticated;
grant insert, delete on public.piece_tags to authenticated;

grant select on public.feedback to anon, authenticated;
grant insert, update, delete on public.feedback to authenticated;

grant select on public.follows to anon, authenticated;
grant insert, delete on public.follows to authenticated;

grant select on public.appreciations to anon, authenticated;
grant insert, delete on public.appreciations to authenticated;

grant select, insert, update, delete on all tables in schema public
  to service_role;
