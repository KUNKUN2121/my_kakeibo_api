/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import BalanceInfo from "@/Components/Home/BlanceInfo";
import TransactionItem from "@/Components/Home/TransactionItem";
import { useEffect, useState } from "react";
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';


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
            const date = new Date();
            const month = date.getMonth() + 1;
            const response = await fetch(`/api/transactions?month=${month}`, {
            });

            // const response = await fetch("/api/transactions");
            if (response.ok) {
                const data = await response.json();
                setSbiTransactions(data.transactions);
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
        // 300ms待機する
        await new Promise((resolve) => setTimeout(resolve, 300));
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
            <BalanceInfo current_balance={currentBalance}/>
            {/* <button css={button}>
                更新
                <CachedIcon />
            </button>
            <button css={button}>
                手動登録
                <AddIcon />
            </button> */}
            <h2
                style={{
                    marginTop: "24px",
                }}
            >取引履歴</h2>
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

const button = css`
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
`;

export default Home;
