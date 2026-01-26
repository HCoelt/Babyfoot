import { colors } from '@/src/theme';
import React from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

interface FastScoreSelectorProps {
    selectedScore: number;
    onScoreChange: (score: number) => void;
    teamColor: 'red' | 'blue';
    disabled?: boolean;
}

export function FastScoreSelector({
    selectedScore,
    onScoreChange,
    teamColor,
    disabled = false,
}: FastScoreSelectorProps) {
    const accentColor = teamColor === 'red' ? (colors.red?.primary || '#E53935') : (colors.blue?.primary || '#1E88E5');

    // Responsive sizes
    const width = Dimensions.get('window').width;
    const isSmallWidth = width < 360;

    // Slightly smaller sizes to prevent overflow
    const scoreSize = isSmallWidth ? 22 : 26;
    const largeSize = isSmallWidth ? 32 : 36;
    const gap = isSmallWidth ? 3 : 4;

    const ScoreButton = ({ value, isLarge = false }: { value: number; isLarge?: boolean }) => {
        const isSelected = selectedScore === value;
        const size = isLarge ? largeSize : scoreSize;

        return (
            <Pressable
                onPress={() => !disabled && onScoreChange(value)}
                disabled={disabled}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                    borderWidth: isSelected ? 1.5 : 0,
                    borderColor: isSelected ? accentColor : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <Text
                    style={{
                        fontSize: isLarge ? 14 : 11,
                        color: isSelected ? accentColor : (colors?.textMuted || '#888'),
                        fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                >
                    {value}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={{ alignItems: 'center', marginVertical: 2, width: '100%' }}>
            {/* 10 button - larger and above with minimal gap */}
            <View style={{ marginBottom: 4 }}>
                <ScoreButton value={10} isLarge />
            </View>

            {/* 0-9 buttons row */}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <ScoreButton key={num} value={num} />
                ))}
            </View>
        </View>
    );
}
