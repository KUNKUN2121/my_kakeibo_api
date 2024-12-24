import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"


interface TransactionItemProps {
    item: SbiTransaction;
}


interface SbiTransaction {
    approval_number: string;
    transaction_date: string;
    merchant_name: string | null;
    currency: string;
    amount: number;
    memo: string;
    is_registered_to_budget: boolean;
    is_confirmed: boolean;
}


const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
    return (
        <li key={item.approval_number} css={wapper} style={{
            backgroundColor: item.is_registered_to_budget == false ? "#cdcdcd98" : "#fff",
            color: item.is_registered_to_budget == false ? "#676767" : "#333",

        }}>
            {/* {item.is_confirmed == true ? "📭確定📭" : "未確定"}<br /> */}
            <p>{dateFormat(item.transaction_date)} {
            item.is_confirmed == true ? " [確定]" : ""}</p>
            <div css={container}>
                <span css={merchantCss}>{getMerchantName(item.merchant_name)}</span>
                <span css={priceCss} style={{
                    color: item.amount < 0 ? "red" : "black",
                }}>{amountFormat(item.amount, item.currency)}<span css={currencyCss}>{item.currency == "JPY" ? "円" : item.currency}</span></span>
            </div>
            <span css={memoCss}>{item.memo}</span>

        </li>
    );
};


const wapper = css`
    margin: 0 0;
    padding: 10px;
    border-bottom: 1px solid #ccc;

`;
const merchantCss = css`
    font-size: 20px;
`;

const container = css`
    display: flex;
    justify-content: space-between;
    padding-top: 14px;
`;

const priceCss = css`
    font-size: 24px;
`;

const currencyCss = css`
    font-size: 14px;
    margin-left: 5px;
    color: #333;
`;

const memoCss = css`
    font-size: 12px;
    color: #666;
    padding-top: 10px;
`;



const getMerchantName = (merchant_name: string | null): string => {
    if (merchant_name === null || merchant_name === "Japan Bridge Center") {
        return " ";
    }
    return merchant_name;
}

const dateFormat = (date: string): string => {
    const dateObj = new Date(date);
    return  (dateObj.getMonth() + 1) + "月" + dateObj.getDate() + "日 " + dateObj.getHours() + "時" + dateObj.getMinutes() + "分";
}

// .00になるので 小数点以下切り捨てる
const amountFormat = (amount: number, currency:string): string => {

    return Math.floor(amount).toLocaleString();
}

export default TransactionItem;
