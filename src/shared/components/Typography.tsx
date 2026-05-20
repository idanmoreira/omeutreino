import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors } from '@/shared/constants/theme';

type TypographyProps = PropsWithChildren<TextProps>;

export function Title({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function Subtitle({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.subtitle, style]} {...props}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.caption, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
