<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = ['email', 'code', 'expires_at', 'verified', 'registration_name', 'registration_password', 'data'];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified' => 'boolean',
        'data' => 'array',
    ];
}
