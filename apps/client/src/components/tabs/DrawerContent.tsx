import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList, type DrawerContentComponentProps } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { ThemeColor } from '@/src/theme/theme-color'
import ThemedText from '../common/ThemedText'
import { useAuth } from '@/src/context/AuthContext'

const DrawerContent = (props: DrawerContentComponentProps) => {
    const { logout } = useAuth()

    return (
        <View style={styles.drawerContainer}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={styles.fotter}>
                <TouchableOpacity
                    style={styles.logoutContainer}
                    onPress={logout}
                >
                    <Ionicons name="log-out-outline" size={20} color={ThemeColor.error}/>
                    <ThemedText
                        variant="secondary"
                        size="md"
                        style={styles.logoutText}
                    >
                        Logout
                    </ThemedText>
                </TouchableOpacity>

                <View style={styles.versionFotter}>
                    <ThemedText variant="secondary" size="sm">
                        Version 1.0.0
                    </ThemedText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1, 
        backgroundColor: ThemeColor.background
    },
    fotter: {
        paddingHorizontal: 30,
        paddingVertical: 20
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        marginLeft: 10
    },
    versionFotter : {
        marginTop: 16, 
        alignItems: 'center' 
    }
})

export default DrawerContent