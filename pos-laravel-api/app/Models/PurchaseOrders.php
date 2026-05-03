<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrders extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number', 'supplier_id', 'order_date', 'expected_delivery_date', 'status',
        'sub_total', 'shipping_cost', 'tax_rate', 'tax_amount', 'grand_total',
        'payment_status', 'payment_method_id', 'created_by_id', 'notes'
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function imeiTrackings(): HasMany
    {
        return $this->hasMany(ImeiTrackings::class, 'purchase_id');
    }
}
