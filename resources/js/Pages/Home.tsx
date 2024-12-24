/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import BalanceInfo from "@/Components/Home/BlanceInfo";
import TransactionItem from "@/Components/Home/TransactionItem";


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

interface HomeProps {
    sbi_transactions: SbiTransaction[];
    remaining_balance: number;
    balance: number;
}



const Home: React.FC<HomeProps> = ({ sbi_transactions,remaining_balance,balance }) => {
    return (
        <div css={wapper}>
            <h1>SBI 履歴</h1>
            <BalanceInfo remaining_balance={remaining_balance} />
            <ul style={{
                marginTop: "20px",

            }}>
                {sbi_transactions.map((item) => (
                    <>
                        <TransactionItem item={item} />

                    </>
                ))}
            </ul>
        </div>
    );
}

const wapper = css`

`;

export default Home;
