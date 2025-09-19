import { getBalanceResponse } from "../types/user.types";
import apiCaller from "./api.service"

export const getBalance = async() => {
    try {
        const result = await apiCaller.get<getBalanceResponse>("/user/balance");
        if (result.usd_balance) {
            return result.usd_balance
        }
    } catch (error) {
        
    }
}