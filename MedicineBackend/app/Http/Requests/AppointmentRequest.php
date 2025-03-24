<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
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
            'name' => 'nullable|string|max:100',
            'specialty' => 'required|string|max:120',
            'description' => 'nullable|string',
            'date' => 'required|date'
        ];
    }

    public function messages(): array 
    {
        return [
            'name.max' => __('messages.validation.appointment.name.max'),
            'specialty.required' => __('messages.validation.appointment.specialty.required'),
            'specialty.max' => __('messages.validation.appointment.specialty.max'),
            'date.required' => __('messages.validation.appointment.date.required'),
            'date.date' => __('messages.validation.appointment.date.date')
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
