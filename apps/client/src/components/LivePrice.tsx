import AssetPrice from '@/src/components/AssetPrice';
import { Asset, AssetData } from '@repo/types';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface LivePriceProps {
    data: AssetData[] | null
    setSelectedAsset: (asset: Asset) => void
    selectedAsset: Asset
}

const LivePrice: React.FC<LivePriceProps> = ({ data, setSelectedAsset, selectedAsset }) => {
    const symbols = ["BTC", "SOL", "ETH"];

    const getPriceForSymbol = (symbol: string): AssetData | null => {
        if (!data || !Array.isArray(data)) return null;
        return data.find(item => item?.asset === symbol) || null;
    };

    return (
        <ScrollView horizontal contentContainerStyle={styles.container}>
                {symbols.map((symbol) => {
                    const priceData = getPriceForSymbol(symbol);
                    const isSelected = selectedAsset === symbol;
                    
                    // Create a mock priceData object for loading state
                    const assetData = priceData || {
                        symbol: symbol as Asset,
                        buyPrice: 0,
                        sellPrice: 0,
                        decimals: 3
                    };
                    
                    return <AssetPrice 
                        key={symbol} 
                        priceData={assetData} 
                        setSelectedAsset={setSelectedAsset}
                        isSelected={isSelected}
                    />
                })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10
    },
});

export default LivePrice;