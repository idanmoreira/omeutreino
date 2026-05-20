import { Card } from '@/shared/components/Card';
import { Screen } from '@/shared/components/Screen';
import { Body, Caption, Subtitle, Title } from '@/shared/components/Typography';
import { colors } from '@/shared/constants/theme';
import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function HistoryScreen() {
  const { sessions } = useWorkoutStore();

  return (
    <Screen>
      <Title>Histórico</Title>
      <Body style={{ color: colors.textSecondary }}>Treinos concluídos, data, semana relacionada e resumo da execução.</Body>

      {sessions.length === 0 ? (
        <Card>
          <Subtitle>Nenhum treino concluído ainda</Subtitle>
          <Caption>Finalize um treino para criar o primeiro registro no histórico simples do MVP.</Caption>
        </Card>
      ) : null}

      {sessions.map((session) => (
        <Card key={session.id}>
          <Caption>{dateFormatter.format(new Date(session.finishedAt))}</Caption>
          <Subtitle>{session.workoutDayTitle}</Subtitle>
          <Body>{session.weekTitle}</Body>
          <Caption>
            {session.completedExercises}/{session.totalExercises} exercícios • feedback {session.feedback}
          </Caption>
        </Card>
      ))}
    </Screen>
  );
}
