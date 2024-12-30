<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::call(function(){
    // 毎日1000円ずつすべてのBudgetsに追加する
    DB::table('budgets')->increment('current_balance', 1000);
    // Log::info('Budgets updated successfully. +1000');
})->daily();
