<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\LookupCategory;
use App\Models\LookupStatus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IncidentApiController extends Controller
{
    public function index(): JsonResponse
    {
        $incidents = Incident::with(['patients', 'dispatches', 'type', 'severity', 'status'])
            ->orderBy('reported_at', 'desc')
            ->get()
            ->map(function ($incident) {
                return [
                    'id' => (string) $incident->id,
                    'responder_id' => $incident->responder_id,
                    'location' => $incident->location_name ?? 'Unknown Location',
                    'call_information' => $incident->description,
                    'status' => $incident->status?->name ?? $incident->status_id,
                    'severity' => $incident->severity?->name ?? $incident->severity_id,
                    'type' => $incident->type?->name ?? $incident->type_id,
                    'latitude' => $incident->latitude,
                    'longitude' => $incident->longitude,
                    'created_at' => $incident->reported_at?->toDateString() ?? $incident->created_at?->toDateString(),
                    'patients_count' => $incident->patients->count(),
                    'dispatches_count' => $incident->dispatches->count(),
                    'is_verified' => $incident->is_verified,
                    'verified_at' => $incident->verified_at?->toDateTimeString(),
                    'verified_by' => $incident->verified_by,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $incidents,
        ]);
    }

    public function show(Incident $incident): JsonResponse
    {
        $incident->load(['patients', 'dispatches', 'type', 'severity', 'status']);
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => (string) $incident->id,
                'responder_id' => $incident->responder_id,
                'location' => $incident->location_name ?? 'Unknown Location',
                'call_information' => $incident->description,
                'status' => $incident->status?->name ?? $incident->status_id,
                'severity' => $incident->severity?->name ?? $incident->severity_id,
                'type' => $incident->type?->name ?? $incident->type_id,
                'latitude' => $incident->latitude,
                'longitude' => $incident->longitude,
                'title' => $incident->title,
                'created_at' => $incident->reported_at?->toDateString() ?? $incident->created_at?->toDateString(),
                'patients' => $incident->patients,
                'dispatches' => $incident->dispatches,
                'is_verified' => $incident->is_verified,
                'verified_at' => $incident->verified_at?->toDateTimeString(),
                'verified_by' => $incident->verified_by,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'age' => 'nullable|string|max:50',
            'gender' => 'nullable|string|max:20',
            'civil_status' => 'nullable|string|max:50',
            'contact_number' => 'nullable|string|max:50',
            'location_name' => 'nullable|string|max:255',
            'call_information' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'required|string|max:100',
            'severity' => 'required|string|max:100',
            'type' => 'required|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'responders' => 'nullable|string|max:255',
            'received_by' => 'nullable|string|max:255',
        ]);

        // Look up foreign keys from lookup tables
        $status = LookupStatus::where('name', $validated['status'])
            ->where('type', 'incident')
            ->first();
        
        $severity = LookupCategory::where('name', $validated['severity'])
            ->where('type', 'severity')
            ->first();
        
        $type = LookupCategory::where('name', $validated['type'])
            ->where('type', 'incident_type')
            ->first();

        $incident = Incident::create([
            'title' => $validated['title'],
            'age' => $validated['age'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'civil_status' => $validated['civil_status'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'location_name' => $validated['location_name'] ?? $validated['title'],
            'description' => $validated['description'] ?? $validated['call_information'] ?? null,
            'status_id' => $status?->id,
            'severity_id' => $severity?->id,
            'type_id' => $type?->id,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'responders' => $validated['responders'] ?? null,
            'received_by' => $validated['received_by'] ?? null,
            'reported_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Incident reported successfully',
            'data' => [
                'id' => (string) $incident->id,
                'location' => $incident->location_name,
                'status' => $incident->status?->name,
                'severity' => $incident->severity?->name,
                'created_at' => $incident->reported_at->toDateString(),
            ],
        ], 201);
    }

    public function update(Request $request, Incident $incident): JsonResponse
    {
        $validated = $request->validate([
            'location' => 'sometimes|string|max:255',
            'call_information' => 'nullable|string',
            'status' => 'sometimes|string|max:100',
            'severity' => 'sometimes|string|max:100',
            'type' => 'sometimes|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if (isset($validated['location'])) {
            $incident->location_name = $validated['location'];
            $incident->title = $validated['location'];
        }
        if (isset($validated['call_information'])) {
            $incident->description = $validated['call_information'];
        }
        if (isset($validated['status'])) {
            $status = LookupStatus::where('name', $validated['status'])
                ->where('type', 'incident')
                ->first();
            $incident->status_id = $status?->id;
        }
        if (isset($validated['severity'])) {
            $severity = LookupCategory::where('name', $validated['severity'])
                ->where('type', 'severity')
                ->first();
            $incident->severity_id = $severity?->id;
        }
        if (isset($validated['type'])) {
            $type = LookupCategory::where('name', $validated['type'])
                ->where('type', 'incident_type')
                ->first();
            $incident->type_id = $type?->id;
        }
        if (array_key_exists('latitude', $validated)) {
            $incident->latitude = $validated['latitude'];
        }
        if (array_key_exists('longitude', $validated)) {
            $incident->longitude = $validated['longitude'];
        }

        $incident->save();

        return response()->json([
            'success' => true,
            'message' => 'Incident updated successfully',
            'data' => [
                'id' => (string) $incident->id,
                'location' => $incident->location_name,
                'status' => $incident->status?->name,
                'severity' => $incident->severity?->name,
                'created_at' => $incident->reported_at?->toDateString(),
            ],
        ]);
    }

    public function destroy(Incident $incident): JsonResponse
    {
        $incident->delete();

        return response()->json([
            'success' => true,
            'message' => 'Incident deleted successfully',
        ]);
    }

    public function verify(Request $request, Incident $incident): JsonResponse
    {
        $validated = $request->validate([
            'verified_by' => 'required|string|max:255',
        ]);

        $incident->update([
            'is_verified' => true,
            'verified_at' => now(),
            'verified_by' => $validated['verified_by'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Incident verified successfully',
            'data' => [
                'id' => (string) $incident->id,
                'is_verified' => true,
                'verified_at' => $incident->verified_at->toDateTimeString(),
                'verified_by' => $incident->verified_by,
            ],
        ]);
    }
}
