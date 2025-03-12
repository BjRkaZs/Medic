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
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'reminder_time1' => $this->reminder_time1 ? $this->reminder_time1->format('H:i') : null,
            'reminder_time2' => $this->reminder_time2 ? $this->reminder_time2->format('H:i') : null,
            'reminder_time3' => $this->reminder_time3 ? $this->reminder_time3->format('H:i') : null,
            'reminder_time4' => $this->reminder_time4 ? $this->reminder_time4->format('H:i') : null,
            'reminder_time5' => $this->reminder_time5 ? $this->reminder_time5->format('H:i') : null,
            'restock' => $this->restock ? $this->restock->format('Y-m-d') : null,
            'restock_reminder' => $this->restock_reminder,
            'repeat' => $this->repeat
        ];
    }
}
