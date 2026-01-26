import { PartnersList } from '@/src/components/statistics/PartnersList';
import { PositionStats } from '@/src/components/statistics/PositionStats';
import { RatingChart } from '@/src/components/statistics/RatingChart';
import { StatItem } from '@/src/components/statistics/StatCard';
import { GlassCard } from '@/src/components/ui';
import { usePlayers } from '@/src/hooks/usePlayers';
import {
  useBestPartners,
  usePlayerStats,
  useRatingHistory,
  useRecentPerformance,
  useToughestOpponents,
} from '@/src/hooks/useStatistics';
import { borderRadius, colors } from '@/src/theme';
import { formatRating, formatRatingChange } from '@/src/utils/scoring';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatisticsScreen() {
  const { data: players = [] } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      // When screen gains focus, we can optionally reset or keep state.
      // User asked: "changing of page it have to reset".
      // This implies when I come BACK to the page, it should be reset? Or when I LEAVE?
      // "changing of page it have to reset to select a player" -> implies entering the page should show "Select a player"
      return () => {
        // Cleanup when screen loses focus
        setSelectedPlayerId(null);
        setMenuVisible(false);
      };
    }, [])
  );

  const { data: stats, isLoading: statsLoading } = usePlayerStats(selectedPlayerId);
  const { data: partners = [] } = useBestPartners(selectedPlayerId);
  const { data: opponents = [] } = useToughestOpponents(selectedPlayerId);
  const { data: recentGames = [] } = useRecentPerformance(selectedPlayerId, 10);
  const { data: ratingHistory = [] } = useRatingHistory(selectedPlayerId);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  if (players.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background }}>
        <GlassCard style={{ padding: 24, alignItems: 'center' }}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold', color: colors.text }}>
            No Players Yet
          </Text>
          <Text style={{ textAlign: 'center', lineHeight: 22, color: colors.textSecondary }}>
            Add players in Settings{'\n'}to view statistics.
          </Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', letterSpacing: 3, color: colors.textMuted, fontSize: 10, marginBottom: 8 }}>
            STATISTICS
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            Player performance insights
          </Text>
        </View>

        <GlassCard style={{ marginBottom: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: '600', color: colors.text }}>
            Select Player
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            contentStyle={{ borderRadius: borderRadius.md, backgroundColor: colors.surface }}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={{ borderRadius: borderRadius.md, borderColor: colors.cardBorder }}
                textColor={selectedPlayer ? colors.text : colors.textSecondary}
              >
                {selectedPlayer?.name || 'Choose a player'}
              </Button>
            }
          >
            <ScrollView style={{ maxHeight: 300 }}>
              {players.map((player) => (
                <Menu.Item
                  key={player.id}
                  onPress={() => {
                    setMenuVisible(false);
                    // Defer state update to ensure menu closes smoothly before heavy re-render
                    setTimeout(() => {
                      setSelectedPlayerId(player.id);
                    }, 0);
                  }}
                  title={player.name}
                  titleStyle={
                    player.id === selectedPlayerId
                      ? { color: colors.red.primary, fontWeight: 'bold' }
                      : { color: colors.text }
                  }
                />
              ))}
            </ScrollView>
          </Menu>
        </GlassCard>

        {!selectedPlayerId && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary }}>
              Select a player above to view their statistics
            </Text>
          </View>
        )}

        {selectedPlayerId && stats && (
          <>
            <GlassCard transparent style={{ marginBottom: 8, padding: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <StatItem
                  title="Rating"
                  value={formatRating(stats.currentRating)}
                  color={colors.red.primary}
                />
                <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '100%' }} />
                <StatItem
                  title="Win Rate"
                  value={`${stats.winRate.toFixed(0)}% `}
                  color={stats.winRate >= 50 ? colors.success : colors.error}
                />
              </View>
            </GlassCard>

            <GlassCard transparent style={{ marginBottom: 8, padding: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <StatItem title="Games" value={stats.gamesPlayed} color={colors.text} />
                <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '100%' }} />
                <StatItem
                  title="Wins"
                  value={stats.wins}
                  color={colors.success}
                />
                <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '100%' }} />
                <StatItem
                  title="Losses"
                  value={stats.losses}
                  color={colors.error}
                />
              </View>
            </GlassCard>

            {ratingHistory.length > 0 && <RatingChart history={ratingHistory} />}

            <PositionStats attack={stats.attack} defense={stats.defense} />

            <PartnersList
              title="Best Partners"
              data={partners}
              type="partner"
              emptyMessage="Play more games to see partner stats"
            />

            <PartnersList
              title="Toughest Opponents"
              data={opponents}
              type="opponent"
              emptyMessage="Play more games to see opponent stats"
            />

            {recentGames.length > 0 && (
              <GlassCard transparent style={{ marginTop: 8 }}>
                <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600', color: colors.text }}>
                  Recent Performance
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {recentGames.slice(0, 10).map((game, index) => (
                    <View
                      key={game.gameId}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: borderRadius.sm,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: game.won
                          ? colors.red.transparent
                          : colors.blue.transparent,
                        borderColor: game.won
                          ? colors.red.glow
                          : colors.blue.glow,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: game.won ? colors.red.primary : colors.blue.primary,
                        }}
                      >
                        {game.won ? 'W' : 'L'}
                      </Text>
                      <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                        {formatRatingChange(game.ratingChange)}
                      </Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

