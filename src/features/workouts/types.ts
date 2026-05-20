export type WorkoutStatus = 'not_started' | 'in_progress' | 'completed';

export type WorkoutGoal = 'hipertrofia' | 'emagrecimento' | 'forca' | 'condicionamento' | 'saude_geral';

export type User = {
  id: string;
  name: string;
  email: string;
  goal?: WorkoutGoal;
  createdAt: string;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  load: string;
  restSeconds: number;
  notes?: string;
  order: number;
  completed: boolean;
};

export type WorkoutDay = {
  id: string;
  title: string;
  dayOfWeek?: string;
  order: number;
  status: WorkoutStatus;
  exercises: Exercise[];
};

export type WorkoutWeek = {
  id: string;
  title: string;
  weekNumber: number;
  notes?: string;
  days: WorkoutDay[];
};

export type WorkoutProgram = {
  id: string;
  userId: string;
  title: string;
  description: string;
  goal: WorkoutGoal;
  weeks: WorkoutWeek[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSession = {
  id: string;
  workoutDayId: string;
  workoutDayTitle: string;
  weekTitle: string;
  startedAt: string;
  finishedAt: string;
  status: 'completed';
  completedExercises: number;
  totalExercises: number;
  feedback: 'facil' | 'moderado' | 'dificil';
};
