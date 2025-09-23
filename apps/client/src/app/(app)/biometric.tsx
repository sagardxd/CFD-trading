import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { useAuth } from '@/src/context/AuthContext'

const BiometricAuth = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const [loading, setLoading] = useState<boolean>(false)

    const handleBiometricAuth = async () => {
        setLoading(true)
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync()
            if (!hasHardware) {
                handleLogout();
                return
            }
            const isEnrolled = await LocalAuthentication.isEnrolledAsync()
            if (!isEnrolled) {
                handleLogout();
                return
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
                biometricsSecurityLevel: 'strong',
            })

            if (result.success) router.replace('/(app)/(drawer)/home')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        logout();
    }

    useEffect(() => {
        handleBiometricAuth()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Ionicons name="finger-print-outline" size={88} color={ThemeColor.primary} />
                <ThemedText size="xl" style={styles.title}>Unlock</ThemedText>

                <TouchableOpacity style={styles.primaryButton} onPress={handleBiometricAuth} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={ThemeColor.background} />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Ionicons name="finger-print" size={20} color={ThemeColor.background} />
                            <ThemedText size="button" style={styles.primaryButtonText}>Authenticate with fingerprint</ThemedText>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout} >
                    <ThemedText size="sm" variant='secondary'>Use password instead</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: ThemeColor.card,
        borderColor: ThemeColor.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        gap: 12,
        width: '90%',
        maxWidth: 380,
    },
    title: {
    },
    subtitle: {
        color: ThemeColor.text.secondary,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: ThemeColor.primary,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: ThemeColor.background,
    },
    secondaryButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },

})

export default BiometricAuth