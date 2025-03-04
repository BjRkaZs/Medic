<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Calendar extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'medicine_id' => $this->medicine_id,
            'medicine' => new Medicine($this->whenLoaded('medicine')),
            'description' => $this->description,
            'stock' => $this->stock,
            'dosage' => $this->dosage,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'reminder_time1' => $this->reminder_time1,
            'reminder_time2' => $this->reminder_time2,
            'reminder_time3' => $this->reminder_time3,
            'reminder_time4' => $this->reminder_time4,
            'reminder_time5' => $this->reminder_time5,
            'restock_reminder' => $this->restock_reminder,
            'repeat' => $this->repeat
        ];
    }
}
