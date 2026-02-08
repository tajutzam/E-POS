import api from "@/lib/api";


export class DashboardService {

    static async getData() {
        const response = await api.get('/dashboard/')
        return response.data
    }

}