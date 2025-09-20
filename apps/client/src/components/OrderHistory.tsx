import ThemedText from '@/src/components/common/ThemedText'
import OpenOrderItem from '@/src/components/OpenOrderItem'
import CloseOrderItem from '@/src/components/CloseOrderItem'
import { ThemeColor } from '@/src/theme/theme-color'
import { OpenTrade, CloseTrade, Asset, OrderType } from '@repo/types'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { OrderStatus } from '../types/order.types'

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.OPEN)

    // Separate arrays for open and closed orders with proper data structure
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

    const [closedOrders, setClosedOrders] = useState<CloseTrade[]>([
        { 
            id: '3', 
            userId: 'user1',
            type: OrderType.BUY, 
            asset: Asset.BTC,
            margin: 500,
            leverage: 20,
            quantity: 0.04, 
            pnl: 150.25,
            open_price: 108718.61,
            close_price: 109500.00,
            opened_at: new Date('2024-01-14T08:00:00Z'),
            closed_at: new Date('2024-01-14T20:22:00Z')
        },
        { 
            id: '4', 
            userId: 'user1',
            type: OrderType.SELL, 
            asset: Asset.SOL,
            margin: 200,
            leverage: 10,
            quantity: 10, 
            pnl: -45.50,
            open_price: 95,
            close_price: 99.55,
            opened_at: new Date('2024-01-13T15:00:00Z'),
            closed_at: new Date('2024-01-13T15:15:00Z')
        },
    ])

    const statusOptions: { key: OrderStatus; label: string }[] = [
        { key: OrderStatus.OPEN, label: 'Open' },
        { key: OrderStatus.CLOSE, label: 'Close' }
    ]

    const handleStatusSelect = (status: OrderStatus) => {
        setSelectedStatus(status)
    }

    const handleCloseOrder = (orderId: string) => {
        setOpenOrders((prev) => prev.filter((order) => order.id != orderId))
    }

    // Get orders based on selected status
    const filteredOrders = selectedStatus === 'open' ? openOrders : closedOrders

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                {statusOptions.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        style={[
                            styles.tab,
                            selectedStatus === option.key && styles.selectedTab
                        ]}
                        onPress={() => handleStatusSelect(option.key)}
                        activeOpacity={0.7}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                selectedStatus === option.key ? styles.selectedTabText : {}
                            ]}
                            size='sm'
                        >
                            {option.label} ({option.key === 'open' ? openOrders.length : closedOrders.length})
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} >
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        if (selectedStatus === 'open') {
                            return (
                                <OpenOrderItem 
                                    key={order.id} 
                                    order={order as OpenTrade} 
                                    onCloseOrder={handleCloseOrder}
                                    currentPrice={order.asset === Asset.BTC ? 109000 : order.asset === Asset.ETH ? 2850 : 98}
                                />
                            )
                        } else {
                            return (
                                <CloseOrderItem 
                                    key={order.id} 
                                    order={order as CloseTrade} 
                                />
                            )
                        }
                    })
                ) : (
                    <ThemedText style={styles.descriptionText} size='sm'>
                        There are no {selectedStatus} orders 
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
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: ThemeColor.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: ThemeColor.border,
        padding: 4,
        margin: 16,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTab: {
        backgroundColor: ThemeColor.background,
        borderWidth: 1,
        borderColor: ThemeColor.border,
    },
    tabText: {
        color: ThemeColor.text.secondary,
        fontWeight: '500',
    },
    selectedTabText: {
        color: ThemeColor.text.primary,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 16,
        flexGrow: 1,
    },

    descriptionText: {
        color: ThemeColor.text.secondary,
        textAlign: 'center',
    },
})

export default OrderHistory