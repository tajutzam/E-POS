import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { CategoryService } from '@/services/CategoryService';
import { displayError } from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';

const CategoryCreatePage: React.FC = () => {
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Silakan pilih foto kategori terlebih dahulu");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('imageFile', imageFile);

        try {
            setIsLoading(true);
            await CategoryService.create(formData);
            toast.success("Kategori berhasil ditambahkan");
            navigate('/data/categories');
        } catch (error: any) {
            displayError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto">
            <div className="flex items-center gap-4 mb-8">
           
                <div>
                    <h1 className="text-2xl font-bold text-dark">Tambah Kategori</h1>
                    <p className="text-sm text-muted-foreground">Buat kategori baru untuk produk Anda</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                {/* Input Nama */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Kategori</Label>
                    <Input
                        id="name"
                        placeholder="Contoh: Makanan Berat, Minuman Dingin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="focus-visible:ring-gray-400"
                    />
                </div>

                {/* Upload Gambar */}
                <div className="space-y-2">
                    <Label>Foto Kategori</Label>
                    <div className="flex flex-col items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden"
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500 font-semibold">Klik untuk unggah foto</p>
                                    <p className="text-xs text-gray-400">PNG, JPG atau JPEG (Maks. 2MB)</p>
                                </div>
                            )}
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/data/categories')}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white min-w-30"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Kategori'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryCreatePage;