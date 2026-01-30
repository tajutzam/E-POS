import React, { useState } from "react"
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { Download, Search } from "lucide-react"

export interface DataTableColumn {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
    columns: DataTableColumn[]
    data: any[]
    searchKey: string
    exportFileName?: string
    itemsPerPage?: number
}

export function DataTable({
    columns,
    data,
    searchKey,
    exportFileName = "data-export",
    itemsPerPage = 5
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const filteredData = data.filter((item) => {
        const valueToSearch = item[searchKey]?.toString().toLowerCase() || ""
        return valueToSearch.includes(searchTerm.toLowerCase())
    })

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    const exportToCSV = () => {
        const headers = columns.map(c => c.label).join(",")

        const rows = filteredData.map(item =>
            columns.map(c => {
                const val = item[c.key]
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
            }).join(",")
        )

        const csvContent = [headers, ...rows].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${exportFileName}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-4">
            {/* Tool Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={`Search by ${searchKey}...`}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1) // Reset ke halaman 1 saat mengetik
                        }}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={exportToCSV}
                    className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key} className="font-semibold py-4 text-dark">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="hover:bg-muted/30 transition-colors">
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className="py-3">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    No results found for "{searchTerm}".
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between py-2 px-1">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                    </p>

                    <Pagination className="justify-end w-auto mx-0">
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="h-8 w-20"
                                >
                                    Previous
                                </Button>
                            </PaginationItem>

                            <div className="flex items-center justify-center text-sm font-medium px-4 h-8 border rounded-md bg-muted/20">
                                {currentPage} / {totalPages}
                            </div>

                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="h-8 w-20"
                                >
                                    Next
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}