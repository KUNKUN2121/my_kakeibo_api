<?php

namespace App\Http\Controllers;

use App\Models\Budgets;
use Illuminate\Http\Request;

class BudgetsController extends Controller
{
    // 残りの残高を取得
        // 残り残高を取得
        public function getRemainingBalance()
        {
            $userId = 1;
            $budget = Budgets::where('user_id', $userId)->first();
            return $budget->current_balance;
        }
}
