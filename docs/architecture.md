# Architecture

O Meu Treino starts as an Expo + React Native app backed by Supabase. The product should stay modular from day one so the MVP can validate quickly without blocking future growth into trainer, student, billing, assessments, and reporting modules.

## Current Direction

- App: React Native + Expo + Expo Router.
- Language: TypeScript.
- Initial backend: Supabase Auth, PostgreSQL, Row Level Security, and Storage later.
- Initial persistence while prototyping: AsyncStorage-backed store.
- Target architecture: modular monolith with clear feature boundaries.

## Module Boundaries

```txt
src/
  app/                  # Expo Router routes only
  features/
    auth/               # account screens, auth services, profile flows
    workouts/           # programs, weeks, days, exercises, sessions
    profile/            # user settings and goals
    billing/            # future subscriptions and plan limits
    students/           # future student area
    trainers/           # future trainer area
  shared/
    api/                # Supabase client, result helpers, API errors
    components/         # reusable UI primitives
    constants/          # design tokens and static options
    hooks/              # reusable hooks
    storage/            # local cache/offline utilities
    types/              # shared app-wide types
    utils/              # pure helpers
```

Routes should be thin. They may coordinate UI state and navigation, but data access should live in feature services.

## Data Flow

```txt
Screen -> feature hook/store -> feature service -> shared api client -> Supabase
```

Screens should not call Supabase directly. For example, a screen should call `createWorkoutProgram(input)`, not `supabase.from('workout_programs').insert(input)`.

## MVP Strategy

1. Keep local storage until the main flows feel right.
2. Add Supabase schema and RLS before connecting remote data.
3. Introduce feature services one module at a time.
4. Preserve the existing local store as cache/offline support where useful.
5. Avoid adding a NestJS backend until product needs exceed Supabase edge functions and policies.

## Backend Evolution

Supabase is the backend for MVP:

- Auth: account creation, login, recovery, session.
- Database: workout data and account profiles.
- RLS: user data isolation and future trainer-student access.
- Storage: future progress photos and exercise media.

If the product outgrows this shape, introduce a NestJS backend for complex billing, trainer workflows, notifications, reporting, and integrations.

## Codex Workflow

For each implementation task, update or consult:

- `docs/codex-notes.md` for current project decisions.
- `docs/api-contracts.md` for service function contracts.
- `docs/database.md` and `supabase/schema.md` before database changes.

Work in narrow slices. Prefer one module per change: auth, profile, workouts, sessions, history, or billing.
