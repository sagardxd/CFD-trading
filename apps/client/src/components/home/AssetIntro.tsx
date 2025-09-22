import { fetchBinanceKlines } from '@/src/services/klines.service';
import { ThemeColor } from '@/src/theme/theme-color';
import { AssetData } from '@repo/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import ThemedText from '../common/ThemedText';
import { SUPPORTED_ASSETS } from '@/src/constants/supportedAsset';
import AssetImage from '../asset/AssetImage';

interface AssetIntroProps {
  asset: AssetData
}

const AssetIntro: React.FC<AssetIntroProps> = ({ asset }) => {
  const router = useRouter();
  const styles = AssetStyles
  const [chartData, setChartData] = useState<{ value: number; dataPointText: string }[]>([]);
  const [lineChartColor, setLineChartColor] = useState<'green' | 'red'>('green')
  const [isLoading, setIsLoading] = useState(true);


  const handleAssetPress = () => {
    router.push({
      pathname: '/asset-details',
      params: {
        assetData: JSON.stringify(asset)
      }
    });
  };

  // Fetch K-lines data when component mounts or asset changes
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBinanceKlines(asset.asset, '1w', 20);
        setChartData(data)

        const lastIndex = data.length - 1;
        if (data[0].value > data[lastIndex].value) setLineChartColor('red')
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [asset.asset]);



  return (
    <TouchableOpacity style={styles.container} onPress={handleAssetPress}>
      <View style={styles.leftSection}>
        <View style={styles.title}>
          <AssetImage asset={asset.asset}/>
          <ThemedText size="lg" variant="primary" >
            {asset.asset}
          </ThemedText>
        </View>

        <View>
          <View style={styles.priceRow}>
            <ThemedText size="sm" variant="secondary" >
              Bid:
            </ThemedText>
            <ThemedText size="md" variant="success" style={styles.priceValue}>
              ${asset.bidPrice / Math.pow(10, asset.decimal)}
            </ThemedText>
          </View>

          <View style={styles.priceRow}>
            <ThemedText size="sm" variant="secondary" >
              Ask:
            </ThemedText>
            <ThemedText size="md" variant="error" style={styles.priceValue}>
              ${asset.askPrice / Math.pow(10, asset.decimal)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ThemedText size="xs" variant="secondary">Loading...</ThemedText>
          </View>
        ) : (
          <View >
            <LineChart
              data={chartData}
              color={lineChartColor}
              areaChart
              curved
              hideDataPoints
              startFillColor="rgba(20,105,81,0.3)"
              endFillColor= 'rgba(31,31,31,0.01)' 
              hideRules
              hideAxesAndRules
              backgroundColor="transparent"
              width={styles.chart.width}
              height={styles.chart.height}
              spacing={styles.chart.width / Math.max(chartData.length - 1, 1)}
              initialSpacing={0}
              endSpacing={0}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const AssetStyles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: ThemeColor.marginHorizontal,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
    gap: 8
  },
  title: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  priceValue: {
    fontFamily: 'ManropeSemiBold',
  },
  chartContainer: {
    width: 120,
    height: 60,
    borderRadius: 8,
    padding: 4,
    marginRight: 10
  },
  chart: {
    width: 100,
    height: 52,
  },
  loadingContainer: {
    width: 112,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default AssetIntro
