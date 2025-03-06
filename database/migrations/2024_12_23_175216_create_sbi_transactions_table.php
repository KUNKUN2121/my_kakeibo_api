<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sbi_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default(1); // 仮で1を設定
            $table->unsignedBigInteger('budget_id')->nullable(); // 家計簿ID
            $table->boolean('is_manual')->default(false); // 手入力フラグ
            // $table->string('payment_method_id')->nullable(); // 支払い方法ID
            $table->string('approval_number')->nullable(); // 承認ID
            $table->datetime('transaction_date'); // 取引日
            $table->string('merchant_name')->nullable(); // 加盟店名
            $table->string('currency'); //  通貨
            $table->decimal('amount', 10, 2); // 金額
            $table->string('memo')->nullable(); // メモ
            $table->boolean('is_registered_to_budget')->default(true); // 家計簿登録フラグ
            $table->boolean('is_confirmed')->default(false); // 確定状態(クレカ)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sbi_transactions');
    }
};
