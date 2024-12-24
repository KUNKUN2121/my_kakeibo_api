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
        Schema::create('monthly_balances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default(1); // 仮で1を設定
            $table->year('year');
            $table->tinyInteger('month');
            $table->integer('balance')->default(30000);
            $table->integer('carried_over_balance')->default(0);
            $table->timestamps(); // 作成日時・更新日時
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_balances');
    }
};
