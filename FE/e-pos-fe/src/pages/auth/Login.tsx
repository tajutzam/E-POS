import React, { useState } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router';
import { AuthService } from '@/services/AuthService';
import toast from 'react-hot-toast';
import { displayError } from '@/utils/errorHandler';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Hook untuk navigasi

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await AuthService.login({ email, password });
            if (result.success) {
                toast.success(result.message);
                navigate('/dashboard');
            }
        } catch (error: any) {
            displayError(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Selamat Datang" subtitle="Masuk ke akun kasir Anda">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                    {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Belum punya akun? </span>
                <Link to="/register" className="text-primary font-semibold hover:underline">
                    Daftar Tenant
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;