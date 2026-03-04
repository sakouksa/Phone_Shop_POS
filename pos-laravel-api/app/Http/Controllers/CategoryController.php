<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Categories;
use Illuminate\Http\Request;
use App\Helpers\UploadHelper;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    use UploadHelper;

    public function index(Request $req)
    {
        $category = Categories::query();
        if ($req->filled("text_search")) {
            $category->where("name", "LIKE", "%" . $req->text_search . "%");
        }
        if ($req->filled("status")) {
            $category->where("status", $req->status);
        }
        return response()->json(['list' => $category->orderBy('id', 'desc')->get()]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('img')) {
            $data['img'] = $this->uploadImage($request->file('img'), 'categories');
        }
        $category = Categories::create($data);
        return response()->json(['data' => $category, 'message' => 'បង្កើតជោគជ័យ'], 201);
    }

    public function update(CategoryRequest $request, string $id)
    {
        $category = Categories::findOrFail($id);
        $data = $request->validated();
        if ($request->hasFile('img')) {
            $data['img'] = $this->uploadImage($request->file('img'), 'categories', $category->img);
        }
        $category->update($data);
        return response()->json(['data' => $category, 'message' => 'កែប្រែជោគជ័យ']);
    }

    public function destroy(string $id)
    {
        $category = Categories::find($id);
        if ($category) {
            $this->deleteImage('categories', $category->img);
            $category->delete();
            return response()->json(['message' => 'លុបជោគជ័យ']);
        }
        return response()->json(['message' => 'រកមិនឃើញ'], 404);
    }
}