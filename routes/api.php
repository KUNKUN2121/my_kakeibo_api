<?php

use App\Http\Controllers\SbiTransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// 追加用API

Route::post('/sbi/mail/add', [SbiTransactionsController::class, 'addMailTransaction'])->name('api.sbi.mail.add');


Route::post('/sbi/selenium/add', [SbiTransactionsController::class, 'addTransactionSelenium'])->name('api.sbi.mail.add');

Route::post('/toggleRegisterToBudget', [SbiTransactionsController::class, 'toggleRegisterToBudget'])->name('api.sbi.mail.add');

Route::get('/transactions', [SbiTransactionsController::class, 'getTransactions'])->name('api.sbi.mail.add');

// 指定された範囲のトランザクションを取得
Route::get('/transactions/range', [SbiTransactionsController::class, 'getTransactionsRange'])->name('api.sbi.mail.add');



Route::get('/transactions/{id}', [SbiTransactionsController::class, 'getTransactionsDetail'])->name('api.sbi.mail.add');


