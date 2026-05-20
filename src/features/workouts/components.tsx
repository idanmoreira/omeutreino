import { StyleSheet, View } from 'react-native';

import { Card } from '@/shared/components/Card';
import { Body, Caption, Subtitle } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';
import { WorkoutDay, WorkoutStatus } from './types';

const statusLabel: Record<WorkoutStatus, string> = {
  not_started: 'não iniciado',
  in_progress: 'em andamento',
  completed: 'concluído',
};

const statusColor: Record<WorkoutStatus, string> = {
  not_started: colors.textSecondary,
  in_progress: colors.warning,
  completed: colors.success,
};

export function StatusPill({ status }: { status: WorkoutStatus }) {
  return (
    <View style={[styles.pill, { borderColor: statusColor[status] }]}>
      <Caption style={{ color: statusColor[status] }}>{statusLabel[status]}</Caption>
    </View>
  );
}

export function WorkoutDayCard({ day }: { day: WorkoutDay }) {
  const completed = day.exercises.filter((exercise) => exercise.completed).length;

  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Subtitle>{day.title}</Subtitle>
          <Caption>{day.dayOfWeek ?? 'Dia personalizado'}</Caption>
        </View>
        <StatusPill status={day.status} />
      </View>
      <Body>
        {completed}/{day.exercises.length} exercícios concluídos
      </Body>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.sm,
  },
});
