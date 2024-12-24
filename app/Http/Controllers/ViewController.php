<?php

namespace App\Http\Controllers;

use App\Models\SbiTransactions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    //

    public function home()
    {
        // sbi_transactions からデータを取得 transaction_date でソート
        $sbi_transactions = SbiTransactions::orderBy('transaction_date', 'desc')->get();

        $monthlyBalance = new MonthlyBalanceController();
        $remaining_balance = $monthlyBalance->getRemainingBalance(2024, 12);

        return Inertia::render('Home', [
            'sbi_transactions' => $sbi_transactions,
            'remaining_balance' => $remaining_balance,
            'balance' => 30000,
        ]);
    }
}
