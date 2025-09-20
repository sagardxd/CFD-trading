import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { Asset, AssetData, OrderType } from '@repo/types'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface TradeProps {
  data: AssetData | null
  selectedAsset: Asset
  onOpenModal: (type: OrderType) => void
}

const Trade: React.FC<TradeProps> = ({ selectedAsset, data, onOpenModal }) => {
  const handleBuyOrder = () => {
    onOpenModal(OrderType.BUY)
  }

  const handleSellOrder = () => {
    onOpenModal(OrderType.SELL)
  }

  return (
    <View style={styles.container}>
      {/* Action Buttons - Stuck to Bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={handleBuyOrder}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buyButtonText} size='button'>
            Long {selectedAsset.toString() || "Asset"}
          </ThemedText>
          {data?.bidPrice && <ThemedText size='sm' style={styles.priceButtonText}>{(Number(data.bidPrice) / Math.pow(10,data.decimal))}</ThemedText>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.sellButton]}
          onPress={handleSellOrder}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.sellButtonText} size='button'>
            Short {selectedAsset.toString() || "Asset"}
          </ThemedText>
          {data?.askPrice && <ThemedText size='sm' style={styles.priceButtonText}>{Number(data.askPrice) / Math.pow(10,data.decimal)}</ThemedText>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: ThemeColor.background,
    borderTopWidth: 1,
    borderTopColor: ThemeColor.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight:50
  },
  buyButton: {
    backgroundColor: ThemeColor.success,
  },
  sellButton: {
    backgroundColor: ThemeColor.error,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sellButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  priceButtonText: {
    color: 'white'
  }
})

export default Trade  