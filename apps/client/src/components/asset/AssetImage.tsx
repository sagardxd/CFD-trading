import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Asset } from '@repo/types'
import { SUPPORTED_ASSETS } from '@/src/constants/supportedAsset'

interface AssetImageProp {
    asset: Asset
}

const AssetImage: React.FC<AssetImageProp> = ({ asset }) => {
    const assetUrl = SUPPORTED_ASSETS.assets.find((val) => val.symbol == asset)?.imageUrl

    return (
        <Image
            src={assetUrl}
            style={styles.assetImage}
        />)

}

const styles = StyleSheet.create({
    assetImage: {
        width: 20,
        height: 20
    },
}

)

export default AssetImage