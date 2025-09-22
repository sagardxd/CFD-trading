import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeColor } from '@/src/theme/theme-color'
import ThemedText from '@/src/components/common/ThemedText'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

interface TradingMarginProps {
  margin: string
  onChangeMargin: (value: string) => void
  availableBalance: number
  hasMargin: boolean
  exceedsBalance: boolean
}

const TradingMargin: React.FC<TradingMarginProps> = ({
  margin,
  onChangeMargin,
  availableBalance,
  hasMargin,
  exceedsBalance,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.marginLabel}>
        <ThemedText variant="secondary" style={styles.sectionTitle}>
          Margin <ThemedText size="sm" variant="tertiary">(in $)</ThemedText>
        </ThemedText>
        <ThemedText variant="secondary" style={styles.helperText}>
          Available: ${availableBalance.toFixed(2)}
        </ThemedText>
      </View>
      <BottomSheetTextInput
        style={styles.input}
        value={margin}
        onChangeText={onChangeMargin}
        placeholder="Enter margin"
        keyboardType="decimal-pad"
        placeholderTextColor={ThemeColor.text.tertiary}
      />
      {hasMargin && exceedsBalance && (
        <ThemedText size='sm' variant='error' style={styles.errorText}>
          Margin must be less than available balance
        </ThemedText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default TradingMargin


