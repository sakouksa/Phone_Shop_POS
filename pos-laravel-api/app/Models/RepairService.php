<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairService extends Model
{
    protected $fillable = [
        'customer_id', 'phone_model', 'imei_number', 'problem_description',
        'service_type_id', 'cost', 'status'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(RepairServiceType::class, 'service_type_id');
    }
}
