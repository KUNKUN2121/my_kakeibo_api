<?php

namespace App\Http\Controllers;

use App\Models\monthlyBalance;
use App\Models\SbiTransactions;
use Illuminate\Http\Request;

class MonthlyBalanceController extends Controller
{
    //
    public function getRemainingBalance($year, $month)
    {
        // 該当月の月初残高を取得
        $monthlyBalance = MonthlyBalance::where('year', $year)
            ->where('month', $month)
            ->first();

        if (!$monthlyBalance) {
            // return response()->json(['message' => '月次データが見つかりません'], 404);
            // 月次データがない場合は、月初残高を0として残高を計算
            $monthlyBalance = new MonthlyBalance();
            $monthlyBalance->year = $year;
            $monthlyBalance->month = $month;
            $monthlyBalance->balance = 30000;
            $monthlyBalance->save();
        }

        // 該当月の取引を取得
        $transactions = SbiTransactions::whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->where('is_registered_to_budget', true) // 家計簿登録済みの取引に限定
            ->get();

        // 該当取引の合計額を計算
        $totalSpent = $transactions->sum('amount');

        // 残高を計算
        $remainingBalance = $monthlyBalance->balance - $totalSpent;

        return $remainingBalance;
    }
}
