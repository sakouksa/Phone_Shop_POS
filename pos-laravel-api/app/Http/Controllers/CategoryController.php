<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Http\Requests\CategoryRequest; // Import Request ថ្មី
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // Filter data with text search and status
    public function index(Request $req)
    {
        $cat = Categories::withCount('subCategories');

        if ($req->filled("text_search")) {
            $cat->where("name", "LIKE", "%" . $req->text_search . "%");
        }

        if ($req->has("status")) {
            $cat->where("status", $req->status);
        }

        return response()->json([
            'list' => $cat->orderBy('id', 'desc')->get(),
        ]);
    }
    // store data
    public function store(CategoryRequest $request)
    {
        // Validate the request data using CategoryRequest
        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        $cat = Categories::create($data);

        return response()->json([
            'data'    => $cat,
            'message' => 'រក្សាទុកជោគជ័យ!',
        ]);
    }
    // show data by id
    public function show($id)
    {
        $cat = Categories::with('subCategories')->find($id);
        if ($cat) {
            return response()->json([
                'data' => $cat,
            ]);
        }
        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }

    // update data
    public function update(CategoryRequest $request, $id)
    {
        $cat = Categories::find($id);

        if (!$cat) {
            return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        $cat->update($data);

        return response()->json([
            'data'    => $cat,
            'message' => 'កែប្រែបានជោគជ័យ!',
        ]);
    }
    // delete data
    public function destroy($id)
    {
        $category = Categories::find($id);
        if ($category) {
            $category->delete();
            return response()->json(['success' => true, 'message' => 'លុបជោគជ័យ']);
        }
        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }
}