/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from "@emotion/react"

interface BalanceInfoProps {
    current_balance: number;
}



const BalanceInfo: React.FC<BalanceInfoProps> = ({ current_balance }) => {

    // apiから取得する

    return (
        <div css={wapper}>
            <h2>残り残高</h2>
            <p css={currentBalanceCss}>{amountFormat(current_balance)}円</p>
            {/* ProgressBarを表示 */}

            <div css={spendingWrapper}>
                <span>1ヶ月</span>
                <div css={spendingContainer}>
                    <span css={spendingAmountCss}>¥4,500</span>
                    <span css={goalAmountCss}>¥30,000</span>
                </div>

                <div css={progressBarContainer}>
                    <span css={progressBarInfo}>50%</span>
                    <ProgressBar value={(4900 / 5000) * 100} />
                    <span css={progressBarInfo}>残り¥5,000</span>
                </div>

            </div>


        </div>
    );
};
const spendingWrapper = css`
    display: flex;
    width: 80%;
    @media (max-width: 768px) {
        width: 90%;
    }
    margin: 0 auto;
    align-items: center;
`;

const progressBarWrapper = css`
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 5px;
`;

const spendingContainer = css`
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
`;
const spendingAmountCss = css`
    font-size: 24px;
`;

const goalAmountCss = css`
    font-size: 14px;
    color: #333;
    margin-top: 5px;
`;

const progressBarContainer = css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div css={progressBarWrapper}>
        <div css={progressBarFill(value)}></div>
    </div>
);

const progressBarFill = (value: number) => css`
    width: ${value}%;
    height: 100%;
    background-color: ${value > 100 ? "#ff6b6b" : "#4caf50"};
    transition: width 0.3s ease;
`;

const progressBarInfo = css`
    text-align: center;
`;
const wapper = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const currentBalanceCss = css`
    font-size: 24px;
    margin: 10px;
    color: #333;
`;


const amountFormat = (current_balance: number): string => {

    return Math.floor(current_balance).toLocaleString();
}

export default BalanceInfo;
