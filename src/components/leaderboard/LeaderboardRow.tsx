import { GlassCard } from '@/src/components/ui';
import { RankBadge } from '@/src/components/ui/RankBadge';
import { colors } from '@/src/theme';
import { LeaderboardEntry } from '@/src/types/statistics';
import { formatRating } from '@/src/utils/scoring';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export const LeaderboardRow = memo(function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const getRankStyle = () => {
    switch (entry.rank) {
      case 1:
        return { backgroundColor: colors.gold, color: '#000', glow: colors.gold };
      case 2:
        return { backgroundColor: colors.silver, color: '#000', glow: colors.silver };
      case 3:
        return { backgroundColor: colors.bronze, color: '#FFF', glow: colors.bronze };
      default:
        return {
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: colors.textSecondary,
          glow: 'transparent',
        };
    }
  };

  const rankStyle = getRankStyle();
  const isTopThree = entry.rank <= 3;

  return (
    <GlassCard style={{ marginHorizontal: 16, marginVertical: 4 }} noPadding>
      <View className="flex-row items-center p-4 min-h-[72px]">
        <View
          className="w-9 h-9 rounded-[18px] justify-center items-center mr-4"
          style={[
            { backgroundColor: rankStyle.backgroundColor },
            isTopThree && {
              shadowColor: rankStyle.glow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          {isTopThree ? (
            <MaterialCommunityIcons
              name="trophy"
              size={16}
              color={rankStyle.color}
            />
          ) : (
            <Text className="font-bold text-sm" style={{ color: rankStyle.color }}>
              {entry.rank}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text variant="titleMedium" className="font-semibold text-text">
            {entry.playerName}
          </Text>
          <Text variant="bodySmall" className="mt-[2px] text-text-secondary">
            {entry.gamesPlayed} games | {entry.winRate.toFixed(0)}% win rate
          </Text>
        </View>
        <RankBadge elo={entry.currentRating} size="small" showLabel={false} />
        <View className="items-end ml-3">
          <Text
            variant="titleLarge"
            className="font-bold"
            style={{ color: isTopThree ? colors.red.primary : colors.text }}
          >
            {formatRating(entry.currentRating)}
          </Text>
          <Text variant="labelSmall" className="opacity-60 text-text-secondary">
            Rating
          </Text>
        </View>
      </View>
    </GlassCard>
  );
});

