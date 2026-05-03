<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImeiTrackingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('imei_tracking') ?: $this->route('id');

        return [
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_id' => 'nullable|exists:purchase_orders,id',
            'sale_id' => 'nullable|exists:sales,id',
            'imei_number' => 'required|string|unique:imei_trackings,imei_number,' . $id,
            'cost_price' => 'required|numeric',
            'status' => 'required|in:available,sold,repair,trade_in',
        ];
    }
}
