<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = ['name', 'group', 'is_menu_web', 'web_route_key'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_roles');
    }
}
