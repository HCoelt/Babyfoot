import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Surface, Text, ActivityIndicator } from 'react-native-paper';
import { LeaderboardRow } from '@/src/components/leaderboard/LeaderboardRow';
import { useLeaderboard } from '@/src/hooks/useStatistics';

export default function LeaderboardScreen() {
  const { data: entries, isLoading, error, refetch } = useLeaderboard();

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load leaderboard</Text>
        </View>
      </Surface>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Surface style={styles.container}>
        <View style={styles.centerContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Rankings Yet
          </Text>
          <Text style={styles.emptyText}>
            Add players and record games{'\n'}to see the leaderboard.
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.playerId.toString()}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
  },
});
