/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
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
        <div css={wapper}>
            <span>{data.is_confirmed ? "確定" : "未確定"}</span>
            <span css={timeCss}>{dateFormat(data.transaction_date)}</span>

            <span css={storeCss}>{data.merchant_name != null ? data.merchant_name : "未登録"}</span>
            <span css={amountCss}>{amountFormat(data.amount)} 円</span>
            <span>{data.memo}</span>
            <span>{data.is_registered_to_budget ? "家計簿に登録済み" : "家計簿に未登録"}</span>
        </div>
    );
}

const wapper = css`
    margin: 16px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;

`;

const timeCss = css`

`;

const storeCss = css`
    margin-top: 24px;
    font-size: 24px;
`;
const amountCss = css`
    margin-top: 8px;
    font-size: 40px;
`;

const dateFormat = (date: string): string => {
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return `${year}年${month}月${day}日 - ` + timeFormat(date);
}

// 時間の変換
const timeFormat = (date: string): string => {
    const hour = date.slice(11, 13);
    const minute = date.slice(14, 16);
    return `${hour}時${minute}分`;
}

const amountFormat = (amount: number): string => {
    const amountStr = amount.toString().split(".")[0];
    const amountLength = amountStr.length;
    let result = "";
    for (let i = 0; i < amountLength; i++) {
        result += amountStr[i];
        if ((amountLength - i - 1) % 3 === 0 && i !== amountLength - 1) {
            result += ",";
        }
    }
    return result;
}

