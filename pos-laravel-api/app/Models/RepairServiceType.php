<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairServiceType extends Model
{
    protected $fillable = ['name', 'description', 'status'];

    public function repairServices(): HasMany
    {
        return $this->hasMany(RepairService::class, 'service_type_id');
    }
}
