import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, Menu, Button, Divider, useTheme } from 'react-native-paper';
import { StatCard } from '@/src/components/statistics/StatCard';
import { PartnersList } from '@/src/components/statistics/PartnersList';
import { usePlayers } from '@/src/hooks/usePlayers';
import {
  usePlayerStats,
  useBestPartners,
  useToughestOpponents,
  useRecentPerformance,
} from '@/src/hooks/useStatistics';
import { formatRating, formatRatingChange } from '@/src/utils/scoring';

export default function StatisticsScreen() {
  const theme = useTheme();
  const { data: players = [] } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const { data: stats, isLoading: statsLoading } = usePlayerStats(selectedPlayerId);
  const { data: partners = [] } = useBestPartners(selectedPlayerId);
  const { data: opponents = [] } = useToughestOpponents(selectedPlayerId);
  const { data: recentGames = [] } = useRecentPerformance(selectedPlayerId, 10);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  if (players.length === 0) {
    return (
      <Surface style={styles.container}>
        <View style={styles.centerContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Players Yet
          </Text>
          <Text style={styles.emptyText}>
            Add players in Settings{'\n'}to view statistics.
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.selectorContainer}>
          <Text variant="titleMedium" style={styles.selectorLabel}>
            Select Player
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.selectorButton}
              >
                {selectedPlayer?.name || 'Choose a player'}
              </Button>
            }
          >
            {players.map((player) => (
              <Menu.Item
                key={player.id}
                onPress={() => {
                  setSelectedPlayerId(player.id);
                  setMenuVisible(false);
                }}
                title={player.name}
                titleStyle={
                  player.id === selectedPlayerId
                    ? { color: theme.colors.primary, fontWeight: 'bold' }
                    : undefined
                }
              />
            ))}
          </Menu>
        </View>

        {!selectedPlayerId && (
          <View style={styles.noSelectionContainer}>
            <Text style={styles.noSelectionText}>
              Select a player above to view their statistics
            </Text>
          </View>
        )}

        {selectedPlayerId && stats && (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                title="Rating"
                value={formatRating(stats.currentRating)}
                color={theme.colors.primary}
              />
              <StatCard
                title="Win Rate"
                value={`${stats.winRate.toFixed(0)}%`}
                color={stats.winRate >= 50 ? theme.colors.primary : theme.colors.error}
              />
            </View>

            <View style={styles.statsGrid}>
              <StatCard title="Games" value={stats.gamesPlayed} />
              <StatCard
                title="Wins"
                value={stats.wins}
                color={theme.colors.primary}
              />
              <StatCard
                title="Losses"
                value={stats.losses}
                color={theme.colors.error}
              />
            </View>

            <Divider style={styles.divider} />

            <PartnersList
              title="Best Partners"
              data={partners}
              type="partner"
              emptyMessage="Play more games to see partner stats"
            />

            <Divider style={styles.divider} />

            <PartnersList
              title="Toughest Opponents"
              data={opponents}
              type="opponent"
              emptyMessage="Play more games to see opponent stats"
            />

            {recentGames.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.recentContainer}>
                  <Text variant="titleMedium" style={styles.recentTitle}>
                    Recent Performance
                  </Text>
                  <View style={styles.recentGames}>
                    {recentGames.slice(0, 10).map((game, index) => (
                      <View
                        key={game.gameId}
                        style={[
                          styles.recentGame,
                          {
                            backgroundColor: game.won
                              ? `${theme.colors.primary}20`
                              : `${theme.colors.error}20`,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: game.won ? theme.colors.primary : theme.colors.error,
                            fontWeight: 'bold',
                          }}
                        >
                          {game.won ? 'W' : 'L'}
                        </Text>
                        <Text variant="labelSmall" style={styles.ratingChange}>
                          {formatRatingChange(game.ratingChange)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    marginBottom: 8,
  },
  selectorButton: {
    width: '100%',
  },
  noSelectionContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noSelectionText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  recentContainer: {
    marginTop: 8,
  },
  recentTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  recentGames: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentGame: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingChange: {
    opacity: 0.7,
  },
});
