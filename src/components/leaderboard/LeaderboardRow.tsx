import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaderboardEntry } from '@/src/types/statistics';
import { formatRating } from '@/src/utils/scoring';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export const LeaderboardRow = memo(function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const theme = useTheme();

  const getRankStyle = () => {
    switch (entry.rank) {
      case 1:
        return { backgroundColor: '#FFD700', color: '#000' };
      case 2:
        return { backgroundColor: '#C0C0C0', color: '#000' };
      case 3:
        return { backgroundColor: '#CD7F32', color: '#FFF' };
      default:
        return { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurfaceVariant };
    }
  };

  const rankStyle = getRankStyle();

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={[styles.rankBadge, { backgroundColor: rankStyle.backgroundColor }]}>
        {entry.rank <= 3 ? (
          <MaterialCommunityIcons
            name="trophy"
            size={16}
            color={rankStyle.color}
          />
        ) : (
          <Text style={[styles.rankText, { color: rankStyle.color }]}>
            {entry.rank}
          </Text>
        )}
      </View>
      <View style={styles.playerInfo}>
        <Text variant="titleMedium" style={styles.name}>
          {entry.playerName}
        </Text>
        <Text variant="bodySmall" style={styles.stats}>
          {entry.gamesPlayed} games | {entry.winRate.toFixed(0)}% win rate
        </Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text variant="titleLarge" style={[styles.rating, { color: theme.colors.primary }]}>
          {formatRating(entry.currentRating)}
        </Text>
        <Text variant="labelSmall" style={styles.ratingLabel}>
          Rating
        </Text>
      </View>
    </Surface>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 72,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  playerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  stats: {
    opacity: 0.7,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontWeight: 'bold',
  },
  ratingLabel: {
    opacity: 0.5,
  },
});
