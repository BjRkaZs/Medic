<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

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
            'name' => 'nullable|string|min:3|max:100',
            'specialty' => 'required|string|max:120',
            'description' => 'nullable|string',
            'date' => 'required|date'
        ];
    }

    public function messages(): array 
    {
        return [
            'name.max' => 'Doctor name cannot be longer than 100 characters',
            'name.min' => 'Doctor name must be at least 3 characters',
            'specialty.required' => 'Medical specialty is required',
            'specialty.max' => 'Specialty name cannot be longer than 120 characters',
            'date.required' => 'Appointment date is required',
            'date.date' => 'Please enter a valid date'
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
