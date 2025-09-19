import { ThemeColor } from '@/src/theme/theme-color';
import { AssetData, OrderType } from '@repo/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../../components/common/ThemedText';
import AssetChart from '@/src/components/chart/AssetChart';
import AssetHeader from '@/src/components/AssetHeader';
import TradingModal from '@/src/components/TradingModal';
import Trade from '@/src/components/Trade';
import OrderHistory from '@/src/components/OrderHistory';

const AssetDetails = () => {
  const router = useRouter();
  const { assetData } = useLocalSearchParams<{ assetData: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState<OrderType>(OrderType.BUY);

  // Parse the asset data from the route params
  const asset: AssetData = assetData ? JSON.parse(assetData) : null;

  const styles = assetDetailsStyles;

  if (!asset) {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <ThemedText size="lg" variant="error">Asset data not found</ThemedText>
      </View>
    );
  }

  const handleOpenModal = (type: OrderType) => {
    setTradeType(type);
    setIsModalVisible(true);
  };


  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <AssetHeader asset={asset} />
      <AssetChart asset={asset.asset} />

      <View style={styles.middleSection}>
        <OrderHistory />
      </View>

      <View style={styles.bottomContainer}>
        <Trade
          selectedAsset={asset.asset}
          data={null}
          onOpenModal={handleOpenModal}
        />
      </View>

      <TradingModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        selectedAsset={asset.asset}
        data={null}
        tradeType={tradeType}
      /> 
    </View>
  );
};

const assetDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColor.background,
  },
  header: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 16,
  },
  infoCard: {
    backgroundColor: ThemeColor.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
  },
  tradingCard: {
    backgroundColor: ThemeColor.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
  },
  cardTitle: {
    marginBottom: 16,
    fontFamily: 'ManropeSemiBold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceValue: {
    fontFamily: 'ManropeSemiBold',
  },
  placeholderText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  assetInfo: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  middleSection: {
    flex: 1,
    marginBottom: 80
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default AssetDetails;
