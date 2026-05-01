<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase_Orders extends Model
{
    use HasFactory;

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
        'payment_method',
        'created_by_id',
        'notes',
    ];

    // ទំនាក់ទំនងទៅកាន់ Supplier
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    // ទំនាក់ទំនងទៅកាន់ User (អ្នកបង្កើត)
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    //  ទំនាក់ទំនង 1 PO អាចមានទំនិញច្រើន (PurchaseOrderItems)
    public function items(): HasMany
    {
        return $this->hasMany(Purchase_Order_Items::class);
    }
}
