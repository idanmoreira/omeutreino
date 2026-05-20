# Codex Notes

Use this file as the compact project memory for future Codex sessions.

## Product

O Meu Treino is a mobile-first workout organizer. The MVP validates this loop:

```txt
Create program -> create week -> create days -> add exercises -> execute workout -> save history
```

The future product expands into a SaaS platform for personal trainers, students, periodization, assessments, billing, reports, and templates.

## Current Implementation

- Expo Router app with dark UI.
- Splash screen at `/`.
- Local MVP auth at `/auth`.
- Home at `/home`.
- Workout week, day execution, and history routes exist.
- Workout data is currently stored through `useWorkoutStore` and AsyncStorage.
- Seed data lives in `src/features/workouts/seed.ts`.

## Decisions

- Start with Supabase instead of a custom backend.
- Use PostgreSQL with RLS as the access-control boundary.
- Keep screens thin and move data operations into feature services before connecting Supabase.
- Do not introduce billing, trainer workflows, videos, AI, or assessments before the MVP loop is solid.
- Prefer small module-focused changes to reduce review and token overhead.

## Next Good Tasks

1. Add shared API helpers: normalized errors, result shape, and Supabase client placeholder.
2. Move auth logic into `features/auth`.
3. Move workout store inputs and mutations toward services under `features/workouts/services`.
4. Connect Supabase Auth.
5. Apply the initial database migration.
6. Replace local-only program/week/day/exercise persistence with Supabase-backed services plus local cache.

## Validation

Run these before publishing changes:

```bash
npm run typecheck
npx expo export --platform web
```

If `expo start --web` fails on the local machine because of Node/freeport issues, validate with the exported `dist` build served locally.
