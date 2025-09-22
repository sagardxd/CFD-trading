import ThemedText from '@/src/components/common/ThemedText'
import { useAuth } from '@/src/context/AuthContext'
import { authService } from '@/src/services/auth.service'
import { logger } from '@/src/services/logger.service'
import { ThemeColor } from '@/src/theme/theme-color'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

const AuthScreen = () => {
    const { login } = useAuth();
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)
    const isValidPassword = (val: string) => val.length >= 6 && val.length <= 20

    const isFormValid = useMemo(() => {
        return isValidEmail(email) && isValidPassword(password)
    }, [email, password])

    const handleAuthFormSubmit = async () => {
        setEmailError('')
        setPasswordError('')
        setError('')

        if (!email) setEmailError('Email is required')
        if (!password) setPasswordError('Password is required')

        if (email && !isValidEmail(email)) setEmailError('Enter a valid email')
        if (password && !isValidPassword(password)) setPasswordError('Password must be 6-20 characters')

        if (!email || !password || !isValidEmail(email) || !isValidPassword(password)) return

        setLoading(true)
        try {
            const result = await authService(email, password, authMode === 'signin');
            if (result.success && result.data) {
                login({ email: email, id: result.data.userId }, result.data.token)
            }
            else {
                console.log("result", result)
                if (result.message) setError(result.message)
                setPassword('');
            }
        } catch (error) {
            logger.error('handleAuthFormSubmit', 'error in authetntication user', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <ThemedText size="xxl" style={styles.title}>
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </ThemedText>

            <View style={styles.form}>
                <TextInput
                    style={[styles.input, !!emailError && styles.inputError]}
                    placeholder="Email"
                    placeholderTextColor={ThemeColor.text.tertiary}
                    value={email}
                    onChangeText={(v) => { setEmail(v); if (emailError) setEmailError('') }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={64}
                />
                {!!emailError && (
                    <ThemedText size="sm" style={styles.errorText}>{emailError}</ThemedText>
                )}

                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={[styles.input, styles.passwordInput, !!passwordError && styles.inputError]}
                        placeholder="Password"
                        placeholderTextColor={ThemeColor.text.tertiary}
                        value={password}
                        onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError('') }}
                        secureTextEntry={!showPassword}
                        maxLength={20}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((s) => !s)}>
                        <ThemedText size="sm" style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</ThemedText>
                    </TouchableOpacity>
                </View>
                {!!passwordError && (
                    <ThemedText size="sm" style={styles.errorText}>{passwordError}</ThemedText>
                )}

                {!!error && (
                    <ThemedText size="sm" style={styles.errorText}>{error}</ThemedText>
                )}

                <TouchableOpacity
                    style={[styles.submitButton, (loading || !isFormValid) && styles.submitButtonDisabled]}
                    onPress={handleAuthFormSubmit}
                    disabled={loading || !isFormValid}
                >
                    <ThemedText size="button" style={styles.submitButtonText}>
                        {loading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            >
                <ThemedText size="sm">
                    {authMode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </ThemedText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemeColor.background,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        gap: 12,
        marginBottom: 24,
    },
    input: {
        backgroundColor: ThemeColor.card,
        borderColor: ThemeColor.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: ThemeColor.text.primary,
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
    },
    passwordWrapper: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 64,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        padding: 8,
    },
    eyeText: {
        color: ThemeColor.text.secondary,
    },
    submitButton: {
        backgroundColor: ThemeColor.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: ThemeColor.background,
    },
    toggleButton: {
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
})

export default AuthScreen