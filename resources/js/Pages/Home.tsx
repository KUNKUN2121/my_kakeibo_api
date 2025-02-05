/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import BalanceInfo from "@/Components/Home/BlanceInfo";
import TransactionItem from "@/Components/Home/TransactionItem";
import { useEffect, useState } from "react";
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import { Dialog } from "@mui/material";
import DialogChildren from "@/Components/Home/DialogChildren";


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

    const [warikanId, setWarikanId] = useState<string>("");
    const fetchTransactions = async () => {
        try {
            var month = new Date().getFullYear() * 100 + (new Date().getMonth() + 1); // 現在の月をYYYYMM形式で取得
            month  = 202412;

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
    const handleToggleBudget = async (
        id: string,
        isRegisteredToBudget: boolean
        ) => {
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



    const [open, setOpen] = useState(false);

    const handleWarikanOpen = (id : string) => {
        setWarikanId(id);
        setOpen(true);
    };

    const handleWarikanClose = () => {
      setOpen(false);
    };


    // 家計簿に登録する
    const handleRegisterToBudget = async (id: string) => {
        try {
            const response = await fetch("/api/registerToBudget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                // 成功時にデータを再取得
                fetchTransactions();
            } else {
                console.error("Failed to register to budget");
            }
        } catch (error) {
            console.error("Error registering to budget:", error);
        }
    }

    return (
        <div css={wapper}>
            <Dialog
                fullScreen
                open={open}
                onClose={handleWarikanClose}
                // TransitionComponent={Transition}
            >
                <DialogChildren
                    handleClose={handleWarikanClose}
                    id={warikanId}
                    handleToggleBudget={handleToggleBudget}
                />
            </Dialog>
            <BalanceInfo current_balance={currentBalance}/>
            {/* 手動登録ボタン */}
            <AddIcon
                css={addBtn}
                onClick={() => {
                    window.location.href = "/home/add";
                }}
            />
            <h2
                style={{
                    marginTop: "24px",
                }}
            >取引履歴</h2>
            <div css={transactionCss}>

                {sbiTransactions.map((item) => (
                    <>
                        <TransactionItem item={item} handleToggleBudget={handleToggleBudget} handleWarikanOpen={handleWarikanOpen}/>

                    </>
                ))}
            </div>
        </div>
    );
}

const wapper = css`
    /* position: absolute; */
`;

const addBtn = css`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    border-radius: 50%;
    background-color: #4CAF50;
    color: white;
    padding: 15px;

`;

const transactionCss = css`
    margin-top: 20px;
    position: relative;
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
