import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useCreatePlayer } from '@/src/hooks/usePlayers';

export function AddPlayerForm() {
  const [name, setName] = useState('');
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
      await createPlayer.mutateAsync({ name: trimmedName });
      setName('');
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
    <View style={styles.container}>
      <TextInput
        label="Player Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError('');
        }}
        mode="outlined"
        style={styles.input}
        error={!!error}
        disabled={createPlayer.isPending}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={createPlayer.isPending}
        disabled={createPlayer.isPending || !name.trim()}
        style={styles.button}
      >
        Add Player
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
});
