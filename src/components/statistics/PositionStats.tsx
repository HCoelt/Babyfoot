import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import { PositionStats as PositionStatsType } from '@/src/types/statistics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

interface PositionStatsProps {
    attack: PositionStatsType;
    defense: PositionStatsType;
}

export function PositionStats({ attack, defense }: PositionStatsProps) {
    const totalGames = attack.gamesPlayed + defense.gamesPlayed;

    // Calculate preferences
    const attackPref = totalGames > 0 ? (attack.gamesPlayed / totalGames) : 0;
    const defensePref = totalGames > 0 ? (defense.gamesPlayed / totalGames) : 0;

    return (
        <GlassCard transparent style={{ marginTop: 8, padding: 16 }}>
            <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600', color: colors.text }}>
                Position Analysis
            </Text>

            {/* Attack Stats */}
            <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name="sword-cross" size={16} color={colors.red.primary} />
                        <Text style={{ color: colors.text, fontWeight: '500' }}>Attack</Text>
                    </View>
                    <Text style={{ color: colors.textSecondary }}>
                        {attack.wins}W - {attack.gamesPlayed - attack.wins}L ({attack.winRate.toFixed(0)}%)
                    </Text>
                </View>
                <ProgressBar
                    progress={attack.winRate / 100}
                    color={colors.red.primary}
                    style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                    Played {attack.gamesPlayed} games ({(attackPref * 100).toFixed(0)}%)
                </Text>
            </View>

            {/* Defense Stats */}
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name="shield" size={16} color={colors.blue.primary} />
                        <Text style={{ color: colors.text, fontWeight: '500' }}>Defense</Text>
                    </View>
                    <Text style={{ color: colors.textSecondary }}>
                        {defense.wins}W - {defense.gamesPlayed - defense.wins}L ({defense.winRate.toFixed(0)}%)
                    </Text>
                </View>
                <ProgressBar
                    progress={defense.winRate / 100}
                    color={colors.blue.primary}
                    style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                    Played {defense.gamesPlayed} games ({(defensePref * 100).toFixed(0)}%)
                </Text>
            </View>
        </GlassCard>
    );
}
