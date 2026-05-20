import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { createId } from '@/shared/utils/id';
import { initialProgram } from './seed';
import { Exercise, User, WorkoutDay, WorkoutGoal, WorkoutProgram, WorkoutSession, WorkoutWeek } from './types';

type WorkoutState = {
  currentUser: User | null;
  programs: WorkoutProgram[];
  activeProgramId: string;
  sessions: WorkoutSession[];
};

type AuthInput = {
  name?: string;
  email: string;
  goal?: WorkoutGoal;
};

type CreateProgramInput = {
  title: string;
  description?: string;
  goal: WorkoutGoal;
};

type CreateWeekInput = {
  title: string;
  notes?: string;
};

type CreateDayInput = {
  weekId: string;
  title: string;
  dayOfWeek?: string;
};

type CreateExerciseInput = {
  dayId: string;
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  load: string;
  restSeconds: number;
  notes?: string;
};

type WorkoutStore = WorkoutState & {
  loading: boolean;
  activeProgram: WorkoutProgram;
  signIn: (input: AuthInput) => void;
  signUp: (input: AuthInput) => void;
  signOut: () => void;
  addProgram: (input: CreateProgramInput) => void;
  setActiveProgram: (programId: string) => void;
  addWeek: (input: CreateWeekInput) => void;
  addDay: (input: CreateDayInput) => void;
  addExercise: (input: CreateExerciseInput) => void;
  toggleExercise: (dayId: string, exerciseId: string) => void;
  startWorkout: (dayId: string) => void;
  finishWorkout: (dayId: string) => void;
};

const STORAGE_KEY = '@omeutreino/workout-state';
const WorkoutContext = createContext<WorkoutStore | null>(null);

const demoUser: User = {
  id: 'user_demo',
  name: 'Danilo',
  email: 'danilo@example.com',
  goal: 'hipertrofia',
  createdAt: new Date().toISOString(),
};

const initialState: WorkoutState = {
  currentUser: null,
  programs: [initialProgram],
  activeProgramId: initialProgram.id,
  sessions: [],
};

function normalizeState(storedState: Partial<WorkoutState> | null): WorkoutState {
  const programs = (storedState?.programs?.length ? storedState.programs : [initialProgram]).map((program) => ({
    ...program,
    userId: program.userId ?? storedState?.currentUser?.id ?? demoUser.id,
  }));

  return {
    currentUser: storedState?.currentUser ?? null,
    programs,
    activeProgramId: storedState?.activeProgramId ?? programs[0]?.id ?? initialProgram.id,
    sessions: storedState?.sessions ?? [],
  };
}

function updateDay(programs: WorkoutProgram[], dayId: string, updater: (day: WorkoutDay) => WorkoutDay) {
  return programs.map((program) => ({
    ...program,
    updatedAt: new Date().toISOString(),
    weeks: program.weeks.map((week) => ({
      ...week,
      days: week.days.map((day) => (day.id === dayId ? updater(day) : day)),
    })),
  }));
}

function updateWeek(programs: WorkoutProgram[], weekId: string, updater: (week: WorkoutWeek) => WorkoutWeek) {
  return programs.map((program) => ({
    ...program,
    updatedAt: new Date().toISOString(),
    weeks: program.weeks.map((week) => (week.id === weekId ? updater(week) : week)),
  }));
}

export function WorkoutProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<WorkoutState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedState) => {
        if (storedState) {
          setState(normalizeState(JSON.parse(storedState) as Partial<WorkoutState>));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [loading, state]);

  const store = useMemo<WorkoutStore>(() => {
    const activeProgram = state.programs.find((program) => program.id === state.activeProgramId) ?? state.programs[0] ?? initialProgram;

    return {
      ...state,
      loading,
      activeProgram,
      signIn: ({ email, name, goal }) => {
        const user: User = {
          id: state.currentUser?.id ?? createId('user'),
          name: name?.trim() || email.split('@')[0] || 'Aluno',
          email: email.trim().toLowerCase(),
          goal,
          createdAt: state.currentUser?.createdAt ?? new Date().toISOString(),
        };

        setState((current) => ({
          ...current,
          currentUser: user,
          programs: current.programs.map((program) => ({ ...program, userId: program.userId ?? user.id })),
        }));
      },
      signUp: ({ email, name, goal }) => {
        const user: User = {
          id: createId('user'),
          name: name?.trim() || 'Aluno',
          email: email.trim().toLowerCase(),
          goal,
          createdAt: new Date().toISOString(),
        };

        setState((current) => ({
          ...current,
          currentUser: user,
          programs: current.programs.map((program) => ({ ...program, userId: user.id, goal: goal ?? program.goal })),
        }));
      },
      signOut: () => {
        setState((current) => ({ ...current, currentUser: null }));
      },
      addProgram: ({ title, description, goal }) => {
        setState((current) => {
          const userId = current.currentUser?.id ?? demoUser.id;
          const program: WorkoutProgram = {
            id: createId('program'),
            userId,
            title: title.trim() || 'Novo programa',
            description: description?.trim() || 'Programa criado para organizar suas semanas de treino.',
            goal,
            weeks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...current,
            programs: [program, ...current.programs],
            activeProgramId: program.id,
          };
        });
      },
      setActiveProgram: (programId) => {
        setState((current) => ({ ...current, activeProgramId: programId }));
      },
      addWeek: ({ title, notes }) => {
        setState((current) => {
          const program = current.programs.find((item) => item.id === current.activeProgramId) ?? current.programs[0] ?? initialProgram;
          const nextWeekNumber = program.weeks.length + 1;
          const newWeek: WorkoutWeek = {
            id: createId('week'),
            title: title.trim() || `Semana ${nextWeekNumber}`,
            weekNumber: nextWeekNumber,
            notes,
            days: [],
          };

          return {
            ...current,
            programs: current.programs.map((item, index) =>
              item.id === program.id || (index === 0 && !current.activeProgramId)
                ? { ...item, updatedAt: new Date().toISOString(), weeks: [...item.weeks, newWeek] }
                : item,
            ),
          };
        });
      },
      addDay: ({ weekId, title, dayOfWeek }) => {
        setState((current) => ({
          ...current,
          programs: updateWeek(current.programs, weekId, (week) => ({
            ...week,
            days: [
              ...week.days,
              {
                id: createId('day'),
                title: title.trim() || 'Novo dia de treino',
                dayOfWeek,
                order: week.days.length + 1,
                status: 'not_started',
                exercises: [],
              },
            ],
          })),
        }));
      },
      addExercise: ({ dayId, name, muscleGroup, sets, reps, load, restSeconds, notes }) => {
        setState((current) => ({
          ...current,
          programs: updateDay(current.programs, dayId, (day) => {
            const exercise: Exercise = {
              id: createId('exercise'),
              name: name.trim() || 'Novo exercício',
              muscleGroup: muscleGroup.trim() || 'Geral',
              sets: sets.trim() || '3',
              reps: reps.trim() || '10',
              load: load.trim() || 'Livre',
              restSeconds,
              notes,
              order: day.exercises.length + 1,
              completed: false,
            };

            return { ...day, exercises: [...day.exercises, exercise] };
          }),
        }));
      },
      toggleExercise: (dayId, exerciseId) => {
        setState((current) => ({
          ...current,
          programs: updateDay(current.programs, dayId, (day) => {
            const exercises = day.exercises.map((exercise) =>
              exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise,
            );
            const completedCount = exercises.filter((exercise) => exercise.completed).length;
            const status = completedCount === 0 ? 'in_progress' : completedCount === exercises.length ? 'completed' : 'in_progress';

            return { ...day, exercises, status };
          }),
        }));
      },
      startWorkout: (dayId) => {
        setState((current) => ({
          ...current,
          programs: updateDay(current.programs, dayId, (day) => ({ ...day, status: 'in_progress' })),
        }));
      },
      finishWorkout: (dayId) => {
        setState((current) => {
          let targetDay: WorkoutDay | undefined;
          let targetWeek: WorkoutWeek | undefined;

          current.programs.forEach((program) => {
            program.weeks.forEach((week) => {
              const day = week.days.find((item) => item.id === dayId);
              if (day) {
                targetDay = day;
                targetWeek = week;
              }
            });
          });

          if (!targetDay || !targetWeek) {
            return current;
          }

          const completedExercises = targetDay.exercises.filter((exercise) => exercise.completed).length;
          const finishedAt = new Date().toISOString();
          const session: WorkoutSession = {
            id: createId('session'),
            workoutDayId: targetDay.id,
            workoutDayTitle: targetDay.title,
            weekTitle: targetWeek.title,
            startedAt: finishedAt,
            finishedAt,
            status: 'completed',
            completedExercises,
            totalExercises: targetDay.exercises.length,
            feedback: completedExercises === targetDay.exercises.length ? 'moderado' : 'dificil',
          };

          return {
            ...current,
            programs: updateDay(current.programs, dayId, (day) => ({
              ...day,
              status: 'completed',
              exercises: day.exercises.map((exercise) => ({ ...exercise, completed: true })),
            })),
            sessions: [session, ...current.sessions],
          };
        });
      },
    };
  }, [loading, state]);

  return <WorkoutContext.Provider value={store}>{children}</WorkoutContext.Provider>;
}

export function useWorkoutStore() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutStore must be used inside WorkoutProvider');
  }

  return context;
}
