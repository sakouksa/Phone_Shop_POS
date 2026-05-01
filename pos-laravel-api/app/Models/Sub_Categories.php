<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sub_Categories extends Model
{
    use HasFactory;

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
}
