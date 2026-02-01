import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategoryService } from "@/services/CategoryService";
import { ProductService } from "@/services/ProductService";
import { displayError } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, ImagePlus } from "lucide-react";

const ProductCreatePage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form State sederhana
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
        image: null as File | null
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAll(0, 100);
                setCategories(response.content);
            } catch (error) {
                displayError(error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("categoryId", formData.categoryId);
            if (formData.description) data.append("description", formData.description);
            if (formData.image) data.append("image", formData.image);

            await ProductService.create(data);

            toast.success("Produk berhasil ditambahkan");
            navigate("/data/products");
        } catch (error) {
            displayError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6  mx-auto space-y-6">
            <div className="flex items-center gap-4">

                <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Section */}
                <Card className="md:col-span-1 border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Product Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 hover:border-slate-400 transition-all cursor-pointer">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <ImagePlus className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-[10px] text-slate-400 font-medium">Click to upload</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Info Section */}
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price (IDR)</Label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="20000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                required
                                onValueChange={val => setFormData(prev => ({ ...prev, categoryId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                className="h-24"
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Tell us more about this product..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Product"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default ProductCreatePage;