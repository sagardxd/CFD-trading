import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { OpenTrade, OpenTradeResponse, OrderType } from '@repo/types'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useAssetStore } from '../store/assets.store'

interface OpenOrderItemProps {
  order: OpenTradeResponse
  onCloseOrder: (orderId: string) => void
}

const OpenOrderItem: React.FC<OpenOrderItemProps> = ({ order, onCloseOrder }) => {
  
  const asset = useAssetStore((state) => state.getAsset(order.asset));
  const currentPrice = order.type === OrderType.BUY ? asset?.askPrice : asset?.bidPrice
  
  const priceDifference = currentPrice ? currentPrice - order.openPrice : 0
  const profitLoss = priceDifference * order.quantity * (order.type === 'BUY' ? 1 : -1)

  return (
    <View style={styles.orderItem}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.assetInfo}>
            <ThemedText style={styles.assetName} size='md'>
              {order.asset}
            </ThemedText>
          </View>
          <View style={styles.topRight}>
            <ThemedText 
              style={[
                styles.profitLoss, 
                { color: (profitLoss || 0) >= 0 ? ThemeColor.success : ThemeColor.error }
              ]} 
              size='md'
            >
              {(profitLoss || 0) >= 0 ? '+' : ''}{profitLoss?.toFixed(2)} USD
            </ThemedText>
            {onCloseOrder && (
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => onCloseOrder(order.orderId)}
              >
                <ThemedText style={styles.closeButtonText} size='sm'>×</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.bottomSection}>
          <ThemedText 
            style={[
              styles.orderType, 
              { color: order.type === 'BUY' ? ThemeColor.primary : ThemeColor.error }
            ]} 
            size='sm'
          >
            {order.type.charAt(0).toUpperCase() + order.type.slice(1).toLowerCase()}
          </ThemedText>
          <ThemedText style={styles.orderDetails} size='sm'>
            {order.quantity} lots at {order.openPrice.toLocaleString()}
          </ThemedText>
          {currentPrice && (
            <ThemedText style={styles.currentPrice} size='sm'>
              Current: {currentPrice.toLocaleString()}
            </ThemedText>
          )}
        </View>
        <View style={styles.additionalInfo}>
          <ThemedText style={styles.leverageInfo} size='sm'>
            {order.leverage}x • ${order.margin.toFixed(0)}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: ThemeColor.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assetName: {
    color: ThemeColor.text.primary,
    fontWeight: '600',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profitLoss: {
    fontWeight: '600',
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColor.text.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: ThemeColor.background,
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderType: {
    fontWeight: '600',
  },
  orderDetails: {
    color: ThemeColor.text.secondary,
    flex: 1,
  },
  currentPrice: {
    color: ThemeColor.text.secondary,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leverageInfo: {
    color: ThemeColor.text.secondary,
    fontSize: 12,
  },
})

export default OpenOrderItem
