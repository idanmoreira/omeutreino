import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useWorkoutStore } from '@/features/workouts/useWorkoutStore';
import { Body, Caption, Title } from '@/shared/components/Typography';
import { colors, radius, spacing } from '@/shared/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { currentUser, loading } = useWorkoutStore();

  useEffect(() => {
    if (loading) {
      return;
    }

    const timeoutId = setTimeout(() => {
      router.replace(currentUser ? '/home' : '/auth');
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [currentUser, loading, router]);

  return (
    <View style={styles.screen}>
      <View style={styles.brandBlock}>
        <View style={styles.logo}>
          <View style={styles.logoBar} />
          <View style={[styles.logoBar, styles.logoBarAccent]} />
          <View style={styles.logoPlate}>
            <Title>OMT</Title>
          </View>
        </View>
        <View style={styles.copy}>
          <Caption>O Meu Treino</Caption>
          <Title>Treino organizado desde o primeiro dia.</Title>
          <Body style={styles.muted}>Semanas, dias e execução em um fluxo simples.</Body>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
        <Caption>{loading ? 'Carregando dados locais' : 'Preparando seu treino'}</Caption>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 96,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  brandBlock: {
    gap: spacing.xl,
  },
  logo: {
    width: 118,
    height: 118,
    justifyContent: 'center',
  },
  logoBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    transform: [{ rotate: '-10deg' }],
  },
  logoBarAccent: {
    top: 38,
    backgroundColor: colors.accent,
    transform: [{ rotate: '10deg' }],
  },
  logoPlate: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  copy: {
    gap: spacing.sm,
    maxWidth: 420,
  },
  muted: {
    color: colors.textSecondary,
  },
  footer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
