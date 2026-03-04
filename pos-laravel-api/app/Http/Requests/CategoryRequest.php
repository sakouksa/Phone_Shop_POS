<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
        // Laravel apiResource ប្រើឈ្មោះ parameter 'category' (ឯកវចនៈ)
        $categoryId = $this->route('category') ?? $this->route('id');

        return [
            'name'        => 'required|string|max:255',
            'img'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'slug'        => 'required|string|max:255|unique:categories,slug,' . $categoryId,
            'description' => 'nullable|string',
            'status'      => 'nullable'
        ];
    }
    }