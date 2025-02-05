import React, { useEffect, useState } from 'react';

const Add: React.FC = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [memo, setMemo] = useState('');
    const [isRegisteredToBudget, setIsRegisteredToBudget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Name:', name);
        console.log('Amount:', amount);
    };



    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // JST に補正
        const formattedDate = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        setDate(formattedDate);
    }
    , []);

    return (
        <div>
            <h1>追加</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">日付時間:</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        defaultValue={new Date().toISOString().slice(0, 16)}
                    />

                </div>
                <div>
                    <label htmlFor="name">店名:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="amount">金額:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="memo">メモ:</label>
                    <input
                        type="text"
                        id="memo"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="is_registered_to_budget">家計簿登録:</label>
                    <input
                        type="checkbox"
                        id="is_registered_to_budget"
                        value={isRegisteredToBudget}
                        onChange={(e) => setIsRegisteredToBudget(e.target.value)}
                    />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default Add;
