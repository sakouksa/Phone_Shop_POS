<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Http\Requests\PaymentMethodRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    // Display a listing of the resource with filters
    public function index(Request $request)
    {
        $query = PaymentMethod::query();

        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }
        if ($request->has('txt_search')) {
            $searchTerm = $request->input('txt_search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where("name", "LIKE", "%" . $searchTerm . "%")
                    ->orWhere("account_number", "LIKE", "%" . $searchTerm . "%");
            });
        }
        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }
        $paymentMethods = $query->orderBy('id', 'desc')->get();

        return response()->json([
            "list" => $paymentMethods,
        ]);
    }

    // Store a newly created resource in storage
    public function store(PaymentMethodRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('qr_code')) {
            // រក្សាទុកក្នុង storage/app/public/uploads/qr_codes
            $data['qr_code'] = $request->file('qr_code')->store('uploads/qr_codes', 'public');
        }

        $paymentMethod = PaymentMethod::create($data);
        return response()->json([
            "message" => "បង្កើតវិធីសាស្ត្រទូទាត់បានជោគជ័យ!",
            "data"    => $paymentMethod,
        ], 201);
    }

    // Display the specified resource
    public function show(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);
        if (!$paymentMethod) {
            return response()->json([
                "message" => "រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ",
            ], 404);
        }

        return response()->json([
            "data" => $paymentMethod,
        ], 200);
    }

    // Update the specified resource in storage
    public function update(PaymentMethodRequest $request, string $id)
    {
        $paymentMethod = PaymentMethod::find($id);
        if (!$paymentMethod) {
            return response()->json([
                "message" => "រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ",
            ], 404);
        }

        $data = $request->validated();

        if ($request->hasFile('qr_code')) {
            if ($paymentMethod->qr_code) {
                Storage::disk('public')->delete($paymentMethod->qr_code);
            }
            $data['qr_code'] = $request->file('qr_code')->store('uploads/qr_codes', 'public');
        }

        if ($request->qr_remove != "") {
            if ($paymentMethod->qr_code) {
                Storage::disk('public')->delete($paymentMethod->qr_code);
            }
            $data['qr_code'] = null; // លុប path ចេញពី database
        }

        $paymentMethod->update($data);
        return response()->json([
            "data"    => $paymentMethod,
            "message" => "កែប្រែវិធីសាស្ត្រទូទាត់បានជោគជ័យ!",
        ], 200);
    }

    // Remove the specified resource from storage
    public function destroy(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json([
                "message" => "រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ",
            ], 404);
        }

        if ($paymentMethod->qr_code) {
            Storage::disk('public')->delete($paymentMethod->qr_code);
        }

        $paymentMethod->delete();

        return response()->json([
            "message" => "លុបវិធីសាស្ត្រទូទាត់បានជោគជ័យ!",
            "data"    => $paymentMethod,
        ], 200);
    }
}
