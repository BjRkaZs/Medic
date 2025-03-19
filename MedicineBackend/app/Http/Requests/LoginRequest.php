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
                        $fail('Helytelen e-mail cím vagy jelszó');
                    }
                }
            ]
        ];
    }

    public function messages() {
        return [
            "email.required" => __('messages.validation.auth.email.required'),
            "email.email" => __('messages.validation.auth.email.email'),
            "email.exists" => __('messages.validation.auth.email.exists'),
            "password.required" => __('messages.validation.auth.password.required')
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Bejelentkezési hiba",
            "data" => $validator->errors(),
            "source" => "Medicine App"
        ]));
    }
}
