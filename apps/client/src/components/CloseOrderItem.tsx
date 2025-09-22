import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { closeTradeDB } from '@repo/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useAssetStore } from '../store/assets.store'

interface CloseOrderItemProps {
  order: closeTradeDB
}

const CloseOrderItem: React.FC<CloseOrderItemProps> = ({ order }) => {

  const asset = useAssetStore((state) => state.getAsset(order.asset));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date))
  }

  return (
    <View style={styles.orderItem}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.assetInfo}>
            <ThemedText style={styles.assetName} size='md'>
              {order.asset}
            </ThemedText>
          </View>
          <ThemedText 
            style={[
              styles.profitLoss, 
              { color: (order.pnl || 0) >= 0 ? ThemeColor.success : ThemeColor.error }
            ]} 
            size='md'
          >
            {(order.pnl || 0) >= 0 ? '+' : ''}{order.pnl.toFixed(2)} USD
          </ThemedText>
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
            {order.quantity} lots at {order.openPrice / Math.pow(10, asset!.decimal)}
          </ThemedText>
          <ThemedText style={styles.closePrice} size='sm'>
            Closed at: {order.closePrice / Math.pow(10, asset!.decimal)}
          </ThemedText>
        </View>
        <View style={styles.additionalInfo}>
          <ThemedText style={styles.leverageInfo} size='sm'>
            {order.leverage}x • ${order.margin / Math.pow(10, asset!.decimal)}
          </ThemedText>
          <ThemedText style={styles.timestamp} size='sm'>
            {formatDate(order.createdAt)}
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
  profitLoss: {
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
  closePrice: {
    color: ThemeColor.text.secondary,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leverageInfo: {
    color: ThemeColor.text.secondary,
    fontSize: 12,
  },
  timestamp: {
    color: ThemeColor.text.secondary,
    fontSize: 12,
  },
})

export default CloseOrderItem
