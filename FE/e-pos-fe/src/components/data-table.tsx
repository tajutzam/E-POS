import React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface DataTableColumn {
    key: string
    label: string
    className?: string
    render?: (value: any, row: any, index: number) => React.ReactNode
}

interface DataTableProps {
    columns: DataTableColumn[]
    data: any[]
    searchKey: string
    totalElements: number
    pageSize: number
    currentPage: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
    onSearch?: (value: string) => void
    isLoading?: boolean
}

export function DataTable({
    columns,
    data,
    searchKey,
    totalElements,
    pageSize,
    currentPage,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading = false,
}: DataTableProps) {
    const totalPages = Math.ceil(totalElements / pageSize)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
               

                {onPageSizeChange && (
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span>Tampilkan</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange?.(Number(value))}
                        >
                            <SelectTrigger className="h-10 w-[70px] border-slate-200 focus:ring-slate-400">
                                <SelectValue placeholder={pageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-200">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(
                                        "h-12 px-4 text-xs font-bold uppercase tracking-wider text-slate-500",
                                        col.className
                                    )}
                                >
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                                        <p className="text-sm font-medium text-slate-500 italic">Sedang menyinkronkan data...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className="hover:bg-slate-50/80 transition-all border-slate-100 last:border-0"
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className="py-4 px-4 text-sm text-slate-700 font-medium">
                                            {col.render
                                                ? col.render(row[col.key], row, rowIndex + (currentPage * pageSize))
                                                : (row[col.key] ?? "-")}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                                        <Search className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-base font-medium">Data Kosong</p>
                                        <p className="text-sm italic">Tidak ada informasi yang dapat ditampilkan.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-sm text-slate-500">
                        Menampilkan <span className="font-semibold text-slate-900">{data.length}</span> dari{" "}
                        <span className="font-semibold text-slate-900">{totalElements}</span> baris
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 0 || isLoading}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {/* Simple Page Indicator */}
                            <div className="flex items-center justify-center h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-sm">
                                {currentPage + 1}
                            </div>
                            <div className="flex items-center justify-center h-9 px-3 text-slate-400 text-xs font-medium">
                                dari {totalPages}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage + 1 >= totalPages || isLoading}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}