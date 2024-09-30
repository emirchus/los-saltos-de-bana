create extension if not exists "moddatetime" with schema "extensions";


create type "public"."location_type" as enum ('salto', 'clip', 'fail');

alter table "public"."locations" add column "video" text;

alter table "public"."locations" alter column "type" set default 'salto'::location_type;

alter table "public"."locations" alter column "type" set data type location_type using "type"::location_type;

alter table "public"."locations" enable row level security;

alter table "public"."profiles" add column "bio" text;

alter table "public"."profiles" add column "sub" boolean not null default false;

alter table "public"."profiles" add column "urls" text[];

create policy "Enable read access for all users"
on "public"."locations"
as permissive
for select
to public
using (true);


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


