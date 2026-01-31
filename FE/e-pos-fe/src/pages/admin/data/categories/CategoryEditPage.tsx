import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CategoryService } from '@/services/CategoryService';
import { displayError } from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

const CategoryEditPage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadCategory = async () => {
            if (!uuid) return;
            try {
                const data = await CategoryService.getByUuid(uuid);
                setName(data.name);
                if (data.image) {
                    setPreviewUrl(`${import.meta.env.VITE_IMAGE_URL}/categories/${data.image}`);
                }
            } catch (error) {
                displayError(error);
                navigate('/data/categories');
            } finally {
                setIsLoading(false);
            }
        };
        loadCategory();
    }, [uuid, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uuid) return;

        const formData = new FormData();
        formData.append('name', name);
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        try {
            setIsSubmitting(true);
            await CategoryService.update(uuid, formData);
            toast.success("Kategori berhasil diperbarui");
            navigate('/data/categories');
        } catch (error: any) {
            displayError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-dark">Edit Kategori</h1>
                    <p className="text-sm text-muted-foreground">Perbarui informasi kategori produk Anda</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Kategori</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="focus-visible:ring-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Foto Kategori</Label>
                    <div className="flex flex-col items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="text-sm text-gray-500 font-semibold">Klik untuk ganti foto</p>
                                </div>
                            )}
                            <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="mt-2 text-xs text-gray-400 italic">*Biarkan kosong jika tidak ingin mengganti foto</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate('/data/categories')} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gray-500 hover:bg-gray-600 text-white min-w-[120px]"
                    >
                        {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryEditPage;