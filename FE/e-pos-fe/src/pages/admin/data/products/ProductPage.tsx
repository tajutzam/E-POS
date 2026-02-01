import React, { useEffect, useState, useCallback } from "react";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { ProductService } from "@/services/ProductService";
import { displayError } from "@/utils/errorHandler";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Barcode from "react-barcode";
import { Badge } from "@/components/ui/badge";

const ProductPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const [meta, setMeta] = useState({
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
    });

    const fetchProducts = useCallback(async (page: number, currentSize: number) => {
        try {
            setIsLoading(true);
            const response = await ProductService.getAll(page, currentSize);
            setData(response.content);
            setMeta({
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                pageNumber: response.number,
                pageSize: response.size,
            });
        } catch (error) {
            displayError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(0, meta.pageSize);
    }, [fetchProducts]);

    const handlePageSizeChange = (newSize: number) => {
        setMeta((prev) => ({ ...prev, pageSize: newSize }));
        fetchProducts(0, newSize);
    };

    const handleDelete = async (uuid: string, name: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Product "${name}" will be permanently deleted!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6B7280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await ProductService.delete(uuid);
                toast.success("Product deleted successfully");
                fetchProducts(meta.pageNumber, meta.pageSize);
            } catch (error) {
                displayError(error);
            }
        }
    };

    const columns: DataTableColumn[] = [
        {
            key: "id",
            label: "No",
            render: (_, __, index) => index + 1 + meta.pageNumber * meta.pageSize,
        },
        {
            key: "image",
            label: "Photo",
            render: (val) => (
                <img
                    src={`${import.meta.env.VITE_IMAGE_URL}/products/${val}`}
                    alt="Product"
                    className="w-12 h-12 rounded-lg object-cover border bg-muted"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Img")}
                />
            ),
        },
        {
            key: "name",
            label: "Product Info",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-dark">{val}</span>
                    <span className="text-xs text-muted-foreground italic">{row.uuid.substring(0, 8)}...</span>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (val) => <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{val?.name || "-"}</Badge>,
        },
        {
            key: "price",
            label: "Price",
            render: (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val),
        },
        {
            key: "stock",
            label: "Stock",
            render: (val) => (
                <span className={`font-medium ${val < 10 ? "text-red-500" : "text-green-600"}`}>
                    {val} pcs
                </span>
            ),
        },
        {
            key: "uuid",
            label: "Barcode",
            render: (val) => (
                <div className="scale-75 -ml-6">
                    <Barcode value={val.substring(0, 12)} width={1} height={30} fontSize={12} />
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/data/products/edit/${row.uuid}`)}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.uuid, row.name)}
                        className="cursor-pointer text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Product List</h1>
                    <p className="text-sm text-muted-foreground">Manage your cashier products and inventory</p>
                </div>
                <Button asChild className="bg-gray-500 hover:bg-gray-600 text-white shadow-sm">
                    <Link to="/data/products/create">+ Add Product</Link>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
                totalElements={meta.totalElements}
                pageSize={meta.pageSize}
                currentPage={meta.pageNumber}
                isLoading={isLoading}
                onPageChange={(newPage: number) => fetchProducts(newPage, meta.pageSize)}
                onPageSizeChange={handlePageSizeChange}
                onSearch={(val: any) => console.log("Searching:", val)}
            />
        </div>
    );
};

export default ProductPage;