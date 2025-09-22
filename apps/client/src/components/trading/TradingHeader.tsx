import React from 'react'
import { View, StyleSheet } from 'react-native'
import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { Asset, OrderType } from '@repo/types'

interface TradingHeaderProps {
  tradeType: OrderType
  selectedAsset: Asset
  currentPrice: number | 'N/A'
}

const TradingHeader: React.FC<TradingHeaderProps> = ({ tradeType, selectedAsset, currentPrice }) => {
  return (
    <>
      <View style={styles.header}>
        <ThemedText size="lg" style={styles.title}>
          {tradeType === OrderType.BUY ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace('USDT', '')}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText variant="secondary" style={styles.sectionTitle}>Current Price</ThemedText>
        <ThemedText size="xl" variant="success">${currentPrice}</ThemedText>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 8,
  },
})

export default TradingHeader


