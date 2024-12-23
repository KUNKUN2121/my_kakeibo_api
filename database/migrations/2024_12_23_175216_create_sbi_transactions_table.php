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
            $table->string('approval_number'); // 承認ID
            $table->date('transaction_date'); // 取引日
            $table->string('merchant_name')->nullable(); // 加盟店名
            $table->string('currency'); //  通貨
            $table->decimal('amount', 10, 2); // 金額
            $table->boolean('is_registered_to_budget')->default(false); // 家計簿登録フラグ
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
