<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');
        $productId = $this->route('product'); // យក ID របស់ Product ពេល Update

        return [
            'name'            => 'required|string|max:255',
            'category_id'     => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'brand_id'        => 'required|exists:brands,id',
            'sku'             => 'required|string|unique:products,sku' . ($isUpdate ? ',' . $productId : ''),

            'cost_price'      => 'required|numeric|min:0',
            'sale_price'      => 'required|numeric|min:0',
            'stock_quantity'  => 'required|integer|min:0',

            'min_stock_alert' => 'nullable|integer|min:0',
            'has_imei'        => 'nullable|boolean',
            'status'          => 'nullable|string|in:active,inactive',
            'description'     => 'nullable|string',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
