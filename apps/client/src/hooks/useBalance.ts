import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "../types/queryKeys.types"
import { getUserUsdBalance } from "../services/balance.service"

export const useBalance = () => {
    return useQuery({
        queryKey: [QueryKeys.USER_BALANCE],
        queryFn: getUserUsdBalance,
        staleTime: 1000 * 60,
    });
}