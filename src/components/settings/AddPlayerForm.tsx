import { GlassCard } from '@/src/components/ui';
import { useCreatePlayer } from '@/src/hooks/usePlayers';
import { colors } from '@/src/theme';
import { GameStyle } from '@/src/types/player';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';

export function AddPlayerForm() {
  const [name, setName] = useState('');
  const [gamestyle, setGamestyle] = useState<GameStyle>('attack');
  const [error, setError] = useState('');
  const createPlayer = useCreatePlayer();

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    try {
      await createPlayer.mutateAsync({ name: trimmedName, gamestyle });
      setName('');
      setGamestyle('attack');
      setError('');
    } catch (err) {
      if (err instanceof Error && err.message.includes('UNIQUE')) {
        setError('Player with this name already exists');
      } else {
        setError('Failed to add player');
      }
    }
  };

  return (
    <GlassCard style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <TextInput
        label="Player Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError('');
        }}
        mode="outlined"
        className="mb-1 bg-transparent"
        error={!!error}
        disabled={createPlayer.isPending}
        outlineColor={colors.cardBorder}
        activeOutlineColor={colors.red.primary}
        textColor={colors.text}
        theme={{
          colors: {
            onSurfaceVariant: colors.textSecondary,
          },
        }}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <View className="mb-4">
        <Text variant="bodyMedium" className="mb-2 text-text-secondary">
          Preferred Position
        </Text>
        <SegmentedButtons
          value={gamestyle}
          onValueChange={(value) => setGamestyle(value as GameStyle)}
          buttons={[
            {
              value: 'attack',
              label: 'Attack',
              icon: 'sword',
              checkedColor: colors.red.primary,
            },
            {
              value: 'defense',
              label: 'Defense',
              icon: 'shield',
              checkedColor: colors.blue.primary,
            },
          ]}
          style={{ backgroundColor: 'transparent' }}
          theme={{
            colors: {
              secondaryContainer: colors.red.transparent,
              onSecondaryContainer: colors.text,
              outline: colors.cardBorder,
            },
          }}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={createPlayer.isPending}
        disabled={createPlayer.isPending || !name.trim()}
        className="mt-2 rounded-md"
        buttonColor={colors.red.primary}
      >
        Add Player
      </Button>
    </GlassCard>
  );
}
