# Database

The database source of truth is PostgreSQL on Supabase. The local AsyncStorage store is temporary MVP persistence and can later become an offline cache.

## Core Tables

```txt
profiles
workout_programs
workout_weeks
workout_days
exercises
workout_sessions
exercise_logs
```

## Ownership Model

Every user-owned table should have a `user_id` referencing `auth.users(id)`.

For MVP:

- A user can only read and write their own profile.
- A user can only read and write their own workout programs and nested workout data.
- Sessions and exercise logs belong to the user that executed the workout.

For trainer workflows later:

- Introduce `trainer_students`.
- Add policies that allow a trainer to read or write linked student workout data.
- Keep direct ownership on the student user whenever the data is assigned to a student.

## Naming

Database uses snake_case:

```txt
created_at
updated_at
user_id
program_id
week_id
workout_day_id
rest_seconds
```

TypeScript uses camelCase:

```txt
createdAt
updatedAt
userId
programId
weekId
workoutDayId
restSeconds
```

Feature services are responsible for mapping between these formats.

## Status Values

Workout status:

```txt
not_started
in_progress
completed
```

Workout goals:

```txt
hipertrofia
emagrecimento
forca
condicionamento
saude_geral
```

Feedback:

```txt
facil
moderado
dificil
dor_desconforto
nao_consegui_completar
```

## Migration Policy

- Database changes must be made through files in `supabase/migrations`.
- Each migration should be small and reversible in spirit, even when Supabase does not require a down migration.
- RLS must be enabled in the same change that creates user-owned tables.
- Never rely on frontend checks for privacy or access control.

## Local Development

Until Supabase is connected, keep the app functional with seeded local data. When a service is migrated to Supabase, keep the UI API stable so screens do not need broad rewrites.
