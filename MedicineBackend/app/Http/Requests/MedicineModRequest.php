<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class MedicineModRequest extends FormRequest
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
            "name" => "required|max:150",
            "form" => "required|max:150",
            "substance" => "required|max:150"
        ];
    }

    public function messages() 
    {
        return [
            "name.required" => "Medicine name is required",
            "name.max" => "Medicine name cannot be longer than 150 characters",
            "form.required" => "Medicine form is required",
            "form.max" => "Medicine form cannot be longer than 150 characters",
            "substance.required" => "Active substance is required",
            "substance.max" => "Active substance cannot be longer than 150 characters"
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(
            [
                "success" => false,
                "errors" => $validator->errors(),
                "message" => "Input error"
            ]));
    }
}
