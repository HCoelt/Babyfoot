import { GlassCard } from '@/src/components/ui';
import { useDeletePlayer, usePlayers, useUpdatePlayerGamestyle, useUpdatePlayerRating } from '@/src/hooks/usePlayers';
import { colors } from '@/src/theme';
import { GameStyle, Player } from '@/src/types/player';
import { formatRating } from '@/src/utils/scoring';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';

interface PlayerListProps {
  ListHeaderComponent?: React.ComponentType<unknown> | React.ReactElement;
}

export function PlayerList({ ListHeaderComponent }: PlayerListProps) {
  const { data: players, isLoading, error } = usePlayers();
  const deletePlayer = useDeletePlayer();
  const updateRating = useUpdatePlayerRating();
  const updateGamestyle = useUpdatePlayerGamestyle();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newRating, setNewRating] = useState('');
  const [newGamestyle, setNewGamestyle] = useState<GameStyle>('attack');
  const [actionError, setActionError] = useState('');

  const handleDeletePress = (player: Player) => {
    setSelectedPlayer(player);
    setActionError('');
    setDeleteDialogVisible(true);
  };

  const handleEditPress = (player: Player) => {
    setSelectedPlayer(player);
    setNewRating(Math.round(player.currentRating).toString());
    setNewGamestyle(player.gamestyle || 'attack');
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
      // Update rating if changed
      if (rating !== selectedPlayer.currentRating) {
        await updateRating.mutateAsync({ id: selectedPlayer.id, newRating: rating });
      }
      // Update gamestyle if changed (compare with fallback to handle undefined)
      const currentGamestyle = selectedPlayer.gamestyle || 'attack';
      if (newGamestyle !== currentGamestyle) {
        await updateGamestyle.mutateAsync({ id: selectedPlayer.id, gamestyle: newGamestyle });
      }
      setEditDialogVisible(false);
      setSelectedPlayer(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1">
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View className="p-8 items-center">
          <Text className="text-text-secondary">Loading players...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1">
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View className="p-8 items-center">
          <Text className="text-error">Error loading players</Text>
        </View>
      </View>
    );
  }

  if (!players || players.length === 0) {
    return (
      <View className="flex-1">
        {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View className="p-8 items-center">
          <GlassCard style={{ padding: 24, alignItems: 'center' }}>
            <Text className="text-center text-text-secondary">
              No players yet. Add your first player above.
            </Text>
          </GlassCard>
        </View>
      </View>
    );
  }

  const getGamestyleIcon = (gamestyle: GameStyle) => {
    return gamestyle === 'attack' ? 'sword' : 'shield';
  };

  const getGamestyleColor = (gamestyle: GameStyle) => {
    return gamestyle === 'attack' ? colors.red.primary : colors.blue.primary;
  };

  const renderItem = ({ item }: { item: Player; index: number }) => (
    <GlassCard style={{ marginHorizontal: 16, marginVertical: 4 }} noPadding>
      <View className="flex-row items-center p-4">
        <View
          className="w-10 h-10 rounded-full justify-center items-center mr-4"
          style={{ backgroundColor: getGamestyleColor(item.gamestyle) + '30' }}
        >
          <Text className="text-lg font-semibold text-text-secondary">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text variant="bodyLarge" className="font-medium text-text">
              {item.name}
            </Text>
            <IconButton
              icon={getGamestyleIcon(item.gamestyle)}
              size={16}
              iconColor={getGamestyleColor(item.gamestyle)}
              style={{ margin: 0, marginLeft: 4 }}
            />
          </View>
          <Text variant="bodySmall" className="text-text-secondary">
            Rating: {formatRating(item.currentRating)} • {item.gamestyle === 'attack' ? 'Attacker' : 'Defender'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <IconButton
            icon="pencil"
            size={20}
            iconColor={colors.blue.primary}
            onPress={() => handleEditPress(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={colors.error}
            onPress={() => handleDeletePress(item)}
          />
        </View>
      </View>
    </GlassCard>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {ListHeaderComponent && (typeof ListHeaderComponent === 'function' ? <ListHeaderComponent /> : ListHeaderComponent)}
            <Text variant="titleMedium" className="px-4 pb-2 font-semibold text-text">
              Players ({players.length})
            </Text>
          </>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        >
          <Dialog.Title className="text-text">Delete Player</Dialog.Title>
          <Dialog.Content>
            <Text className="text-text-secondary">
              Are you sure you want to delete {selectedPlayer?.name}?
            </Text>
            {actionError ? (
              <Text className="text-error mt-2">{actionError}</Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)} textColor={colors.textSecondary}>
              Cancel
            </Button>
            <Button onPress={confirmDelete} loading={deletePlayer.isPending} textColor={colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        >
          <Dialog.Title className="text-text">Edit Player</Dialog.Title>
          <Dialog.Content>
            <Text className="mb-4 text-text-secondary">
              Edit {selectedPlayer?.name}'s details:
            </Text>
            <TextInput
              label="Rating"
              value={newRating}
              onChangeText={setNewRating}
              keyboardType="numeric"
              mode="outlined"
              className="mt-2 bg-transparent"
              outlineColor={colors.cardBorder}
              activeOutlineColor={colors.blue.primary}
              textColor={colors.text}
            />

            <View className="mt-4">
              <Text variant="bodyMedium" className="mb-2 text-text-secondary">
                Preferred Position
              </Text>
              <SegmentedButtons
                value={newGamestyle}
                onValueChange={(value) => setNewGamestyle(value as GameStyle)}
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

            {actionError ? (
              <Text className="text-error mt-2">{actionError}</Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)} textColor={colors.textSecondary}>
              Cancel
            </Button>
            <Button onPress={confirmEdit} loading={updateRating.isPending || updateGamestyle.isPending} textColor={colors.blue.primary}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
