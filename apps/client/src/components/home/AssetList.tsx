import AssetIntro from '@/src/components/home/AssetIntro';
import { Asset, AssetData } from '@repo/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AssetListProps {
  assets: AssetData[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  const styles = assetListStyles;

  return (
    <View style={styles.container}>
      {assets.map((asset, index) => (
        <AssetIntro key={`${asset.asset}-${index}`} asset={asset} />
      ))}
    </View>
  );
};

const assetListStyles = StyleSheet.create({
  container: {
    gap: 2,
  },
});

export default AssetList;
