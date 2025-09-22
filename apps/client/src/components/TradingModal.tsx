import AssetDetails from '@/src/components/AssetDetails'
import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Asset, AssetData, OrderType, CreateTradeInput } from '@repo/types'
import { useBalance } from '@/src/hooks/useBalance'
import { useCreateTrade } from '@/src/hooks/useTrade'
import { BALANCE_DECIMAL } from '@/src/constants/decimal.constant'
import TradingHeader from '@/src/components/trading/TradingHeader'
import TradingMargin from '@/src/components/trading/TradingMargin'
import TradingLeverage from '@/src/components/trading/TradingLeverage'

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

  const { data: balanceResponse } = useBalance();
  const createTrade = useCreateTrade();
  const [userBalance, setUserBalance] = useState(0)
  const [margin, setMargin] = useState('')
  const [leverage, setLeverage] = useState(1.0)
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    const balance = balanceResponse?.data?.usd;
    if (balance) setUserBalance(balance);
  }, [balanceResponse]);

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
    ? (Number(data.bidPrice) / Math.pow(10, data.decimal))
    : tradeType === OrderType.SELL && data?.askPrice
      ? (Number(data.askPrice) / Math.pow(10, data.decimal))
      : 'N/A'

  // Validation
  const hasMargin = margin.trim().length > 0
  const exceedsBalance = (userBalance - parseFloat(margin) * Math.pow(10, BALANCE_DECIMAL)) < 0;

  const isButtonDisabled = !hasMargin || exceedsBalance || createTrade.isPending

  const handleCreateTrade = async () => {
    if (isButtonDisabled) return;

    const tradeInput: CreateTradeInput = {
      asset: selectedAsset,
      type: tradeType,
      margin: parseFloat(margin) * Math.pow(10, BALANCE_DECIMAL), // sending the value with adding 2 decimal
      leverage: leverage,
    };

    try {
      await createTrade.mutateAsync(tradeInput);
      onClose(); 
    } catch (error) {
      console.error('Failed to create trade:', error);
    }
  };

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
          <TradingHeader tradeType={tradeType} selectedAsset={selectedAsset} currentPrice={currentPrice} />

          <View style={styles.section}>
            <ThemedText variant="secondary" style={styles.sectionTitle}>Asset Details</ThemedText>
            <AssetDetails
              asset={selectedAsset}
              assetPrice={currentPrice.toString()}
              margin={margin}
              leverage={leverage}
            />
          </View>

          <TradingMargin
            margin={margin}
            onChangeMargin={setMargin}
            availableBalance={userBalance}
            hasMargin={hasMargin}
            exceedsBalance={exceedsBalance}
          />

          <TradingLeverage
            value={leverage}
            onIncrement={handleLeverageIncrement}
            onDecrement={handleLeverageDecrement}
            onChange={setLeverage}
          />

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
              onPress={handleCreateTrade}
            >
              <ThemedText size="button" style={styles.actionButtonText}>
                {createTrade.isPending 
                  ? 'Creating...' 
                  : `${tradeType === OrderType.BUY ? 'Long/Buy' : 'Short/Sell'} ${selectedAsset?.replace("USDT", "")}`
                }
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
  marginLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    marginBottom: 8,
  },
  helperText: {
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
  errorText: {
    marginTop: 8,
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
