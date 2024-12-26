<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budgets extends Model
{
    //
    protected $fillable = [
        'user_id',
        'name',
        'initial_balance',
        'current_balance'
    ];

}
