import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import { fetchBinanceKlines } from '@/src/services/api';
import { Asset } from '@repo/types';
import { ThemeColor } from '@/src/theme/theme-color';

interface AssetChartProps {
    asset: Asset;
}

type TimeInterval = '1m' | '5m' | '1h' | '4h' | '1d' | '1w';

const AssetChart: React.FC<AssetChartProps> = ({ asset }) => {
    const [chartData, setChartData] = useState<{ value: number; dataPointText: string; date: string }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1w');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const timeIntervals: { label: string; value: TimeInterval }[] = [
        { label: '1M', value: '1m' },
        { label: '5M', value: '5m' },
        { label: '1H', value: '1h' },
        { label: '4H', value: '4h' },
        { label: '1D', value: '1d' },
        { label: '1W', value: '1w' },
    ];

    const fetchChartData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchBinanceKlines(asset, selectedInterval, 20);

            // Add date information to the data with labels
            const dataWithDates = data.map((item, index) => {
                const now = new Date();
                const date = new Date(now.getTime() - (data.length - index - 1) * getIntervalMs(selectedInterval));
                const formattedDate = formatDate(date, selectedInterval);

                // Add labels for every few data points to show time on chart
                const shouldShowLabel = index % Math.max(1, Math.floor(data.length / 4)) === 0 || index === data.length - 1;

                return {
                    ...item,
                    date: formattedDate,
                    ...(shouldShowLabel && {
                        label: formattedDate,
                        labelTextStyle: { color: ThemeColor.text.tertiary, width: 60 }
                    })
                };
            });

            setChartData(dataWithDates);
        } catch (err) {
            setError('Failed to fetch chart data');
            console.error('Error fetching chart data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getIntervalMs = (interval: TimeInterval): number => {
        switch (interval) {
            case '1m': return 60 * 1000;
            case '5m': return 5 * 60 * 1000;
            case '1h': return 60 * 60 * 1000;
            case '4h': return 4 * 60 * 60 * 1000;
            case '1d': return 24 * 60 * 60 * 1000;
            case '1w': return 7 * 24 * 60 * 60 * 1000;
            default: return 60 * 60 * 1000;
        }
    };

    const formatDate = (date: Date, interval: TimeInterval): string => {
        // For all intervals, show consistent date format
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            // If it's today, show time
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            // If it's not today, show date
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [asset, selectedInterval]);

    const dataMax = Math.max(...chartData.map(d => d.value));
    const dataMin = Math.min(...chartData.map(d => d.value));
    const priceRange = dataMax - dataMin;

    const maxValue = dataMax + (priceRange * 0.1); // 10% above highest price

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchChartData}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Time Interval Toggle */}
            <View style={styles.toggleContainer}>
                {timeIntervals.map((interval) => (
                    <TouchableOpacity
                        key={interval.value}
                        style={[
                            styles.toggleButton,
                            selectedInterval === interval.value && styles.toggleButtonActive
                        ]}
                        onPress={() => setSelectedInterval(interval.value)}
                    >
                        <Text style={[
                            styles.toggleButtonText,
                            selectedInterval === interval.value && styles.toggleButtonTextActive
                        ]}>
                            {interval.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ThemeColor.primary} />
                </View>
            ): 

      (
            <View style={styles.chartContainer}>
                <LineChart
                    areaChart
                    data={chartData}
                    width={320}
                    hideDataPoints
                    spacing={15}
                    color={ThemeColor.primary}
                    thickness={2}
                    startFillColor="rgba(20,105,81,0.3)"
                    endFillColor="rgba(20,85,81,0.01)"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={0}
                    noOfSections={6}
                    maxValue={maxValue}
                    yAxisColor={ThemeColor.border}
                    yAxisThickness={1}
                    rulesType="dotted"
                    rulesColor={ThemeColor.border}
                    yAxisTextStyle={{ color: ThemeColor.text.tertiary, fontSize: 12 }}
                    xAxisColor={ThemeColor.border}
                    hideYAxisText={false}
                    hideAxesAndRules={false}
                    xAxisLabelTextStyle={{ color: ThemeColor.text.tertiary, fontSize: 10 }}
                    pointerConfig={{
                        pointerStripHeight: -50,
                        pointerStripColor: ThemeColor.border,
                        pointerStripWidth: 1,
                        pointerColor: ThemeColor.primary,
                        radius: 4,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: true,
                        pointerLabelComponent: (items: any) => {
                            return (
                                <View style={styles.pointerLabel}>
                                    <Text style={styles.pointerLabelDate}>
                                        {items[0].date || 'N/A'}
                                    </Text>
                                    <View style={styles.pointerLabelContent}>
                                        <Text style={styles.pointerLabelValue}>
                                            ${items[0].value.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            </View>
      )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.background,
        borderRadius: 12,
        padding: 16,
        overflow: 'hidden',
        height: 380,
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: ThemeColor.card,
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: ThemeColor.primary,
    },
    toggleButtonText: {
        color: ThemeColor.text.secondary,
        fontSize: 14,
        fontWeight: '500',
    },
    toggleButtonTextActive: {
        color: ThemeColor.background,
        fontWeight: '600',
    },
    chartContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: ThemeColor.card,
        borderRadius: 8,
        overflow: 'hidden'
    },
    loadingContainer: {
        flex: 1,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: ThemeColor.text.secondary,
        marginTop: 12,
        fontSize: 16,
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: ThemeColor.error,
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: ThemeColor.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: ThemeColor.background,
        fontWeight: '600',
        fontSize: 16,
    },
    pointerLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -240,
        marginLeft: -50,
    },
    pointerLabelDate: {
        color: ThemeColor.text.secondary,
        fontSize: 12,
        marginBottom: 4,
        textAlign: 'center',
    },
    pointerLabelContent: {
        backgroundColor: ThemeColor.primary,
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 6,
    },
    pointerLabelValue: {
        color: ThemeColor.background,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default AssetChart;
