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

        //approval_numberが重複している場合は、終了
        $check = $transaction->where('approval_number', $data['approval_number'])->first();
        if($check){
            return response()->json([
                'status' => 304,
                'message' => 'Transaction already exists'
            ]);
        }

        $transaction->user_id = 1; // 仮で1を設定
        $transaction->approval_number = $data['approval_number'];
        $transaction->transaction_date = $data['transaction_date'];
        $transaction->merchant_name = $data['merchant_name'];
        $transaction->currency = $data['currency'];
        $transaction->amount = $data['amount'];
        // $transaction->is_registered_to_budget = $data['is_registered_to_budget'];
        // $transaction->is_confirmed = $data['is_confirmed'];
        $transaction->save();



        return response()->json([
            'status' => 200,
            'message' => 'Transaction added successfully'
        ]);
    }

    // Selenium用のコード
    public function addTransactionSelenium(Request $request)
    {
        // jsonで受け取る
        $data = $request->json()->all();

        // $dataを一つひとつ取り出して、DBに追加する
        foreach ($data as $d) {
            $get_is_confirmed = $d["settleStatus"] == 1 ? true : false;

            // 未確定なら処理を終了し、次のデータへ
            if(!$get_is_confirmed){ continue; }



            $sbi_instance = new SbiTransactions();

            $get_approval_number = $d["authNo"];

            // 承認IDから取引を取得 (firstで最新にし、被りがあっても良い)
            $transaction = $sbi_instance->where('approval_number', $get_approval_number)->first();

            if($transaction){
                $transaction->merchant_name = $d["tranDesc"];
                $transaction->amount = $d["tranAmt"];
                $transaction->is_confirmed = true;
                $transaction->save();
                continue;
            } else{
                // 取引がない場合は追加
                $transaction = new SbiTransactions();
                $transaction->user_id = 1; // 仮で1を設定
                $transaction->approval_number = $get_approval_number;
                $transaction->transaction_date = $d["tranDate"];
                $transaction->merchant_name = $d["tranDesc"];
                $transaction->currency = $d["tranCrcy"];
                $transaction->amount = $d["tranAmt"];
                // $transaction->memo = "";
                $transaction->is_confirmed = true;
                $transaction->save();
            }
        }
    }
}
