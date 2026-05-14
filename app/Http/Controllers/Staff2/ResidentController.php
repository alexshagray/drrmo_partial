<?php

namespace App\Http\Controllers\Staff2;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index()
    {
        $residents = Resident::orderBy('last_name')->orderBy('first_name')->get();
        return inertia('Staff2/ResidentDetails', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|in:Male,Female',
            'civil_status' => 'required|in:Single,Married,Widowed,Divorced',
            'barangay' => 'required|string|max:255',
            'zone_sitio' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:255',
        ]);

        Resident::create($validated);

        return redirect()->back()->with('success', 'Resident added successfully!');
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|in:Male,Female',
            'civil_status' => 'required|in:Single,Married,Widowed,Divorced',
            'barangay' => 'required|string|max:255',
            'zone_sitio' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:255',
        ]);

        $resident->update($validated);

        return redirect()->back()->with('success', 'Resident updated successfully!');
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();

        return redirect()->back()->with('success', 'Resident deleted successfully!');
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $residents = Resident::where(function ($q) use ($query) {
            $q->where('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%")
              ->orWhere('barangay', 'like', "%{$query}%")
              ->orWhere('zone_sitio', 'like', "%{$query}%");
        })
        ->orderBy('last_name')
        ->orderBy('first_name')
        ->limit(10)
        ->get();

        return response()->json($residents);
    }
}
