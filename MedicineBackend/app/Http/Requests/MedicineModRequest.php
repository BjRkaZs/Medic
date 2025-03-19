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
            "name.required" => __('messages.validation.medicine.name.required'),
            "name.max" => __('messages.validation.medicine.name.max'),
            "form.required" => __('messages.validation.medicine.form.required'),
            "form.max" => __('messages.validation.medicine.form.max'),
            "substance.required" => __('messages.validation.medicine.substance.required'),
            "substance.max" => __('messages.validation.medicine.substance.max'),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(
            [
                "success" => false,
                "errors" => $validator->errors(),
                "message" => "Beviteli hiba"
            ]));
    }
}
