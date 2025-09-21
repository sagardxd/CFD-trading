import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const AppLayout = () => {

    const { user } = useAuth()

    console.log('here')

    if (!user) {
        console.log("redirecting to auth");
        return <Redirect href="/(auth)" />;
      }

    return (
        <Stack
            initialRouteName="(drawer)"
            screenOptions={{ headerShown: false, animation: 'ios_from_right', contentStyle: { backgroundColor: '#000' } }}>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="asset-details" />
        </Stack>
    )
}

export default AppLayout;