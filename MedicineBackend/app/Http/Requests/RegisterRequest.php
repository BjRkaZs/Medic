<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
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
            "name" => "required|max:15",
            "email" => "required|email|unique:users,email",
            "password" => [
                            "required",
                            "min:8",
                            "regex:/[a-z]/",
                            "regex:/[A-Z]/",
                            "regex:/[0-9]/" ],
            "password_confirmation" => "required|same:password"
        ];
    }

    public function messages() {
        return [
            "name.required" => __('messages.validation.auth.name.required'),
            "name.max" => __('messages.validation.auth.name.max'),
            "email.required" => __('messages.validation.auth.email.required'),
            "email.email" => __('messages.validation.auth.email.email'),
            "email.unique" => __('messages.validation.auth.email.unique'),
            "password.required" => __('messages.validation.auth.password.required'),
            "password.min" => __('messages.validation.auth.password.min'),
            "password.regex" => __('messages.validation.auth.password.regex'),
            "password_confirmation.same" => __('messages.validation.auth.password.confirmed'),
            "password_confirmation.required" => __('messages.validation.auth.password.confirmation_required')
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Regisztrációs hiba",
            "data" => $validator->errors(),
            "source" => "Medicine App"
        ]));
    }
}
