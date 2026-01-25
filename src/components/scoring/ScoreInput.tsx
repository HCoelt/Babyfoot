import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface ScoreInputProps {
  team1Score: string;
  team2Score: string;
  onTeam1ScoreChange: (score: string) => void;
  onTeam2ScoreChange: (score: string) => void;
  disabled?: boolean;
}

export function ScoreInput({
  team1Score,
  team2Score,
  onTeam1ScoreChange,
  onTeam2ScoreChange,
  disabled = false,
}: ScoreInputProps) {
  const handleScoreChange = (value: string, onChange: (s: string) => void) => {
    // Only allow positive integers
    const numericValue = value.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  return (
    <GlassCard style={{ marginVertical: 8 }}>
      <Text variant="titleMedium" className="text-center mb-4 font-semibold text-text">
        Final Score
      </Text>
      <View className="flex-row items-center justify-center">
        <View className="w-[110px]">
          <TextInput
            label="Team 1"
            value={team1Score}
            onChangeText={(v) => handleScoreChange(v, onTeam1ScoreChange)}
            keyboardType="number-pad"
            mode="outlined"
            disabled={disabled}
            className="text-center bg-transparent"
            contentStyle={{ textAlign: 'center' }}
            outlineColor={colors.red.transparent}
            activeOutlineColor={colors.red.primary}
            textColor={colors.text}
            theme={{
              colors: {
                onSurfaceVariant: colors.textSecondary,
              },
            }}
          />
        </View>
        <Text variant="headlineMedium" className="mx-4 font-light text-text-secondary">
          -
        </Text>
        <View className="w-[110px]">
          <TextInput
            label="Team 2"
            value={team2Score}
            onChangeText={(v) => handleScoreChange(v, onTeam2ScoreChange)}
            keyboardType="number-pad"
            mode="outlined"
            disabled={disabled}
            className="text-center bg-transparent"
            contentStyle={{ textAlign: 'center' }}
            outlineColor={colors.blue.transparent}
            activeOutlineColor={colors.blue.primary}
            textColor={colors.text}
            theme={{
              colors: {
                onSurfaceVariant: colors.textSecondary,
              },
            }}
          />
        </View>
      </View>
    </GlassCard>
  );
}

