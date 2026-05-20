import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Screen } from '@/shared/components/Screen';
import { Body, Caption, Subtitle, Title } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';
import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';
import { WorkoutDayCard } from '@/features/workouts/components';
import { WorkoutGoal } from '@/features/workouts/types';

const goalLabels: Record<WorkoutGoal, string> = {
  hipertrofia: 'Hipertrofia',
  emagrecimento: 'Emagrecimento',
  forca: 'Força',
  condicionamento: 'Condicionamento',
  saude_geral: 'Saúde geral',
};

export default function HomeScreen() {
  const router = useRouter();
  const { activeProgram, addProgram, addWeek, currentUser, loading, programs, sessions, setActiveProgram, signOut } = useWorkoutStore();
  const [programTitle, setProgramTitle] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programGoal, setProgramGoal] = useState<WorkoutGoal>('hipertrofia');
  const [weekTitle, setWeekTitle] = useState('');
  const currentWeek = activeProgram.weeks[0];
  const nextWorkout = currentWeek?.days.find((day) => day.status !== 'completed') ?? currentWeek?.days[0];

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/auth');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <Screen>
        <Title>Carregando seu treino...</Title>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Caption>O Meu Treino</Caption>
        <Title>Olá, {currentUser.name}. Seu treino semanal está aqui.</Title>
        <Body style={styles.heroBody}>Organize programas, semanas, dias e execução sem perder o foco do treino de hoje.</Body>
        <Pressable onPress={signOut}>
          <Caption style={styles.link}>Sair da conta</Caption>
        </Pressable>
      </View>

      <Card>
        <Caption>Programa ativo</Caption>
        <Subtitle>{activeProgram.title}</Subtitle>
        <Body>{activeProgram.description}</Body>
        <Caption>Objetivo: {goalLabels[activeProgram.goal]}</Caption>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Subtitle>{activeProgram.weeks.length}</Subtitle>
            <Caption>semanas</Caption>
          </View>
          <View style={styles.metric}>
            <Subtitle>{activeProgram.weeks.reduce((total, week) => total + week.days.length, 0)}</Subtitle>
            <Caption>dias</Caption>
          </View>
          <View style={styles.metric}>
            <Subtitle>{sessions.length}</Subtitle>
            <Caption>concluídos</Caption>
          </View>
        </View>
      </Card>

      <Card>
        <Subtitle>Programas</Subtitle>
        <Caption>Crie divisões como Hipertrofia, Força Base ou Treino em Casa.</Caption>
        {programs.map((program) => {
          const selected = program.id === activeProgram.id;

          return (
            <Pressable key={program.id} style={[styles.programOption, selected && styles.programOptionActive]} onPress={() => setActiveProgram(program.id)}>
              <View style={styles.flex}>
                <Body>{program.title}</Body>
                <Caption>{goalLabels[program.goal]} • {program.weeks.length} semanas</Caption>
              </View>
              <Caption style={selected ? styles.activeLabel : styles.link}>{selected ? 'ativo' : 'usar'}</Caption>
            </Pressable>
          );
        })}
      </Card>

      <Card>
        <Subtitle>Criar programa</Subtitle>
        <TextInput
          value={programTitle}
          onChangeText={setProgramTitle}
          placeholder="Nome do programa"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={programDescription}
          onChangeText={setProgramDescription}
          placeholder="Descrição curta"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <View style={styles.goalGrid}>
          {(Object.keys(goalLabels) as WorkoutGoal[]).map((goal) => {
            const selected = programGoal === goal;

            return (
              <Pressable key={goal} style={[styles.goalChip, selected && styles.goalChipActive]} onPress={() => setProgramGoal(goal)}>
                <Caption style={selected && styles.goalChipTextActive}>{goalLabels[goal]}</Caption>
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton
          label="Criar programa"
          variant="accent"
          onPress={() => {
            addProgram({ title: programTitle, description: programDescription, goal: programGoal });
            setProgramTitle('');
            setProgramDescription('');
            setProgramGoal('hipertrofia');
          }}
        />
      </Card>

      {nextWorkout ? (
        <Link href={`/day/${nextWorkout.id}`} asChild>
          <Pressable>
            <WorkoutDayCard day={nextWorkout} />
          </Pressable>
        </Link>
      ) : null}

      <Card>
        <Subtitle>Criar semana</Subtitle>
        <Caption>Use nomes como “Semana 2 — Progressão de carga” ou “Semana 4 — Deload”.</Caption>
        <TextInput
          value={weekTitle}
          onChangeText={setWeekTitle}
          placeholder="Título da semana"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <PrimaryButton
          label="Criar semana"
          onPress={() => {
            addWeek({ title: weekTitle });
            setWeekTitle('');
          }}
        />
      </Card>

      <View style={styles.sectionHeader}>
        <Subtitle>Semanas de treino</Subtitle>
        <Link href="/history" asChild>
          <Pressable>
            <Caption style={styles.link}>Ver histórico</Caption>
          </Pressable>
        </Link>
      </View>

      {activeProgram.weeks.map((week) => (
        <Link key={week.id} href={`/week/${week.id}`} asChild>
          <Pressable>
            <Card>
              <View style={styles.weekRow}>
                <View style={styles.flex}>
                  <Subtitle>{week.title}</Subtitle>
                  <Caption>{week.notes ?? `${week.days.length} dias cadastrados`}</Caption>
                </View>
                <Body>→</Body>
              </View>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  heroBody: {
    color: colors.textSecondary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.success,
    fontWeight: '700',
  },
  programOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  programOptionActive: {
    borderColor: colors.primary,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  goalChip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  goalChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  goalChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
