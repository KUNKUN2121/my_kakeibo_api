/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from "@emotion/react"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import UndoIcon from '@mui/icons-material/Undo';
import GroupsIcon from '@mui/icons-material/Groups';

import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
    Type,
  } from 'react-swipeable-list';
  import 'react-swipeable-list/dist/styles.css';
import { DeleteOutline } from '@mui/icons-material';


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

        <TrailingActions>
        <SwipeAction
            onClick={() => {
                console.log("toggle")
                handleToggleBudget(id, is_registered_to_budget)
            }}
        >
            <div css={actionContent} style={{ backgroundColor: "#ba772b"}}>
                <GroupsIcon />
            </div>
        </SwipeAction>
        {/* 222222 */}
        <SwipeAction
            onClick={() => {
                console.log("toggle")
                handleToggleBudget(id, is_registered_to_budget)
            }}
        >
            {is_registered_to_budget == true ? (
                // 家計簿に登録しない
                <div css={actionContent} style={{
                    backgroundColor: "#f44336",
                    }}>
                    <div css={itemColumnCentered}>
                        <DeleteOutline />
                    </div>
                </div>
            ) : (
                <div css={actionContent} style={{
                    backgroundColor: "#4caf50",
                    }}>
                    <div css={itemColumnCentered}>
                        <UndoIcon />
                    </div>
                </div>

            )}

        </SwipeAction>
        </TrailingActions>

  );
  const handleItemClick = (item: SbiTransaction) => {
    window.location.href = `/home/${item.id}`;
};

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
                onClick={() => handleItemClick(item)}
            >
                <div key={item.approval_number} css={wapper} style={{
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




                </div>
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

const actionContent = css`
    height: 100%;
    display: flex;
    align-items: center;
    padding: 8px;
    font-size: 12px;
    font-weight: 500;
    box-sizing: border-box;
    color: #eee;
    user-select: none;
`;


const itemColumnCentered = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
