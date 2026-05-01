<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImeiTrackingRequest extends FormRequest
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
        $id = $this->route('id');
        return [
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_id' => 'nullable|exists:purchase_orders,id',
            'sale_id' => 'nullable|exists:sales,id',
            'imei_number' => 'required|string|unique:imeiTrackings,imei_number,' . $id,
            'cost_price' => 'required|numeric',
            'status' => 'required|in:available,sold,repair,trade_in',
        ];
    }
}
