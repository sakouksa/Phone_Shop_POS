<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;


//  Public Routes

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//Protected Routes (Requires JWT Token)
Route::middleware('auth:api')->group(function () {

    // Get Authenticated User Info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Categories & Sub-Categories
    Route::apiResource('categories', CategoryController::class);
    Route::post('categories/change-status/{id}', [CategoryController::class, 'changeStatus']);

    Route::apiResource('sub-categories', SubCategoryController::class);
    Route::post('sub-categories/change-status/{id}', [SubCategoryController::class, 'changeStatus']);
});