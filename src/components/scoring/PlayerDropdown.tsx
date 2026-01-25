import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Menu, Button, Text, useTheme } from 'react-native-paper';
import { Player } from '@/src/types/player';

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
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
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
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {selectedPlayer?.name || 'Select Player'}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        <ScrollView style={styles.menuScroll}>
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    marginBottom: 4,
    opacity: 0.7,
  },
  button: {
    width: '100%',
  },
  buttonContent: {
    justifyContent: 'flex-start',
  },
  menuContent: {
    maxHeight: 300,
  },
  menuScroll: {
    maxHeight: 280,
  },
});
