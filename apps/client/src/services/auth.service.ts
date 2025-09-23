import { ApiResponse, AuthResponse, UserProfile } from "@repo/types";
import apiCaller from "./api.service";
import { ServerError } from "../utils/api-resonse";
import { logger } from "./logger.service";

export const authService = async (email: string, password: string, isSignIn: boolean):Promise<ApiResponse<AuthResponse | null>> =>  {
    try {
        const route = isSignIn ? "signin" : "signup"
        const response = await apiCaller.post<AuthResponse>(`/auth/${route}`, {
            email,
            password
        })
        return response;
    } catch (error) {
        logger.error('authService', `error in user ${isSignIn ? "signin" : "signup"}`, error)
        return ServerError();
    }
}

export const getUserProfile = async():Promise<ApiResponse<UserProfile | null>> => {
    try {
        const response = await apiCaller.get<UserProfile>(`/auth/me`)
        return response;
    } catch (error) {
        logger.error('authService', `error in fetching user profile`, error)
        return ServerError();
    }
}