import { StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeColor } from '@/src/theme/theme-color'
import OrderHistory from '@/src/components/OrderHistory'
import ThemeHeaderBackButton from '@/src/components/common/ThemeHeaderBackButton'
import { useRouter } from 'expo-router'

const Orders = () => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ThemeHeaderBackButton onPress={() => router.back()} title='Orders'/>
      <OrderHistory />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor.background,
    flex: 1
  }
})

export default Orders