<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class supplier extends Model
{

    protected $table = 'suppliers';

    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
        'status',
    ];

    /**
     * Relationship ទៅកាន់ ImeiTracking (១ ទៅ ច្រើន)
     */
    public function imeiTrackings(): HasMany
    {
        return $this->hasMany(ImeiTrackings::class, 'supplier_id');
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class, 'supplier_id');
    }
}
