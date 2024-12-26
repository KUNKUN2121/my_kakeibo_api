/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from "@emotion/react"

interface BalanceInfoProps {
    current_balance: number;
}


const BalanceInfo: React.FC<BalanceInfoProps> = ({ current_balance }) => {
    return (
        <div css={wapper}>
            <h2>残り残高</h2>
            <p>{current_balance}円</p>
            一日あたり
            100円/1000円
            一週間あたり
            一ヶ月あたり
        </div>
    );
};


const wapper = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default BalanceInfo;
