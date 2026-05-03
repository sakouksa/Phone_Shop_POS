<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseType extends Model
{
    protected $fillable = ['name'];

    public function expenseLists(): HasMany
    {
        return $this->hasMany(ExpenseList::class);
    }
}
