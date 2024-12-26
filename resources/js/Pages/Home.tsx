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
    current_balance: number;
}



const Home: React.FC<HomeProps> = ({ sbi_transactions,current_balance }) => {
    return (
        <div css={wapper}>
            <h1>SBI 履歴</h1>
            <BalanceInfo current_balance={current_balance}/>
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
