<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'birth_date',
        'gender',
        'civil_status',
        'address',
        'barangay',
        'contact_number',
        'email',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        return "{$this->last_name}, {$this->first_name} {$this->middle_name}";
    }
}
