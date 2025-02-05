import { CloseOutlined } from '@mui/icons-material';
import { AppBar, Button, Divider, IconButton, List, ListItem, Toolbar, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface DialogChildrenProps {
    handleClose: () => void;
    id: string;
    handleToggleBudget: (id: string, isRegisteredToBudget: boolean) => void;
}

interface getData {
    current_balance: number;
    status: string;
    transaction: Transaction;
}
interface Transaction {
    id: number;
    user_id: number;
    budget_id: number;
    is_manual: boolean;
    approval_number: string;
    transaction_date: string;
    merchant_name: string;
    currency: string;
    amount: number;
    memo: string;
    is_registered_to_budget: boolean;
    is_confirmed: boolean;
    created_at: string;
    updated_at: string;
}

const DialogChildren: React.FC<DialogChildrenProps> = ({
     handleClose, id,handleToggleBudget
     }) => {
    const [amount] = useState(2000); // 割り勘前の金額 (固定)
    const [people, setPeople] = useState(2); // 割り勘する人数
    const [date] = useState('2025-01-03 12:00'); // 利用日時 (固定)
    const [storeName] = useState('サンプル店名'); // 店名 (固定)
    const [data, setData] = useState<Transaction | null>(null);

    useEffect(() => {
        // 仮でIDを1として取得
        // const id = 1;
        fetch(`/api/transactions/${id}`)
            .then((res) => res.json())
            .then((json: getData) =>
                setData(json.transaction))
            .catch(console.error);
    }, []);

    // 割り勘の計算結果
    const result = data?.amount && people > 0 ? (data.amount / people).toFixed(2) : 0;

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseOutlined />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        簡易割り勘
                    </Typography>
                    <Button autoFocus color="inherit"
            onClick={() => postData(handleClose, handleToggleBudget, data.id,amount,people)}>
                        保存
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>支払い日時: {data?.transaction_date}</Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>店名: {data?.merchant_name}</Typography>

                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    金額: {formatAmount(data.amount)} 円
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 2 }}>
                        人数:
                    </Typography>
                    <input
                        type="number"
                        value={people}
                        onChange={(e) => setPeople(Number(e.target.value))}
                        style={{ width: '60px', padding: '5px', fontSize: '16px' }}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="h4"
                    sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}
                >
                    金額: {formatAmount(result)} 円
                </Typography>
            </Box>
        </>
    );
};

const formatAmount = (amount: string): string => {
    // .00を消してカンマ区切りにする
    return Number(amount).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

const postData = (
    handleClose: () => void,
    handleToggleBudget: any,
    id : number,
    amount: number,
    people: number,
) => {
    const result = amount && people > 0 ? (amount / people).toFixed(2) : 0;
    if(result == 0 || people == 0 || people==1) return;
    handleToggleBudget(id, true);
    console.log('保存処理');
    handleClose();
}
export default DialogChildren;
