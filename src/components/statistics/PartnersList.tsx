import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text, Divider, useTheme } from 'react-native-paper';
import { PartnerStats, OpponentStats } from '@/src/types/statistics';

interface PartnersListProps {
  title: string;
  data: PartnerStats[] | OpponentStats[];
  type: 'partner' | 'opponent';
  emptyMessage: string;
}

export function PartnersList({ title, data, type, emptyMessage }: PartnersListProps) {
  const theme = useTheme();

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
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <FlatList<PartnerStats | OpponentStats>
        data={data as (PartnerStats | OpponentStats)[]}
        keyExtractor={(item) => getId(item).toString()}
        renderItem={({ item, index }) => (
          <List.Item
            title={getName(item)}
            description={`${getGames(item)} games together`}
            left={(props) => (
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>{index + 1}</Text>
              </View>
            )}
            right={() => (
              <View style={styles.winRateContainer}>
                <Text
                  variant="titleMedium"
                  style={{
                    color:
                      type === 'partner'
                        ? getWinRate(item) >= 50
                          ? theme.colors.primary
                          : theme.colors.error
                        : getWinRate(item) >= 50
                        ? theme.colors.primary
                        : theme.colors.error,
                  }}
                >
                  {getWinRate(item).toFixed(0)}%
                </Text>
                <Text variant="labelSmall" style={styles.winRateLabel}>
                  {type === 'partner' ? 'win rate' : 'vs them'}
                </Text>
              </View>
            )}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  rankContainer: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rank: {
    fontWeight: 'bold',
    opacity: 0.5,
  },
  winRateContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  winRateLabel: {
    opacity: 0.5,
  },
});
