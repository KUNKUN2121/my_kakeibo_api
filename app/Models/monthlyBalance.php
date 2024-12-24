<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class monthlyBalance extends Model
{
    protected $fillable = [
        'year',
        'month',
        'balance'
    ];

}
