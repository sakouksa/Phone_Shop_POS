<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
        'permissions',
    ];

    /**
     * បំប្លែង JSON permissions ទៅជា Array ដោយស្វ័យប្រវត្តិ
     */
    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    /**
     * Relationship: Role មួយ មាន User ច្រើន (Many-to-Many)
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }

    /**
     * Relationship: Role មួយ មាន Permission ច្រើន (Many-to-Many)
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_roles');
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
