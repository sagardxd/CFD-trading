import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AssetData } from '@repo/types';
import { ThemeColor } from '@/src/theme/theme-color';
import ThemedText from './common/ThemedText';
import AssetImage from './asset/AssetImage';

interface AssetHeaderProps {
  asset: AssetData | null
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ asset }) => {

  if (!asset) return null
  
  const formatPrice = (price: number, decimals: number) => {
    return price / (Math.pow(10, decimals));
  };


  return (
    <View style={styles.container}>
      <View style={styles.assetInfo}>
        <AssetImage asset={asset.asset}/>
        <ThemedText size="lg" variant="primary" style={styles.assetSymbol}>
          {asset.asset}
        </ThemedText>
        <Ionicons name="trending-up" size={20} color={ThemeColor.primary} />
      </View>

      <View style={styles.bidAskContainer}>
        <View style={styles.priceItem}>
          <Ionicons name="arrow-down" size={14} color={ThemeColor.error} />
          <ThemedText size="sm" variant="tertiary">Bid</ThemedText>
          <ThemedText size="sm" variant="primary">${formatPrice(asset.bidPrice, asset.decimal)}</ThemedText>
        </View>

        <View style={styles.priceItem}>
          <Ionicons name="arrow-up" size={14} color={ThemeColor.success} />
          <ThemedText size="sm" variant="tertiary">Ask</ThemedText>
          <ThemedText size="sm" variant="primary">${formatPrice(asset.askPrice, asset.decimal)}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
    marginHorizontal: 16
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  assetSymbol: {
    fontFamily: 'ManropeSemiBold',
  },
  currentPrice: {
    fontFamily: 'ManropeSemiBold',
  },
  bidAskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default AssetHeader;
