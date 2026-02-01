import React, { useEffect, useState, useCallback } from "react"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { CategoryService } from "@/services/CategoryService"
import { displayError } from "@/utils/errorHandler"
import moment from "moment-timezone"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

const CategoryPage: React.FC = () => {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()
    const [meta, setMeta] = useState({
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10 // Default size
    })

    const fetchCategories = useCallback(async (page: number, currentSize: number) => {
        try {
            setIsLoading(true)
            const response = await CategoryService.getAll(page, currentSize)
            setData(response.content)
            setMeta({
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                pageNumber: response.number,
                pageSize: response.size
            })
        } catch (error) {
            displayError(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories(0, meta.pageSize)
    }, [fetchCategories])

    const handlePageSizeChange = (newSize: number) => {
        setMeta(prev => ({ ...prev, pageSize: newSize }))
        fetchCategories(0, newSize)
    }

    const handleDelete = async (uuid: string, name: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Category "${name}" will be permanently deleted!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6B7280',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await CategoryService.delete(uuid);
                toast.success("Category deleted successfully");
                fetchCategories(meta.pageNumber, meta.pageSize);
            } catch (error) {
                displayError(error);
            }
        }
    };

    const columns: DataTableColumn[] = [
        {
            key: "id",
            label: "No",
            render: (_, __, index) => index + 1
        },
        {
            key: "image",
            label: "Photo",
            render: (val) => (
                <img
                    src={`${import.meta.env.VITE_IMAGE_URL}/categories/${val}`}
                    alt="Category"
                    className="w-10 h-10 rounded-lg object-cover border bg-muted"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Img")}
                />
            )
        },
        { key: "name", label: "Category Name" },
        {
            key: "createdAt",
            label: "Created At",
            render: (val) => val ? moment.parseZone(val).format("YYYY-MM-DD HH:mm:ss") : "-"
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/data/categories/edit/${row.uuid}`)}
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
            )
        }
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Category List</h1>
                    <p className="text-sm text-muted-foreground">Manage your cashier product categories</p>
                </div>
                <Button asChild className="bg-gray-500 hover:bg-gray-600 text-white shadow-sm">
                    <Link to="/data/categories/create">+ Add Category</Link>
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
                onPageChange={(newPage: number) => fetchCategories(newPage, meta.pageSize)}
                onPageSizeChange={handlePageSizeChange}
                onSearch={(val: any) => console.log("Searching:", val)}
            />
        </div>
    )
}

export default CategoryPage