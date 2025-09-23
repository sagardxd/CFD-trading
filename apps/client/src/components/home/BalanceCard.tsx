import { ThemeColor } from '@/src/theme/theme-color';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from '../common/ThemedText';
import { useBalance } from '@/src/hooks/useBalance';
import { BALANCE_DECIMAL } from '@/src/constants/decimal.constant';
import LoadingSpinner from '../LoadingSpinner';

const BalanceCard = () => {
    const styles = balanceStyles;
    const { data, isLoading } = useBalance();
    const [balance, setBalance] = useState(0.00)

    useEffect(() => {
        const userBalance = data?.data?.usd;
        if (userBalance) setBalance(userBalance);
    }, [data]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingSpinner size='small' />
            </View>
        )
    }

    return (
            <View style={styles.balanceContent}>
                <ThemedText variant="primary" size='xl' style={styles.balanceText}>
                    $ {(balance / Math.pow(10, BALANCE_DECIMAL)).toFixed(2)}
                </ThemedText>
            </View>
    );
};

const balanceStyles = StyleSheet.create({
    balanceContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    balanceText: {
        fontWeight: '700'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: ThemeColor.background,
        alignItems: 'flex-end'

    },
    label: {
        marginBottom: 4,
    },

});

export default BalanceCard;
