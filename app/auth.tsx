import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';
import { WorkoutGoal } from '@/features/workouts/types';
import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Screen } from '@/shared/components/Screen';
import { Body, Caption, Subtitle, Title } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';

const goalOptions: Array<{ label: string; value: WorkoutGoal }> = [
  { label: 'Hipertrofia', value: 'hipertrofia' },
  { label: 'Emagrecimento', value: 'emagrecimento' },
  { label: 'Força', value: 'forca' },
  { label: 'Condicionamento', value: 'condicionamento' },
  { label: 'Saúde geral', value: 'saude_geral' },
];

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp } = useWorkoutStore();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState<WorkoutGoal>('hipertrofia');

  const isSignup = mode === 'signup';

  function submit() {
    if (isSignup) {
      signUp({ name, email, goal });
    } else {
      signIn({ email, name });
    }

    setPassword('');
    router.replace('/home');
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Caption>O Meu Treino</Caption>
        <Title>{isSignup ? 'Crie sua conta e comece pela Semana 1.' : 'Entre para continuar seu treino.'}</Title>
        <Body style={styles.muted}>Autenticação local para validar o MVP. Depois, esta tela conecta no Supabase Auth.</Body>
      </View>

      <Card>
        <View style={styles.modeRow}>
          <Pressable style={[styles.modeButton, isSignup && styles.modeButtonActive]} onPress={() => setMode('signup')}>
            <Caption style={isSignup && styles.modeButtonTextActive}>Criar conta</Caption>
          </Pressable>
          <Pressable style={[styles.modeButton, !isSignup && styles.modeButtonActive]} onPress={() => setMode('login')}>
            <Caption style={!isSignup && styles.modeButtonTextActive}>Entrar</Caption>
          </Pressable>
        </View>

        {isSignup ? (
          <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor={colors.textSecondary} style={styles.input} />
        ) : null}
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="E-mail"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Senha"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />

        {isSignup ? (
          <View style={styles.goalGroup}>
            <Subtitle>Objetivo principal</Subtitle>
            <View style={styles.goalGrid}>
              {goalOptions.map((option) => {
                const selected = goal === option.value;

                return (
                  <Pressable key={option.value} style={[styles.goalChip, selected && styles.goalChipActive]} onPress={() => setGoal(option.value)}>
                    <Caption style={selected && styles.goalChipTextActive}>{option.label}</Caption>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <PrimaryButton label={isSignup ? 'Criar conta' : 'Entrar'} onPress={submit} />
        <Caption>Recuperação de senha entra quando a autenticação real estiver conectada.</Caption>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.xl,
  },
  muted: {
    color: colors.textSecondary,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
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
  goalGroup: {
    gap: spacing.sm,
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
});
