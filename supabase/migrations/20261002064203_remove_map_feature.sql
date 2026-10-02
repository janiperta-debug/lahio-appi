drop function if exists public.get_map_places_at_point(double precision, double precision, numeric, text);
drop function if exists public.get_map_places_discovery(numeric, text);
drop function if exists public.get_nearby_map_places();

drop table if exists public.map_area_cache;
drop table if exists public.map_places;
