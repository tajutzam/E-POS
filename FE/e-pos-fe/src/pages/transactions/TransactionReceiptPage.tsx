import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TransactionService } from "@/services/TransactionService";
import { formatRupiah } from "@/utils/helper";
import { displayError } from "@/utils/errorHandler";

const TransactionReceiptPage: React.FC = () => {
    const { uuid } = useParams();
    const [data, setData] = useState<any>(null);
    const [printed, setPrinted] = useState(false);

    useEffect(() => {
        fetchTransaction();
    }, []);

    useEffect(() => {
        if (data && !printed) {
            setPrinted(true);
            setTimeout(() => {
                window.print();
            }, 300);
        }
    }, [data, printed]);

    const fetchTransaction = async () => {
        try {
            const res = await TransactionService.getByUuid(uuid!);
            setData(res.data);
        } catch (error) {
            displayError(error);
        }
    };

    if (!data) return null;

    const totalPaid = data.totalAmount - data.totalReturn;

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center py-6 print:bg-white">
            <div className="w-full max-w-xs bg-white p-4 text-xs print:p-0 print:shadow-none">

                <div className="text-center mb-3">
                    <h1 className="font-bold text-sm tracking-wide">
                        POS RECEIPT
                    </h1>
                    <p className="text-[10px] text-slate-500">
                        Transaction Proof
                    </p>
                </div>

                <div className="space-y-1 mb-2">
                    <div className="flex justify-between">
                        <span>ID</span>
                        <span className="font-mono">{data.uuid}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date</span>
                        <span>
                            {new Date(data.createdAt).toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-semibold">
                            {data.status}
                        </span>
                    </div>
                </div>

                <hr className="border-dashed my-2" />

                <div className="space-y-2">
                    {data.details.map((item: any, idx: number) => (
                        <div key={idx}>
                            <p className="font-medium truncate">
                                {item.productName}
                            </p>
                            <div className="flex justify-between font-mono text-[11px]">
                                <span>
                                    {item.qty} x {formatRupiah(item.price)}
                                </span>
                                <span>
                                    {formatRupiah(item.subtotal)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="border-dashed my-2" />

                <div className="space-y-1 font-mono">


                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatRupiah(data.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between font-bold">
                        <span>Paid</span>
                        <span>{formatRupiah(totalPaid)}</span>
                    </div>

                    {data.totalReturn !== undefined && (
                        <div className="flex justify-between">
                            <span>Change</span>
                            <span>{formatRupiah(data.totalReturn)}</span>
                        </div>
                    )}
                </div>

                <hr className="border-dashed my-2" />

                <div className="text-center text-[10px] text-slate-500">
                    <p>Thank you</p>
                    <p>POS System</p>
                </div>
            </div>
        </div>
    );
};

export default TransactionReceiptPage;
