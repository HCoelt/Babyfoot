import { GlassCard } from '@/src/components/ui';
import { colors } from '@/src/theme';
import { RatingHistoryPoint } from '@/src/types/statistics';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';

interface RatingChartProps {
    history: RatingHistoryPoint[];
}

export function RatingChart({ history }: RatingChartProps) {
    if (!history || history.length === 0) return null;

    // Format data for the chart
    const data = history.map(point => ({
        value: point.rating,
        label: point.date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
        dataPointText: Math.round(point.rating).toString(),
    }));

    // Calculate min/max for Y-axis scaling
    const ratings = history.map(p => p.rating);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    const padding = 50; // Reduced padding back to 50 for tightness, but still allow some buffer
    const yMin = Math.max(0, minRating - padding);

    const screenWidth = Dimensions.get('window').width;

    return (
        <GlassCard transparent style={{ marginTop: 8, padding: 16 }}>
            <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600', color: colors.text }}>
                Rating History
            </Text>

            <View style={{ marginLeft: -16 }}>
                <LineChart
                    data={data}
                    color={colors.red.primary}
                    thickness={3}
                    dataPointsColor={colors.red.light}
                    textColor={colors.textSecondary}
                    yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                    yAxisColor="transparent"
                    xAxisColor="rgba(255,255,255,0.1)"
                    noOfSections={4}
                    maxValue={maxRating - yMin + padding}
                    yAxisOffset={yMin}
                    width={screenWidth - 80} // Adjust width based on padding
                    height={200}
                    curved
                    isAnimated
                    hideDataPoints={history.length > 20} // Hide dots if too many points
                    initialSpacing={20}
                    endSpacing={20}
                    hideRules // cleaner look
                    pointerConfig={{
                        pointerStripHeight: 160,
                        pointerStripColor: 'lightgray',
                        pointerStripWidth: 2,
                        pointerColor: 'lightgray',
                        radius: 6,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: false,
                        pointerLabelComponent: (items: any) => {
                            return (
                                <View
                                    style={{
                                        height: 90,
                                        width: 100,
                                        justifyContent: 'center',
                                        marginTop: -30,
                                        marginLeft: -40,
                                    }}>
                                    <Text style={{ color: 'white', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                                        {items[0].value}
                                    </Text>
                                    <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                            {items[0].label}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            </View>
        </GlassCard>
    );
}
