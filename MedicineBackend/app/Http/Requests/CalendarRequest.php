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
            'description' => "max:150|nullable",
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
            "medicine_id.required" => __('messages.validation.calendar.medicine_id.required'),
            "medicine_id.exists" => __('messages.validation.calendar.medicine_id.exists'),
            "description.max" => __('messages.validation.calendar.description.max'),
            "stock.required" => __('messages.validation.calendar.stock.required'),
            "stock.numeric" => __('messages.validation.calendar.stock.numeric'),
            "dosage.required" => __('messages.validation.calendar.dosage.required'),
            "dosage.numeric" => __('messages.validation.calendar.dosage.numeric'),
            "start_date.required" => __('messages.validation.calendar.start_date.required'),
            "start_date.date" => __('messages.validation.calendar.start_date.date'),
            "end_date.required" => __('messages.validation.calendar.end_date.required'),
            "end_date.date" => __('messages.validation.calendar.end_date.date'),
            "end_date.after" => __('messages.validation.calendar.end_date.after'),
            "reminder_time1.required" => __('messages.validation.calendar.reminder_time1.required'),
            "reminder_time1.date_format" => __('messages.validation.calendar.reminder_time1.date_format'),
            "reminder_time2.date_format" => __('messages.validation.calendar.reminder_time2.date_format'),
            "reminder_time3.date_format" => __('messages.validation.calendar.reminder_time3.date_format'),
            "reminder_time4.date_format" => __('messages.validation.calendar.reminder_time4.date_format'),
            "reminder_time5.date_format" => __('messages.validation.calendar.reminder_time5.date_format'),
            "restock.date" => __('messages.validation.calendar.restock.date'),
            "restock_reminder.numeric" => __('messages.validation.calendar.restock_reminder.numeric'),
            "repeat.integer" => __('messages.validation.calendar.repeat.integer')
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
