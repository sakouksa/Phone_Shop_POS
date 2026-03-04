<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $fillable = [
        'role_name',
        'permissions'
    ];

    /**
     * បំប្លែង JSON permissions ទៅជា Array ដោយស្វ័យប្រវត្តិ
     */
    protected $casts = [
        'permissions' => 'array',
    ];

    /**
     * Relationship: Role មួយ មាន User ច្រើន (One-to-Many)
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }

    /**
     * Helper Function សម្រាប់ឆែកមើលថាតើ Role នេះមានសិទ្ធិអ្វីមួយដែរឬទេ
     * example $role->hasPermission('delete_product')
     */
    public function hasPermission($permission): bool
    {
        return is_array($this->permissions) && in_array($permission, $this->permissions);
    }
}