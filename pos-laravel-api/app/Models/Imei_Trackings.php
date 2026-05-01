<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Imei_Trackings extends Model
{
    use HasFactory;

    const STATUS_AVAILABLE = 'available';
    const STATUS_SOLD = 'sold';
    const STATUS_REPAIR = 'repair';
    const STATUS_TRADE_IN = 'trade_in';

    protected $table = 'imei_trackings';

    protected $fillable = [
        'product_id',
        'supplier_id',
        'purchase_id',
        'sale_id',
        'imei_number',
        'cost_price',
        'status',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(Purchase_Orders::class, 'purchase_id');
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }
}
