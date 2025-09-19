import AssetIntro from '@/src/components/home/AssetIntro'
import AssetList from '@/src/components/home/AssetList'
import BalanceCard from '@/src/components/home/BalanceCard'
import { ThemeColor } from '@/src/theme/theme-color'
import { Asset, AssetData, OrderType } from '@repo/types'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  const styles = homeStyles;
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(Asset.BTC);
  

  const demoAssets: AssetData[] = [
    {
      askPrice: 43250.50,
      asset: Asset.BTC,
      bidPrice: 43200.25,
      decimal: 2
    },
    {
      askPrice: 2650.75,
      asset: Asset.ETH,
      bidPrice: 2645.30,
      decimal: 2
    },
    {
      askPrice: 122.15,
      asset: Asset.SOL,
      bidPrice: 121.85,
      decimal: 2
    }
  ]

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View style={styles.cardsContainer}>
        <BalanceCard balance={1250.75} />
        <AssetList assets={demoAssets} />
      </View>


      {/* <View style={styles.topSection}>
        <LivePrice data={assets} setSelectedAsset={setSelectedAsset} selectedAsset={selectedAsset} />
        <CandlestickChart symbol={selectedAsset} interval="1m" />
      </View>

      <View style={styles.middleSection}>
        <OrderHistory />
      </View>
 */}

    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColor.background
  },
  cardsContainer: {
    gap: 6
  },
  topSection: {
    flex: 0,
  },

})

export default index