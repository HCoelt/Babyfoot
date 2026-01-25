import { Player } from '@/src/types/player';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Menu, Text, useTheme } from 'react-native-paper';

interface PlayerDropdownProps {
  label: string;
  selectedPlayerId: number | null;
  players: Player[];
  excludedPlayerIds: number[];
  onSelect: (playerId: number | null) => void;
  disabled?: boolean;
}

export function PlayerDropdown({
  label,
  selectedPlayerId,
  players,
  excludedPlayerIds,
  onSelect,
  disabled = false,
}: PlayerDropdownProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
  const availablePlayers = players.filter((p) => !excludedPlayerIds.includes(p.id));

  return (
    <View className="my-1">
      <Text variant="labelMedium" className="mb-1 opacity-70">
        {label}
      </Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            disabled={disabled}
            className="w-full"
            contentStyle={{ justifyContent: 'flex-start' }}
          >
            {selectedPlayer?.name || 'Select Player'}
          </Button>
        }
        contentStyle={{ maxHeight: 300 }}
      >
        <ScrollView className="max-h-[280px]">
          {availablePlayers.length === 0 ? (
            <Menu.Item title="No players available" disabled />
          ) : (
            availablePlayers.map((player) => (
              <Menu.Item
                key={player.id}
                onPress={() => {
                  onSelect(player.id);
                  setVisible(false);
                }}
                title={player.name}
                titleStyle={
                  player.id === selectedPlayerId
                    ? { color: theme.colors.primary, fontWeight: 'bold' }
                    : undefined
                }
              />
            ))
          )}
        </ScrollView>
      </Menu>
    </View>
  );
}

