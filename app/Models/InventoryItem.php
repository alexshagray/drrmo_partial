<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'quantity',
        'min_stock_level',
        'emergency_type_id',
        'condition_id',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(LookupCategory::class, 'category_id');
    }

    public function emergencyType(): BelongsTo
    {
        return $this->belongsTo(LookupCategory::class, 'emergency_type_id');
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(LookupCategory::class, 'condition_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function dispatches(): HasMany
    {
        return $this->hasMany(ResourceDispatch::class);
    }
}
