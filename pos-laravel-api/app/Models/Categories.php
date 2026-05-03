<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        "name",
        "slug",
        "status",
    ];
    /**
     * Relationship ទៅកាន់ Sub_categories (One to Many)
     */
    public function subCategories()
    {
        return $this->hasMany(SubCategories::class, 'category_id');
    }
    /**
     * Relationship ទៅកាន់ Product (One to Many)
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
