import { OrderRequest } from "../types/order.types";
import apiCaller from "./api.service";

export const createOrder = async(data: OrderRequest) => {
    const response = await apiCaller.post("/trade", {
        data
    })
    
}