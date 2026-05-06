<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // Display a listing of the resource with filters
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }
        if ($request->has('txt_search')) {
            $searchTerm = $request->input('txt_search');
            $query->where("name", "LIKE", "%" . $searchTerm . "%");
        }
        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }

        $categories = $query->orderBy('id', 'desc')->get();

        return response()->json([
            "list" => $categories,
            "message" => "success",
        ]);
    }

    // Store a newly created resource in storage
    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        $category = Category::create($data);

        return response()->json([
            "message" => "រក្សាទុកប្រភេទបានជោគជ័យ!",
            "data"    => $category,
        ], 201);
    }

    // Display the specified resource
    public function show(string $id)
    {
        $category = Category::with('subCategories')->find($id);
        if (!$category) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        return response()->json([
            "data" => $category,
        ], 200);
    }

    // Update the specified resource in storage
    public function update(CategoryRequest $request, string $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        $category->update($data);

        return response()->json([
            "data"    => $category,
            "message" => "កែប្រែបានជោគជ័យ!",
        ], 200);
    }

    // Remove the specified resource from storage
    public function destroy(string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $category->delete();

        return response()->json([
            "message" => "លុបបានជោគជ័យ!",
            "data"    => $category,
        ], 200);
    }
}
