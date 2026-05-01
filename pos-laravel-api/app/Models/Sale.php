<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{

    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'user_id',
        'sub_total',
        'discount',
        'tax_amount',
        'grand_total',
        'amount_received',
        'change',
        'payment_method',
        'status',
        'notes',
    ];

    // ទំនាក់ទំនងទៅកាន់ Customer
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    // ទំនាក់ទំនងទៅកាន់ User (អ្នកលក់)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ទំនាក់ទំនង 1 វិក្កយបត្រមានទំនិញច្រើន
    public function items(): HasMany
    {
        return $this->hasMany(Sale_Items::class);
    }
}
