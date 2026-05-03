<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{

    protected $table = 'products';

    protected $fillable = [
        "category_id",
        "sub_category_id",
        "brand_id",
        "name",
        "slug",
        "sku",
        "cost_price",
        "sale_price",
        "stock_quantity",
        "min_stock_alert",
        "has_imei",
        "description",
        "image",
        "status",
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategories::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function imeiTrackings(): HasMany
    {
        return $this->hasMany(ImeiTrackings::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItems::class);
    }
}
