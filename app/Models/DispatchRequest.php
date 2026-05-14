<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DispatchRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_time',
        'category_id',
        'items',
        'status_id',
    ];

    protected $casts = [
        'items' => 'array',
        'date_time' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(LookupCategory::class, 'category_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(LookupStatus::class, 'status_id');
    }
}
