import api from "@/lib/api";


export class ProductService {
    static async create(formData: FormData) {
        return await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async getAll(page = 0, size = 10) {
        const response = await api.get(`/products?page=${page}&size=${size}`);
        return response.data.data;
    }

    static async getAllInCashier(
        page: number,
        size = 10,
        currentSearch?: string,
        categoryUuid?: string
    ) {
        const response = await api.get("/products/data/cashier", {
            params: {
                page,
                size,
                search: currentSearch || undefined,
                category: categoryUuid || undefined,
            },
        });

        return response.data;
    }


    static async getByUuid(uuid: string) {
        const response = await api.get(`/products/${uuid}`);
        return response.data.data;
    }

    static async update(uuid: string, formData: FormData) {
        return await api.put(`/products/${uuid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async delete(uuid: string) {
        return await api.delete(`/products/${uuid}`);
    }


}