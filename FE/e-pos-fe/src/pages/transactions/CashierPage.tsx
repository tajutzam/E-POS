import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ShoppingCart, Plus, Minus, Trash2,
    Search, X, Loader2, ChevronDown, Filter, CheckCircle2, Printer
} from "lucide-react";
import { formatRupiah } from "@/utils/helper";
import { ProductService } from "@/services/ProductService";
import { CategoryService } from "@/services/CategoryService";
import { TransactionService } from "@/services/TransactionService";
import { displayError } from "@/utils/errorHandler";
import type { Product, ProductListResponse, Category, TransactionRequest } from "@/types/typeApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface CartItem extends Product {
    qty: number;
}

const CashierPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
    const [paymentAmount, setPaymentAmount] = useState<string>("");
    const [lastTransaction, setLastTransaction] = useState<any>(null);
    const navigate = useNavigate()

    const fetchCategories = useCallback(async () => {
        try {
            const response = await CategoryService.getAll(0, 100);
            setCategories(response.content);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    }, []);

    const fetchProducts = useCallback(async (
        pageNum: number,
        isLoadMore: boolean = false,
        currentSearch: string = "",
        categoryUuid: string = "all"
    ) => {
        try {
            if (isLoadMore) setIsLoadingMore(true);
            else setIsLoading(true);

            const response: ProductListResponse = await ProductService.getAllInCashier(
                pageNum,
                5,
                currentSearch,
                categoryUuid === "all" ? "" : categoryUuid
            );

            if (response.success) {
                const currentPage = Number(response.data.number);
                setPage(currentPage);

                if (isLoadMore) {
                    setProducts(prev => [...prev, ...response.data.content]);
                } else {
                    setProducts(response.data.content);
                }
                setHasMore(!response.data.last);
            }
        } catch (error) {
            displayError(error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchProducts(0, false, "", "all");
    }, [fetchCategories, fetchProducts]);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        fetchProducts(0, false, val, selectedCategory);
    };

    const handleCategoryChange = (uuid: string) => {
        setSelectedCategory(uuid);
        fetchProducts(0, false, search, uuid);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchProducts(page + 1, true, search, selectedCategory);
        }
    };

    const handlePrint = () => {
        window.open(`/transactions/${lastTransaction.uuid}/receipt`, '_blank')
    }

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;
        setCart(prev => {
            const exist = prev.find(i => i.uuid === product.uuid);
            if (exist) {
                if (exist.qty >= product.stock) {
                    toast.error("Stok tidak mencukupi");
                    return prev;
                }
                return prev.map(i => i.uuid === product.uuid ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (uuid: string, qty: number) => {
        if (qty <= 0) {
            setCart(prev => prev.filter(i => i.uuid !== uuid));
        } else {
            setCart(prev => prev.map(i => i.uuid === uuid ? { ...i, qty } : i));
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const change = Number(paymentAmount) - total;

    const handleNumpadClick = (num: string) => {
        setPaymentAmount(prev => prev + num);
    };

    const handleClearPayment = () => {
        setPaymentAmount("");
    };

    const processPayment = async () => {
        try {
            setIsSubmitting(true);

            const requestData: TransactionRequest = {
                payment_amount: Number(paymentAmount),
                items: cart.map(item => ({
                    productId: item.id,
                    qty: item.qty
                }))
            };

            const response = await TransactionService.create(requestData);

            if (response.success) {
                setLastTransaction({
                    ...response.data,
                    change: change
                });
                setIsCheckoutOpen(false);
                setIsSuccessOpen(true);
                setCart([]);
                setPaymentAmount("");
                // Refresh produk untuk update stok
                fetchProducts(0, false, search, selectedCategory);
            }
        } catch (error) {
            displayError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

            {/* LEFT - PRODUCT LIST */}
            <div className="flex-1 flex flex-col min-h-0">
                <header className="p-4 lg:p-6 bg-white border-b space-y-4 shadow-sm z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-800">E-POS</h1>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Kasir Aktif</p>
                        </div>
                        <div className="lg:hidden relative">
                            <Button variant="outline" size="icon" className="relative rounded-xl border-slate-200" onClick={() => setIsMobileCartOpen(true)}>
                                <ShoppingCart className="h-5 w-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Cari nama produk..."
                                className="pl-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-gray-400"
                                value={search}
                                onChange={e => handleSearchChange(e.target.value)}
                            />
                        </div>

                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-slate-50 border-slate-200 rounded-xl">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.uuid} value={cat.uuid}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar bg-slate-50/30">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p className="text-sm italic">Menghubungkan ke gudang...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center">
                            <Filter className="h-16 w-16 opacity-10 mb-4" />
                            <p className="font-medium text-slate-400 text-sm">Produk tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-32 lg:pb-10">
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4">
                                {products.map(product => (
                                    <Card
                                        key={product.uuid}
                                        className={`group cursor-pointer border-none shadow-sm hover:shadow-md transition-all active:scale-95 bg-white rounded-2xl overflow-hidden ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardContent className="p-0">
                                            <div className="p-3 lg:p-4 space-y-3">
                                                <div className="aspect-square w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100/50 flex items-center justify-center relative">
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGE_URL}/products/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/200x200?text=No+Img")}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-xs lg:text-sm truncate">{product.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-tighter">{product.category?.name || 'Item'}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p className="text-sm font-black text-slate-900">{formatRupiah(product.price)}</p>
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            {product.stock}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <Button onClick={handleLoadMore} variant="outline" disabled={isLoadingMore} className="rounded-full px-8 py-5 border-slate-200 text-slate-600">
                                        {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                                        Muat Lebih Banyak
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* RIGHT - CART SECTION */}
            <aside className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 w-full lg:w-[380px] bg-white lg:border-l border-slate-200 flex flex-col transform transition-all duration-300 ${isMobileCartOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}`}>
                <div className="lg:hidden flex justify-center p-3 border-b bg-slate-50" onClick={() => setIsMobileCartOpen(false)}>
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full cursor-pointer" />
                </div>

                <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg"><ShoppingCart className="h-5 w-5" /></div>
                        <h2 className="font-bold text-lg text-slate-800 tracking-tight">Keranjang</h2>
                    </div>
                    <Button variant="ghost" size="icon" className="lg:hidden text-slate-400" onClick={() => setIsMobileCartOpen(false)}><X className="h-5 w-5" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 pb-48 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10 text-center opacity-40">
                            <ShoppingCart className="h-12 w-12 mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">Belum ada pesanan</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.uuid} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">{formatRupiah(item.price)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                                        <button className="px-2 py-1 text-slate-400 hover:text-slate-800" onClick={() => updateQty(item.uuid, item.qty - 1)}><Minus size={12} strokeWidth={3} /></button>
                                        <span className="w-6 text-center text-xs font-black text-slate-700">{item.qty}</span>
                                        <button className="px-2 py-1 text-slate-400 hover:text-slate-800" onClick={() => addToCart(item)}><Plus size={12} strokeWidth={3} /></button>
                                    </div>
                                    <button className="text-slate-300 hover:text-red-500 p-1" onClick={() => updateQty(item.uuid, 0)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-white border-t shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tagihan</span>
                        <span className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{formatRupiah(total)}</span>
                    </div>
                    <Button
                        className="w-full h-12 lg:h-14 text-md font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        Proses Pembayaran
                    </Button>
                </div>
            </aside>

            {/* CHECKOUT DIALOG */}
            <Dialog open={isCheckoutOpen} onOpenChange={(open) => {
                setIsCheckoutOpen(open);
                if (!open) setPaymentAmount("");
            }}>
                <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-6 gap-6 outline-none">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-slate-800 tracking-tight">Selesaikan Pembayaran</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-5 rounded-[1.5rem] space-y-3 border border-slate-100">
                            <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                                <span>Tagihan</span>
                                <span>{formatRupiah(total)}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-600">Kembalian</span>
                                <span className={`text-xl font-black ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                    {formatRupiah(change < 0 ? 0 : change)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Uang Diterima</p>
                            <div className="text-3xl font-black text-slate-900 bg-slate-100 p-5 rounded-2xl text-right min-h-[80px] flex items-center justify-end shadow-inner border border-slate-200">
                                {paymentAmount ? formatRupiah(Number(paymentAmount)) : "Rp 0"}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00"].map((num) => (
                                <Button key={num} variant="outline" className="h-14 text-xl font-black rounded-2xl hover:bg-slate-900 hover:text-white border-slate-200 transition-all active:scale-90" onClick={() => handleNumpadClick(num)}>{num}</Button>
                            ))}
                            <Button variant="destructive" className="h-14 rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border-none transition-all active:scale-90" onClick={handleClearPayment}><Trash2 className="h-6 w-6" /></Button>
                        </div>
                    </div>

                    <DialogFooter className="sm:flex-col gap-3">
                        <Button
                            disabled={change < 0 || total === 0 || isSubmitting}
                            className="w-full h-16 text-lg font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
                            onClick={processPayment}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                            Bayar Sekarang
                        </Button>
                        <Button variant="ghost" className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest" onClick={() => setIsCheckoutOpen(false)}>Batal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SUCCESS DIALOG (NOTIFIKASI BERHASIL) */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-8 text-center outline-none">
                    <div className="flex justify-center mb-4">
                        <div className="bg-emerald-100 p-4 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                        </div>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-800">Pembayaran Berhasil!</DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-xs text-slate-500 font-medium mb-1">Kembalian Anda</p>
                            <p className="text-3xl font-black text-emerald-600">{formatRupiah(lastTransaction?.change || 0)}</p>
                        </div>

                        <div className="text-left text-sm text-slate-500 space-y-2 px-2">
                            <div className="flex justify-between">
                                <span>No. Transaksi</span>
                                <span className="font-bold text-slate-700 font-mono text-[11px]">{lastTransaction?.uuid.split('-')[0].toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Item</span>
                                <span className="font-bold text-slate-700">{lastTransaction?.totalQty} pcs</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:flex-col gap-3 mt-8">
                        <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold" onClick={() => setIsSuccessOpen(false)}>
                            Transaksi Baru
                        </Button>
                        <Button onClick={() => handlePrint()} variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold">
                            <Printer className="h-4 w-4 mr-2" /> Cetak Struk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MOBILE FLOATING BAR (Hanya muncul jika mobile & keranjang ada isinya) */}
            {!isMobileCartOpen && cart.length > 0 && (
                <div className="lg:hidden fixed bottom-4 left-4 right-4 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl z-40 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="relative bg-white/10 p-2 rounded-xl">
                            <ShoppingCart className="h-5 w-5 text-white" />
                            <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">{cart.length}</span>
                        </div>
                        <div><p className="text-lg font-black leading-none">{formatRupiah(total)}</p></div>
                    </div>
                    <Button onClick={() => setIsMobileCartOpen(true)} className="bg-white text-slate-900 px-6 rounded-xl font-bold shadow-md h-12">Bayar</Button>
                </div>
            )}
        </div>
    );
};

export default CashierPage;