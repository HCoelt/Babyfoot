import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import { Player } from '@/src/types/player';
import React from 'react';
import { Text } from 'react-native-paper';
import { PlayerDropdown } from './PlayerDropdown';

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
  const teamColor = teamNumber === 1 ? colors.red.primary : colors.blue.primary;

  // Exclude all selected players except the current ones for this team
  const getExcludedIds = (currentPlayerId: number | null) => {
    return allSelectedIds.filter((id) => id !== currentPlayerId);
  };

  return (
    <GlassCard
      style={{ marginVertical: 8 }}
      variant={teamNumber === 1 ? 'red' : 'blue'}
    >
      <Text variant="titleMedium" className="mb-4 font-bold" style={{ color: teamColor }}>
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
    </GlassCard>
  );
}

