<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'parent_id',
        'status',
    ];

    /**
     * ទាញយក Category មេ (Parent)
     */
    public function parent()
    {
        return $this->belongsTo(Categories::class, 'parent_id');
    }

    /**
     * ទាញយក Sub-categories (Children)
     */
    public function children()
    {
        return $this->hasMany(Categories::class, 'parent_id');
    }
}