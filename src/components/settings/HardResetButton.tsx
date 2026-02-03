import { GlassCard } from '@/src/components/ui';
import { hardResetAllElos } from '@/src/database/operations/seasons';
import { colors } from '@/src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

export function HardResetButton() {
    const [isResetting, setIsResetting] = useState(false);
    const queryClient = useQueryClient();

    const handleReset = () => {
        Alert.alert(
            '⚠️ Hard Reset All Elos',
            'This will reset ALL player ratings to 1000 and clear their points statistics.\n\nThis action cannot be undone!\n\nAre you absolutely sure?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Reset Everything',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsResetting(true);
                            await hardResetAllElos();
                            // Invalidate all player-related queries
                            await queryClient.invalidateQueries({ queryKey: ['players'] });
                            await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
                            await queryClient.invalidateQueries({ queryKey: ['statistics'] });
                            Alert.alert('✅ Reset Complete', 'All player ratings have been reset to 1000.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset ratings. Please try again.');
                            console.error('Hard reset failed:', error);
                        } finally {
                            setIsResetting(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="refresh-circle" size={24} color={colors.error} />
                <Text style={styles.title}>Season Reset</Text>
            </View>
            <Text style={styles.description}>
                Reset all player ratings to 1000 and clear points statistics. Use this at the start of a new season.
            </Text>
            <TouchableOpacity
                style={[styles.button, isResetting && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={isResetting}
            >
                {isResetting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="alert-circle" size={18} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Hard Reset All Elos</Text>
                    </>
                )}
            </TouchableOpacity>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 8,
    },
    description: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.error,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
