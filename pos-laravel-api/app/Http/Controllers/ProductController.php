<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Categories;
use App\Models\Product;
use App\Http\Requests\ProductRequest; // ហៅ Request មកប្រើ
use App\Models\Sub_Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // ទាញយកទិន្នន័យ
    public function index(Request $request)
    {
        $query = Product::query(); //ORM Eloquent

        if ($request->filled('text_search')) {
            $query->where('name', 'LIKE', '%' . $request->text_search . '%')
                ->orWhere('sku', 'LIKE', '%' . $request->text_search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }
        $product = $query->with(['category', 'brand', 'sub_category'])->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $product,
            "category" => Categories::all(),
            "brand" => Brand::all(),
            "sub_category" => Sub_Categories::all(),
        ]);
    }

    // រក្សាទុកទិន្នន័យ
    public function store(ProductRequest $request)
    {
        // ទិន្នន័យដែលឆ្លងកាត់ Validation ត្រូវបានផ្ទុកក្នុង validated()
        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = $imagePath;
        }

        $product = Product::create($data);

        return response()->json([
            'data'    => $product,
            'message' => 'រក្សាទុកទំនិញបានជោគជ័យ!',
        ], 201);
    }

    // បង្ហាញទិន្នន័យតាម ID
    public function show($id)
    {
        $product = Product::with(['category', 'brand', 'subCategory', 'imeiTrackings'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        return response()->json(['data' => $product]);
    }

    // កែប្រែទិន្នន័យ
    public function update(ProductRequest $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = $imagePath;
        }

        $product->update($data);

        return response()->json([
            'data'    => $product,
            'message' => 'កែប្រែទំនិញបានជោគជ័យ!',
        ]);
    }

    // លុបទិន្នន័យ
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបទំនិញបានជោគជ័យ',
        ]);
    }
}
