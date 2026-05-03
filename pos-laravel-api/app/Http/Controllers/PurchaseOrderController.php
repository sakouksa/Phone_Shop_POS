<?php
namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;
use App\Http\Requests\PurchaseOrderRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    // select data all
    public function index(Request $request)
    {
        $query = PurchaseOrder::query();

        if ($request->filled('text_search')) {
            $query->where('po_number', 'LIKE', '%' . $request->text_search . '%');
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $purchaseOrders = $query->with(['supplier', 'user', 'items.product'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'list' => $purchaseOrders,
            'supplier' => Supplier::where('status', 'active')->get(),
            'user' => User::all(),
        ]);
    }

    // store data
    public function store(PurchaseOrderRequest $request)
    {
        $data = $request->validated();

        // បង្កើតលេខកូដ PO ដោយស្វ័យប្រវត្តិ ប្រសិនបើមិនបានផ្ញើមក
        $data['po_number'] = $request->po_number ?? 'PO-' . now()->format('Ymd') . '-' . rand(1000, 9999);

        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::create($data);

            // រក្សាទុក items ចូលក្នុងតារាង purchase_order_items
            foreach ($request->items as $item) {
                \App\Models\PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_line_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'data'    => $purchaseOrder->load('items'),
                'message' => 'រក្សាទុកការបញ្ជាទិញបានជោគជ័យ!',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលរក្សាទុក!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // show find ID
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'user', 'items.product'])->find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'រកមិនឃើញការបញ្ជាទិញ'], 404);
        }

        return response()->json(['data' => $purchaseOrder]);
    }

    // Update data
    public function update(PurchaseOrderRequest $request, $id)
    {
        $purchaseOrder = PurchaseOrder::find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'រកមិនឃើញការបញ្ជាទិញ'], 404);
        }

        $data = $request->validated();

        DB::beginTransaction();
        try {
            $purchaseOrder->update($data);

            // លុប items ចាស់ចេញ រួចបញ្ចូល items ថ្មីចូលវិញ
            $purchaseOrder->items()->delete();

            foreach ($request->items as $item) {
                \App\Models\PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_line_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'data'    => $purchaseOrder->load('items'),
                'message' => 'កែប្រែការបញ្ជាទិញបានជោគជ័យ!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលកែប្រែ!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // delete data
    public function destroy($id)
    {
        $purchaseOrder = PurchaseOrder::find($id);

        if (!$purchaseOrder) {
            return response()->json(['message' => 'រកមិនឃើញការបញ្ជាទិញ'], 404);
        }

        $purchaseOrder->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបការបញ្ជាទិញបានជោគជ័យ',
        ]);
    }
}
