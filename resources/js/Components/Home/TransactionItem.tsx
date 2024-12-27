/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from "@emotion/react"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
    Type,
  } from 'react-swipeable-list';
  import 'react-swipeable-list/dist/styles.css';


interface TransactionItemProps {
    item: SbiTransaction;
    handleToggleBudget: (id: string, isRegisteredToBudget: boolean) => void;
}


interface SbiTransaction {
    id: string;
    approval_number: string;
    transaction_date: string;
    merchant_name: string | null;
    currency: string;
    amount: number;
    memo: string;
    is_registered_to_budget: boolean;
    is_confirmed: boolean;
}

const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => console.info('swipe action triggered')}>
        Action name
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = (id : string, is_registered_to_budget : boolean, handleToggleBudget : (id: string, isRegisteredToBudget: boolean) => void) => (
    <div style={{
        // width: '50px',
        display: 'flex', flexDirection: 'row' }}>
        <TrailingActions>
        <SwipeAction
            onClick={() => {
                console.log("toggle")
                handleToggleBudget(id, is_registered_to_budget)
            }}
        >
            <div css={itemCss}>
                <BookmarkAddIcon
                    style={{
                        fontSize: "40px",
                        color: "#333"
                    }}
                />
                <p style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-all",
                    whiteSpace: "nowrap",

                }}>家計簿</p><p>追加</p>
            </div>
        </SwipeAction>
        </TrailingActions>
    </div>
  );


const TransactionItem: React.FC<TransactionItemProps> = ({ item, handleToggleBudget}) => {
    return (
        <SwipeableList
            fullSwipe={true}
            threshold={0.4}
            type={Type.IOS}
        >
            <SwipeableListItem
                leadingActions={leadingActions()}
                trailingActions={trailingActions(item.id, item.is_registered_to_budget,handleToggleBudget)}
            >
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
            </SwipeableListItem>
        </SwipeableList>
    );
};


const wapper = css`
    margin: 0 0;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    width: 100%;

`;
const merchantCss = css`
    font-size: 20px;
`;

const itemCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #b8ffb2;
    p {
        font-size: 12px;
    }
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


const toggleBudget = (id: string, is_registered_to_budget : boolean) => {
    console.log(id);
    // josonで/api/toggleRegisterToBudget にpost
    fetch('/api/toggleRegisterToBudget', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            is_registered_to_budget: !is_registered_to_budget,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            // 成功したらリロード
            location.reload();
        }
    })
}

export default TransactionItem;
