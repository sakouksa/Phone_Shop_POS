<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
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

        $purchaseOrders = $query->with(['supplier', 'createdBy', 'purchaseOrderItems.product', 'paymentMethod'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'list' => $purchaseOrders,
            'supplier' => Supplier::where('status', 'active')->get(),
            'payment_method' => PaymentMethod::where('status', 'active')->get(),
            'user' => User::all(),
        ]);
    }

    // store data
    public function store(PurchaseOrderRequest $request)
    {
        $data = $request->validated();

        // ពិនិត្យនិងទប់ស្កាត់ការជាន់គ្នានៃលេខកូដ PO ក្នុង Database
        do {
            $poNumber = $request->po_number ?? 'PO-' . now()->format('Ymd') . '-' . rand(1000, 9999);
        } while (PurchaseOrder::where('po_number', $poNumber)->exists());

        $data['po_number'] = $poNumber;
        $data['order_date'] = $request->order_date ?? now()->format('Y-m-d');
        $data['sub_total'] = $request->sub_total ?? 0.00;
        $data['grand_total'] = $request->grand_total ?? $request->sub_total ?? 0.00;

        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::create($data);

            // 📌 ពិនិត្យមើលថាតើមាន Items ផ្ញើមក និងមានទំហំធំជាង ០ ដែរឬទេ
            if ($request->has('items') && is_array($request->items) && count($request->items) > 0) {
                foreach ($request->items as $item) {
                    if (is_array($item) && isset($item['product_id'])) {
                        \App\Models\PurchaseOrderItem::create([
                            'purchase_order_id' => $purchaseOrder->id,
                            'product_id' => $item['product_id'],
                            'quantity' => $item['quantity'] ?? 1,
                            'unit_price' => $item['unit_price'] ?? 0.00,
                            'total_line_price' => ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0.00),
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'data'    => $purchaseOrder->load('purchaseOrderItems'),
                'message' => 'រក្សាទុកការបញ្ជាទិញបានជោគជ័យ!',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលរក្សាទុក!',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }


    // show find ID
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'createdBy', 'purchaseOrderItems.product', 'paymentMethod'])->find($id);

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

        $data['sub_total'] = $request->sub_total ?? 0.00;
        $data['grand_total'] = $request->grand_total ?? $request->sub_total ?? 0.00;

        DB::beginTransaction();
        try {
            $purchaseOrder->update($data);

            // លុប items ចាស់ចេញ
            $purchaseOrder->purchaseOrderItems()->delete();

            if ($request->has('items') && is_array($request->items)) {
                foreach ($request->items as $item) {
                    \App\Models\PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_line_price' => $item['quantity'] * $item['unit_price'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'data'    => $purchaseOrder->load(['purchaseOrderItems', 'paymentMethod']),
                'message' => 'កែប្រែការបញ្ជាទិញបានជោគជ័យ!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលកែប្រែ!',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
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
