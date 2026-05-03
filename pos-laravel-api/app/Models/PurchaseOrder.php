<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{

    protected $fillable = [
        'po_number',
        'supplier_id',
        'order_date',
        'expected_delivery_date',
        'status',
        'sub_total',
        'shipping_cost',
        'tax_rate',
        'tax_amount',
        'grand_total',
        'payment_status',
        'payment_method_id',
        'created_by_id',
        'notes'
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
