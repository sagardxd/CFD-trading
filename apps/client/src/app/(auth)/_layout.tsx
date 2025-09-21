import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const AuthLayout = () => {
    const { user } = useAuth();

    if (user) {
        
        return <Redirect href={'/(app)/(drawer)/home'}/>
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}

export default AuthLayout;  