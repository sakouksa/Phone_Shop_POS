<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\SaleItemRequest;
use App\Models\SaleItems;
use Illuminate\Http\Request;

class SaleItemController extends Controller
{
    public function index(Request $request)
    {
        $query = SaleItems::query();

        if ($request->filled('sale_id')) {
            $query->where('sale_id', $request->sale_id);
        }

        $items = $query->with(['sale', 'product'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'list'     => $items,
            'products' => Product::all(),
        ]);
    }

    public function store(SaleItemRequest $request)
    {
        $data = $request->validated();

        // គណនាតម្លៃសរុប
        $data['total_line_price'] = ($request->quantity * $request->unit_price) - ($request->discount_item ?? 0);

        $item = SaleItems::create($data);

        return response()->json([
            'data'    => $item->load('product'),
            'message' => 'រក្សាទុកទំនិញក្នុងវិក្កយបត្របានជោគជ័យ!',
        ], 201);
    }

    public function show($id)
    {
        $item = SaleItems::with(['sale', 'product'])->find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញក្នុងវិក្កយបត្រ'], 404);
        }

        return response()->json(['data' => $item]);
    }

    public function update(SaleItemRequest $request, $id)
    {
        $item = SaleItems::find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញក្នុងវិក្កយបត្រ'], 404);
        }

        $data = $request->validated();
        $data['total_line_price'] = ($request->quantity * $request->unit_price) - ($request->discount_item ?? 0);

        $item->update($data);

        return response()->json([
            'data'    => $item->load('product'),
            'message' => 'កែប្រែទំនិញក្នុងវិក្កយបត្របានជោគជ័យ!',
        ]);
    }

    public function destroy($id)
    {
        $item = SaleItems::find($id);

        if (!$item) {
            return response()->json(['message' => 'រកមិនឃើញទំនិញ'], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបទំនិញក្នុងវិក្កយបត្របានជោគជ័យ',
        ]);
    }
}
