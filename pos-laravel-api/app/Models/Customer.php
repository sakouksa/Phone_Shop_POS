<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'points',
        'status',
    ];

    // ទំនាក់ទំនង 1 Customer អាចមាន Sale (វិក្កយបត្រ) ច្រើន
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'customer_id');
    }
}
