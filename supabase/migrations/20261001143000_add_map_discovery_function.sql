create or replace function public.get_map_places_discovery(
  p_radius_km numeric default 25,
  p_category text default 'all'
)
returns table(
  id uuid,
  osm_id bigint,
  name text,
  category text,
  address text,
  location_city text,
  latitude double precision,
  longitude double precision,
  distance_meters double precision
)
language sql
stable
set search_path = public
as $$
  select
    mp.id,
    mp.osm_id,
    mp.name,
    mp.category,
    mp.address,
    mp.location_city,
    st_y(mp.location_point::geometry) as latitude,
    st_x(mp.location_point::geometry) as longitude,
    st_distance(mp.location_point, get_my_location()) as distance_meters
  from public.map_places mp
  where get_my_location() is not null
    and mp.location_point is not null
    and st_dwithin(
      mp.location_point,
      get_my_location(),
      least(greatest(coalesce(p_radius_km, 25), 0.5), 50) * 1000
    )
    and (
      coalesce(p_category, 'all') = 'all'
      or mp.category = p_category
    )
  order by mp.location_point <-> get_my_location()
  limit 500;
$$;

revoke execute on function public.get_map_places_discovery(numeric, text) from public;
revoke execute on function public.get_map_places_discovery(numeric, text) from anon;
grant execute on function public.get_map_places_discovery(numeric, text) to authenticated;
