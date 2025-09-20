import AssetList from '@/src/components/home/AssetList'
import BalanceCard from '@/src/components/home/BalanceCard'
import { ThemeColor } from '@/src/theme/theme-color'
import { AssetData, WSData } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAssetStore } from '@/src/store/assets.store'

const index = () => {
  const styles = homeStyles;
  const [isClient, setIsClient] = useState(false);
  // const { assets, setAssets } = useAssetStore()
  const  [ assets, setAssets] = useState<AssetData[]>([])

  useEffect(() => {
    if (isClient) return;

    let socket: WebSocket | null = null;

    try {
      // Use the same IP as your API service
      socket = new WebSocket(`ws://192.168.1.237:8003`);
      console.log('Attempting WebSocket connection...');

      socket.onopen = () => {
        console.log('Connected to WebSocket backend');
      }

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data) as WSData
        console.log(response)
        setAssets(response.price_updates)

      }
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      }

      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
      }

    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isClient]);


  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View style={styles.cardsContainer}>
        <BalanceCard balance={1250.75} />
        {assets && assets.length > 0 &&
          <AssetList assets={assets} />
        }
      </View>
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