# Lähellä — Vercel migration

This is the first Vercel-ready version of the working Emergent application.

## Architecture
- Expo Router + React Native Web frontend
- FastAPI backend in `api/index.py`
- Existing Supabase project remains the data/auth backend
- Same-origin `/api/*` calls in Vercel production
- PWA manifest + service worker included

## Environment variables
Production Vercel needs:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional `SUPABASE_ANON_KEY`
- optional `DIGITRANSIT_API_KEY`

For local/native development, `EXPO_PUBLIC_BACKEND_URL` may point to a separately running backend. In Vercel it is intentionally optional because frontend and FastAPI share the same origin.

## Build
`npx expo export --platform web`
