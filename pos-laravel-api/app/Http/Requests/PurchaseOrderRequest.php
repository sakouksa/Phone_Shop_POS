<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date',
            'status' => 'nullable|string',
            'sub_total' => 'required|numeric',
            'shipping_cost' => 'nullable|numeric',
            'tax_rate' => 'nullable|numeric',
            'tax_amount' => 'nullable|numeric',
            'grand_total' => 'required|numeric',
            'payment_status' => 'nullable|string',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'created_by_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',

            'items' => 'nullable|array',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.quantity' => 'nullable|integer|min:1',
            'items.*.unit_price' => 'nullable|numeric',
       
        ];
    }
}
