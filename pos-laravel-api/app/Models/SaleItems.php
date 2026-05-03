<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleItems extends Model
{

    protected $fillable = [
        'sale_id', 'product_id', 'imei_number', 'quantity', 'unit_price',
        'discount_item', 'total_line_price'
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
