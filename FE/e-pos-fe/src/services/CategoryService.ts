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
        return response.data;
    }
}