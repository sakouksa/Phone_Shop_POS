<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject // អនុវត្ត (Implement) JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        "name",
        "email",
        "password",
    ];
    

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Function JWT ដំណើរការ
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Claim ផ្សេងៗបើអ្នកចង់ដាក់ក្នុង Token
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Relationship ទៅកាន់ Role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
    //relationship user with profile
    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id');
    }
}