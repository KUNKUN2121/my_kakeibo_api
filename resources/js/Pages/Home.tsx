/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import BalanceInfo from "@/Components/Home/BlanceInfo";
import TransactionItem from "@/Components/Home/TransactionItem";
import { useEffect, useState } from "react";


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



const Home: React.FC<HomeProps> = ({}) => {
    const [sbiTransactions, setSbiTransactions] = useState<SbiTransaction[]>([]);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    // データ取得用関数
    const fetchTransactions = async () => {
        try {
            const response = await fetch("/api/transactions"); // APIのURLを適切に設定
            if (response.ok) {
                const data = await response.json();
                setSbiTransactions(data.transactions); // 適切なキーに合わせて変更
                setCurrentBalance(data.current_balance);
            } else {
                console.error("Failed to fetch transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // 初回レンダリング時にデータを取得
    useEffect(() => {
        fetchTransactions();
    }, []);

    // トグル処理
    const handleToggleBudget = async (id: string, isRegisteredToBudget: boolean) => {
        try {
            const response = await fetch("/api/toggleRegisterToBudget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    is_registered_to_budget: !isRegisteredToBudget,
                }),
            });

            if (response.ok) {
                // 成功時にデータを再取得
                fetchTransactions();
            } else {
                console.error("Failed to toggle budget registration");
            }
        } catch (error) {
            console.error("Error toggling budget registration:", error);
        }
    };




    return (
        <div css={wapper}>
            <h1>SBI 履歴</h1>
            <BalanceInfo current_balance={currentBalance}/>
            <ul style={{
                marginTop: "20px",

            }}>
                {sbiTransactions.map((item) => (
                    <>
                        <TransactionItem item={item} handleToggleBudget={handleToggleBudget} />

                    </>
                ))}
            </ul>
        </div>
    );
}

const wapper = css`

`;

export default Home;
