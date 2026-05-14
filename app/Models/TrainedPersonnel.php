<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainedPersonnel extends Model
{
    use HasFactory;

    protected $table = 'trained_personnel';

    protected $fillable = [
        'name',
        'email',
        'contact_number',
        'specialization_id',
        'barangay_id',
        'age',
        'sex',
        'status_id',
        'notes',
    ];

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(LookupCategory::class, 'specialization_id');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(LookupStatus::class, 'status_id');
    }
}
