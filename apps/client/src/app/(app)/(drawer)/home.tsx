import AssetList from '@/src/components/home/AssetList'
import BalanceCard from '@/src/components/home/BalanceCard'
import { ThemeColor } from '@/src/theme/theme-color'
import { AssetData, WSData } from '@repo/types'
import React, { useEffect, useState } from 'react'
import {  StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAssetStore } from '@/src/store/assets.store'
import { useNavigation, useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { logger } from '@/src/services/logger.service'

const Home = () => {
    const navigation = useNavigation();
    const styles = homeStyles;
    const [isClient, setIsClient] = useState(false);
    const { setAssets: SetAssetStore } = useAssetStore()
    const [assets, setAssets] = useState<AssetData[]>([])

    useEffect(() => {
        if (isClient) return;

        let socket: WebSocket | null = null;

        try {
            socket = new WebSocket(`ws://192.168.0.89:8003`);
            logger.info('Attempting WebSocket connection...');

            socket.onopen = () => {
                logger.info('Connected to WebSocket backend');
            }

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data) as WSData
                setAssets(response.price_updates)
                SetAssetStore(response.price_updates)

            }
            socket.onerror = (error) => {
                logger.error('WebSocket error', '', error);
            }

            socket.onclose = (event) => {
                logger.error('WebSocket connection closed:', (event.code).toString(), event.reason);
            }

        } catch (error) {
            logger.error('home uef', 'Error creating WebSocket:', error);
        }

        // Cleanup function
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [isClient]);

    const handleDrawerOpen = () => {
        navigation.dispatch(DrawerActions.openDrawer)
    }

    return (
        <View style={styles.container}>
            <SafeAreaView />
            <View style={styles.menuContainer}> 
                <Ionicons
                    name="menu"
                    size={28}
                    color={ThemeColor.text.secondary}
                    onPress={handleDrawerOpen}
                    style={styles.menuIcon}
                />
                <BalanceCard />
            </View>

            <View style={styles.cardsContainer}>
                {assets && assets.length > 0 &&
                    <AssetList assets={assets} />
                }
            </View>
        </View>
    )
}

const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemeColor.background
    },
    menuContainer: {
        flexDirection: 'row',
        marginHorizontal: ThemeColor.marginHorizontal,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginTop: 10,
        borderRadius: 14,
        backgroundColor: ThemeColor.card,
        borderWidth: 1,
        borderColor: ThemeColor.border,
        alignItems: 'center',
    },
    menuIcon: {
        opacity: 0.9,
        marginRight: 12,
    },
    cardsContainer: {
        marginTop: 20,
        gap: 12
    },
    topSection: {
        flex: 0,
    },

})

export default Home