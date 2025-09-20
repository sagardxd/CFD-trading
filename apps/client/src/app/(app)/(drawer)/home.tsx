import AssetList from '@/src/components/home/AssetList'
import BalanceCard from '@/src/components/home/BalanceCard'
import { ThemeColor } from '@/src/theme/theme-color'
import { AssetData, WSData } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAssetStore } from '@/src/store/assets.store'
import { useNavigation, useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const styles = homeStyles;
    const [isClient, setIsClient] = useState(false);
    const { setAssets: SetAssetStore } = useAssetStore()
    const [assets, setAssets] = useState<AssetData[]>([])

    useEffect(() => {
        if (isClient) return;

        let socket: WebSocket | null = null;

        try {
            // Use the same IP as your API service
            socket = new WebSocket(`ws://192.168.1.237:8003`);
            console.log('Attempting WebSocket connection...');

            socket.onopen = () => {
                console.log('Connected to WebSocket backend');
            }

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data) as WSData
                // console.log(response)
                setAssets(response.price_updates)
                SetAssetStore(response.price_updates)

            }
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            }

            socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
            }

        } catch (error) {
            console.error('Error creating WebSocket:', error);
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
                <BalanceCard balance={1250.75} />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: ThemeColor.marginHorizontal,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: ThemeColor.background,
        borderWidth: 1,
        borderColor: ThemeColor.text.secondary + '20', // 20% opacity
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    menuIcon: {
        opacity: 0.8,
    },
    cardsContainer: {
        marginTop: 20,
        gap: 6
    },
    topSection: {
        flex: 0,
    },

})

export default Home