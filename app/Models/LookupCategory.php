<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LookupCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class, 'category_id');
    }

    public function emergencyTypes()
    {
        return $this->hasMany(InventoryItem::class, 'emergency_type_id');
    }

    public function conditions()
    {
        return $this->hasMany(InventoryItem::class, 'condition_id');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'type_id');
    }

    public function severities()
    {
        return $this->hasMany(Incident::class, 'severity_id');
    }

    public function dispatchRequests()
    {
        return $this->hasMany(DispatchRequest::class, 'category_id');
    }

    public function trainedPersonnel()
    {
        return $this->hasMany(TrainedPersonnel::class, 'specialization_id');
    }
}
