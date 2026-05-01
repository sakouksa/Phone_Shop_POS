<?php

namespace App\Http\Controllers;

use App\Models\Imei_Trackings;
use App\Http\Requests\ImeiTrackingRequest;
use Illuminate\Http\Request;

class ImeiTrackingController extends Controller
{
    // Filter data with text search and status
    public function index(Request $req)
    {
        // ហៅទាញយកទិន្នន័យទាំងអស់ និង Relation របស់វា
        $imei = Imei_Trackings::with(['product', 'supplier', 'purchaseOrder', 'sale']);

        if ($req->filled("text_search")) {
            $imei->where("imei_number", "LIKE", "%" . $req->text_search . "%");
        }

        if ($req->filled("status")) {
            $imei->where("status", $req->status);
        }

        return response()->json([
            'list' => $imei->orderBy('id', 'desc')->get(),
        ]);
    }

    // store data
    public function store(ImeiTrackingRequest $request)
    {
        $data = $request->validated();

        $imei = Imei_Trackings::create($data);

        return response()->json([
            'data'    => $imei,
            'message' => 'រក្សាទុកជោគជ័យ!',
        ]);
    }

    // show data by id
    public function show($id)
    {
        $imei = Imei_Trackings::with(['product', 'supplier', 'purchaseOrder', 'sale'])->find($id);

        if ($imei) {
            return response()->json([
                'data' => $imei,
            ]);
        }
        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }

    // update data
    public function update(ImeiTrackingRequest $request, $id)
    {
        $imei = Imei_Trackings::find($id);

        if (!$imei) {
            return response()->json(['message' => 'រកមិនឃើញทิน្នន័យ'], 404);
        }

        $data = $request->validated();

        $imei->update($data);

        return response()->json([
            'data'    => $imei,
            'message' => 'កែប្រែបានជោគជ័យ!',
        ]);
    }

    // delete data
    public function destroy($id)
    {
        $imei = Imei_Trackings::find($id);
        if ($imei) {
            $imei->delete();
            return response()->json(['success' => true, 'message' => 'លុបជោគជ័យ']);
        }
        return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
    }
}
