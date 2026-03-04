<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

    // Register a new user
    public function register(Request $request)
    {
        // កែសម្រួល Validation ឱ្យត្រូវនឹងអ្វីដែលអ្នកផ្ញើពី Postman
        $request->validate([
            'full_name' => 'required|string|max:255',
            'username'  => 'required|string|unique:users',
            'email'     => 'required|string|email|unique:users',
            'password'  => 'required|string|min:6|confirmed',
        ]);

        // បង្កើត User ចូលទៅក្នុង Table ថ្មី
        $user = User::create([
            'full_name' => $request->full_name,
            'username'  => $request->username,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role_id'   => $request->role_id ?? null,
            'phone'     => $request->phone ?? null,
            'status'    => $request->status ?? 'active',
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'ការចុះឈ្មោះអ្នកប្រើប្រាស់បានជោគជ័យ',
        ], 201);
    }
    // Login a user and return a JWT token
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        // ចាប់យកតែ Email និង Password ពី Request
        $credentials = $request->only('email', 'password');

        // ៣. verify Database តាមរយៈ JWTAuth
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'error' => 'អ៊ីមែល ឬលេខសម្ងាត់របស់អ្នកមិនត្រឹមត្រូវទេ!'
            ], 401);
        }

        //Access Token
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'user'         => JWTAuth::user(),
        ]);
    }
}