<?php

namespace App\Http\Controllers;

use App\Models\Budgets;
use App\Models\SbiTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SbiTransactionsController extends Controller
{
    // メール受信登録
    public function addMailTransaction(Request $request)
    {
        $data = $request->json()->all();
        $userId = 1;

        DB::transaction(function () use ($data, $userId) {
            $transaction = new SbiTransactions();
            // 承認番号[approval_number] が重複している場合は、終了
            if($transaction->where('approval_number', $data['approval_number'])->first()){
                return response()->json([
                    'status' => 304,
                    'message' => 'Transaction already exists'
                ]);
            }

            SbiTransactions::create([
                'user_id' => $userId,
                'approval_number' => $data['approval_number'],
                'transaction_date' => $data['transaction_date'],
                'merchant_name' => $data['merchant_name'],
                'currency' => $data['currency'],
                'amount' => $data['amount'],
            ]);

        });
        return response()->json([
            'status' => 200,
            'message' => 'Transaction added successfully'
        ]);
    }

    // スクレイピング用追加
    public function addTransactionSelenium(Request $request)
    {
        $data = $request->json()->all();
        $userId = 1;

        DB::transaction(function () use ($data, $userId) {
            // $dataを一つひとつ取り出して、DBに追加する
            foreach ($data as $d) {
                $get_is_confirmed = $d["settleStatus"] == 1 ? true : false;

                // 未確定なら登録をしない
                if (!$get_is_confirmed) continue;
                // authNoがない場合は登録をしない。年会費の請求など、稀にある
                if ($d["authNo"] == "" || $d["authNo"] == null) continue;

                $sbi_instance = new SbiTransactions();
                $get_approval_number = $d["authNo"];

                // 承認IDから取引を取得 (firstで最新にし、被りがあっても良い)
                $transaction = $sbi_instance->where('approval_number', $get_approval_number)->first();

                if ($transaction) {
                    $transaction->merchant_name = $d["tranDesc"];
                    $transaction->amount = $d["tranAmt"];
                    $transaction->is_confirmed = true;
                    $transaction->save();

                } else {
                    // 取引がない場合は追加
                    $transaction = new SbiTransactions();
                    $transaction->user_id = $userId;
                    $transaction->approval_number = $get_approval_number;
                    $transaction->transaction_date = $d["tranDate"];
                    $transaction->merchant_name = $d["tranDesc"];
                    $transaction->currency = $d["tranCcy"];
                    $transaction->amount = $d["tranAmt"];
                    $transaction->is_confirmed = true;
                    $transaction->save();
                }
            }
        });

        return response()->json([
            'status' => 200,
            'message' => 'Transactions processed successfully'
        ]);
    }

    public function getTransactions(
        Request $request
    ){
        $userId = 1;

        // getメソッドからmonthを取得 ない場合は現在の月を取得
        $month = $request->get('month') ? $request->get('month') : date('Ym');
        $formattedMonth = substr($month, 0, 4) . '-' . substr($month, 4, 2);


        $transactions = SbiTransactions::where('user_id', $userId)
                                        ->where('transaction_date', 'like', $formattedMonth . '%')
                                        ->orderBy('transaction_date', 'desc')
                                        ->get();

        // 今月、今週、今日の取引の合計金額を取得

        if($month == date('Ym')){
            $month_total_amount = $this->getMonthTransactions();
            $week_total_amount = $this->getThisWeekTransactions();
            $today_total_amount = $this->getTodayTransactions();
        }else{
            $month_total_amount = $this->getMonthTransactions($month);
            $week_total_amount = null;
            $today_total_amount = null;
        }


        return response()->json([
            'status' => 200,
            'transactions' => $transactions,
            'total_amount' => [
                'month' => $month_total_amount,
                'week' => $week_total_amount,
                'today' => $today_total_amount,
            ]
        ]);
    }

    public function getTransactionsDetail($id){
        $userId = 1;
        $transaction = SbiTransactions::where('user_id', $userId)->where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'transaction' => $transaction,
        ]);
    }


    // 今日の取引を取得
    public function getTodayTransactions(){
        $userId = 1;
        $today = date('Y-m-d');
        $transactions = SbiTransactions::where('user_id', $userId)
                                        ->where('transaction_date', $today)
                                        ->orderBy('transaction_date', 'desc')
                                        ->get();

        $budgets = new BudgetsController();
        $budget = Budgets::where('user_id', $userId)->first();
        $current_balance = $budget->current_balance;

        $today_total_amount = 0;
        foreach($transactions as $transaction){
            $today_total_amount += $transaction->amount;
        }
        return $today_total_amount;
    }

    // 今月の取引を取得
    public function getMonthTransactions(
        $month = null
    ){
        if(!$month){
            $month = date('Ym');
        }
        $userId = 1;

        $formattedMonth = substr($month, 0, 4) . '-' . substr($month, 4, 2);




        $transactions = SbiTransactions::where('user_id', $userId)
                                        ->where('transaction_date', 'like', $formattedMonth . '%')
                                        ->orderBy('transaction_date', 'desc')
                                        ->get();



        $this_month_total_amount = 0;
        foreach($transactions as $transaction){
            $this_month_total_amount += $transaction->amount;
        }

        return $this_month_total_amount;
    }

    // 今週の取引を取得
    public function getThisWeekTransactions(

    ){
        $userId = 1;
        $today = date('Y-m-d');
        // 過去7日間を取得
        $week = date('Y-m-d', strtotime('-7 day', strtotime($today)));

        $transactions = SbiTransactions::where('user_id', $userId)
                                        ->where('transaction_date', '>=', $week)
                                        ->orderBy('transaction_date', 'desc')
                                        ->get();

        $this_week_total_amount = 0;
        foreach($transactions as $transaction){
            $this_week_total_amount += $transaction->amount;
        }

        return $this_week_total_amount;
    }
}
