import ThemedText from '@/src/components/common/ThemedText'
import OpenOrderItem from '@/src/components/OpenOrderItem'
import { ThemeColor } from '@/src/theme/theme-color'
import { Asset, OpenTrade, OpenTradeResponse } from '@repo/types'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useOpenTrades, useCloseTrade } from '../hooks/useTrade'
import { logger } from '../services/logger.service'
import { errorToast, successToast } from '../utils/toast'

const OpenOrders = () => {
    const { data } = useOpenTrades();
    const closeTrade = useCloseTrade();
    const [openOrders, setOpenOrders] = useState<OpenTradeResponse[]>([])

    useEffect(() => {
        const orders = data?.data?.trades
        if (orders && orders.length > 0) setOpenOrders(orders)
    }, [data]);


    const handleCloseOrder = async (orderId: string) => {
        try {
            await closeTrade.mutateAsync(orderId)
            setOpenOrders((prev) => prev.filter((order) => order.orderId !== orderId))
            successToast('Order closed successfully')
        } catch (error) {
            logger.error("handleCloseOrder", "error closing order", error)
            errorToast('Error closing order')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText size="lg" variant="primary" style={styles.headerText}>
                    Open Orders
                </ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {openOrders.length > 0 ? (
                     openOrders.map((order) => (
                        <OpenOrderItem
                            key={order.orderId}
                            order={order}
                            onCloseOrder={handleCloseOrder}
                        />
                     ))
                ) : (
                    <ThemedText style={styles.emptyText} size='sm'>
                        No open orders
                    </ThemedText>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.background,
        flex: 1,
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: ThemeColor.paddingHorizontal,
    },
    headerText: {
        fontFamily: 'ManropeSemiBold',
    },
    contentContainer: {
        padding: 16,
        flexGrow: 1,
    },
    emptyText: {
        color: ThemeColor.text.secondary,
        textAlign: 'center',
        marginTop: 40,
    },
})

export default OpenOrders
