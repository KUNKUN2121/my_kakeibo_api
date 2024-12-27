<?php

namespace App\Http\Controllers;

use App\Models\Budgets;
use App\Models\SbiTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SbiTransactionsController extends Controller
{
    // メール用のコード
    public function addTransaction(Request $request)
    {

        // jsonで受け取る
        $data = $request->json()->all();
        $userId = 1;

        DB::transaction(function () use ($data, $userId) {
            $transaction = new SbiTransactions();
            //approval_numberが重複している場合は、終了
            $check = $transaction->where('approval_number', $data['approval_number'])->first();
            if($check){
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

            // buggetsテーブルのcurrent_balanceを更新
            $budget = Budgets::where('user_id', $userId)->first();
            if(!$budget){
                return response()->json([
                    'status' => 404,
                    'message' => 'Budget not found'
                ]);
            }
            $budget->current_balance -= $data['amount'];
            $budget->save();

        });
        return response()->json([
            'status' => 200,
            'message' => 'Transaction added successfully'
        ]);

        // コントローラーでDBにデータを追加する


    }

    // Selenium用のコード
    public function addTransactionSelenium(Request $request)
    {
        // jsonで受け取る
        $data = $request->json()->all();
        $userId = 1;

        DB::transaction(function () use ($data, $userId) {
            // $dataを一つひとつ取り出して、DBに追加する
            foreach ($data as $d) {
                $get_is_confirmed = $d["settleStatus"] == 1 ? true : false;

                // 未確定なら処理を終了し、次のデータへ
                if (!$get_is_confirmed) {
                    continue;
                }

                $sbi_instance = new SbiTransactions();

                $get_approval_number = $d["authNo"];

                // 承認IDから取引を取得 (firstで最新にし、被りがあっても良い)
                $transaction = $sbi_instance->where('approval_number', $get_approval_number)->first();

                if ($transaction) {
                    $transaction->merchant_name = $d["tranDesc"];
                    $transaction->amount = $d["tranAmt"];
                    $transaction->is_confirmed = true;
                    $transaction->save();

                    // もともとの金額と、更新後の金額差がある場合
                    if ($transaction->amount != $d["tranAmt"]) {
                        // budgetsテーブルのcurrent_balanceを更新
                        $budget = Budgets::where('user_id', $userId)->first();
                        $budget->current_balance += $transaction->amount;  // もともとの金額を戻す
                        $budget->current_balance -= $d["tranAmt"];  // 更新後の金額を引く
                        $budget->save();
                    }
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
                    // budgetsテーブルのcurrent_balanceを更新
                        $budget = Budgets::where('user_id', $userId)->first();
                        $budget->current_balance -= $d["tranAmt"];
                        $budget->save();
                }
            }
        });

        return response()->json([
            'status' => 200,
            'message' => 'Transactions processed successfully'
        ]);
    }


    // 手動で取引追加
    public function addManualTransaction(Request $request)
    {
        // jsonで受け取る
        $data = $request->json()->all();
        $userId = 1;

        DB::transaction(function () use ($data, $userId) {
            $transaction = new SbiTransactions();


            SbiTransactions::create([
                'user_id' => $userId,
                'approval_number' => null,
                'transaction_date' => $data['transaction_date'],
                'merchant_name' => $data['merchant_name'],
                'currency' => $data['currency'],
                'amount' => $data['amount'],
                'is_manual' => true,
            ]);

            // buggetsテーブルのcurrent_balanceを更新
            $budget = Budgets::where('user_id', $userId)->first();
            if(!$budget){
                return response()->json([
                    'status' => 404,
                    'message' => 'Budget not found'
                ]);
            }
            $budget->current_balance -= $data['amount'];
            $budget->save();

        });
        return response()->json([
            'status' => 200,
            'message' => 'Transaction added successfully'
        ]);
    }


    // 家計簿に登録するかしないかの切り替え
    public function toggleRegisterToBudget(Request $request)
    {
        // jsonで受け取る
        $data = $request->json()->all();
        // サンプルデータ

        $userId = 1;



        try {
            DB::transaction(function () use ($data, $userId) {
                $transaction = SbiTransactions::where('user_id' , $userId)
                                                ->where('id', $data['id'])
                                                ->first();
                if(!$transaction){
                    throw new \Exception('Transaction not found');
                }

                // 変更がない場合はthrow
                if($transaction->is_registered_to_budget == $data['is_registered_to_budget']){
                    throw new \Exception('No change');
                }


                $transaction->is_registered_to_budget = $data['is_registered_to_budget'];
                $transaction->save();

                // buggetsテーブルのcurrent_balanceを更新
                $budget = Budgets::where('user_id', $userId)->first();
                if(!$budget){
                    return response()->json([
                        'status' => 404,
                        'message' => 'Budget not found'
                    ]);
                }


                if($data['is_registered_to_budget']){
                    $budget->current_balance -= $transaction->amount;
                }else{
                    $budget->current_balance += $transaction->amount;
                }
                $budget->save();

            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'message' => $e->getMessage()
            ]);
        }
        // 登録の場合
        if($data['is_registered_to_budget']){
            return response()->json([
                'status' => 200,
                'message' => 'Transaction registered to budget'
            ]);
        }else{
            return response()->json([
                'status' => 200,
                'message' => 'Transaction unregistered to budget'
            ]);
        }
    }


    public function getTransactions(){
        $userId = 1;
        $transactions = SbiTransactions::where('user_id', $userId)->orderBy('transaction_date', 'desc')->get();
        $budgets = new BudgetsController();
        $budget = Budgets::where('user_id', $userId)->first();
        $current_balance = $budget->current_balance;

        return response()->json([
            'status' => 200,
            'current_balance' => $current_balance,
            'transactions' => $transactions,
        ]);
    }
}
