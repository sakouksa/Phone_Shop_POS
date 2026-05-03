<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_line_price',
    ];

    // Relationship to PurchaseOrder មេ
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(Purchase_Orders::class);
    }

    // Relationship to Product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
