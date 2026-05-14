<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LookupStatus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'status_id');
    }

    public function patients()
    {
        return $this->hasMany(Patient::class, 'status_id');
    }

    public function resourceDispatches()
    {
        return $this->hasMany(ResourceDispatch::class, 'status_id');
    }

    public function dispatchRequests()
    {
        return $this->hasMany(DispatchRequest::class, 'status_id');
    }

    public function trainedPersonnel()
    {
        return $this->hasMany(TrainedPersonnel::class, 'status_id');
    }
}
