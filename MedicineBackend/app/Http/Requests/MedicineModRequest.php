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
            "name.required" => "Gyógyszer nevének megadása kötelező",
            "name.max" => "Túl hosszú gyógyszer név",
            "form.required" => "Forma megadása kötelező",
            "form.max" => "Túl hosszú gyógyszer forma",
            "substance.required" => "Aktív hatóanyag megadása kötelező",
            "substance.max" => "Túl hosszú aktív hatóanyag",
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
