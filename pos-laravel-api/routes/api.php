<?php

use App\Http\Controllers\ImeiTrackingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\SupplierController;
//  Public Routes

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//Protected Routes (Requires JWT Token)
Route::middleware('auth:api')->group(function () {

    // Get Authenticated User Info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('sub_categories', SubCategoryController::class);
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('imei-trackings', ImeiTrackingController::class);
});
