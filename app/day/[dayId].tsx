import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { StatusPill } from '@/features/workouts/components';
import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';
import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Screen } from '@/shared/components/Screen';
import { Body, Caption, Subtitle, Title } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';

export default function DayScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const { activeProgram, addExercise, finishWorkout, startWorkout, toggleExercise } = useWorkoutStore();
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [load, setLoad] = useState('');

  const week = activeProgram.weeks.find((item) => item.days.some((day) => day.id === dayId));
  const day = week?.days.find((item) => item.id === dayId);

  if (!day || !week) {
    return (
      <Screen>
        <Title>Treino não encontrado</Title>
        <Body>Volte para a semana e selecione um dia cadastrado.</Body>
      </Screen>
    );
  }

  const completed = day.exercises.filter((exercise) => exercise.completed).length;

  return (
    <Screen>
      <View style={styles.header}>
        <Caption>{week.title}</Caption>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Title>{day.title}</Title>
            <Caption>{completed}/{day.exercises.length} exercícios concluídos</Caption>
          </View>
          <StatusPill status={day.status} />
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Iniciar treino" variant="ghost" onPress={() => startWorkout(day.id)} />
        <PrimaryButton label="Finalizar treino" onPress={() => finishWorkout(day.id)} />
      </View>

      <Card>
        <Subtitle>Adicionar exercício</Subtitle>
        <TextInput value={name} onChangeText={setName} placeholder="Nome do exercício" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <TextInput value={muscleGroup} onChangeText={setMuscleGroup} placeholder="Grupo muscular" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <View style={styles.formRow}>
          <TextInput value={sets} onChangeText={setSets} placeholder="Séries" placeholderTextColor={colors.textSecondary} style={[styles.input, styles.shortInput]} />
          <TextInput value={reps} onChangeText={setReps} placeholder="Reps" placeholderTextColor={colors.textSecondary} style={[styles.input, styles.shortInput]} />
          <TextInput value={load} onChangeText={setLoad} placeholder="Carga" placeholderTextColor={colors.textSecondary} style={[styles.input, styles.shortInput]} />
        </View>
        <PrimaryButton
          label="Adicionar exercício"
          variant="accent"
          onPress={() => {
            addExercise({ dayId: day.id, name, muscleGroup, sets, reps, load, restSeconds: 90 });
            setName('');
            setMuscleGroup('');
            setSets('3');
            setReps('10');
            setLoad('');
          }}
        />
      </Card>

      <Subtitle>Execução</Subtitle>
      {day.exercises.map((exercise) => (
        <Pressable key={exercise.id} onPress={() => toggleExercise(day.id, exercise.id)}>
          <Card>
            <View style={styles.exerciseRow}>
              <View style={[styles.checkbox, exercise.completed && styles.checkboxChecked]}>
                <Body>{exercise.completed ? '✓' : ''}</Body>
              </View>
              <View style={styles.flex}>
                <Subtitle>{exercise.name}</Subtitle>
                <Caption>{exercise.muscleGroup} • {exercise.sets}x{exercise.reps} • {exercise.load} • descanso {exercise.restSeconds}s</Caption>
                {exercise.notes ? <Caption>{exercise.notes}</Caption> : null}
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  actions: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  shortInput: {
    flex: 1,
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  checkbox: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
  },
  checkboxChecked: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
});
