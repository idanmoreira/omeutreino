import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { WorkoutDayCard } from '@/features/workouts/components';
import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';
import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Screen } from '@/shared/components/Screen';
import { Body, Caption, Subtitle, Title } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';

export default function WeekScreen() {
  const { weekId } = useLocalSearchParams<{ weekId: string }>();
  const { activeProgram, addDay } = useWorkoutStore();
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const week = activeProgram.weeks.find((item) => item.id === weekId);

  if (!week) {
    return (
      <Screen>
        <Title>Semana não encontrada</Title>
        <Body>Volte para a Home e selecione uma semana cadastrada.</Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Caption>Semana {week.weekNumber}</Caption>
        <Title>{week.title}</Title>
        {week.notes ? <Body style={styles.muted}>{week.notes}</Body> : null}
      </View>

      <Card>
        <Subtitle>Novo dia de treino</Subtitle>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: Quinta — Upper"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={dayOfWeek}
          onChangeText={setDayOfWeek}
          placeholder="Dia da semana ou nome personalizado"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <PrimaryButton
          label="Adicionar dia"
          onPress={() => {
            addDay({ weekId: week.id, title, dayOfWeek });
            setTitle('');
            setDayOfWeek('');
          }}
        />
      </Card>

      <Subtitle>Dias da semana</Subtitle>
      {week.days.length === 0 ? <Caption>Nenhum dia criado ainda.</Caption> : null}
      {week.days.map((day) => (
        <Link key={day.id} href={`/day/${day.id}`} asChild>
          <Pressable>
            <WorkoutDayCard day={day} />
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  muted: {
    color: colors.textSecondary,
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
});
