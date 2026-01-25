import { LeaderboardRow } from '@/src/components/leaderboard/LeaderboardRow';
import { GlassCard } from '@/src/components/ui';
import { useLeaderboard } from '@/src/hooks/useStatistics';
import { colors } from '@/src/theme';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const { data: entries, isLoading, error, refetch } = useLeaderboard();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.red.primary} />
        <Text style={{ marginTop: 16, fontSize: 14, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background }}>
        <GlassCard style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, textAlign: 'center', color: colors.error }}>
            Failed to load leaderboard
          </Text>
        </GlassCard>
      </View>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background }}>
        <GlassCard style={{ padding: 24, alignItems: 'center' }}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold', color: colors.text }}>
            No Rankings Yet
          </Text>
          <Text style={{ textAlign: 'center', lineHeight: 22, color: colors.textSecondary }}>
            Add players and record games{'\n'}to see the leaderboard.
          </Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.playerId.toString()}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80, paddingHorizontal: 16 }}
        onRefresh={refetch}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', letterSpacing: 3, color: colors.textMuted, fontSize: 10, textAlign: 'center', marginBottom: 8 }}>
              LEADERBOARD
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>
              Top players ranked by rating
            </Text>
          </View>
        }
      />
    </View>
  );
}

