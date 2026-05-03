<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseOrderItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'product_id'        => 'required|exists:products,id',
            'quantity'          => 'required|integer|min:1',
            'unit_price'        => 'required|numeric|min:0',
        ];
    }
}
