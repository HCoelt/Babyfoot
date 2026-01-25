import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import React from 'react';
import { Text } from 'react-native-paper';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const valueColor = color || colors.red.primary;

  return (
    <GlassCard style={{ flex: 1, margin: 4, minWidth: 100, alignItems: 'center', paddingVertical: 16 }}>
      <Text variant="labelMedium" className="mb-1 text-[11px] tracking-[0.5px] text-text-secondary uppercase">
        {title}
      </Text>
      <Text variant="headlineMedium" className="font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
      {subtitle && (
        <Text variant="bodySmall" className="mt-[2px] text-text-secondary">
          {subtitle}
        </Text>
      )}
    </GlassCard>
  );
}

