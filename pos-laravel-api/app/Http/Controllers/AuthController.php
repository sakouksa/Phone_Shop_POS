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
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable',
            'address' => 'nullable',
            'type' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,png,gif|max:5120',
        ]);
        //create the user
        $user = User::create([
            'name' => $request->name, //body json client $request->name | $request->input('name')
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        //Handle the image upload if exist
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('profile', 'public');
        }
        //create the profile
        $user->profile()->create([
            'phone' => $request->phone,
            'address' => $request->address,
            'image' => $imagePath,
            'type' => $request->type,
        ]);

        return response()->json([
            'user' => $user->load('profile'),
            'message' => 'Register successfully ',
        ], 201);
    }
    // Login a user and return a JWT token
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);
        // attempt to verify the credentials and create a token for the user
        $credentials = $request->only('email', 'password');

        // verify the credentials and create a token for the user
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'error' => 'អ៊ីមែល ឬលេខសម្ងាត់របស់អ្នកមិនត្រឹមត្រូវទេ!'
            ], 401);
        }
        $user = auth()->user()->load('profile');
        //Access Token
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'user'         => $user,
            'message'      => 'ចូលប្រើបានជោគជ័យ!',
        ]);
    }
}