<?php

use App\Http\Controllers\SbiTransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('/sbi/add', [SbiTransactionsController::class, 'addTransaction'])->name('api.sbi.add');
