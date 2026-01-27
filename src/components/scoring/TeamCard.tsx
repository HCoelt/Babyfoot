import { colors } from '@/src/theme';
import { Player } from '@/src/types/player';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AvatarDropdown } from './AvatarDropdown';
import { FastScoreSelector } from './FastScoreSelector';

interface TeamCardProps {
    teamType: 'red' | 'blue';
    teamLabel: 'HOME' | 'AWAY';
    score: number | null;
    player1Id: number | null;
    player2Id: number | null;
    players: Player[];
    allSelectedIds: number[];
    onPlayer1Change: (id: number | null) => void;
    onPlayer2Change: (id: number | null) => void;
    onScoreChange: (score: number) => void;
    disabled?: boolean;
}

export function TeamCard({
    teamType,
    teamLabel,
    score,
    player1Id,
    player2Id,
    players,
    allSelectedIds,
    onPlayer1Change,
    onPlayer2Change,
    onScoreChange,
    disabled = false,
}: TeamCardProps) {
    const accentColor = teamType === 'red' ? (colors.red?.primary || '#E53935') : (colors.blue?.primary || '#1E88E5');
    const teamName = teamType === 'red' ? 'TEAM RED' : 'TEAM BLUE';

    const height = Dimensions.get('window').height;
    const isSmallScreen = height < 750; // Increased threshold for "small" logic to be safe

    const getExcludedIds = (currentPlayerId: number | null) => {
        return allSelectedIds.filter((id) => id !== currentPlayerId);
    };

    return (
        <View
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 16,
                borderWidth: 2,
                borderColor: accentColor,
                // Reduced padding significantly
                paddingVertical: isSmallScreen ? 8 : 12,
                paddingHorizontal: 12,
                // Reduced gap
                gap: isSmallScreen ? 4 : 8,
                flex: 1,
                justifyContent: 'space-between'
            }}
        >
            {/* Header - Compact */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ color: accentColor, fontWeight: 'bold', fontSize: 13, letterSpacing: 2 }}>
                        {teamName}
                    </Text>
                    <Text style={{ color: colors?.textMuted || '#888', fontSize: 8, letterSpacing: 1 }}>
                        {teamLabel}
                    </Text>
                </View>
            </View>

            {/* Score Display - Reduced Size */}
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{ color: colors?.text || '#FFF', fontSize: isSmallScreen ? 40 : 48, fontWeight: 'bold', lineHeight: isSmallScreen ? 48 : 56 }}>
                    {score !== null ? score : '-'}
                </Text>
            </View>

            {/* Fast Score Selector */}
            <View style={{ flex: 0 }}>
                <FastScoreSelector
                    selectedScore={score}
                    onScoreChange={onScoreChange}
                    teamColor={teamType}
                    disabled={disabled}
                />
            </View>

            {/* Player Selectors - Ensure they are inside with no top margin delay */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                <AvatarDropdown
                    label="ATK"
                    selectedPlayerId={player1Id}
                    players={players}
                    excludedPlayerIds={getExcludedIds(player1Id)}
                    onSelect={onPlayer1Change}
                    teamColor={teamType}
                    disabled={disabled}
                />
                <AvatarDropdown
                    label="DEF"
                    selectedPlayerId={player2Id}
                    players={players}
                    excludedPlayerIds={getExcludedIds(player2Id)}
                    onSelect={onPlayer2Change}
                    teamColor={teamType}
                    disabled={disabled}
                />
            </View>
        </View>
    );
}
