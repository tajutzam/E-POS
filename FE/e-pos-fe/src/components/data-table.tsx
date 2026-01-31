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
import { Search, Download, Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface DataTableColumn {
    key: string
    label: string
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
    onPageSizeChange?: (size: number) => void // Prop baru
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
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={`Cari berdasarkan ${searchKey}...`}
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key} className="font-semibold py-4 text-dark text-nowrap">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Memuat data...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="hover:bg-muted/30 transition-colors">
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className="py-3">
                                            {col.render
                                                ? col.render(row[col.key], row, rowIndex + (currentPage * pageSize))
                                                : row[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    Tidak ada data ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            Total <span className="font-medium">{totalElements}</span> data
                        </p>

                        {/* Page Size Filter */}
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Baris:</p>
                            <Select
                                value={pageSize.toString()}
                                onValueChange={(value) => onPageSizeChange?.(Number(value))}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
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
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 0 || isLoading}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="h-8 w-20"
                        >
                            Previous
                        </Button>

                        <div className="flex items-center justify-center text-sm font-medium px-4 h-8 border rounded-md bg-muted/20">
                            {currentPage + 1} / {totalPages}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage + 1 >= totalPages || isLoading}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="h-8 w-20"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}