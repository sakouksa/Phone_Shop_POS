<?php

namespace App\Http\Controllers;

use App\Models\Sub_categories;
use App\Models\Categories;
use App\Http\Requests\SubCategoryRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SubCategoryController extends Controller
{
    // Get list of subcategories with filters and pagination
    public function index(Request $request)
    {
        $query = Sub_categories::query(); // ORM Eloquent

        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }
        if ($request->has('category_id')) {
            $query->where("category_id", "=", $request->input("category_id"));
        }
        if ($request->has('txt_search')) {
            $query->where("name", "LIKE", "%" . $request->input("txt_search") . "%");
        }
        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }

        $sub_categories = $query->with(['category'])->orderBy('id', 'desc')->get(); // Fetch list with related category data

        return response()->json([
            "list"     => $sub_categories,
            "category" => Categories::all(),
        ]);
    }

    // Store a new subcategory
    public function store(SubCategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            // crate Folder sub_categories in storage/app/public
            $data['image'] = $request->file('image')->store('sub_categories', 'public');
        }

        $sub = Sub_categories::create($data);
        return response()->json([
            "message" => "រក្សាទុកអនុប្រភេទបានជោគជ័យ!",
            "data"    => $sub,
        ], 201);
    }

    // Show a single subcategory
    public function show(string $id)
    {
        $sub = Sub_categories::with('category')->find($id);
        if (!$sub) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }
        return response()->json([
            "data" => $sub,
        ], 200);
    }

    // Update the specified resource in storage
    public function update(SubCategoryRequest $request, string $id)
    {
        $sub = Sub_categories::find($id);
        if (!$sub) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            if ($sub->image) {
                Storage::disk('public')->delete($sub->image);
            }
            $data['image'] = $request->file('image')->store('sub_categories', 'public');
        }

        if ($request->image_remove != "") {
            if ($sub->image) {
                Storage::disk('public')->delete($sub->image);
            }
            $data['image'] = null;
        }

        $sub->update($data);
        return response()->json([
            "data"    => $sub,
            "message" => "ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!",
        ], 200);
    }

    // Delete a subcategory
    public function destroy(string $id)
    {
        $sub = Sub_categories::find($id);

        if (!$sub) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        if ($sub->image) {
            Storage::disk('public')->delete($sub->image);
        }

        $sub->delete();

        return response()->json([
            "message" => "លុបបានជោគជ័យ!",
            "data"    => $sub
        ], 200);
    }
}
