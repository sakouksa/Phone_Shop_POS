<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubCategoryRequest;
use App\Models\Sub_categories; // ឬ SubCategory តាមឈ្មោះ Model បង
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SubCategoryController extends Controller
{
    // ទាញយកបញ្ជី Sub-categories ព្រមទាំង Search និង Filter តាម Category មេ
    public function index(Request $req)
    {
        $query = Sub_categories::with('category'); // ទាញទាំងព័ត៌មាន Category មេមកជាមួយ

        // ស្វែងរកតាមឈ្មោះ
        if ($req->has("text_search")) {
            $query->where("name", "LIKE", "%" . $req->input("text_search") . "%");
        }

        // Filter តាម Category មេ (ឧទាហរណ៍៖ ចង់មើលតែ Sub-category របស់ iPhone)
        if ($req->has("category_id")) {
            $query->where("category_id", "=", $req->input("category_id"));
        }

        // Filter តាមស្ថានភាព
        if ($req->has("status")) {
            $query->where("status", "=", $req->input("status"));
        }

        $list = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $list,
        ]);
    }

    // បង្កើត Sub-category ថ្មី
    public function store(SubCategoryRequest $request)
    {
        $subCategory = Sub_categories::create($request->validated());

        return response()->json([
            'data' => $subCategory,
            'message' => 'បានបង្កើតប្រភេទកូនថ្មីដោយជោគជ័យ',
        ]);
    }

    // បង្ហាញព័ត៌មានលម្អិត
    public function show(string $id)
    {
        $subCategory = Sub_categories::with('category')->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }
        return $subCategory;
    }

    // កែប្រែទិន្នន័យ
    public function update(SubCategoryRequest $request, string $id)
    {
        $subCategory = Sub_categories::findOrFail($id);
        $subCategory->update($request->validated());

        return response()->json([
            'data' => $subCategory,
            'message' => 'បានកែប្រែទិន្នន័យដោយជោគជ័យ',
        ]);
    }

    // លុបទិន្នន័យ
    public function destroy(string $id)
    {
        $subCategory = Sub_categories::find($id);
        if (!$subCategory) {
            return response()->json([
                'error' => true,
                'message' => 'រកមិនឃើញទិន្នន័យឡើយ',
            ]);
        }

        $subCategory->delete();
        return response()->json([
            'data' => $subCategory,
            'message' => 'បានលុបទិន្នន័យដោយជោគជ័យ',
        ]);
    }

    // ផ្លាស់ប្តូរស្ថានភាព
    public function changeStatus(Request $request, $id)
    {
        $subCategory = Sub_categories::find($id);
        if (!$subCategory) {
            return response()->json([
                'error' => true,
                'message' => 'រកមិនឃើញទិន្នន័យឡើយ',
            ]);
        }

        $subCategory->status = $request->input('status');
        $subCategory->save();

        return response()->json([
            'data' => $subCategory,
            'message' => 'ស្ថានភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ',
        ]);
    }
}