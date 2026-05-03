<?php
namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Customer;
use App\Models\SaleItems;
use App\Models\User;
use App\Http\Requests\SaleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    // ទាញយកទិន្នន័យ
    public function index(Request $request)
    {
        $query = Sale::query();

        if ($request->filled('text_search')) {
            $query->where('invoice_number', 'LIKE', '%' . $request->text_search . '%');
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sales = $query->with(['customer', 'user', 'items.product'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'list'      => $sales,
            'customer'  => Customer::where('status', 1)->get(),
            'user'      => User::all(),
        ]);
    }

    // រក្សាទុកទិន្នន័យ (រក្សាវិក្កយបត្រ)
    public function store(SaleRequest $request)
    {
        $data = $request->validated();

        // បង្កើតលេខកូដវិក្កយបត្រដោយស្វ័យប្រវត្តិ ប្រសិនបើមិនបានផ្ញើមក
        $data['invoice_number'] = $request->invoice_number ?? 'INV-' . now()->format('Ymd') . '-' . rand(1000, 9999);

        DB::beginTransaction();
        try {
            $sale = Sale::create($data);

            // រក្សាទុក items ចូលក្នុងតារាង sale_items
            foreach ($request->items as $item) {
                SaleItems::create([
                    'sale_id'          => $sale->id,
                    'product_id'       => $item['product_id'],
                    'imei_number'      => $item['imei_number'] ?? null,
                    'quantity'         => $item['quantity'],
                    'unit_price'       => $item['unit_price'],
                    'discount_item'    => $item['discount_item'] ?? 0,
                    'total_line_price' => ($item['quantity'] * $item['unit_price']) - ($item['discount_item'] ?? 0),
                ]);
            }

            DB::commit();

            return response()->json([
                'data'    => $sale->load('items'),
                'message' => 'រក្សាទុកវិក្កយបត្របានជោគជ័យ!',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលរក្សាទុកវិក្កយបត្រ!',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // បង្ហាញទិន្នន័យតាម ID
    public function show($id)
    {
        $sale = Sale::with(['customer', 'user', 'items.product'])->find($id);

        if (!$sale) {
            return response()->json(['message' => 'រកមិនឃើញវិក្កយបត្រ'], 404);
        }

        return response()->json(['data' => $sale]);
    }

    // កែប្រែទិន្នន័យ
    public function update(SaleRequest $request, $id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json(['message' => 'រកមិនឃើញវិក្កយបត្រ'], 404);
        }

        $data = $request->validated();

        DB::beginTransaction();
        try {
            $sale->update($data);

            // លុប items ចាស់ចេញ រួចបញ្ចូល items ថ្មីចូលវិញ
            $sale->items()->delete();

            foreach ($request->items as $item) {
                \App\Models\SaleItem::create([
                    'sale_id'          => $sale->id,
                    'product_id'       => $item['product_id'],
                    'imei_number'      => $item['imei_number'] ?? null,
                    'quantity'         => $item['quantity'],
                    'unit_price'       => $item['unit_price'],
                    'discount_item'    => $item['discount_item'] ?? 0,
                    'total_line_price' => ($item['quantity'] * $item['unit_price']) - ($item['discount_item'] ?? 0),
                ]);
            }

            DB::commit();

            return response()->json([
                'data'    => $sale->load('items'),
                'message' => 'កែប្រែវិក្កយបត្របានជោគជ័យ!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងពេលកែប្រែវិក្កយបត្រ!',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // លុបទិន្នន័យ
    public function destroy($id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json(['message' => 'រកមិនឃើញវិក្កយបត្រ'], 404);
        }

        $sale->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបវិក្កយបត្របានជោគជ័យ',
        ]);
    }
}
