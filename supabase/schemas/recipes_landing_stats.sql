create or replace function public.get_recipes_landing_stats()
returns table (
	total_recipes bigint,
	contributor_count bigint,
	tag_count bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
	return query
	select
		coalesce((select count(*)::bigint from public.recipes), 0) as total_recipes,
		coalesce(
			(
				select count(*)::bigint
				from (
					select distinct trim(both from r.author) as author
					from public.recipes as r
					where trim(both from r.author) <> ''
				) distinct_authors
			),
			0
		) as contributor_count,
		coalesce(
			(
				select count(*)::bigint
				from (
					select distinct lower(trim(both from tag_elem.value->> 'tag')) as tag
					from public.recipes as r
					cross join lateral jsonb_array_elements(
						coalesce(to_jsonb(r.tags), '[]'::jsonb)
					) as tag_elem(value)
					where coalesce(tag_elem.value->> 'tag', '') <> ''
				) distinct_tags
			),
			0
		) as tag_count;
end;
$$;
