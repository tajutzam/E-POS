import React, { useState } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router';
import { AuthService } from '@/services/AuthService';
import toast from 'react-hot-toast';
import { displayError } from '@/utils/errorHandler';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await AuthService.register({ name, email, password });
            if (result.success) {
                toast.success(result.message || 'Registrasi berhasil!');
                navigate('/login');
            }
        } catch (error: any) {
            displayError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Daftar Akun" subtitle="Mulai kelola bisnis tenant Anda">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        placeholder="nama@email.com"
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
                        placeholder="Minimal 8 karakter"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-all"
                >
                    {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Sudah punya akun? </span>
                <Link to="/login" className="text-primary font-semibold hover:underline">
                    Masuk di sini
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;