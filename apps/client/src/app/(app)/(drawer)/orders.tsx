import { View } from 'react-native'
import React from 'react'
import OpenOrders from '@/src/components/OpenOrders'
import { SafeAreaView } from 'react-native-safe-area-context'

const Orders = () => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <OpenOrders />
    </View>
  )
}

export default Orders