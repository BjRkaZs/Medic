<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CalendarRequest extends FormRequest
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
            'medicine_id' => 'required|exists:medicine,id',
            'description' => "max:150",
            'stock' => "required|numeric",
            'dosage' => "required|numeric",
            'start_date' => "required|date",
            'end_date' => "required|date|after:start_date",
            'reminder_time1' => "required|date_format:H:i",
            'reminder_time2' => "nullable|date_format:H:i",
            'reminder_time3' => "nullable|date_format:H:i",
            'reminder_time4' => "nullable|date_format:H:i",
            'reminder_time5' => "nullable|date_format:H:i",
            'restock' => "date",
            'restock_reminder' => "numeric",
            'repeat' => "integer"
        ];
    }

    public function messages() {
        return [
            "description.max" => "Túl hosszú leírás",
            "stock.required" => "Készlet megadása kötelező",
            "stock.numeric" => "Készlet csak szám lehet",
            "dosage"=> "Adag megadása kötelező",
            "dosage.numeric" => "Adag csak szám lehet",
            "start_date.required" => "Kezdési dátum megadása kötelező",
            "start_date.date" => "Érvénytelen kezdési dátum",
            "end_date.required" => "Befejezési dátum megadása kötelező",
            "end_date.date" => "Érvénytelen befejezési dátum",
            "end_date.after_or_equal" => "Befejezési dátum nem lehet korábbi a kezdési dátumnál",
            "reminder_time1.required" => "Emlékeztető idő megadása kötelező",
            "reminder_time1.date_format" => "Érvénytelen emlékeztető idő formátum",
            "reminder_time2.date_format" => "Érvénytelen emlékeztető idő formátum",
            "reminder_time3.date_format" => "Érvénytelen emlékeztető idő formátum",
            "reminder_time4.date_format" => "Érvénytelen emlékeztető idő formátum",
            "reminder_time5.date_format" => "Érvénytelen emlékeztető idő formátum",
            "restock_reminder.date" => "Érvénytelen újra raktározási emlékeztető dátum",
            "repeat.integer" => "Ismétlést kérem napokban adja meg"
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Beviteli hiba",
            "data" => $validator->errors()
        ]));
    }
}
