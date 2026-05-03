<?php

namespace App\Http\Controllers;

use App\Models\ImeiTrackings;
use App\Http\Requests\ImeiTrackingRequest;
use App\Models\Product;
use App\Models\Purchase_Orders;
use App\Models\PurchaseOrders;
use App\Models\Supplier;
use App\Models\Sale;
use Illuminate\Http\Request;

class ImeiTrackingController extends Controller
{
    public function index(Request $req)
    {
        $query = ImeiTrackings::query();

        if ($req->filled('text_search')) {
            $query->where('imei_number', 'like', '%' . $req->input('text_search') . '%');
        }
        if ($req->filled('product_id')) {
            $query->where('product_id', $req->input('product_id'));
        }
        if ($req->filled('supplier_id')){
            $query->where('supplier_id', $req->input('supplier_id'));
        }
        if ($req->filled('purchase_id')){
            $query->where('purchase_id', $req->input('purchase_id'));
        }
        if ($req->filled('sale_id')){
            $query->where('sale_id', $req->input('sale_id'));
        }
        if ($req->filled('status')) {
            $query->where('status', $req->input('status'));
        }

        $imei_tracking = $query->with(['product', 'supplier', 'purchaseOrder', "sale"])->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $imei_tracking,
            "product" => Product::all(),
            "supplier" => Supplier::all(),
            "purchase" => PurchaseOrders::all(),
            "sale" => Sale::all(),
        ]);
    }

    public function store(ImeiTrackingRequest $request)
    {
        $data = $request->validated();
        $imei = ImeiTrackings::create($data);

        return response()->json([
            'data'    => $imei,
            'message' => 'រក្សាទុកជោគជ័យ!',
        ]);
    }

    public function update(ImeiTrackingRequest $request, $id)
    {
        $imei = ImeiTrackings::find($id);

        if (!$imei) {
            return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }

        $data = $request->validated();
        $imei->update($data);

        return response()->json([
            'data'    => $imei,
            'message' => 'កែប្រែបានជោគជ័យ!',
        ]);
    }

    public function destroy($id)
    {
        $imei = ImeiTrackings::find($id);
        if ($imei) {
            $imei->delete();
            return response()->json(['success' => true, 'message' => 'លុបជោគជ័យ']);
        }
        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }
}
