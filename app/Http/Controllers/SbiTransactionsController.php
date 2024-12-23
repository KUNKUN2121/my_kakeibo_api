<?php

namespace App\Http\Controllers;

use App\Models\SbiTransactions;
use Illuminate\Http\Request;

class SbiTransactionsController extends Controller
{
    // Python用のコード
    public function addTransaction(Request $request)
    {
        // jsonで受け取る
        $data = $request->json()->all();
        // $data = $request->all();


        // コントローラーでDBにデータを追加する
        $transaction = new SbiTransactions();
        $transaction->approval_number = $data['approval_number'];
        $transaction->transaction_date = $data['transaction_date'];
        $transaction->merchant_name = $data['merchant_name'];
        $transaction->currency = $data['currency'];
        $transaction->amount = $data['amount'];
        // $transaction->is_registered_to_budget = $data['is_registered_to_budget'];
        // $transaction->is_confirmed = $data['is_confirmed'];
        $transaction->save();



        return response()->json(['message' => 'Transaction added successfully']);
    }
}
