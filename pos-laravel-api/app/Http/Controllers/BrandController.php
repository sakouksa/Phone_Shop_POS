<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Http\Requests\BrandRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    // Display a listing of the resource with filters
    public function index(Request $request)
    {
        $query = Brand::query();

        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }
        if ($request->has('txt_search')) {
            $searchTerm = $request->input('txt_search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where("name", "LIKE", "%" . $searchTerm . "%")
                    ->orWhere("country", "LIKE", "%" . $searchTerm . "%");
            });
        }
        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }
        $brands = $query->orderBy('id', 'desc')->get();

        return response()->json([
            "list" => $brands,
        ]);
    }

    // Store a newly created resource in storage
    public function store(BrandRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('brands', 'public');
        }

        $brand = Brand::create($data);
        return response()->json([
            "message" => "រក្សាទុកម៉ាកយីហោបានជោគជ័យ!",
            "data"    => $brand,
        ], 201);
    }

    // Display the specified resource
    public function show(string $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        return response()->json([
            "data" => $brand,
        ], 200);
    }

    // Update the specified resource in storage
    public function update(BrandRequest $request, string $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }
            $data['image'] = $request->file('image')->store('brands', 'public');
        }

        if ($request->image_remove != "") {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }
            $data['image'] = null; //null
        }

        $brand->update($data);
        return response()->json([
            "data"    => $brand,
            "message" => "ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!",
        ], 200);
    }

    // Remove the specified resource from storage
    public function destroy(string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }

        $brand->delete();

        return response()->json([
            "message" => "លុបបានជោគជ័យ!",
            "data"    => $brand,
        ], 200);
    }
}
