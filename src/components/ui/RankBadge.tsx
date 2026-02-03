import { getRankInfo } from '@/src/utils/ranks';
import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface RankBadgeProps {
    elo: number;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

export const RankBadge = memo(function RankBadge({
    elo,
    size = 'medium',
    showLabel = true,
}: RankBadgeProps) {
    const rankInfo = getRankInfo(elo);

    const sizeConfig = {
        small: { badge: 40, fontSize: 9 },
        medium: { badge: 56, fontSize: 11 },
        large: { badge: 72, fontSize: 14 },
    };

    const config = sizeConfig[size];

    return (
        <View style={styles.container}>
            <Image
                source={rankInfo.image}
                style={{
                    width: config.badge,
                    height: config.badge,
                }}
                resizeMode="contain"
            />
            {showLabel && (
                <Text
                    style={[
                        styles.label,
                        {
                            fontSize: config.fontSize,
                            color: rankInfo.color,
                        },
                    ]}
                >
                    {rankInfo.name}
                </Text>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    label: {
        marginTop: 2,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
