import { Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

const AppLayout = () => {

    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{ headerShown: false, animation: 'ios_from_right', contentStyle: { backgroundColor: '#000' } }}>
            <Stack.Protected guard={!!user} >
                <Stack.Screen name="biometric" />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen name="asset-details" />
            </Stack.Protected>
            <Stack.Screen name="auth" />
        </Stack>
    )
}

export default AppLayout;