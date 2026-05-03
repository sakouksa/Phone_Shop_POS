<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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
            'payment_method' => 'nullable|string',
            'created_by_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
        ];
    }
}
