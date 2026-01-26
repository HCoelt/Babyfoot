import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import { OpponentStats, PartnerStats } from '@/src/types/statistics';
import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';

interface PartnersListProps {
  title: string;
  data: PartnerStats[] | OpponentStats[];
  type: 'partner' | 'opponent';
  emptyMessage: string;
}

export function PartnersList({ title, data, type, emptyMessage }: PartnersListProps) {
  const getName = (item: PartnerStats | OpponentStats): string => {
    if ('partnerName' in item) return item.partnerName;
    return item.opponentName;
  };

  const getWinRate = (item: PartnerStats | OpponentStats): number => {
    if ('winRate' in item) return item.winRate;
    return item.winRateAgainst;
  };

  const getGames = (item: PartnerStats | OpponentStats): number => {
    return item.gamesPlayed;
  };

  const getId = (item: PartnerStats | OpponentStats): number => {
    if ('partnerId' in item) return item.partnerId;
    return item.opponentId;
  };

  if (!data || data.length === 0) {
    return (
      <GlassCard style={{ marginVertical: 8 }}>
        <Text variant="titleMedium" className="mb-4 font-semibold text-text">
          {title}
        </Text>
        <Text className="text-sm text-text-secondary">{emptyMessage}</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard transparent style={{ marginVertical: 8 }}>
      <Text variant="titleMedium" className="mb-4 font-semibold text-text">
        {title}
      </Text>
      <FlatList<PartnerStats | OpponentStats>
        data={data as (PartnerStats | OpponentStats)[]}
        keyExtractor={(item) => getId(item).toString()}
        renderItem={({ item, index }) => {
          const winRate = getWinRate(item);
          const winRateColor = winRate >= 50 ? colors.success : colors.error;

          return (
            <View
              className="flex-row items-center py-2"
              style={index < data.length - 1 ? { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' } : {}}
            >
              <View className="w-7 justify-center items-center">
                <Text className="font-bold text-sm text-text-secondary">{index + 1}</Text>
              </View>
              <View className="flex-1 ml-2">
                <Text variant="bodyLarge" className="font-medium text-text">
                  {getName(item)}
                </Text>
                <Text variant="bodySmall" className="text-text-secondary">
                  {getGames(item)} games together
                </Text>
              </View>
              <View className="items-end justify-center">
                <Text variant="titleMedium" className="font-bold" style={{ color: winRateColor }}>
                  {winRate.toFixed(0)}%
                </Text>
                <Text variant="labelSmall" className="text-[10px] text-text-secondary">
                  {type === 'partner' ? 'win rate' : 'vs them'}
                </Text>
              </View>
            </View>
          );
        }}
        scrollEnabled={false}
      />
    </GlassCard>
  );
}

