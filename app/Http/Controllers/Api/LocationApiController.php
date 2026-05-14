<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LocationApiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
        ]);

        $location = Location::create([
            'user_id' => null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $validated['address'] ?? null,
            'captured_at' => now(),
        ]);

        return response()->json([
            'message' => 'Location saved successfully',
            'location' => $location,
        ], 201);
    }

    public function index(Request $request)
    {
        $locations = Location::with('user')
            ->orderBy('captured_at', 'desc')
            ->when($request->user_id, function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->paginate(50);

        return response()->json([
            'locations' => $locations,
        ]);
    }

    public function show(Location $location)
    {
        $location->load('user');

        return response()->json([
            'location' => $location,
        ]);
    }
}
