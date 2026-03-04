<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sub_categories extends Model
{
    use HasFactory;

    protected $table = 'sub_categories';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'image',
        'description',
        'status'
    ];

    /**
     * Relationship ត្រឡប់ទៅកាន់ Category មេ (Belongs To)
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }
}