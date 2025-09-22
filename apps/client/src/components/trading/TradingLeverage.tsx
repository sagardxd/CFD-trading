import React from 'react'
import { View, StyleSheet } from 'react-native'
import ThemedText from '@/src/components/common/ThemedText'
import LeverageControls from '@/src/components/LeverageControls'
import LeverageSlider from '@/src/components/LeverageSlider'

interface TradingLeverageProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  onChange: (val: number) => void
}

const TradingLeverage: React.FC<TradingLeverageProps> = ({ value, onIncrement, onDecrement, onChange }) => {
  return (
    <View style={styles.section}>
      <ThemedText variant="secondary" style={styles.sectionTitle}>Leverage</ThemedText>
      <LeverageControls value={value} onIncrement={onIncrement} onDecrement={onDecrement} />
      <LeverageSlider value={value} onValueChange={onChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 8,
  },
})

export default TradingLeverage


