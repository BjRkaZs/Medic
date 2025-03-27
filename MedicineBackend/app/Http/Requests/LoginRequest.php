<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;

class LoginRequest extends FormRequest
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
            "email" => "required|email|exists:users,email",
            "password" => [
                "required", function ($attribute, $value, $fail) {
                    if (!Auth::attempt(['email' => $this->email, 'password' => $value])) {
                        $fail('Incorrect e-mail address or password');
                    }
                }
            ]
        ];
    }

    public function messages() {
        return [
            "email.required" => "Email address is required",
            "email.email" => "Please enter a valid email address",
            "email.exists" => "This email is not registered",
            "password.required" => "Password is required"
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Login error",
            "data" => $validator->errors(),
            "source" => "Medicine App"
        ]));
    }
}
