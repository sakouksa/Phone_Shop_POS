<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale_Items extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'imei_number',
        'quantity',
        'unit_price',
        'discount_item',
        'total_line_price',
    ];

    // ទំនាក់ទំនងទៅកាន់ Sale មេ
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    // ទំនាក់ទំនងទៅកាន់ Product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
