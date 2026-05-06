<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
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
        $id = $this->route('customer') ?: $this->route('id');
        return [
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:20|unique:customers,phone,' . $id,
            'email'   => 'nullable|string|email|max:255|unique:customers,email,' . $id,
            'address' => 'nullable|string|max:500',
            'points'  => 'nullable|numeric|min:0',
            'status'  => 'required|in:active,inactive',
        ];
    }
}
