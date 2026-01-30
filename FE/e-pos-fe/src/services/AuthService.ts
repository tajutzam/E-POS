import api from "@/lib/api";

export class AuthService {
  static async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  }

  static logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}