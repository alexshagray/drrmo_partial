<?php

namespace Database\Seeders;

use App\Models\LookupCategory;
use App\Models\LookupStatus;
use Illuminate\Database\Seeder;

class LookupSeeder extends Seeder
{
    public function run(): void
    {
        // Seed categories
        $categories = [
            // Inventory categories
            ['name' => 'Medical Supplies', 'type' => 'inventory', 'is_active' => true],
            ['name' => 'Emergency Equipment', 'type' => 'inventory', 'is_active' => true],
            ['name' => 'Rescue Tools', 'type' => 'inventory', 'is_active' => true],
            ['name' => 'Communication Devices', 'type' => 'inventory', 'is_active' => true],
            ['name' => 'Food & Water', 'type' => 'inventory', 'is_active' => true],
            
            // Emergency types
            ['name' => 'Medical', 'type' => 'emergency_type', 'is_active' => true],
            ['name' => 'Fire', 'type' => 'emergency_type', 'is_active' => true],
            ['name' => 'Flood', 'type' => 'emergency_type', 'is_active' => true],
            ['name' => 'Earthquake', 'type' => 'emergency_type', 'is_active' => true],
            ['name' => 'Typhoon', 'type' => 'emergency_type', 'is_active' => true],
            
            // Condition types
            ['name' => 'New', 'type' => 'condition', 'is_active' => true],
            ['name' => 'Excellent', 'type' => 'condition', 'is_active' => true],
            ['name' => 'Good', 'type' => 'condition', 'is_active' => true],
            ['name' => 'Poor', 'type' => 'condition', 'is_active' => true],
            
            // Incident types
            ['name' => 'Medical Emergency', 'type' => 'incident_type', 'is_active' => true],
            ['name' => 'Fire Incident', 'type' => 'incident_type', 'is_active' => true],
            ['name' => 'Natural Disaster', 'type' => 'incident_type', 'is_active' => true],
            ['name' => 'Rescue Operation', 'type' => 'incident_type', 'is_active' => true],
            
            // Severity levels
            ['name' => 'Low', 'type' => 'severity', 'is_active' => true],
            ['name' => 'Medium', 'type' => 'severity', 'is_active' => true],
            ['name' => 'High', 'type' => 'severity', 'is_active' => true],
            ['name' => 'Critical', 'type' => 'severity', 'is_active' => true],
            
            // Specializations
            ['name' => 'Medical Responder', 'type' => 'specialization', 'is_active' => true],
            ['name' => 'Firefighter', 'type' => 'specialization', 'is_active' => true],
            ['name' => 'Rescue Diver', 'type' => 'specialization', 'is_active' => true],
            ['name' => 'Search & Rescue', 'type' => 'specialization', 'is_active' => true],
            
            // Dispatch request categories
            ['name' => 'Emergency', 'type' => 'dispatch_category', 'is_active' => true],
            ['name' => 'Routine', 'type' => 'dispatch_category', 'is_active' => true],
            ['name' => 'Training', 'type' => 'dispatch_category', 'is_active' => true],
        ];

        foreach ($categories as $category) {
            LookupCategory::firstOrCreate(
                ['name' => $category['name'], 'type' => $category['type']],
                $category
            );
        }

        // Seed statuses
        $statuses = [
            // Incident statuses
            ['name' => 'Active', 'type' => 'incident', 'is_active' => true],
            ['name' => 'Resolved', 'type' => 'incident', 'is_active' => true],
            ['name' => 'Under Investigation', 'type' => 'incident', 'is_active' => true],
            
            // Patient statuses
            ['name' => 'Active', 'type' => 'patient', 'is_active' => true],
            ['name' => 'Discharged', 'type' => 'patient', 'is_active' => true],
            ['name' => 'Transferred', 'type' => 'patient', 'is_active' => true],
            
            // Dispatch statuses
            ['name' => 'Dispatched', 'type' => 'dispatch', 'is_active' => true],
            ['name' => 'Delivered', 'type' => 'dispatch', 'is_active' => true],
            ['name' => 'Cancelled', 'type' => 'dispatch', 'is_active' => true],
            
            // Personnel statuses
            ['name' => 'Active', 'type' => 'personnel', 'is_active' => true],
            ['name' => 'On Leave', 'type' => 'personnel', 'is_active' => true],
            ['name' => 'Retired', 'type' => 'personnel', 'is_active' => true],
            
            // Request statuses
            ['name' => 'Pending', 'type' => 'request', 'is_active' => true],
            ['name' => 'Approved', 'type' => 'request', 'is_active' => true],
            ['name' => 'Rejected', 'type' => 'request', 'is_active' => true],
            ['name' => 'Completed', 'type' => 'request', 'is_active' => true],
        ];

        foreach ($statuses as $status) {
            LookupStatus::firstOrCreate(
                ['name' => $status['name'], 'type' => $status['type']],
                $status
            );
        }
    }
}
