<?php
namespace App\Http\Controllers;

use App\Models\PurchaseOrderItem;
use App\Models\Product;
use App\Http\Requests\PurchaseOrderItemRequest;
use Illuminate\Http\Request;

class PurchaseOrderItemController extends Controller
{
    // select data all
    public function index(Request $request)
    {
        $query = PurchaseOrderItem::query();

        if ($request->filled('purchase_order_id')) {
            $query->where('purchase_order_id', $request->purchase_order_id);
        }

        $items = $query->with(['purchaseOrder', 'product'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'list' => $items,
            'products' => Product::all(),
        ]);
    }

    // store data
    public function store(PurchaseOrderItemRequest $request)
    {
        $data = $request->validated();

        // គណនាតម្លៃសរុបដោយស្វ័យប្រវត្តិ
        $data['total_line_price'] = $request->quantity * $request->unit_price;

        $item = PurchaseOrderItem::create($data);

        return response()->json([
            'data'    => $item->load('product'),
            'message' => 'រក្សាទុកទំនិញបានជោគជ័យ!',
        ], 201);
    }

    // show find ID
    public function show($id)
    {
        $item = PurchaseOrderItem::with(['purchaseOrder', 'product'])->find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        return response()->json(['data' => $item]);
    }

    // Update data
    public function update(PurchaseOrderItemRequest $request, $id)
    {
        $item = PurchaseOrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        $data = $request->validated();
        $data['total_line_price'] = $request->quantity * $request->unit_price;

        $item->update($data);

        return response()->json([
            'data'    => $item->load('product'),
            'message' => 'កែប្រែទំនិញបានជោគជ័យ!',
        ]);
    }

    // Delete data
    public function destroy($id)
    {
        $item = PurchaseOrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបទំនិញបានជោគជ័យ',
        ]);
    }
}
