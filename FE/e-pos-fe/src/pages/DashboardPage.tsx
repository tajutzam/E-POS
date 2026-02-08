import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    TrendingUp,
    Package,
    DollarSign,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardService } from "@/services/DashboardService";
import { formatRupiah } from "@/utils/helper";

const DashboardPage = () => {

    const [data, setData] = useState({
        orders: 0,
        totalProduct: 0,
        totalRevenue: 0,
        productLowStock: 0
    })


    const stats = [
        {
            title: "Total Revenue",
            value: formatRupiah(data.totalRevenue),
            icon: DollarSign,
            desc: "From all transactions",
            trend: "up"
        },
        {
            title: "Orders",
            value: data.orders.toLocaleString("id-ID"),
            icon: ShoppingCart,
            desc: "Total orders",
            trend: "up"
        },
        {
            title: "Products",
            value: data.totalProduct.toString(),
            icon: Package,
            desc: "Available products",
            trend: "down"
        }
    ];



    const fetchData = async () => {
        try {
            const response = await DashboardService.getData();

            if (response.success && response.data) {
                setData({
                    orders: response.data.orders,
                    totalProduct: response.data.totalProduct,
                    totalRevenue: response.data.totalRevenue,
                    productLowStock: response.data.productLowStock
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };



    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 italic text-sm">Welcome back! Here's what's happening with your store today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-rose-500" />
                                )}
                                <p className={`text-[11px] font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                                    {stat.desc}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Transactions Section */}
                <Card className="col-span-4 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <CardDescription>You made 265 sales this month.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 border-slate-200 text-xs font-bold uppercase">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                                            TR
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold leading-none">Customer #00{i + 12}</p>
                                            <p className="text-xs text-muted-foreground italic">12 Feb 2026, 14:24</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-bold text-slate-900">+Rp 150.000</p>
                                        <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-100">Success</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Inventory Status</CardTitle>
                        <CardDescription>Quick overview of your stock levels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-amber-500" />
                                <span className="text-sm font-medium">Low Stock Items</span>
                            </div>
                            <span className="text-sm font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">{data.productLowStock}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium">Top Category</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">Food & Beverages</span>
                        </div>
                        <div className="pt-2">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs h-10">
                                Open POS System
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;