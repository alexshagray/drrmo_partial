<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class PasswordChangeController extends Controller
{
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function requestPasswordChange(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
            'new_password_confirmation' => 'required|string',
        ]);

        // Check if passwords match
        if ($validated['new_password'] !== $validated['new_password_confirmation']) {
            return response()->json([
                'message' => 'The new password field confirmation does not match.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 400);
        }

        // Send OTP to the user's email with password change data
        $this->otpService->generateAndSendOtp($user->email, null, null, [
            'user_id' => $user->id,
            'new_password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'OTP sent to your email. Please verify to change your password.',
            'email' => $user->email,
        ]);
    }

    public function verifyPasswordChange(Request $request)
    {
        $validated = $request->validate([
            'otp' => 'required|digits:6',
            'email' => 'required|email',
        ]);

        // Get OTP record with password change data
        $otp = \App\Models\Otp::where('code', $validated['otp'])
            ->where('email', $validated['email'])
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP code.',
            ], 400);
        }

        $passwordChangeData = $otp->data ?? null;

        if (!$passwordChangeData || !isset($passwordChangeData['user_id']) || !isset($passwordChangeData['new_password'])) {
            return response()->json([
                'message' => 'Password change data not found. Please try again.',
            ], 400);
        }

        $user = User::find($passwordChangeData['user_id']);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        // Update password
        $user->update([
            'password' => $passwordChangeData['new_password'],
        ]);

        // Delete the OTP record
        $otp->delete();

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
