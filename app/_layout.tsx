import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/shared/constants/theme';
import { WorkoutProvider } from '@/features/workouts/useWorkoutStore';

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="week/[weekId]" options={{ title: 'Semana de treino' }} />
        <Stack.Screen name="day/[dayId]" options={{ title: 'Dia de treino' }} />
        <Stack.Screen name="history" options={{ title: 'Histórico' }} />
      </Stack>
    </WorkoutProvider>
  );
}
