import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

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
  const theme = useTheme();

  const handleScoreChange = (value: string, onChange: (s: string) => void) => {
    // Only allow positive integers
    const numericValue = value.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Final Score
      </Text>
      <View style={styles.scoreRow}>
        <View style={styles.scoreInput}>
          <TextInput
            label="Team 1"
            value={team1Score}
            onChangeText={(v) => handleScoreChange(v, onTeam1ScoreChange)}
            keyboardType="number-pad"
            mode="outlined"
            disabled={disabled}
            style={[styles.input, { borderColor: theme.colors.primary }]}
            contentStyle={styles.inputContent}
          />
        </View>
        <Text variant="headlineSmall" style={styles.vs}>
          -
        </Text>
        <View style={styles.scoreInput}>
          <TextInput
            label="Team 2"
            value={team2Score}
            onChangeText={(v) => handleScoreChange(v, onTeam2ScoreChange)}
            keyboardType="number-pad"
            mode="outlined"
            disabled={disabled}
            style={[styles.input, { borderColor: theme.colors.secondary }]}
            contentStyle={styles.inputContent}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInput: {
    width: 100,
  },
  input: {
    textAlign: 'center',
  },
  inputContent: {
    textAlign: 'center',
  },
  vs: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
});
