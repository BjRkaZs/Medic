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
            "name.required" => "Name is required",
            "name.max" => "Name cannot be longer than 50 characters",
            "email.required" => "Email address is required",
            "email.email" => "Please enter a valid email address",
            "email.unique" => "This email is already registered",
            "password.required" => "Password is required",
            "password.min" => "Password must be at least 8 characters",
            "password.regex" => "Password must contain at least one lowercase letter, one uppercase letter, and one number",
            "password.confirmed" => "Passwords do not match",
            "password_confirmation.required" => "Please confirm your password"
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Registration error",
            "data" => $validator->errors(),
            "source" => "Medicine App"
        ]));
    }
}
