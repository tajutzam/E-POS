import api from "@/lib/api";


export class CategoryService {
    static async create(formData: FormData) {
        return await api.post('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async getAll(page = 0, size = 10) {
        const response = await api.get(`/categories?page=${page}&size=${size}`);
        return response.data.data;
    }

    static async getByUuid(uuid: string) {
        const response = await api.get(`/categories/${uuid}`);
        return response.data.data;
    }

    static async update(uuid: string, formData: FormData) {
        return await api.put(`/categories/${uuid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async delete(uuid: string) {
        return await api.delete(`/categories/${uuid}`);
    }


}