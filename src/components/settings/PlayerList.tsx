import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  List,
  IconButton,
  Text,
  Dialog,
  Portal,
  Button,
  TextInput,
  useTheme,
  Divider,
} from 'react-native-paper';
import { usePlayers, useDeletePlayer, useUpdatePlayerRating } from '@/src/hooks/usePlayers';
import { Player } from '@/src/types/player';
import { formatRating } from '@/src/utils/scoring';

interface PlayerListProps {
  ListHeaderComponent?: React.ComponentType<unknown> | React.ReactElement;
}

export function PlayerList({ ListHeaderComponent }: PlayerListProps) {
  const { data: players, isLoading, error } = usePlayers();
  const deletePlayer = useDeletePlayer();
  const updateRating = useUpdatePlayerRating();
  const theme = useTheme();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newRating, setNewRating] = useState('');
  const [actionError, setActionError] = useState('');

  const handleDeletePress = (player: Player) => {
    setSelectedPlayer(player);
    setActionError('');
    setDeleteDialogVisible(true);
  };

  const handleEditPress = (player: Player) => {
    setSelectedPlayer(player);
    setNewRating(Math.round(player.currentRating).toString());
    setActionError('');
    setEditDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlayer) return;

    try {
      await deletePlayer.mutateAsync(selectedPlayer.id);
      setDeleteDialogVisible(false);
      setSelectedPlayer(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const confirmEdit = async () => {
    if (!selectedPlayer) return;

    const rating = parseFloat(newRating);
    if (isNaN(rating) || rating < 100) {
      setActionError('Rating must be a number >= 100');
      return;
    }

    try {
      await updateRating.mutateAsync({ id: selectedPlayer.id, newRating: rating });
      setEditDialogVisible(false);
      setSelectedPlayer(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View style={styles.emptyContainer}>
          <Text>Loading players...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.error }}>Error loading players</Text>
        </View>
      </View>
    );
  }

  if (!players || players.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No players yet. Add your first player above.</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Player }) => (
    <List.Item
      title={item.name}
      description={`Rating: ${formatRating(item.currentRating)}`}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => (
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditPress(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => handleDeletePress(item)}
          />
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        Players ({players.length})
      </Text>
      <Divider />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        ListHeaderComponent={ListHeaderComponent}
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Player</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete {selectedPlayer?.name}?</Text>
            {actionError ? (
              <Text style={{ color: theme.colors.error, marginTop: 8 }}>{actionError}</Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} loading={deletePlayer.isPending}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Rating</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.editLabel}>
              Manually adjust {selectedPlayer?.name}'s rating:
            </Text>
            <TextInput
              label="New Rating"
              value={newRating}
              onChangeText={setNewRating}
              keyboardType="numeric"
              mode="outlined"
              style={styles.ratingInput}
            />
            {actionError ? (
              <Text style={{ color: theme.colors.error, marginTop: 8 }}>{actionError}</Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmEdit} loading={updateRating.isPending}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editLabel: {
    marginBottom: 12,
  },
  ratingInput: {
    marginTop: 8,
  },
});
