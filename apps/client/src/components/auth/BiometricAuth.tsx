import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricAuth = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const fallbackBiometricNotSupported = () => {
        console.log('fall back to password authentication')
    }

    const handleBiometricAuth = async () => {
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

        if (!isBiometricAvailable) console.log(`Biometric not available on user device`)

        let supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log('supported bometrics are: ', supportedBiometrics)

        const savedBiometric = await LocalAuthentication.isEnrolledAsync();
        if (savedBiometric) {
            console.log(`Biometric record not found`)
        }

        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Login into CFD",
            cancelLabel: "No fuck off",
            disableDeviceFallback: true,
            biometricsSecurityLevel: 'strong',

        }) 

        console.log("kya hua uaht ka ", biometricAuth)

    }

    return (
        <View>
            <Button title='BiometricAuth' onPress={handleBiometricAuth} />
        </View>
    )
}

export default BiometricAuth