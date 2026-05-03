<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    protected $fillable = ['user_id', 'salary_amount', 'bonus', 'total_paid', 'payment_date'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
