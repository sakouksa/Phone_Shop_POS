<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubCategoryRequest extends FormRequest
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
        $id = $this->route('sub_category') ?? $this->route('id');
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:sub_categories,slug,' . $id,
            'image'       => 'nullable|string', // ឬ 'nullable|image|mimes:jpeg,png,jpg|max:2048' បើ upload ឯកសារពិត
            'description' => 'nullable|string',
            'status'      => 'nullable|boolean',
        ];
    }
}