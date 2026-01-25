import { colors } from '@/src/theme';
import { Player } from '@/src/types/player';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Menu, Text } from 'react-native-paper';

interface AvatarDropdownProps {
    label: string; // ATK or DEF
    selectedPlayerId: number | null;
    players: Player[];
    excludedPlayerIds: number[];
    onSelect: (playerId: number | null) => void;
    teamColor: 'red' | 'blue';
    disabled?: boolean;
}

export function AvatarDropdown({
    label,
    selectedPlayerId,
    players,
    excludedPlayerIds,
    onSelect,
    teamColor,
    disabled = false,
}: AvatarDropdownProps) {
    const [visible, setVisible] = useState(false);
    const accentColor = teamColor === 'red' ? (colors.red?.primary || '#E53935') : (colors.blue?.primary || '#1E88E5');

    const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
    const availablePlayers = players.filter((p) => !excludedPlayerIds.includes(p.id));

    // Get initials from player name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const iconName = label === 'ATK' ? 'sword-cross' : 'shield';
    const textColor = colors?.text || '#FFFFFF';
    const mutedColor = colors?.textMuted || '#888888';

    return (
        <View style={{ flex: 1 }}>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <Pressable
                        onPress={() => !disabled && setVisible(true)}
                        disabled={disabled}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 24,
                            paddingVertical: 6,
                            paddingHorizontal: 8,
                            gap: 8,
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        {/* Avatar Circle */}
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 11 }}>
                                {selectedPlayer ? getInitials(selectedPlayer.name) : '+'}
                            </Text>
                        </View>

                        {/* Label and Icon */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text style={{ color: mutedColor, fontSize: 9, letterSpacing: 0.5 }}>
                                    {label}
                                </Text>
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={12}
                                    color={accentColor}
                                />
                            </View>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: textColor,
                                    fontSize: 12,
                                    fontWeight: selectedPlayer ? '600' : 'normal'
                                }}
                            >
                                {selectedPlayer ? selectedPlayer.name.split(' ')[0] : 'Select'}
                            </Text>
                        </View>
                    </Pressable>
                }
                contentStyle={{ maxHeight: 300, backgroundColor: colors?.surface || '#12121A' }}
            >
                <ScrollView style={{ maxHeight: 280 }}>
                    {availablePlayers.length === 0 ? (
                        <Menu.Item title="No players available" disabled titleStyle={{ color: mutedColor }} />
                    ) : (
                        availablePlayers.map((player) => (
                            <Menu.Item
                                key={player.id}
                                onPress={() => {
                                    onSelect(player.id);
                                    setVisible(false);
                                }}
                                title={player.name}
                                titleStyle={{
                                    color: player.id === selectedPlayerId ? accentColor : textColor,
                                    fontWeight: player.id === selectedPlayerId ? 'bold' : 'normal',
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            </Menu>
        </View>
    );
}
