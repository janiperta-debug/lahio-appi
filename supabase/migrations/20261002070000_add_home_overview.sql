create or replace function public.get_home_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with me as (
  select location_point as center, coalesce(search_radius_km, 5)::numeric as radius_km, location_city
  from public.profiles where id = auth.uid()
),
listing_rows as (
  select 'play'::text as type, p.id, p.title, p.description, p.created_at,
         null::text as category, null::text as help_type, p.tags, pr.display_name
  from public.play_listings p join public.profiles pr on pr.id = p.user_id cross join me
  where p.status = 'active' and p.location_point is not null and me.center is not null
    and st_dwithin(p.location_point, me.center, me.radius_km * 1000)
  union all
  select 'help'::text as type, h.id, h.title, h.description, h.created_at,
         h.category, h.help_type::text, h.tags, pr.display_name
  from public.help_listings h join public.profiles pr on pr.id = h.user_id cross join me
  where h.status = 'active' and h.location_point is not null and me.center is not null
    and st_dwithin(h.location_point, me.center, me.radius_km * 1000)
),
recent_listings as (select * from listing_rows order by created_at desc limit 6),
recent_events as (
  select e.id, e.title, e.description, e.category, e.location_address, e.location_city,
         e.starts_at, e.max_participants,
         (select count(*)::int from public.event_participants ep
          where ep.event_id = e.id and ep.status = 'going') as participant_count
  from public.events e cross join me
  where e.status = 'active' and e.starts_at >= now()
    and e.location_point is not null and me.center is not null
    and st_dwithin(e.location_point, me.center, me.radius_km * 1000)
  order by e.starts_at asc limit 5
)
select jsonb_build_object(
  'location_city', (select location_city from me),
  'radius_km', coalesce((select radius_km from me), 5),
  'member_count', coalesce((
    select count(*)::int from public.profiles p cross join me
    where p.location_point is not null and me.center is not null
      and st_dwithin(p.location_point, me.center, me.radius_km * 1000)
  ), 0),
  'listing_count', coalesce((select count(*)::int from listing_rows), 0),
  'event_count', coalesce((
    select count(*)::int from public.events e cross join me
    where e.status = 'active' and e.starts_at >= now()
      and e.location_point is not null and me.center is not null
      and st_dwithin(e.location_point, me.center, me.radius_km * 1000)
  ), 0),
  'listings', coalesce((select jsonb_agg(to_jsonb(recent_listings) order by recent_listings.created_at desc) from recent_listings), '[]'::jsonb),
  'events', coalesce((select jsonb_agg(to_jsonb(recent_events) order by recent_events.starts_at asc) from recent_events), '[]'::jsonb)
);
$$;

revoke all on function public.get_home_overview() from public;
grant execute on function public.get_home_overview() to authenticated;
