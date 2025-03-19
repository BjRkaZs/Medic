<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PassResetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => __('messages.validation.auth.email.required'),
            'email.email' => __('messages.validation.auth.email.email'),
            'email.exists' => __('messages.validation.auth.email.exists')
        ];
    }
}