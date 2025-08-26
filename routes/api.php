<?php

use App\Http\Controllers\SbiTransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// 追加用
Route::prefix('add')->group(function() {{
    // SBI メール取り込み
    Route::post('/sbi/mail', [SbiTransactionsController::class, 'addMailTransaction'])->name('api.sbi.mail.add');

    // SBI Selenium 取り込み
    Route::post('/sbi/selenium', [SbiTransactionsController::class, 'addTransactionSelenium'])->name('api.sbi.selenium.add');
}});

// 取得用
Route::prefix('get')->group(function() {
    Route::get('/', [SbiTransactionsController::class, 'getTransactions'])->name('api.sbi.mail.add');

    // 指定された範囲のトランザクションを取得 ?start ?end
    Route::get('/transactions/range', [SbiTransactionsController::class, 'getTransactionsRange'])->name('api.sbi.mail.add');

    // 指定されたIDのトランザクションを取得
    Route::get('/transaction/{id}', [SbiTransactionsController::class, 'getTransactionsDetail'])->name('api.sbi.mail.add');
});


// 変更用
Route::prefix('update')->group(function() {
    // 指定されたIDのトランザクションを更新
    Route::post('/transaction/{id}', [SbiTransactionsController::class, 'updateTransaction'])->name('api.sbi.mail.add');
});


Route::post('/toggleRegisterToBudget', [SbiTransactionsController::class, 'toggleRegisterToBudget'])->name('api.sbi.mail.add');




