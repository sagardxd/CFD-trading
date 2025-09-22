import ThemedText from '@/src/components/common/ThemedText'
import OpenOrderItem from '@/src/components/OpenOrderItem'
import CloseOrderItem from '@/src/components/CloseOrderItem'
import { ThemeColor } from '@/src/theme/theme-color'
import { Asset,  closeTradeDB, OpenTradeResponse } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { OrderStatus } from '../types/order.types'
import { useCloseTrades, useOpenTrades } from '../hooks/useTrade'
import { useAssetStore } from '../store/assets.store'

const OrderHistory = () => {
    const { data: openTradesResponse } = useOpenTrades();
    const { data: closeTradesResponse } = useCloseTrades();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.OPEN)
    const [openOrders, setOpenOrders] = useState<OpenTradeResponse[]>([])
    const [closedOrders, setClosedOrders] = useState<closeTradeDB[]>([])

    useEffect(() => {
        const openOrders = openTradesResponse?.data?.trades
        if (openOrders && openOrders.length > 0) setOpenOrders(openOrders);

        const closeOrders = closeTradesResponse?.data?.trades
        if (closeOrders && closeOrders.length > 0) setClosedOrders(closeOrders)
    }, [openTradesResponse, openTradesResponse]);


    const statusOptions: { key: OrderStatus; label: string }[] = [
        { key: OrderStatus.OPEN, label: 'Open' },
        { key: OrderStatus.CLOSE, label: 'Close' }
    ]

    const handleStatusSelect = (status: OrderStatus) => {
        setSelectedStatus(status)
    }

    const handleCloseOrder = (orderId: string) => {
        setOpenOrders((prev) => prev.filter((order) => order.orderId != orderId))
    }
console.log(closedOrders)
    // Get orders based on selected status
    const filteredOrders = selectedStatus === 'open' ? openOrders : closedOrders
    console.log(filteredOrders.length)

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
                    filteredOrders.map((order: any) => {
                        if (selectedStatus === 'open') {
                            return (
                                <OpenOrderItem
                                    key={order?.orderId}
                                    order={order as OpenTradeResponse}
                                    onCloseOrder={handleCloseOrder}
                                />
                            )
                        } else {
                            return (
                                <CloseOrderItem
                                    key={order.id}
                                    order={order as closeTradeDB}
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