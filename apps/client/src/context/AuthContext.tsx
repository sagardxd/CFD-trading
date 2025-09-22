import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, storeToken } from "../storage/auth.storage";
import { getUserProfile } from "../services/auth.service";
import { logger } from "../services/logger.service";

interface User {
    email: string
    id: string
}

type AuthContextType = {
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = async () => {

        console.log('logging user fetch kra bro')
        try {
            const token = await getToken();
            if (!token) {
                console.log('token not avail')
                setIsLoading(false)
                return;
            }

            // validate token 
            const response = await getUserProfile();
            if (response.success && response.data) {
                setUser(response.data)
            }
            console.log(response)
        } catch (error) {
            logger.error('fetchCurrentUser', 'Failed to fetch current user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (user: User, token: string) => {
        try {
            setUser(user);
            await storeToken(token);
            router.replace('/(app)/biometric')
        } catch (error) {
            logger.error('login', 'Error logging in auth context', error)
        }
    }

    const logout = async () => {
        try {
            setUser(null);
            await removeToken();
            router.replace('/auth')
        } catch (error) {
            logger.error('logout', 'Error logging in auth context', error)
        }
    }

    return (
        <AuthContext.Provider value={{ login, user, logout, getCurrentUser: fetchCurrentUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}