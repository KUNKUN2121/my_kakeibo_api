<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SbiTransactions extends Model
{
    public function addTransaction($data)
    {
        $this->approval_number = $data['approval_number'];
        $this->transaction_date = $data['transaction_date'];
        $this->merchant_name = $data['merchant_name'];
        $this->currency = $data['currency'];
        $this->amount = $data['amount'];
        $this->is_registered_to_budget = $data['is_registered_to_budget'];
        $this->is_confirmed = $data['is_confirmed'];
        $this->save();
    }
}
