import React, { useEffect, useState } from "react";

interface getData {
    current_balance: number;
    status: string;
    transaction: Transaction;
}

interface Transaction {
    id: number;
    user_id: number;
    budget_id: number;
    is_manual: boolean;
    approval_number: string;
    transaction_date: string;
    merchant_name: string;
    currency: string;
    amount: number;
    memo: string;
    is_registered_to_budget: boolean;
    is_confirmed: boolean;
    created_at: string;
    updated_at: string;
}

export default function Detail() {
    // リンクからIDを取得
    const id = window.location.pathname.split("/").pop();

    const [data, setData] = useState<Transaction | null>(null);

    useEffect(() => {
        // 仮でIDを1として取得
        // const id = 1;
        fetch(`/api/transactions/${id}`)
            .then((res) => res.json())
            .then((json: getData) =>
                setData(json.transaction))
            .catch(console.error);
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <>
                <p>ID: {data.id}</p>
                <p>User ID: {data.user_id}</p>
                <p>Budget ID: {data.budget_id}</p>
                <p>Is manual: {data.is_manual ? "Yes" : "No"}</p>
                <p>Approval number: {data.approval_number}</p>
                <p>Transaction date: {data.transaction_date}</p>
                <p>Merchant name: {data.merchant_name}</p>
                <p>Currency: {data.currency}</p>
                <p>Amount: {data.amount}</p>
                <p>Memo: {data.memo}</p>
                <p>Is registered: {data.is_registered_to_budget ? "Yes" : "No"}</p>
                <p>Is confirmed: {data.is_confirmed ? "Yes" : "No"}</p>
                <p>Created at: {data.created_at}</p>
                <p>Updated at: {data.updated_at}</p>
            </>
        </div>
    );
}
