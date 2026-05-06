<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // ទាញយកទិន្នន័យអតិថិជនទាំងអស់ ឬស្វែងរក (Search)
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }

        if ($request->has('txt_search')) {
            $searchTerm = $request->input('txt_search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where("name", "LIKE", "%" . $searchTerm . "%")
                    ->orWhere("phone", "LIKE", "%" . $searchTerm . "%");
            });
        }

        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }

        $customers = $query->orderBy('id', 'desc')->get();

        return response()->json([
            "list" => $customers,
        ]);
    }

    // បង្កើតទិន្នន័យអតិថិជនថ្មី
    public function store(CustomerRequest $request)
    {
        $data = $request->validated();

        $customer = Customer::create($data);

        return response()->json([
            "message" => "បង្កើតទិន្នន័យអតិថិជនបានជោគជ័យ!",
            "data"    => $customer,
        ], 201);
    }

    // បង្ហាញទិន្នន័យតាម ID
    public function show(string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        return response()->json([
            "data" => $customer,
        ], 200);
    }

    // កែប្រែទិន្នន័យ
    public function update(CustomerRequest $request, string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $data = $request->validated();
        $customer->update($data);

        return response()->json([
            "data"    => $customer,
            "message" => "ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!",
        ], 200);
    }

    // លុបទិន្នន័យ
    public function destroy(string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                "message" => "រកមិនឃើញទិន្នន័យ",
            ], 404);
        }

        $customer->delete();

        return response()->json([
            "message" => "លុបបានជោគជ័យ!",
            "data"    => $customer,
        ], 200);
    }
}
