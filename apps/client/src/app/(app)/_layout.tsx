import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const AppLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right', contentStyle: { backgroundColor: '#000' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="asset-details" />
        </Stack>
    )
}

export default AppLayout;