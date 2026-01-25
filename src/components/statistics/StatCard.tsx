import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const theme = useTheme();
  const textColor = color || theme.colors.primary;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="labelMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="headlineMedium" style={[styles.value, { color: textColor }]}>
          {value}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    minWidth: 100,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 2,
  },
});
