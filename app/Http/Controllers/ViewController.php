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
        $budgets = new BudgetsController();
        $current_balance = $budgets->getRemainingBalance();

        return Inertia::render('Home', [
            'sbi_transactions' => $sbi_transactions,
            'current_balance' => $current_balance,
            'balance' => 30000,
        ]);
    }

    public function detail($id)
    {
        return Inertia::render('Detail');
    }

    public function add()
    {
        return Inertia::render('Add');
    }
}
