import { ThemeColor } from '@/src/theme/theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from '../common/ThemedText';

interface BalanceCardProps {
    balance: number;
    currency?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currency = 'USD' }) => {
    const styles = balanceStyles;

    return (
        <View style={styles.container}>
            <ThemedText size="button" variant="secondary" style={styles.label}>
                Balance
            </ThemedText>
            <View style={styles.balanceContainer}>
                <ThemedText size="xl" variant="primary" style={styles.balance}>
                    ${balance.toFixed(2)}
                </ThemedText>
                <ThemedText size="sm" variant="primary" style={styles.balance}>
                    {currency}
                </ThemedText>
            </View>
        </View>
    );
};

const balanceStyles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.card,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: ThemeColor.border,
        alignItems: 'center',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    label: {
        marginBottom: 4,
    },
    balance: {
    },
});

export default BalanceCard;
