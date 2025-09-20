import AssetDetails from '@/src/components/AssetDetails'
import LeverageSlider from '@/src/components/LeverageSlider'
import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import LeverageControls from './LeverageControls'
import { Asset, AssetData, OrderType, WSData } from '@repo/types'

interface TradingModalProps {
  isVisible: boolean
  onClose: () => void
  selectedAsset: Asset
  data: AssetData | null
  tradeType: OrderType
}

const TradingModal: React.FC<TradingModalProps> = ({
  isVisible,
  onClose,
  selectedAsset,
  data,
  tradeType,
}) => {
  const [margin, setMargin] = useState('')
  const [leverage, setLeverage] = useState(1.0)
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    setMargin('');
    setLeverage(1.0)
  }, [tradeType]);

  const snapPoints = useMemo(() => ["80%"], []);

  if (!isVisible) return null

  const handleLeverageIncrement = () => {
    setLeverage(prev => {
      if (prev === 1) return 10;
      return Math.min(Math.round(prev) + 10, 100)
    })
  }

  const handleLeverageDecrement = () => {
    setLeverage(prev => Math.max(Math.round(prev) - 10, 1))
  }

  const currentPrice = tradeType === OrderType.BUY && data
    ? (Number(data.bidPrice) / Math.pow(10 , data.decimal))
    : tradeType === OrderType.SELL && data?.askPrice
    ? (Number(data.askPrice) / Math.pow(10 , data.decimal))
    : 'N/A'

  // Check if button should be disabled
  const isButtonDisabled = !margin || Number(margin) <= 0

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints} 
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <ThemedText size="lg" style={styles.title}>
                {tradeType === OrderType.BUY ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Asset Details</ThemedText>
              <AssetDetails
                asset={selectedAsset} 
                assetPrice={currentPrice.toString()}
                margin={margin}
                leverage={leverage} 
              />
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Current Price</ThemedText>
              <ThemedText size="xl" variant="success">${currentPrice}</ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>
                Margin <ThemedText size="sm" variant="tertiary">(in $)</ThemedText>
              </ThemedText>
              <BottomSheetTextInput
                style={styles.input}
                value={margin}
                onChangeText={setMargin}
                placeholder="Enter margin"
                keyboardType="decimal-pad"
                placeholderTextColor={ThemeColor.text.tertiary}
              />
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Leverage</ThemedText>
              <LeverageControls 
                value={leverage}
                onIncrement={handleLeverageIncrement}
                onDecrement={handleLeverageDecrement}
              />
              <LeverageSlider 
                value={leverage}
                onValueChange={setLeverage}
              />
            </View>

            <View style={styles.section}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { 
                    backgroundColor: isButtonDisabled 
                      ? ThemeColor.text.tertiary
                      : tradeType === OrderType.BUY
                        ? ThemeColor.success 
                        : ThemeColor.error 
                  }
                ]}
                disabled={isButtonDisabled}
              >
                <ThemedText size="button" style={styles.actionButtonText}>
                  {tradeType === OrderType.BUY ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: ThemeColor.card,
  },
  indicator: {
    backgroundColor: '#666',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
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
  input: {
    borderWidth: 1,
    borderColor: ThemeColor.border,
    borderRadius: 8,
    padding: 16,
    backgroundColor: ThemeColor.card,
    color: ThemeColor.text.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: ThemeColor.text.primary,
    fontSize: 16,
    marginLeft: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: ThemeColor.text.primary,
  },
})

export default TradingModal
