# Supabase Schema

This is the planned MVP schema. The executable SQL lives in `supabase/migrations/0001_initial_schema.sql`.

## Tables

```txt
profiles
  id uuid primary key references auth.users(id)
  name text not null
  email text not null
  role text not null default 'student'
  goal text
  created_at timestamptz not null
  updated_at timestamptz not null

workout_programs
  id uuid primary key
  user_id uuid not null references auth.users(id)
  title text not null
  description text
  goal text not null
  created_at timestamptz not null
  updated_at timestamptz not null

workout_weeks
  id uuid primary key
  program_id uuid not null references workout_programs(id)
  user_id uuid not null references auth.users(id)
  title text not null
  week_number integer not null
  notes text
  created_at timestamptz not null
  updated_at timestamptz not null

workout_days
  id uuid primary key
  week_id uuid not null references workout_weeks(id)
  user_id uuid not null references auth.users(id)
  title text not null
  day_of_week text
  display_order integer not null
  status text not null
  created_at timestamptz not null
  updated_at timestamptz not null

exercises
  id uuid primary key
  workout_day_id uuid not null references workout_days(id)
  user_id uuid not null references auth.users(id)
  name text not null
  muscle_group text not null
  sets text not null
  reps text not null
  load text
  rest_seconds integer not null
  notes text
  display_order integer not null
  created_at timestamptz not null
  updated_at timestamptz not null

workout_sessions
  id uuid primary key
  user_id uuid not null references auth.users(id)
  workout_day_id uuid not null references workout_days(id)
  started_at timestamptz not null
  finished_at timestamptz
  status text not null
  feedback text
  created_at timestamptz not null
  updated_at timestamptz not null

exercise_logs
  id uuid primary key
  session_id uuid not null references workout_sessions(id)
  exercise_id uuid not null references exercises(id)
  user_id uuid not null references auth.users(id)
  completed boolean not null
  actual_load text
  actual_reps text
  difficulty text
  notes text
  created_at timestamptz not null
  updated_at timestamptz not null
```

## RLS Policy

For MVP, every user-owned table has a simple rule:

```txt
auth.uid() = user_id
```

For `profiles`, ownership is:

```txt
auth.uid() = id
```

Trainer access should be added later with explicit relationship tables and separate policies.
