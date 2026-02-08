import api from "@/lib/api";
import type { TransactionRequest, TransactionResponse } from "@/types/typeApi";

export class TransactionService {
    static async delete(uuid: string) {
        const response = await api.delete(`/transactions/${uuid}`)
        return response.data
    }


    static async getByUuid(uuid: string) {
        const response = await api.get(`/transactions/${uuid}`)
        return response.data
    }

    static async create(request: TransactionRequest): Promise<TransactionResponse> {
        const response = await api.post<TransactionResponse>('/transactions/', request);
        return response.data;
    }

    static async getAll(
        page: number,
        size: number,
        search?: string,
        sort?: string,
        startDate?: string,
        endDate?: string
    ) {
        const response = await api.get("/transactions", {
            params: {
                page,
                size,
                search: search || undefined,
                sort: sort || "createdAt,desc",
                startDate: startDate,
                endDate: endDate
            },
        });

        return response.data;
    }

}