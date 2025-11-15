-- Stores which recipes a signed-in user has marked as a favorite.
create table if not exists public.favorites (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	recipe_id bigint not null references public.recipes(id) on delete cascade,
	created_at timestamptz not null default timezone('utc', now()),
	constraint favorites_user_recipe_unique unique (user_id, recipe_id)
);

comment on table public.favorites is 'End-user favorites list linking users to recipes.';
comment on column public.favorites.user_id is 'Authenticated user who favorited the recipe.';
comment on column public.favorites.recipe_id is 'Recipe that was favorited.';
comment on column public.favorites.created_at is 'Timestamp when the favorite was created.';

alter table public.favorites enable row level security;

create policy favorites_select_own
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy favorites_insert_self
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy favorites_delete_self
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

create policy favorites_update_self
on public.favorites
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
