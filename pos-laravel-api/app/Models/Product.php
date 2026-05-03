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

    /**
     * Relationship ទៅកាន់ Category (One to Many - Inverse)
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    /**
     * Relationship ទៅកាន់ Sub Category (One to Many - Inverse)
     */
    public function sub_category(): BelongsTo
    {
        return $this->belongsTo(SubCategories::class, 'sub_category_id');
    }

    /**
     * Relationship ទៅកាន់ Brand (One to Many - Inverse)
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    /**
     * Relationship ទៅកាន់ IMEI Trackings (One to Many)
     */
    public function imeiTrackings(): HasMany
    {
        return $this->hasMany(ImeiTrackings::class, 'product_id');
    }
    /**
     * Relationship ទៅកាន់ Purchase Order Item (One to Many)
     */
    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
