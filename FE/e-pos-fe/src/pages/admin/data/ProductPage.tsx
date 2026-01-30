import { DataTable, type DataTableColumn } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Barcode from "react-barcode";

const productColumns: DataTableColumn[] = [
    {
        key: "image",
        label: "Product",
        render: (value, row) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-lg border shadow-sm">
                    <AvatarImage src={value} alt={row.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                        {row.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-none">{row.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">ID: #{row.id}</span>
                </div>
            </div>
        ),
    },
    {
        key: "barcode_data",
        label: "Barcode",
        render: (value) => (
            <div className="flex flex-col items-center bg-white p-1 rounded w-fit">
                <Barcode
                    value={value || "000000"}
                    height={30}
                    width={1.2}
                    fontSize={10}
                    background="transparent"
                />
            </div>
        ),
    },
    {
        key: "category",
        label: "Category",
        render: (value) => (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                {value}
            </Badge>
        ),
    },
    {
        key: "price",
        label: "Price",
        render: (value: number) => (
            <span className="font-mono font-medium">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                }).format(value)}
            </span>
        ),
    },
    {
        key: "stock",
        label: "Stock",
        render: (value: number) => (
            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${value < 10 ? "text-destructive" : "text-emerald-600"}`}>
                    {value}
                </span>
                <span className="text-xs text-muted-foreground text-opacity-50 font-normal">pcs</span>
            </div>
        ),
    },
];

const products = [
    {
        id: 1,
        name: "Kopi Gula Aren",
        category: "Coffee",
        price: 22000,
        stock: 45,
        image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=100&h=100&fit=crop",
        barcode_data: "899123456701",
    },
    {
        id: 2,
        name: "Matcha Latte",
        category: "Non-Coffee",
        price: 28000,
        stock: 8,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=100&h=100&fit=crop",
        barcode_data: "899123456702",
    },
    {
        id: 3,
        name: "Croissant Almond",
        category: "Pastry",
        price: 35000,
        stock: 12,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop",
        barcode_data: "899123456703",
    },
    {
        id: 4,
        name: "Tuna Puff",
        category: "Pastry",
        price: 32000,
        stock: 5,
        image: "https://images.unsplash.com/photo-1626078299034-7467faaf7793?w=100&h=100&fit=crop",
        barcode_data: "899123456704",
    },
];

const ProductPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">

                <Button className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add New Product
                </Button>
            </div>

            <DataTable
                columns={productColumns}
                data={products}
                searchKey="name"
                exportFileName="inventory-report"
                itemsPerPage={5}
            />
        </div>
    );
};

export default ProductPage;