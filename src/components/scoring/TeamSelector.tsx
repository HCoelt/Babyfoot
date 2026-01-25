import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { PlayerDropdown } from './PlayerDropdown';
import { Player } from '@/src/types/player';

interface TeamSelectorProps {
  teamNumber: 1 | 2;
  player1Id: number | null;
  player2Id: number | null;
  players: Player[];
  allSelectedIds: number[];
  onPlayer1Change: (id: number | null) => void;
  onPlayer2Change: (id: number | null) => void;
  disabled?: boolean;
}

export function TeamSelector({
  teamNumber,
  player1Id,
  player2Id,
  players,
  allSelectedIds,
  onPlayer1Change,
  onPlayer2Change,
  disabled = false,
}: TeamSelectorProps) {
  const theme = useTheme();
  const teamColor = teamNumber === 1 ? theme.colors.primary : theme.colors.secondary;

  // Exclude all selected players except the current ones for this team
  const getExcludedIds = (currentPlayerId: number | null) => {
    return allSelectedIds.filter((id) => id !== currentPlayerId);
  };

  return (
    <Card style={[styles.container, { borderLeftColor: teamColor, borderLeftWidth: 4 }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.title, { color: teamColor }]}>
          Team {teamNumber}
        </Text>
        <PlayerDropdown
          label="Player 1"
          selectedPlayerId={player1Id}
          players={players}
          excludedPlayerIds={getExcludedIds(player1Id)}
          onSelect={onPlayer1Change}
          disabled={disabled}
        />
        <PlayerDropdown
          label="Player 2"
          selectedPlayerId={player2Id}
          players={players}
          excludedPlayerIds={getExcludedIds(player2Id)}
          onSelect={onPlayer2Change}
          disabled={disabled}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
});
