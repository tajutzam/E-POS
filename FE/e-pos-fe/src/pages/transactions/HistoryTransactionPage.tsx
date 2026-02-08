import React, { useEffect, useState, useCallback } from "react";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { TransactionService } from "@/services/TransactionService";
import { displayError } from "@/utils/errorHandler";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/helper";
import { Printer, Trash2, CalendarIcon } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

/* shadcn */
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const HistoryTransactionPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("createdAt,desc");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const [meta, setMeta] = useState({
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
    });

    const fetchTransactions = useCallback(
        async (page: number, size: number) => {
            try {
                setIsLoading(true);

                const res = await TransactionService.getAll(
                    page,
                    size,
                    search || undefined,
                    sort,
                    dateRange?.from
                        ? format(dateRange.from, "yyyy-MM-dd")
                        : undefined,
                    dateRange?.to
                        ? format(dateRange.to, "yyyy-MM-dd")
                        : undefined
                );

                setData(res.data.content);
                setMeta({
                    totalElements: res.data.totalElements,
                    totalPages: res.data.totalPages,
                    pageNumber: res.data.number,
                    pageSize: res.data.size,
                });
            } catch (error) {
                displayError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [search, sort, dateRange]
    );

    useEffect(() => {
        fetchTransactions(0, meta.pageSize);
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchTransactions(0, meta.pageSize);
        }, 400);

        return () => clearTimeout(delay);
    }, [search, sort, dateRange]);

    const handlePageSizeChange = (newSize: number) => {
        setMeta((prev) => ({ ...prev, pageSize: newSize }));
        fetchTransactions(0, newSize);
    };

    const handlePrint = (row: any) => {
        window.open(`/transactions/${row.uuid}/receipt`, "_blank");
    };

    const handleDelete = async (uuid: string) => {
        const result = await Swal.fire({
            title: "Delete transaction?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const response = await TransactionService.delete(uuid);
                toast.success(response.message);
                fetchTransactions(meta.pageNumber, meta.pageSize);
            } catch (error) {
                displayError(error);
            }
        }
    };

    const columns: DataTableColumn[] = [
        {
            key: "id",
            label: "No",
            render: (_, __, index) =>
                index + 1 + meta.pageNumber * meta.pageSize,
        },
        {
            key: "uuid",
            label: "Transaction ID",
            render: (val) => (
                <span className="font-mono text-xs">{val}</span>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (val) =>
                new Date(val).toLocaleString("id-ID"),
        },
        {
            key: "totalQty",
            label: "Qty",
        },
        {
            key: "totalAmount",
            label: "Total",
            render: (val) => formatRupiah(val),
        },
        {
            key: "status",
            label: "Status",
            render: (val) => (
                <Badge
                    variant="outline"
                    className={
                        val === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600"
                    }
                >
                    {val}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handlePrint(row)}>
                        <Printer size={16} />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(row.uuid)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">

            {/* ===== FILTER BAR (AMAN DARI TABLE) ===== */}
            <div className="relative z-50 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                    <p className="text-sm text-muted-foreground">
                        List of all cashier transactions
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* DATE RANGE */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start text-left w-[220px]"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from
                                    ? dateRange.to
                                        ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
                                            dateRange.to,
                                            "dd/MM/yyyy"
                                        )}`
                                        : format(dateRange.from, "dd/MM/yyyy")
                                    : "Select date range"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            align="start"
                            className="p-0 bg-white shadow-lg border rounded-md z-50"
                        >
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="bg-white"
                                classNames={{
                                    months: "bg-white",
                                }}
                            />

                        </PopoverContent>
                    </Popover>

                    <Input
                        placeholder="Search UUID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60"
                    />

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt,desc">Latest</SelectItem>
                            <SelectItem value="createdAt,asc">Oldest</SelectItem>
                            <SelectItem value="totalAmount,desc">Highest Total</SelectItem>
                            <SelectItem value="totalAmount,asc">Lowest Total</SelectItem>
                            <SelectItem value="totalQty,desc">Highest Qty</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="relative z-10">
                <DataTable
                    columns={columns}
                    data={data}
                    totalElements={meta.totalElements}
                    pageSize={meta.pageSize}
                    currentPage={meta.pageNumber}
                    isLoading={isLoading}
                    onPageChange={(page) =>
                        fetchTransactions(page, meta.pageSize)
                    }
                    onPageSizeChange={handlePageSizeChange}
                    searchKey=""
                />
            </div>
        </div>
    );
};

export default HistoryTransactionPage;
