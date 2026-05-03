<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubCategories extends Model
{

    protected $table = 'sub_categories';

    protected $fillable = [
        "category_id",
        "name",
        "slug",
        "image",
        "status",
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
