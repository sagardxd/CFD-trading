import ThemedText from '@/src/components/common/ThemedText'
import { Asset } from '@repo/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import AssetImage from './asset/AssetImage'

interface AssetDetailsProps {
  asset: Asset
  assetPrice: string
  margin: string
  leverage: number
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, margin, leverage, assetPrice = null }) => {
  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        <View style={styles.assetInfo}>
          <AssetImage asset={asset}/>
          <ThemedText style={styles.name}>{asset}</ThemedText>
        </View>
        {assetPrice && margin ? <ThemedText style={styles.amountValue}>{((Number(margin) * leverage)/parseFloat(assetPrice)).toFixed(8)}</ThemedText> :
        <ThemedText style={styles.amountValue}>0</ThemedText>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  amountValue: {
    color: '#ccc',
    fontSize: 12,
  },
})

export default AssetDetails 