<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class RegisterController extends Controller
{
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Send OTP to the user's email with registration data
        $this->otpService->generateAndSendOtp(
            $validated['email'],
            $validated['name'],
            Hash::make($validated['password']),
            ['username' => $validated['username']]
        );

        return response()->json([
            'message' => 'OTP sent to your email. Please verify your account.',
            'email' => $validated['email'],
        ]);
    }

    public function verifyRegistration(Request $request)
    {
        $validated = $request->validate([
            'otp' => 'required|digits:6',
        ]);

        // Get OTP record with registration data
        $otp = \App\Models\Otp::where('code', $validated['otp'])
            ->where('verified', false)
            ->where('expires_at', '>', \Carbon\Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP code.',
            ], 400);
        }

        if (!$otp->registration_name || !$otp->registration_password) {
            return response()->json([
                'message' => 'Registration data not found. Please register again.',
            ], 400);
        }

        // Verify OTP
        $isOtpValid = $this->otpService->verifyOtp($otp->email, $validated['otp']);

        if (!$isOtpValid) {
            return response()->json([
                'message' => 'Invalid or expired OTP code.',
            ], 400);
        }

        // Get username from OTP data
        $username = $otp->data['username'] ?? null;
        
        if (!$username) {
            return response()->json([
                'message' => 'Username not found in registration data. Please register again.',
            ], 400);
        }

        // Create user with pending status
        User::create([
            'name' => $otp->registration_name,
            'email' => $otp->email,
            'username' => $username,
            'password' => $otp->registration_password,
            'role' => 'mobile', // Default role for mobile users
            'is_approved' => false, // Pending admin approval
        ]);

        return response()->json([
            'message' => 'Account created successfully. Your account is pending admin approval.',
        ]);
    }
}
