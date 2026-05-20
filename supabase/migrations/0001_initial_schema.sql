create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'student' check (role in ('student', 'trainer', 'admin')),
  goal text check (goal in ('hipertrofia', 'emagrecimento', 'forca', 'condicionamento', 'saude_geral')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  goal text not null check (goal in ('hipertrofia', 'emagrecimento', 'forca', 'condicionamento', 'saude_geral')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_weeks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.workout_programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  week_number integer not null check (week_number > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, week_number)
);

create table public.workout_days (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.workout_weeks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  day_of_week text,
  display_order integer not null check (display_order > 0),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_id, display_order)
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  muscle_group text not null,
  sets text not null,
  reps text not null,
  load text,
  rest_seconds integer not null default 90 check (rest_seconds >= 0),
  notes text,
  display_order integer not null check (display_order > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workout_day_id, display_order)
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  feedback text check (feedback in ('facil', 'moderado', 'dificil', 'dor_desconforto', 'nao_consegui_completar')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed boolean not null default false,
  actual_load text,
  actual_reps text,
  difficulty text check (difficulty in ('facil', 'moderado', 'dificil')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, exercise_id)
);

create index workout_programs_user_id_idx on public.workout_programs(user_id);
create index workout_weeks_program_id_idx on public.workout_weeks(program_id);
create index workout_weeks_user_id_idx on public.workout_weeks(user_id);
create index workout_days_week_id_idx on public.workout_days(week_id);
create index workout_days_user_id_idx on public.workout_days(user_id);
create index exercises_workout_day_id_idx on public.exercises(workout_day_id);
create index exercises_user_id_idx on public.exercises(user_id);
create index workout_sessions_user_id_idx on public.workout_sessions(user_id);
create index workout_sessions_workout_day_id_idx on public.workout_sessions(workout_day_id);
create index exercise_logs_session_id_idx on public.exercise_logs(session_id);
create index exercise_logs_user_id_idx on public.exercise_logs(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger workout_programs_set_updated_at
before update on public.workout_programs
for each row execute function public.set_updated_at();

create trigger workout_weeks_set_updated_at
before update on public.workout_weeks
for each row execute function public.set_updated_at();

create trigger workout_days_set_updated_at
before update on public.workout_days
for each row execute function public.set_updated_at();

create trigger exercises_set_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

create trigger workout_sessions_set_updated_at
before update on public.workout_sessions
for each row execute function public.set_updated_at();

create trigger exercise_logs_set_updated_at
before update on public.exercise_logs
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workout_programs enable row level security;
alter table public.workout_weeks enable row level security;
alter table public.workout_days enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "workout_programs_select_own" on public.workout_programs for select using (auth.uid() = user_id);
create policy "workout_programs_insert_own" on public.workout_programs for insert with check (auth.uid() = user_id);
create policy "workout_programs_update_own" on public.workout_programs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_programs_delete_own" on public.workout_programs for delete using (auth.uid() = user_id);

create policy "workout_weeks_select_own" on public.workout_weeks for select using (auth.uid() = user_id);
create policy "workout_weeks_insert_own" on public.workout_weeks for insert with check (auth.uid() = user_id);
create policy "workout_weeks_update_own" on public.workout_weeks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_weeks_delete_own" on public.workout_weeks for delete using (auth.uid() = user_id);

create policy "workout_days_select_own" on public.workout_days for select using (auth.uid() = user_id);
create policy "workout_days_insert_own" on public.workout_days for insert with check (auth.uid() = user_id);
create policy "workout_days_update_own" on public.workout_days for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_days_delete_own" on public.workout_days for delete using (auth.uid() = user_id);

create policy "exercises_select_own" on public.exercises for select using (auth.uid() = user_id);
create policy "exercises_insert_own" on public.exercises for insert with check (auth.uid() = user_id);
create policy "exercises_update_own" on public.exercises for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercises_delete_own" on public.exercises for delete using (auth.uid() = user_id);

create policy "workout_sessions_select_own" on public.workout_sessions for select using (auth.uid() = user_id);
create policy "workout_sessions_insert_own" on public.workout_sessions for insert with check (auth.uid() = user_id);
create policy "workout_sessions_update_own" on public.workout_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_sessions_delete_own" on public.workout_sessions for delete using (auth.uid() = user_id);

create policy "exercise_logs_select_own" on public.exercise_logs for select using (auth.uid() = user_id);
create policy "exercise_logs_insert_own" on public.exercise_logs for insert with check (auth.uid() = user_id);
create policy "exercise_logs_update_own" on public.exercise_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercise_logs_delete_own" on public.exercise_logs for delete using (auth.uid() = user_id);
