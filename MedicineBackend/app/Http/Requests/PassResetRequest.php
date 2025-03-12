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
            'email.required' => 'E-mail cím megadása kötelező',
            'email.email' => 'Érvénytelen e-mail formátum',
            'email.exists' => 'Nem található felhasználó ezzel az e-mail címmel'
        ];
    }
}