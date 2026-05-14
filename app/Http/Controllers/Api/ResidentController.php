<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $residents = Resident::where(function ($q) use ($query) {
            $q->where('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%")
              ->orWhere('address', 'like', "%{$query}%")
              ->orWhere('barangay', 'like', "%{$query}%");
        })
        ->orderBy('last_name')
        ->orderBy('first_name')
        ->limit(10)
        ->get();

        return response()->json($residents);
    }
}
