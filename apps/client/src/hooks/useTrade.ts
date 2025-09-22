import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "../types/queryKeys.types"
import { createTradeService, closeTradeService, getAllOpenTradeService, getAllCloseTradeService } from "../services/trade.service"
import { CreateTradeInput } from "@repo/types"

export const useCreateTrade = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (input: CreateTradeInput) => createTradeService(input),
        onSuccess: () => {
            // Invalidate and refetch open trades after creating a new trade
            queryClient.invalidateQueries({ queryKey: [QueryKeys.OPEN_TRADES] })
            queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_BALANCE] })
        }
    })
}

export const useCloseTrade = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (tradeId: string) => closeTradeService(tradeId),
        onSuccess: () => {
            // Invalidate and refetch trades after closing
            queryClient.invalidateQueries({ queryKey: [QueryKeys.OPEN_TRADES] })
            queryClient.invalidateQueries({ queryKey: [QueryKeys.CLOSE_TRADES] })
            queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_BALANCE] })
        }
    })
}

export const useOpenTrades = () => {
    return useQuery({
        queryKey: [QueryKeys.OPEN_TRADES],
        queryFn: getAllOpenTradeService,
    })
}

export const useCloseTrades = () => {
    return useQuery({
        queryKey: [QueryKeys.CLOSE_TRADES],
        queryFn: getAllCloseTradeService,
    })
}