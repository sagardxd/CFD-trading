import ThemedText from '@/src/components/common/ThemedText'
import OpenOrderItem from '@/src/components/OpenOrderItem'
import { ThemeColor } from '@/src/theme/theme-color'
import { OpenTrade, Asset, OrderType } from '@repo/types'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const OpenOrders = () => {
    const [openOrders, setOpenOrders] = useState<OpenTrade[]>([
        { 
            id: '1', 
            userId: 'user1',
            type: OrderType.BUY, 
            asset: Asset.BTC,
            margin: 1000,
            leverage: 1,
            quantity: 0.08, 
            liquidation_price: 95000,
            open_price: 108770.16, 
            opened_at: new Date('2024-01-15T10:30:00Z')
        },
        { 
            id: '2', 
            userId: 'user1',
            type: OrderType.SELL, 
            asset: Asset.ETH,
            margin: 500,
            leverage: 5,
            quantity: 2.0, 
            liquidation_price: 3200,
            open_price: 2800, 
            opened_at: new Date('2024-01-15T14:20:00Z')
        },
    ])

    const handleCloseOrder = (orderId: string) => {
        setOpenOrders((prev) => prev.filter((order) => order.id !== orderId))
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
                            key={order.id} 
                            order={order} 
                            onCloseOrder={handleCloseOrder}
                            currentPrice={order.asset === Asset.BTC ? 109000 : order.asset === Asset.ETH ? 2850 : 98}
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
