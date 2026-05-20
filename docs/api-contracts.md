# API Contracts

This document defines the service layer that screens should call. The first implementation can use AsyncStorage. The later implementation can use Supabase without changing screen code.

## Auth Service

```ts
type SignUpInput = {
  name: string;
  email: string;
  password: string;
  goal?: WorkoutGoal;
};

type SignInInput = {
  email: string;
  password: string;
};

signUp(input: SignUpInput): Promise<UserProfile>;
signIn(input: SignInInput): Promise<UserProfile>;
signOut(): Promise<void>;
getCurrentUser(): Promise<UserProfile | null>;
requestPasswordReset(email: string): Promise<void>;
```

## Profile Service

```ts
getProfile(): Promise<UserProfile>;
updateProfile(input: UpdateProfileInput): Promise<UserProfile>;
```

## Workout Program Service

```ts
listWorkoutPrograms(): Promise<WorkoutProgram[]>;
getWorkoutProgram(programId: string): Promise<WorkoutProgram>;
createWorkoutProgram(input: CreateWorkoutProgramInput): Promise<WorkoutProgram>;
updateWorkoutProgram(programId: string, input: UpdateWorkoutProgramInput): Promise<WorkoutProgram>;
deleteWorkoutProgram(programId: string): Promise<void>;
```

## Workout Week Service

```ts
listWorkoutWeeks(programId: string): Promise<WorkoutWeek[]>;
createWorkoutWeek(input: CreateWorkoutWeekInput): Promise<WorkoutWeek>;
updateWorkoutWeek(weekId: string, input: UpdateWorkoutWeekInput): Promise<WorkoutWeek>;
deleteWorkoutWeek(weekId: string): Promise<void>;
```

## Workout Day Service

```ts
listWorkoutDays(weekId: string): Promise<WorkoutDay[]>;
createWorkoutDay(input: CreateWorkoutDayInput): Promise<WorkoutDay>;
updateWorkoutDay(dayId: string, input: UpdateWorkoutDayInput): Promise<WorkoutDay>;
deleteWorkoutDay(dayId: string): Promise<void>;
```

## Exercise Service

```ts
listExercises(dayId: string): Promise<Exercise[]>;
createExercise(input: CreateExerciseInput): Promise<Exercise>;
updateExercise(exerciseId: string, input: UpdateExerciseInput): Promise<Exercise>;
deleteExercise(exerciseId: string): Promise<void>;
reorderExercises(dayId: string, exerciseIds: string[]): Promise<Exercise[]>;
```

## Workout Session Service

```ts
startWorkoutSession(workoutDayId: string): Promise<WorkoutSession>;
updateExerciseLog(input: UpdateExerciseLogInput): Promise<ExerciseLog>;
finishWorkoutSession(sessionId: string, input: FinishWorkoutSessionInput): Promise<WorkoutSession>;
listWorkoutHistory(): Promise<WorkoutSession[]>;
```

## Error Shape

Services should return typed data or throw a normalized app error:

```ts
type AppErrorCode =
  | 'auth_required'
  | 'validation_error'
  | 'not_found'
  | 'permission_denied'
  | 'network_error'
  | 'unknown_error';

type AppError = {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
};
```

Screens should show user-friendly messages and avoid parsing database errors directly.
