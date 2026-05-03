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
        'invoice_number', 'customer_id', 'user_id', 'sub_total', 'discount',
        'tax_amount', 'grand_total', 'amount_received', 'change',
        'payment_method_id', 'status', 'notes'
    ];


    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItems::class);
    }
}
