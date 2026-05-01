<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\SupplierRequest;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    // Filter data with text search and status
    public function index(Request $req)
    {
        $supplier = Supplier::query();

        if ($req->filled("text_search")) {
            $supplier->where("name", "LIKE", "%" . $req->text_search . "%")
                ->orWhere("contact_person", "LIKE", "%" . $req->text_search . "%");
        }

        if ($req->has("status")) {
            $supplier->where("status", $req->status);
        }

        return response()->json([
            'list' => $supplier->orderBy('id', 'desc')->get(),
        ]);
    }

    // store data
    public function store(SupplierRequest $request)
    {
        $data = $request->validated();

        $supplier = Supplier::create($data);

        return response()->json([
            'data'    => $supplier,
            'message' => 'រក្សាទុកជោគជ័យ!',
        ]);
    }

    // show data by id
    public function show($id)
    {
        $supplier = Supplier::find($id);

        if ($supplier) {
            return response()->json([
                'data' => $supplier,
            ]);
        }

        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }

    // update data
    public function update(SupplierRequest $request, $id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }

        $data = $request->validated();

        $supplier->update($data);

        return response()->json([
            'data'    => $supplier,
            'message' => 'កែប្រែបានជោគជ័យ!',
        ]);
    }

    // delete data
    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if ($supplier) {
            $supplier->delete();
            return response()->json(['success' => true, 'message' => 'លុបជោគជ័យ']);
        }

        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }
}
