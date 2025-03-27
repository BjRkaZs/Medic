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
            'dosage_unit' => "required|in:g,mg,ml,pieces",
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
            "medicine_id.required" => "Please select a medication",
            "medicine_id.exists" => "Selected medication not found",
            "description.max" => "Description cannot be longer than 255 characters",
            "stock.required" => "Stock amount is required",
            "stock.numeric" => "Stock must be a number",
            "dosage.required" => "Dosage is required",
            "dosage.numeric" => "Dosage must be a number",
            'dosage_unit.required' => 'Please select a dosage unit',
            "start_date.required" => "Start date is required",
            "start_date.date" => "Please enter a valid start date",
            "end_date.required" => "End date is required", 
            "end_date.date" => "Please enter a valid end date",
            "end_date.after" => "End date must be after start date",
            "reminder_time1.required" => "At least one reminder time is required",
            "reminder_time1.date_format" => "Invalid reminder time format (HH:mm)",
            "reminder_time2.date_format" => "Invalid reminder time format (HH:mm)",
            "reminder_time3.date_format" => "Invalid reminder time format (HH:mm)",
            "reminder_time4.date_format" => "Invalid reminder time format (HH:mm)",
            "reminder_time5.date_format" => "Invalid reminder time format (HH:mm)",
            "restock.date" => "Please enter a valid restock date",
            "restock_reminder.numeric" => "Restock reminder must be a number",
            "repeat.integer" => "Repeat value must be a whole number"
        ];
    }

    public function failedValidation( Validator $validator ) {
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Input error",
            "data" => $validator->errors()
        ]));
    }
}
